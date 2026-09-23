#!/usr/bin/env node
/**
 * 博客内链图验证：证明「每篇文章都至少被 1 篇其他文章链接到」+「没有指向不存在路由的内链」。
 *
 * 关键点：直接 import **真实的** 推荐函数模块（Node >=22.18 / 23 / 26 原生剥离类型，
 * 可直接 import .ts），而不是在 Node/Python 里把算法复刻一遍 —— 复刻物会和线上跑偏。
 *
 * 入链两个来源：
 *   (a) 相关文章组件自动生成的内链（调 getRelatedPosts）
 *   (b) 文章正文里手写的 <Link href="/blog/...">
 *
 * 用法:
 *   node scripts/verify_blog_internal_links.mjs [repoRoot] [blogDirRel] [libRel] [limit]
 * 例:
 *   node scripts/verify_blog_internal_links.mjs . src/app/blog src/lib/related-posts.ts 6
 *
 * 退出码: 0 = PASS（无孤岛、无死链）；1 = FAIL
 * 注意: 本机 node 可能在 /usr/local/bin，默认 PATH 里没有 → 先 export PATH="/usr/local/bin:$PATH"
 */
import { readdirSync, readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const repoRoot = resolve(process.argv[2] || ".");
const blogDirRel = process.argv[3] || "src/app/blog";
const libRel = process.argv[4] || "src/lib/related-posts.ts";
const limit = Number(process.argv[5] || 6);

const blogDir = join(repoRoot, blogDirRel);
const libPath = join(repoRoot, libRel);

if (!existsSync(libPath)) {
  console.error(`❌ 找不到推荐函数模块: ${libPath}`);
  process.exit(2);
}

const mod = await import(libPath);
const { getRelatedPosts, POST_CLUSTERS, ALL_POST_SLUGS, POST_TITLES, POST_SUMMARIES } = mod;
if (typeof getRelatedPosts !== "function") {
  console.error("❌ 模块未导出 getRelatedPosts");
  process.exit(2);
}

// 1. 文件系统里的真实路由 = 事实来源
const routeSlugs = readdirSync(blogDir, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
  .map((d) => d.name)
  .sort();

const known = new Set(routeSlugs);
const inbound = new Map(routeSlugs.map((s) => [s, []]));
const deadTargets = new Map(); // target -> [来源]

// 2. (a) 相关文章自动内链
for (const slug of routeSlugs) {
  let related = [];
  try {
    related = getRelatedPosts(slug, limit) || [];
  } catch (e) {
    deadTargets.set(`getRelatedPosts(${slug}) 抛错: ${e.message}`, [slug]);
    continue;
  }
  for (const r of related) {
    const t = typeof r === "string" ? r : r.slug;
    if (!known.has(t)) deadTargets.set(t, [...(deadTargets.get(t) || []), `${slug} (related)`]);
    else inbound.get(t).push(`${slug} (related)`);
  }
}

// 3. (b) 正文手写内链
for (const slug of routeSlugs) {
  const p = join(blogDir, slug, "page.tsx");
  if (!existsSync(p)) continue;
  const src = readFileSync(p, "utf8");
  for (const m of src.matchAll(/href="\/(?:blog|blog\/)([a-z0-9-]+)"/g)) {
    const t = m[1];
    if (!known.has(t)) deadTargets.set(t, [...(deadTargets.get(t) || []), `${slug} (inline)`]);
    else if (t !== slug) inbound.get(t).push(`${slug} (inline)`);
  }
}

// 4. 注册表与目录是否一致
const unregistered = routeSlugs.filter((s) => !POST_CLUSTERS || !POST_CLUSTERS[s]);
const orphanKeys = ALL_POST_SLUGS ? ALL_POST_SLUGS.filter((s) => !known.has(s)) : [];
const missingMeta = ALL_POST_SLUGS
  ? ALL_POST_SLUGS.filter((s) => (POST_TITLES && !POST_TITLES[s]) || (POST_SUMMARIES && !POST_SUMMARIES[s]))
  : [];

const islands = [...inbound.entries()].filter(([, from]) => from.length === 0).map(([s]) => s);
const counts = [...inbound.entries()].sort((a, b) => a[1].length - b[1].length);

console.log(`推荐函数模块        : ${libRel}  (limit=${limit})`);
console.log(`路由数(目录)        : ${routeSlugs.length}`);
console.log(`注册表登记数        : ${ALL_POST_SLUGS ? ALL_POST_SLUGS.length : "n/a"}`);
console.log(`目录有但未登记      : ${unregistered.length} ${JSON.stringify(unregistered)}`);
console.log(`登记了但目录不存在  : ${orphanKeys.length} ${JSON.stringify(orphanKeys)}`);
console.log(`缺 title/摘要       : ${missingMeta.length} ${JSON.stringify(missingMeta)}`);
console.log(`指向不存在路由的内链: ${deadTargets.size} ${JSON.stringify([...deadTargets.keys()])}`);
console.log("");
console.log("入链最少的 8 篇(related + inline):");
for (const [s, from] of counts.slice(0, 8)) console.log(`  ${String(from.length).padStart(3)}  ${s}`);
console.log("");
console.log(`零入链孤岛: ${islands.length}  ${JSON.stringify(islands)}`);

const ok =
  islands.length === 0 &&
  deadTargets.size === 0 &&
  unregistered.length === 0 &&
  orphanKeys.length === 0 &&
  missingMeta.length === 0;
console.log(ok ? "\n✅ PASS — 无孤岛、无死链、注册表与目录一致" : "\n❌ FAIL");
process.exit(ok ? 0 : 1);
