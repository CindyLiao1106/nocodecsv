#!/usr/bin/env python3
"""Push 2 new articles + /blog hub + patch sitemap/related-posts/header/footer."""
import sys, base64, json
sys.path.insert(0, "/opt/data/cad_work/nocodecsv_workspace")
from gh_helper import get_file, put_file, api, REPO

B16 = open("/opt/data/prompts/nocodecsv_blog16_transpose-csv-file.tsx", encoding="utf-8").read()
B17 = open("/opt/data/prompts/nocodecsv_blog17_extract-email-addresses-from-csv.tsx", encoding="utf-8").read()
HUB = open("/opt/data/prompts/nocodecsv_blog_hub_page.tsx", encoding="utf-8").read()

MSG = "SEO: add transpose-csv-file + extract-email-addresses-from-csv, add /blog hub page, nav+sitemap"

NEW_FILES = [
    ("src/app/blog/transpose-csv-file/page.tsx", B16),
    ("src/app/blog/extract-email-addresses-from-csv/page.tsx", B17),
    ("src/app/blog/page.tsx", HUB),
]

PATCHES = {
    "src/app/sitemap.ts": [
        (
            '    { url: `${BASE_URL}/pricing`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },',
            '    { url: `${BASE_URL}/pricing`, lastModified: seoLastModified, changeFrequency: "monthly" as const, priority: 0.8 },\n\n'
            '    // 博客枢纽页（所有文章的入口，被抓取的必经节点）\n'
            '    { url: `${BASE_URL}/blog`, lastModified: "2026-09-12T00:00:00.000Z", changeFrequency: "weekly" as const, priority: 0.8 },',
        ),
        (
            '    { url: `${BASE_URL}/blog/keep-leading-zeros-in-csv`, lastModified: "2026-09-11T00:00:00.000Z", changeFrequency: "monthly" as const, priority: 0.7 },',
            '    { url: `${BASE_URL}/blog/keep-leading-zeros-in-csv`, lastModified: "2026-09-11T00:00:00.000Z", changeFrequency: "monthly" as const, priority: 0.7 },\n'
            '    { url: `${BASE_URL}/blog/transpose-csv-file`, lastModified: "2026-09-12T00:00:00.000Z", changeFrequency: "monthly" as const, priority: 0.7 },\n'
            '    { url: `${BASE_URL}/blog/extract-email-addresses-from-csv`, lastModified: "2026-09-12T00:00:00.000Z", changeFrequency: "monthly" as const, priority: 0.7 },',
        ),
    ],
    "src/lib/related-posts.ts": [
        (
            "  'csv-to-chart-online-free': 'convert',",
            "  'csv-to-chart-online-free': 'convert',\n  'transpose-csv-file': 'convert',",
        ),
        (
            "  'change-csv-delimiter': 'clean',",
            "  'change-csv-delimiter': 'clean',\n  'extract-email-addresses-from-csv': 'clean',",
        ),
        (
            "  'import-csv-into-google-sheets': 'ops',",
            "  'import-csv-into-google-sheets': 'ops',\n  'merge-csv-files-free': 'ops',",
        ),
        (
            "  'visualize-sales-data-csv': 'ai',",
            "  'visualize-sales-data-csv': 'ai',\n  'opencode-go-review-cheap-ai-models': 'ai',",
        ),
        (
            "  'csv-to-chart-online-free': 'CSV to Chart Online Free',",
            "  'csv-to-chart-online-free': 'CSV to Chart Online Free',\n  'transpose-csv-file': 'Transpose a CSV File',",
        ),
        (
            "  'change-csv-delimiter': 'Change CSV Delimiter',",
            "  'change-csv-delimiter': 'Change CSV Delimiter',\n  'extract-email-addresses-from-csv': 'Extract Email Addresses from a CSV',",
        ),
        (
            "  'import-csv-into-google-sheets': 'Import CSV into Google Sheets',",
            "  'import-csv-into-google-sheets': 'Import CSV into Google Sheets',\n  'merge-csv-files-free': 'Merge CSV Files',",
        ),
        (
            "  'visualize-sales-data-csv': 'Visualize Sales Data from CSV',",
            "  'visualize-sales-data-csv': 'Visualize Sales Data from CSV',\n  'opencode-go-review-cheap-ai-models': 'OpenCode Go Review',",
        ),
        (
            """  // 同集群优先,内部按字母序稳定排序
  const picked = [...sameCluster.sort(), ...others.sort()].slice(0, limit);
  return picked.map((s) => ({ slug: s, title: POST_TITLES[s] || s }));""",
            """  // 同集群优先;组内按当前 slug 轮转起点,避免字母序靠后的文章永远拿不到入链
  const rotate = (arr: string[], seed: string): string[] => {
    if (arr.length === 0) return arr;
    const start = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length;
    return [...arr.slice(start), ...arr.slice(0, start)];
  };
  const picked = [
    ...rotate(sameCluster.sort(), slug),
    ...rotate(others.sort(), slug),
  ].slice(0, limit);
  return picked.map((s) => ({ slug: s, title: POST_TITLES[s] || s }));""",
        ),
    ],
    "src/components/layout/header.tsx": [
        (
            '          <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900 hidden sm:block">Pricing</Link>',
            '          <Link href="/blog" className="text-sm text-zinc-600 hover:text-zinc-900 hidden md:block">Blog</Link>\n'
            '          <Link href="/pricing" className="text-sm text-zinc-600 hover:text-zinc-900 hidden sm:block">Pricing</Link>',
        ),
    ],
    "src/components/layout/footer.tsx": [
        (
            '            <p className="font-semibold text-sm mb-3">Blog</p>\n            <div className="space-y-2 text-sm text-zinc-500">\n              <Link href="/blog/how-to-analyze-csv-with-ai-free"',
            '            <p className="font-semibold text-sm mb-3">Blog</p>\n            <div className="space-y-2 text-sm text-zinc-500">\n              <Link href="/blog" className="block hover:text-zinc-700 font-medium">All Guides</Link>\n              <Link href="/blog/how-to-analyze-csv-with-ai-free"',
        ),
    ],
}

def do():
    results = []
    # new files (no sha needed unless they exist)
    for path, content in NEW_FILES:
        _, sha, _ = get_file(path)
        r = put_file(path, content, MSG, sha=sha)
        results.append((path, "new" if not sha else "update", r.get("commit", {}).get("sha", r)))
    # patched files
    for path, pairs in PATCHES.items():
        content, sha, meta = get_file(path)
        assert content, f"cannot fetch {path}: {meta}"
        for old, new in pairs:
            if old not in content:
                results.append((path, "PATCH-MISS", old[:60]))
                continue
            content = content.replace(old, new, 1)
        r = put_file(path, content, MSG, sha=sha)
        results.append((path, "patched", r.get("commit", {}).get("sha", r)))
    for x in results:
        print(x)

if __name__ == "__main__":
    do()
