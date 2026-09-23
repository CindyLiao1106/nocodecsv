import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";
import { ALL_POST_SLUGS, POST_DATES, POST_TITLES } from "@/lib/related-posts";

/** 首页 Guides 区块:自动取【最新 5 篇】文章(由注册表派生,避免新文章永远进不了首页) */
const DATE_INDEX: Record<string, number> = Object.fromEntries(
  Object.keys(POST_DATES).map((s, i) => [s, i]),
);
const LATEST_GUIDES: string[] = [...ALL_POST_SLUGS]
  .filter((s) => Boolean(POST_DATES[s]))
  .sort(
    (a, b) =>
      (POST_DATES[b] ?? "").localeCompare(POST_DATES[a] ?? "") ||
      (DATE_INDEX[b] ?? 0) - (DATE_INDEX[a] ?? 0),
  )
  .slice(0, 5);

/** 长标题裁短:去掉年份、问号后的从句,超长加省略号 */
function shortGuideTitle(title: string): string {
  const clean = title.replace(/\s*\(20\d\d\)\s*$/, "");
  const head = clean.split(/[?:—|]/)[0].trim();
  return head.length > 52 ? `${head.slice(0, 49).trimEnd()}…` : head;
}

export const metadata: Metadata = {
  title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
  description:
    "Upload a CSV or Excel file and ask questions in plain English. AI generates charts, finds patterns, and summarizes your data. Free to start.",
  alternates: { canonical: "https://nocodecsv.com/" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
    description:
      "Upload a CSV or Excel file and ask questions in plain English. AI generates charts, finds patterns, and summarizes your data.",
    type: "website",
    url: "https://nocodecsv.com/",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
    description: "Upload a CSV or Excel file and ask questions in plain English. AI generates charts and insights instantly.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "NoCodeCSV",
      url: "https://nocodecsv.com/",
      description: "Chat with your CSV & Excel files using AI. No coding needed.",
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "NoCodeCSV",
      url: "https://nocodecsv.com/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered CSV and Excel data analysis. Upload a file, ask questions in plain English, and get charts and insights instantly.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "15", priceCurrency: "USD" },
        { "@type": "Offer", name: "Business", price: "49", priceCurrency: "USD" },
      ],
      author: { "@type": "Organization", name: "NoCodeCSV" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is NoCodeCSV?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NoCodeCSV is a free AI-powered tool that lets you chat with your CSV and Excel files. Upload a spreadsheet, ask questions in plain English, and get instant charts, patterns, and summaries — no SQL, Python, or coding required.",
          },
        },
        {
          "@type": "Question",
          name: "Is NoCodeCSV free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. NoCodeCSV offers a free tier with 3 analyses per day. A Pro plan at $15/month unlocks unlimited analyses and advanced features.",
          },
        },
        {
          "@type": "Question",
          name: "How do I analyze a CSV file with AI?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your CSV file to the free analyzer, then type questions about your data in plain English. The AI generates charts, finds patterns, and summarizes the results for you.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to know SQL or Python to use NoCodeCSV?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. NoCodeCSV is designed for non-technical users. You ask questions in natural language and the AI handles the analysis, charting, and data exploration for you.",
          },
        },
        {
          "@type": "Question",
          name: "What file types does NoCodeCSV support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "NoCodeCSV supports CSV and Excel (.xlsx) files. You can upload, analyze, and export your data entirely in the browser.",
          },
        },
        {
          "@type": "Question",
          name: "Is my data private when I upload it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Files are parsed in your browser and analysis is processed per request without being stored. NoCodeCSV does not keep your uploaded data on its servers.",
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <HowItWorks />

      {/* FAQ —— 必须是"页面上看得见"的问答,否则 FAQPage schema 属于违规(2026-09-19 体检修复) */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is NoCodeCSV?</h3>
              <p className="text-zinc-600 leading-relaxed">
                NoCodeCSV is a free AI-powered tool that lets you chat with your CSV and Excel
                files. Upload a spreadsheet, ask questions in plain English, and get instant
                charts, patterns, and summaries — no SQL, Python, or coding required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is NoCodeCSV free to use?</h3>
              <p className="text-zinc-600 leading-relaxed">
                Yes. NoCodeCSV offers a free tier with 3 analyses per day. A Pro plan at
                $15/month unlocks unlimited analyses and advanced features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I analyze a CSV file with AI?</h3>
              <p className="text-zinc-600 leading-relaxed">
                Upload your CSV file to the free analyzer, then type questions about your data
                in plain English. The AI generates charts, finds patterns, and summarizes the
                results for you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Do I need to know SQL or Python to use NoCodeCSV?
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                No. NoCodeCSV is designed for non-technical users. You ask questions in natural
                language and the AI handles the analysis, charting, and data exploration for you.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What file types does NoCodeCSV support?</h3>
              <p className="text-zinc-600 leading-relaxed">
                NoCodeCSV supports CSV and Excel (.xlsx) files. You can upload, analyze, and
                export your data entirely in the browser.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my data private when I upload it?</h3>
              <p className="text-zinc-600 leading-relaxed">
                Files are parsed in your browser and analysis is processed per request without
                being stored. NoCodeCSV does not keep your uploaded data on its servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal links: tools & guides */}
      <section className="bg-white border-t border-zinc-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Free AI data tools & guides
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-6">
              <h3 className="font-semibold text-lg mb-3">Tools</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/tools/csv-analyzer" className="hover:text-blue-600">Free AI CSV Analyzer</Link></li>
                <li><Link href="/tools/excel-data-analysis" className="hover:text-blue-600">AI Excel Data Analysis</Link></li>
                <li><Link href="/tools/spreadsheet-charts" className="hover:text-blue-600">AI Chart Generator</Link></li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6">
              <h3 className="font-semibold text-lg mb-3">Guides</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                {LATEST_GUIDES.map((slug) => (
                  <li key={slug}>
                    <Link href={`/blog/${slug}`} className="hover:text-blue-600">
                      {shortGuideTitle(POST_TITLES[slug] ?? slug)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6 flex flex-col">
              <h3 className="font-semibold text-lg mb-3">Start now</h3>
              <p className="text-sm text-zinc-500 mb-4">Upload a CSV or Excel file and ask your first question — free.</p>
              <Link href="/dashboard">
                <Button className="gap-2">Open Dashboard <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 深度内容(2026-09-22 加):首页承载的 10 个查询全在"ai csv / ai for csv / csv analysis ai"这一簇,
          位置 70-88 名 → 补足内容深度与答案前置,争取推进到前 3 页 */}
      <section className="bg-zinc-50 border-t border-zinc-100 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold">
            AI for CSV files: what it actually does
          </h2>
          <p className="mt-4 text-lg text-zinc-700">
            An AI CSV tool does three things: it parses your file, it computes over the columns, and
            it puts the answer in a sentence. Parsing and computing happen in your browser. Only the
            question and the data the answer needs are sent to a model — and you can skip that step
            entirely if you only want counts, null rates or duplicates.
          </p>

          <h3 className="mt-10 text-xl font-semibold">The four questions people actually arrive with</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              {
                q: "\u201cWhat is in this file?\u201d",
                a: "Column names, types, row count, null rate per column, duplicate rows, min and max. This needs no model at all — it is arithmetic on the parsed file.",
              },
              {
                q: "\u201cWhich rows matter?\u201d",
                a: "Filtering and grouping. The model\u2019s only job is translating your sentence into a group-by you could have written yourself.",
              },
              {
                q: "\u201cIs this data trustworthy?\u201d",
                a: "Missing values, mixed types in one column, dates stored as text, trailing whitespace in keys. This is where a spreadsheet silently lies to you.",
              },
              {
                q: "\u201cExplain it to someone else.\u201d",
                a: "The one genuinely AI-shaped task: turning an aggregate into a paragraph a colleague can act on, with the numbers still attached.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl border border-zinc-200 bg-white p-5">
                <p className="font-semibold text-zinc-900">{item.q}</p>
                <p className="mt-2 text-sm text-zinc-600">{item.a}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-semibold">Analyse a CSV file with AI — three routes, honestly compared</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-300 text-left text-zinc-500">
                  <th className="py-3 pr-4 font-medium">Route</th>
                  <th className="py-3 pr-4 font-medium">You need</th>
                  <th className="py-3 pr-4 font-medium">Fails when</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                <tr className="border-b border-zinc-200">
                  <td className="py-3 pr-4 font-medium text-zinc-900">Spreadsheet + formulas</td>
                  <td className="py-3 pr-4">The column names to already be clean</td>
                  <td className="py-3 pr-4">Any column is text that should be a number, or the file is larger than the row limit</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-3 pr-4 font-medium text-zinc-900">Pivot table</td>
                  <td className="py-3 pr-4">Knowing which two columns to cross</td>
                  <td className="py-3 pr-4">You do not yet know what you are looking for — which is the usual case</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-3 pr-4 font-medium text-zinc-900">Script (pandas / R)</td>
                  <td className="py-3 pr-4">The ability to write and debug it</td>
                  <td className="py-3 pr-4">You need the answer once, today</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-medium text-zinc-900">Ask in plain English</td>
                  <td className="py-3 pr-4">Nothing — type the question</td>
                  <td className="py-3 pr-4">The file has no header row, or one column mixes units (kg and lb in the same column)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            None of these is the right answer for everything. The plain-English route is the fastest
            way to find out which of the other three you actually needed.
          </p>

          <h3 className="mt-10 text-xl font-semibold">Two checks worth running before you trust any number</h3>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-zinc-700">
            <li>
              <strong className="text-zinc-900">Look at the null rate per column first.</strong> A
              column that is 40% empty will still produce a confident average, and that average is
              answering a different question than the one you asked.
            </li>
            <li>
              <strong className="text-zinc-900">Check for duplicate rows before you sum anything.</strong>{" "}
              Exported reports frequently contain them, and they inflate totals invisibly.
            </li>
          </ol>
          <p className="mt-6 text-zinc-700">
            Both are free and neither needs a model:{" "}
            <Link href="/tools/csv-analyzer" className="font-semibold text-blue-600 hover:text-blue-700">
              open the CSV analyzer
            </Link>{" "}
            and the profile is the first thing it shows. If your file is a European export that came
            in as a single column, the{" "}
            <Link href="/tools/csv-delimiter-converter" className="font-semibold text-blue-600 hover:text-blue-700">
              delimiter converter
            </Link>{" "}
            fixes that before analysis. And if it is simply too large to open,{" "}
            <Link href="/tools/csv-splitter" className="font-semibold text-blue-600 hover:text-blue-700">
              split it first
            </Link>
            .
          </p>

          <h3 className="mt-10 text-xl font-semibold">Frequently asked questions</h3>
          <dl className="mt-4 space-y-5">
            {[
              {
                q: "Is it safe to analyse a CSV with AI?",
                a: "It depends on which half you use. Parsing, profiling and counting run in the browser and the file never leaves your machine. The plain-English question sends the question plus the data needed to answer it to a model. If your data is regulated or identifiable, use the profile half only, or strip the sensitive columns before asking.",
              },
              {
                q: "Can an AI tool handle a CSV that is too big for Excel?",
                a: "Excel stops at 1,048,576 rows and becomes unusable well before that. A browser tool is limited by your machine's memory rather than a hard row cap, but the practical move for a large file is to split it or aggregate it first — you rarely need every row to answer the question.",
              },
              {
                q: "Does the file need a header row?",
                a: "Yes, for anything useful. Without a header, the tool has to invent column names (field_1, field_2) and every question becomes harder to phrase. If your export has a title line above the header, delete that line first.",
              },
              {
                q: "What if my CSV is semicolon-separated?",
                a: "It will parse as a single column. That is a delimiter problem, not an AI problem — convert it to comma-separated first, then analyse it. The same applies to files with a byte-order mark glued to the first header.",
              },
            ].map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-zinc-900">{item.q}</dt>
                <dd className="mt-1 text-zinc-600">{item.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CTA />
    </>
  );
}
