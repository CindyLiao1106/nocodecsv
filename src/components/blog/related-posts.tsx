import Link from "next/link";
import { getRelatedPosts, CLUSTER_LABELS, POST_CLUSTERS } from "@/lib/related-posts";

/**
 * 相关文章内链区块 — 自动按主题集群推荐,提升站内链接密度
 * 用法:在文章 </article> 之前插入 <RelatedPosts slug="当前文章slug" />
 */
export function RelatedPosts({ slug, limit = 4 }: { slug: string; limit?: number }) {
  const posts = getRelatedPosts(slug, limit);
  if (!posts.length) return null;
  const cluster = POST_CLUSTERS[slug];
  const label = cluster ? CLUSTER_LABELS[cluster] : "Related reading";

  return (
    <section className="not-prose my-10 rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">Related reading</h2>
      <p className="text-sm text-slate-500 mb-4">{label} — other guides that pair well with this one.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group flex items-start gap-2 rounded-lg border border-slate-200 p-3 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <span className="mt-0.5 text-blue-600" aria-hidden="true">
                →
              </span>
              <span className="text-sm font-medium text-slate-800 group-hover:text-blue-700">
                {p.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-slate-400">
        Browse all guides in the{" "}
        <Link href="/blog" className="underline hover:text-blue-600">
          NoCodeCSV blog
        </Link>
        .
      </p>
    </section>
  );
}
