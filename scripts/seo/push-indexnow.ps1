# push-indexnow.ps1 — 将 nocodecsv.com 的全部可索引 URL 推送给 Bing (IndexNow 协议)
#
# 前置条件:
#   1. 站点根目录 public/<key>.txt 存在（文件名 = key 内容 = key），并已部署上线
#   2. https://nocodecsv.com/<key>.txt 可访问（验证所有权）
#
# 用法: powershell -ExecutionPolicy Bypass -File push-indexnow.ps1

$ErrorActionPreference = "Stop"
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$site = "https://nocodecsv.com"
$hostName = "nocodecsv.com"

# ---- 1. 找到 IndexNow key 文件（public/ 下 *.txt，文件名即 key） ----
$keyFile = Get-ChildItem -Path (Join-Path $projectRoot "public") -Filter "*.txt" | Select-Object -First 1
if (-not $keyFile) {
    Write-Error "错误: 未在 public/ 找到 IndexNow key 文件 (public/<key>.txt)"
    exit 1
}
$key = $keyFile.BaseName
$keyLocation = "$site/$key.txt"
Write-Host "[IndexNow] key 文件: $($keyFile.Name) -> $keyLocation"

# ---- 2. 从线上 sitemap.xml 拉取全部 URL ----
$sitemapXml = (& curl.exe -s --max-time 30 "$site/sitemap.xml" 2>$null) -join "`n"
if (-not $sitemapXml -or $sitemapXml -notmatch "urlset") {
    Write-Error "错误: 无法获取 $site/sitemap.xml"
    exit 1
}
[xml]$doc = $sitemapXml
$urls = @($doc.urlset.url | ForEach-Object { $_.loc } | Where-Object { $_ })
Write-Host "[IndexNow] 从 sitemap 获取到 $($urls.Count) 个 URL"

if ($urls.Count -eq 0) {
    Write-Host "[IndexNow] sitemap 为空，跳过推送"
    exit 0
}

# ---- 3. 推送到 IndexNow ----
$body = @{
    host        = $hostName
    key         = $key
    keyLocation = $keyLocation
    urlList     = $urls
} | ConvertTo-Json -Compress

$resp = & curl.exe -s -o NUL -w "%{http_code}" --max-time 60 -X POST `
    -H "Content-Type: application/json; charset=utf-8" `
    -d $body `
    "https://api.indexnow.org/indexnow"
$resp = $resp.Trim()

if ($resp -eq "200" -or $resp -eq "202") {
    Write-Host "[IndexNow] 推送成功 (HTTP $resp)：$($urls.Count) 个 URL 已提交给 Bing"
    exit 0
} else {
    Write-Host "[IndexNow] 推送失败 (HTTP $resp)"
    Write-Host "         若 keyLocation 尚未上线（404），请先 git commit + push 部署后再试。"
    exit 1
}
