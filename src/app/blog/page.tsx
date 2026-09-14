import type { Metadata } from "next";
import Link from "next/link";
import {
  ALL_POST_SLUGS,
  POST_CLUSTERS,
  POST_TITLES,
  POST_SUMMARIES,
  type Cluster,
} from "@/lib/related-posts";

export const metadata: Metadata = {
  title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
  description:
    "Every NoCodeCSV guide in one place: converting, cleaning, analysing and reshaping CSV and Excel files, with free browser tools and step-by-step methods.",
  keywords: [
    "csv guides",
    "excel data guides",
    "csv tutorials",
    "data cleaning guides",
    "csv tools blog",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog" },
  openGraph: {
    title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
    description:
      "Converting, cleaning, analysing and reshaping CSV and Excel files. Every guide, plus free browser tools.",
    type: "website",
    url: "https://nocodecsv.com/blog",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
    description: "Every guide for working with CSV and Excel files, plus free tools.",
  },
};

type Post = { slug: string; title: string; blurb: string };

// 分组顺序与文案：数据本身来自 src/lib/related-posts.ts 的单一数据源，
// 新增文章只需要改那一个文件，这里和 GROUPS 会自动同步。
const GROUP_ORDER: Cluster[] = ["convert", "clean", "ai", "ops", "basics"];

const GROUP_META: Record<Cluster, { label: string; blurb: string }> = {
  convert: {
    label: "Format & Conversion",
    blurb: "Moving data between CSV, Excel, PDF, JSON, HTML and Markdown without losing anything on the way.",
  },
  clean: {
    label: "Data Cleaning",
    blurb: "The unglamorous work that decides whether the rest of the pipeline runs at all.",
  },
  ai: {
    label: "AI & Analysis",
    blurb: "Getting answers, summaries and charts out of a file without writing a formula nobody can maintain.",
  },
  ops: {
    label: "File Operations",
    blurb: "Splitting, sorting, comparing and loading files — the mechanical jobs that come up every week.",
  },
  basics: {
    label: "CSV Fundamentals",
    blurb: "The format itself, and the trade-offs that decide which one to keep.",
  },
};

const GROUPS: { label: string; blurb: string; posts: Post[] }[] = GROUP_ORDER.map((cluster) => ({
  label: GROUP_META[cluster].label,
  blurb: GROUP_META[cluster].blurb,
  posts: ALL_POST_SLUGS.filter((slug) => POST_CLUSTERS[slug] === cluster).map((slug) => ({
    slug,
    title: POST_TITLES[slug] ?? slug,
    blurb: POST_SUMMARIES[slug] ?? "",
  })),
}));

const allPosts = GROUPS.flatMap((g) => g.posts);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CSV, Excel & Data Guides",
  description:
    "Every NoCodeCSV guide: converting, cleaning, analysing and reshaping CSV and Excel files, with free browser tools and step-by-step methods.",
  url: "https://nocodecsv.com/blog",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: allPosts.length,
    itemListElement: allPosts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `https://nocodecsv.com/blog/${p.slug}`,
    })),
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
  ],
};

export default function BlogIndex() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          CSV, Excel and data guides
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-zinc-600">
          Every guide we have written about CSV and Excel files, sorted by what you are trying to
          do. Each one is a step-by-step method with a comparison of the free options, and most
          link to a browser tool you can use without signing up.
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          {allPosts.length} guides. Start with a{" "}
          <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
            free CSV analysis
          </Link>{" "}
          if you are not sure what is wrong with a file yet.
        </p>

        {GROUPS.map((g) => (
          <section key={g.label} className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-900">{g.label}</h2>
            <p className="mt-1 text-sm text-zinc-500">{g.blurb}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {g.posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block h-full rounded-xl border border-zinc-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <span className="block font-semibold text-zinc-900">{p.title}</span>
                    <span className="mt-1 block text-sm text-zinc-600">{p.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-xl font-bold text-zinc-900">Free tools that go with these guides</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Everything runs in your browser and the file never leaves your machine.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li>
              <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
                CSV Analyzer
              </Link>
              <span className="block text-sm text-zinc-600">Columns, types and fill rates at a glance.</span>
            </li>
            <li>
              <Link href="/tools/excel-data-analysis" className="text-blue-600 underline">
                Excel Data Analysis
              </Link>
              <span className="block text-sm text-zinc-600">Ask questions of a workbook in plain English.</span>
            </li>
            <li>
              <Link href="/tools/spreadsheet-charts" className="text-blue-600 underline">
                Spreadsheet Charts
              </Link>
              <span className="block text-sm text-zinc-600">Turn a table into a chart you can share.</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
