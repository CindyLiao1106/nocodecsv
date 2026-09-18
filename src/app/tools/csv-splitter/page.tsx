import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap } from "lucide-react";
import { CsvSplitterTool } from "./csv-splitter-tool";

export const metadata: Metadata = {
  title: "CSV Splitter — Split a Large CSV Into Multiple Files (Free)",
  description:
    "Split a large CSV file by row count, file size, or column value — entirely in your browser. Every file keeps the header. No upload, no signup.",
  keywords: [
    "csv splitter",
    "split csv file",
    "split large csv file online",
    "split csv by rows",
    "split csv by column value",
    "divide csv into multiple files",
  ],
  alternates: { canonical: "https://nocodecsv.com/tools/csv-splitter" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "CSV Splitter — Split a Large CSV Into Multiple Files (Free)",
    description: "Split a large CSV file by row count, size, or column value in your browser. No upload.",
    type: "website",
    url: "https://nocodecsv.com/tools/csv-splitter",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV Splitter — Split a Large CSV Into Multiple Files (Free)",
    description: "Split a large CSV file by row count, size, or column value in your browser. No upload.",
  },
};

const faqs = [
  {
    q: "How do I split a CSV file into two?",
    a: "Open the file in a splitter, choose \"by row count,\" and set the number to roughly half the total rows — the tool creates two files, each with the header row included. With this tool, upload the file above, pick By row count, enter half of the total row count shown at the top, and click Split & Download.",
  },
  {
    q: "How can I split a file into multiple files online?",
    a: "Use a browser-based splitter so the file never has to be uploaded to a server — this tool reads the file with the FileReader API, splits it in memory by row count, size, or a column's values, and gives you one download link per resulting file, plus a \"download all\" button.",
  },
  {
    q: "How to split a CSV file in Excel?",
    a: "Excel has no built-in split command. The common workaround is to open the file, select the extra rows, cut them, and paste them into a new workbook — repeated manually for every chunk, and risky for files near Excel's 1,048,576-row limit since Excel may already be truncating what it loaded. A dedicated splitter like this one handles the row math and keeps the header automatically.",
  },
  {
    q: "What is the best separator to use in a CSV file?",
    a: "Comma is the standard (RFC 4180) and what most tools expect by default. This tool detects whatever separator your file already uses and keeps it unchanged in every split file — it splits rows, it doesn't convert delimiters. To change the delimiter itself, use our CSV delimiter converter.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "CSV Splitter",
      url: "https://nocodecsv.com/tools/csv-splitter",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Split a large CSV file into multiple smaller files by row count, file size, or column value — entirely in the browser. No file upload, no signup required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Split by row count, file size, or column value",
        "Header row repeated in every file (optional)",
        "Pre-split estimate of file count and size",
        "Per-file download links plus a download-all button",
        "100% client-side — files never leave the browser",
        "UTF-8 and UTF-8 with BOM output encoding",
        "Handles large files in chunks",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: "CSV Splitter",
          item: "https://nocodecsv.com/tools/csv-splitter",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const scenarios = [
  { scenario: "You need to email or upload each piece under a size limit (5 MB, 10 MB, 25 MB)", mode: "By file size" },
  { scenario: "You want roughly equal chunks to hand to teammates or run through a script in parallel", mode: "By row count" },
  { scenario: "You need one file per region, status, customer, or category for separate handling", mode: "By column value" },
  { scenario: "You just want the file small enough for Excel or Google Sheets to open without lagging", mode: "By row count" },
];

export default function CsvSplitterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero + tool (above the fold) */}
      <section className="bg-white pt-10 sm:pt-14 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              CSV Splitter
            </h1>
            <p className="mt-3 text-lg text-zinc-500 max-w-2xl mx-auto">
              Split a CSV with millions of rows into smaller files — by row count, file size, or column value. Every
              file keeps the header. The file never leaves your computer.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" /> No upload
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-blue-600" /> Runs in your browser
              </span>
            </div>
          </div>

          {/* WebMCP:把该工具声明给 AI agent(旧浏览器忽略这些属性)*/}
          <form
            toolname="splitLargeCsv"
            tooldescription="Splits a CSV file that is too large for Excel or Google Sheets into smaller files with a chosen number of rows each. Use this when a user has a file that will not open or is too big to work with."
            onSubmit={(e) => e.preventDefault()}
          >
            <CsvSplitterTool />
          </form>
        </div>
      </section>

      {/* Which mode to use */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Which Split Mode Should You Use?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Scenario</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Use this mode</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {scenarios.map((s) => (
                  <tr key={s.scenario}>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{s.scenario}</td>
                    <td className="p-3 border-b border-zinc-100 font-medium text-zinc-900">{s.mode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Headers */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Headers Are Where This Usually Goes Wrong</h2>
          <p className="text-zinc-600 mb-4">
            A CSV&apos;s first row is a header, not data — it names the columns so the row values line up correctly.
            Split naively and only the first file keeps that header; every other file starts with real data in place
            of column names, and whatever tool opens it next either misreads the first data row as a header or fails
            to match columns at all.
          </p>
          <p className="text-zinc-600 mb-4">
            That&apos;s why this tool repeats the header row in every split file by default. It also means the
            header row itself doesn&apos;t count toward your row-count or size target — a 50,000-row split gives you
            50,000 rows of data plus one header line, not 49,999.
          </p>
          <p className="text-zinc-600">
            If you plan to concatenate the files back together yourself, turn the &quot;repeat header&quot; option
            off — only the first file will have a header, so a simple concatenation won&apos;t duplicate it in the
            middle of the merged file.
          </p>
        </div>
      </section>

      {/* Merging back */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Splitting Is Reversible</h2>
          <p className="text-zinc-600">
            Splitting a file doesn&apos;t destroy anything — every row from the original ends up in exactly one
            output file, in order. If you split by row count or file size and later need the original back, stack
            the files in order and drop the repeated header rows from all but the first. See{" "}
            <Link href="/blog/merge-csv-files-free" className="text-blue-600 underline">
              our guide to merging CSV files back together
            </Link>{" "}
            for the exact steps, including a free tool for it.
          </p>
        </div>
      </section>

      {/* How big can CSVs get */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">How Big Can a CSV File Get Before It&apos;s a Problem?</h2>
          <p className="text-zinc-600 mb-4">
            Excel caps every worksheet at 1,048,576 rows — a CSV can hold far more than that, but Excel will silently
            stop loading at the limit rather than warn you the rest is missing. See{" "}
            <Link href="/blog/excel-row-limit" className="text-blue-600 underline">
              our breakdown of Excel&apos;s row limit
            </Link>{" "}
            for what actually happens when you hit it.
          </p>
          <p className="text-zinc-600">
            Beyond the row cap, a multi-gigabyte CSV is simply slow to open, email, or process in memory-limited
            tools. Splitting it into pieces sized for the tool at the other end is usually less work than fighting
            the file&apos;s size directly — see{" "}
            <Link href="/blog/split-large-csv-file-online" className="text-blue-600 underline">
              our full guide to splitting large CSV files online
            </Link>{" "}
            for more approaches, including command-line options for files too large to load in a browser at all.
          </p>
        </div>
      </section>

      {/* Why no upload */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why We Don&apos;t Upload Your File</h2>
          <p className="text-zinc-600 mb-6">
            Files big enough to need splitting are usually exports of everything — full customer lists, transaction
            logs, entire databases dumped to CSV. Those are exactly the files that shouldn&apos;t leave your machine.
            This tool reads the file with the browser&apos;s FileReader API, splits it in memory, and hands each
            piece back as a direct download. Nothing is sent to a server, so there&apos;s nothing to log, cache, or
            leak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">&nbsp;</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">This tool</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Typical online splitter</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="p-3 border-b border-zinc-100 text-zinc-500">File leaves your device?</td>
                  <td className="p-3 border-b border-zinc-100">No</td>
                  <td className="p-3 border-b border-zinc-100">Yes — uploaded to their server</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-100 text-zinc-500">Works offline once loaded?</td>
                  <td className="p-3 border-b border-zinc-100">Yes</td>
                  <td className="p-3 border-b border-zinc-100">No</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-500">Signup required?</td>
                  <td className="p-3">No</td>
                  <td className="p-3">Sometimes, for larger files</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-lg mb-2">{f.q}</h3>
                <p className="text-zinc-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related tools & guides */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">More Free CSV Tools &amp; Guides</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link href="/tools/csv-delimiter-converter">
              <Button variant="outline">CSV Delimiter Converter</Button>
            </Link>
            <Link href="/tools/csv-analyzer">
              <Button variant="outline">CSV Analyzer</Button>
            </Link>
            <Link href="/ai-analytics-statistics">
              <Button variant="outline">AI Analytics Statistics</Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/blog/split-large-csv-file-online" className="text-blue-600 underline">
              Split a large CSV file online
            </Link>
            <Link href="/blog/merge-csv-files-free" className="text-blue-600 underline">
              Merge CSV files back together
            </Link>
            <Link href="/blog/excel-row-limit" className="text-blue-600 underline">
              Excel&apos;s row limit explained
            </Link>
            <Link href="/blog/count-rows-in-csv-file" className="text-blue-600 underline">
              Count rows in a CSV file
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
