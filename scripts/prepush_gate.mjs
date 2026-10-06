#!/usr/bin/env node
/**
 * prepush_gate.mjs — nocodecsv 推送前闸门（挂在 .git/hooks/pre-push）
 *
 * 为什么需要它（2026-10-06）：
 *   这个站的博客索引页是按 lib/related-posts.ts 的 POST_CLUSTERS 分组的：
 *       posts: ALL_POST_SLUGS.filter((slug) => POST_CLUSTERS[slug] === cluster)
 *   所以【一篇没有登记进 POST_CLUSTERS 的文章】会：
 *     · 不出现在 /blog 索引页上（= 零入链孤儿页，Google 基本不抓）
 *     · 拿不到任何"相关文章"内链
 *   而它仍然在 sitemap 里（ALL_POST_SLUGS 由 POST_CLUSTERS 推导）—— 也就是【隐形孤儿】：
 *   看 sitemap 一切正常，看索引页少一篇。每天自动发文的引擎最容易踩这个坑。
 *
 * 检查项：
 *   1. 每个 src/app/blog/<slug>/page.tsx 都登记进 POST_CLUSTERS（否则索引页看不到）
 *   2. POST_CLUSTERS 里的每个 slug 都有对应目录（否则是悬空引用/死链）
 *   3. 每篇文章都导出 metadata 且带 canonical（缺 canonical = 重复内容风险）
 *
 * 用法：
 *   node scripts/prepush_gate.mjs      # 检查，有问题 exit 1（pre-push 钩子会据此中止推送）
 *   node scripts/prepush_gate.mjs --fix  # 自动把一个未登记的文章按关键词补进 POST_CLUSTERS
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG = join(ROOT, "src/app/blog");
const RELATED = join(ROOT, "src/lib/related-posts.ts");
const FIX = process.argv.includes("--fix");

const RELATED_SRC = readFileSync(RELATED, "utf8");
const registered = new Set(
  [...RELATED_SRC.matchAll(/'([a-z0-9-]+)'\s*:\s*'(?:convert|clean|ai|ops|basics)'/g)].map((m) => m[1])
);

const posts = readdirSync(BLOG)
  .filter((s) => existsSync(join(BLOG, s, "page.tsx")))
  .sort();

const unregistered = posts.filter((s) => !registered.has(s));
const dangling = [...registered].filter((s) => !posts.includes(s)).sort();
const noMeta = [];
const noCanonical = [];

for (const slug of posts) {
  const src = readFileSync(join(BLOG, slug, "page.tsx"), "utf8");
  if (!/export\s+const\s+metadata\s*:/.test(src)) noMeta.push(slug);
  else if (!/canonical\s*:/.test(src)) noCanonical.push(slug);
}

// ── 自动补登记（--fix）────────────────────────────────────────────────────────
if (unregistered.length && FIX) {
  const guessCluster = (src) => {
    const s = src.toLowerCase();
    if (/convert|pdf|excel|json|tsv|markdown|html|word|chart|transpose/.test(s)) return "convert";
    if (/clean|duplicate|blank|garbled|delimiter|leading zero|fix/.test(s)) return "clean";
    if (/\bai\b|analy|chat|generate|llm|gpt|prompt/.test(s)) return "ai";
    if (/split|merge|compress|upload|download|privacy|100mb|large|file size/.test(s)) return "ops";
    return "basics";
  };
  const lines = unregistered.map((slug) => {
    const src = readFileSync(join(BLOG, slug, "page.tsx"), "utf8");
    return `  '${slug}': '${guessCluster(src)}',`;
  });
  // 插到 POST_CLUSTERS 对象结尾（该对象以 "\n};" 结束）
  const marker = RELATED_SRC.indexOf("export const POST_CLUSTERS");
  const end = RELATED_SRC.indexOf("\n};", marker);
  if (end === -1) {
    console.error("❌ 找不到 POST_CLUSTERS 对象结尾，无法自动补登记，请手工加");
    process.exit(1);
  }
  writeFileSync(RELATED, RELATED_SRC.slice(0, end) + "\n\n  // 2026-10-06 自动补登记（prepush_gate --fix），请复查集群归类是否正确\n" + lines.join("\n") + RELATED_SRC.slice(end));
  console.log(`✅ 已自动补登记 ${unregistered.length} 篇到 POST_CLUSTERS：`);
  for (const s of unregistered) console.log(`   + ${s}`);
  console.log("   ⚠️ 集群归类是关键词猜的，请复查；分类错了只会影响它出现在哪一组。");
}

const problems = [];
if (!FIX && unregistered.length)
  problems.push(
    `${unregistered.length} 篇未登记进 POST_CLUSTERS（→ /blog 索引页看不到，隐形孤儿）:\n` +
      unregistered.map((s) => "      · " + s).join("\n")
  );
if (dangling.length)
  problems.push(
    `${dangling.length} 个 POST_CLUSTERS 条目没有对应目录（→ 悬空引用/死链）:\n` +
      dangling.map((s) => "      · " + s).join("\n")
  );
if (noMeta.length)
  problems.push(
    `${noMeta.length} 篇没有导出 metadata:\n` + noMeta.map((s) => "      · " + s).join("\n")
  );
if (noCanonical.length)
  problems.push(
    `${noCanonical.length} 篇没有 canonical:\n` + noCanonical.map((s) => "      · " + s).join("\n")
  );

console.log("");
console.log(`博客文章          : ${posts.length} 篇`);
console.log(`POST_CLUSTERS 登记: ${registered.size} 条`);
console.log(`未登记            : ${FIX ? 0 : unregistered.length} 篇`);
console.log(`悬空引用          : ${dangling.length} 条`);
console.log(`缺 metadata       : ${noMeta.length} 篇`);
console.log(`缺 canonical      : ${noCanonical.length} 篇`);

if (problems.length) {
  console.log("\n❌ prepush_gate FAIL — 修完再推：\n");
  for (const p of problems) console.log("   · " + p);
  console.log("\n   修法：node scripts/prepush_gate.mjs --fix   （自动补登记，再复查集群归类）");
  console.log("   缺 metadata/canonical 必须手工补。");
  process.exit(1);
}
console.log("\n✅ prepush_gate PASS");
