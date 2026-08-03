# seo-nightly.ps1 — 夜间无人值守 SEO 任务主入口
#
# 流程:
#   1. IndexNow 推送当前线上全部 URL 给 Bing（尽快让爬虫知道站点存在）
#   2. 以 claude headless 模式执行 nightly-instructions.md 中的 SEO 任务
#      （跳过权限确认、限制最大轮次防失控）
#   3. 全程输出到 scripts/seo/logs/seo-nightly-<时间戳>.log
#
# 用法: powershell -ExecutionPolicy Bypass -File scripts\seo\seo-nightly.ps1

$ErrorActionPreference = "Continue"

# 项目根（本脚本位于 scripts/seo/，上两级即项目根）
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
Set-Location $projectRoot

$claudeCmd  = Join-Path $env:APPDATA "npm\claude.cmd"
$instructionsPath = Join-Path $PSScriptRoot "nightly-instructions.md"
$pushScript = Join-Path $PSScriptRoot "push-indexnow.ps1"
$logDir     = Join-Path $PSScriptRoot "logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$stamp   = Get-Date -Format "yyyyMMdd-HHmm"
$logFile = Join-Path $logDir "seo-nightly-$stamp.log"

function Write-Log {
    param([string]$msg)
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
    $line | Tee-Object -FilePath $logFile -Append
}

Write-Log "==== SEO Nightly 开始: $stamp ===="
Write-Log "项目目录: $projectRoot"
Write-Log "日志文件: $logFile"

# ---- 前置检查 ----
if (-not (Test-Path $claudeCmd)) {
    Write-Log "错误: 找不到 claude 命令 ($claudeCmd)"
    exit 1
}
if (-not (Test-Path $instructionsPath)) {
    Write-Log "错误: 找不到指令文件 ($instructionsPath)"
    exit 1
}
$instructions = Get-Content -Raw -Path $instructionsPath
Write-Log "已加载指令文件 (长度 $($instructions.Length) 字符)"

# ---- 步骤 1: IndexNow 推送 ----
Write-Log "---- 步骤 1/2: IndexNow 推送线上 URL ----"
try {
    & $pushScript 2>&1 | ForEach-Object { Write-Log $_ }
} catch {
    Write-Log "IndexNow 推送异常(不影响后续任务): $_"
}

# ---- 步骤 2: claude headless 执行 SEO ----
Write-Log "---- 步骤 2/2: claude headless 执行 SEO ----"
$prompt = @"
$instructions

[执行约束]
- 你正处于无人值守夜间模式，请全程自主执行。
- 禁止停下询问任何问题，禁止输出“是否继续 / 需要确认”等请求。
- 若某一步失败，尝试修复并继续，直到满足完成标准。
- 完成后输出简洁的中文总结。
"@

$claudeArgs = @(
    "-p", $prompt,
    "--dangerously-skip-permissions",
    "--max-turns", "100",
    "--output-format", "text"
)
Write-Log "启动 claude headless (最大 100 轮) ..."
& $claudeCmd @claudeArgs 2>&1 | ForEach-Object { Write-Log $_ }
$claudeExit = $LASTEXITCODE
Write-Log "claude 退出码: $claudeExit"

Write-Log "==== SEO Nightly 结束 ===="
exit $claudeExit
