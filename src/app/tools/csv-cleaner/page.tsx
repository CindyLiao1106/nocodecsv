import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap } from "lucide-react";
import { CsvCleanerTool } from "./csv-cleaner-tool";
import { WebMcpForm } from "@/components/tools/webmcp-form";
import { ToolAnimation } from "@/components/tools/tool-animation";

export const metadata: Metadata = {
  title: "CSV Cleaner — Remove Blank Rows & Duplicates (Free)",
  description:
    "Clean a messy CSV in one click: trim invisible spaces, drop empty rows and columns, remove duplicates, tidy headers. Runs in your browser — no upload, no signup.",
  keywords: [
    "csv cleaner",
    "clean csv file online",
    "csv cleaner online",
    "remove duplicate rows from csv",
    "remove blank rows from csv",
    "clean csv data",
  ],
  alternates: { canonical: "https://nocodecsv.com/tools/csv-cleaner" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "CSV Cleaner — Remove Blank Rows & Duplicates (Free)",
    description: "Clean a messy CSV in your browser. No upload, no signup.",
    type: "website",
    url: "https://nocodecsv.com/tools/csv-cleaner",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV Cleaner — Remove Blank Rows & Duplicates (Free)",
    description: "Clean a messy CSV in your browser. No upload, no signup.",
  },
};

const faqs = [
  {
    q: "How do I remove blank rows from a CSV file?",
    a: "Load the file into this cleaner and keep the Remove empty rows rule switched on. Every row where all cells are empty is deleted before you download, so the blank lines that break sorting, formulas, and lookups are gone in one pass.",
  },
  {
    q: "How do I remove duplicate rows from a CSV?",
    a: "Leave Remove duplicate rows switched on. The tool compares each row after the other rules have run, so a row with a stray space or a non-breaking space is recognised as the duplicate it really is, not treated as a separate record.",
  },
  {
    q: "Why do two values that look the same not match?",
    a: "Almost always because of invisible characters. A non-breaking space (character code 160) looks exactly like a normal space but is a different character, and leading or trailing spaces also break exact matches. The trim rule removes both, which is what makes VLOOKUP and other lookups work again.",
  },
  {
    q: "Does this tool upload my CSV to a server?",
    a: "No. The file is read with the browser FileReader API and cleaned in memory on your own device. Nothing is sent anywhere, so customer lists, payroll exports, and invoices never leave your computer.",
  },
  {
    q: "Can it clean a file that is too big for Excel?",
    a: "It cleans any plain-text CSV your browser can open, including files past Excel's 1,048,576 row limit. If a file is so large that the browser struggles, split it first with our free CSV splitter and clean the parts.",
  },
  {
    q: "Can I clean specific things only?",
    a: "Yes. Every rule is a checkbox. Switch off the ones you do not want — for example keep duplicates but remove empty rows — and the download updates instantly, with a before and after count for each rule.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "CSV Cleaner",
      url: "https://nocodecsv.com/tools/csv-cleaner",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Clean a messy CSV file in the browser: trim invisible spaces, remove empty rows and columns, remove duplicate rows, and tidy header names. No upload and no signup.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Trim leading and trailing spaces and non-breaking spaces",
        "Remove empty rows and empty columns",
        "Remove duplicate rows, compared after the other cleanups",
        "Tidy header names and name unnamed columns",
        "Optional UTF-8 BOM so Excel reads accented characters correctly",
        "100% client-side — the file never leaves the browser",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: "CSV Cleaner",
          item: "https://nocodecsv.com/tools/csv-cleaner",
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

export default function CsvCleanerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero + tool (above the fold) */}
      <section className="bg-white pt-10 sm:pt-14 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              CSV Cleaner
            </h1>
            <p className="mt-3 text-lg text-zinc-500 max-w-2xl mx-auto">
              Clean a messy CSV in one click — invisible spaces, blank rows, duplicate rows, and
              untidy headers, fixed before you download. The file never leaves your computer.
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

          {/* WebMCP: declare the tool for AI agents (client wrapper, ignored by older browsers) */}
          <WebMcpForm
            toolname="cleanCsvFile"
            tooldescription="Cleans a messy CSV file: trims leading and trailing spaces and non-breaking spaces, removes empty rows and empty columns, removes duplicate rows, and tidies header names. Use this when a user has a CSV with blank lines, duplicates, or values that will not match because of invisible spaces."
          >
            <CsvCleanerTool />
          </WebMcpForm>
        </div>
      </section>

      {/* Product animation (pure canvas, zero dependencies) */}
      <ToolAnimation variant="delimiter" />

      {/* What it fixes */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">What the Cleaner Fixes</h2>
          <ul className="space-y-4">
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Invisible spaces that break lookups</h3>
              <p className="text-sm text-zinc-500">
                A value can look identical on screen and still not be equal. Leading and trailing
                spaces and non-breaking spaces (character code 160) are removed from every cell, which
                is the usual reason a VLOOKUP or a match returns nothing.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Blank rows in the middle of the file</h3>
              <p className="text-sm text-zinc-500">
                Empty lines left by an export split tables in two. Sorting, filters, and formulas all
                stop at the first blank row, so removing them is the first repair in most cleanup jobs.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Duplicate rows</h3>
              <p className="text-sm text-zinc-500">
                Rows are compared after the trimming step, so &quot;Ann&quot; and &quot; Ann&quot;
                count as the same record. That catches the near-duplicates a plain exact-match
                dedupe misses.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Empty columns and messy headers</h3>
              <p className="text-sm text-zinc-500">
                Columns with no data in any row are dropped, and header names are trimmed, with double
                spaces collapsed and unnamed columns given a column_1, column_2 name instead of a blank.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Accents that turn into symbols in Excel</h3>
              <p className="text-sm text-zinc-500">
                The download can include a UTF-8 byte order mark. Without it, Excel on Windows often
                shows &quot;MÃ¼ller&quot; instead of &quot;Müller&quot;. The checkbox is on by default
                because it causes fewer surprises.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Three ways */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Three Ways to Clean a Messy File</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">1. This tool (quickest)</h3>
              <p className="text-sm text-zinc-500">
                Pick your rules, see the count of what changed, and download the cleaned file. No
                install, no upload, works on any device — and it takes seconds rather than minutes.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">2. Power Query in Excel</h3>
              <p className="text-sm text-zinc-500">
                The right answer when the same export arrives every month. Power Query records your
                cleaning steps once, then replays them on refresh. See our{" "}
                <Link href="/blog/power-query-tutorial" className="text-blue-600 underline">
                  Power Query tutorial
                </Link>
                .
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">3. Python (pandas)</h3>
              <p className="text-sm text-zinc-500">Three lines for a repeatable cleanup:</p>
              <pre className="mt-2 rounded-lg bg-zinc-100 p-2 text-xs overflow-x-auto">
                {`df = pd.read_csv("dirty.csv")\ndf = df.map(str.strip).dropna(how="all").drop_duplicates()`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Where it goes wrong */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Where Cleaning Usually Goes Wrong</h2>
          <ul className="space-y-4">
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Deleting before you keep a copy</h3>
              <p className="text-sm text-zinc-500">
                Always keep the original export. Deduplication and placeholder removal both delete
                rows, and you cannot undo a download once you have overwritten the source.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Treating real rows as duplicates</h3>
              <p className="text-sm text-zinc-500">
                Two orders from the same customer on different dates are not duplicates. If two rows
                can be legitimate, dedupe on a key column in a spreadsheet instead of dropping whole
                rows here.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Whitespace hidden in numbers and dates</h3>
              <p className="text-sm text-zinc-500">
                A number stored as text with a trailing space is still text. After trimming, set the
                column type in Excel or Power Query — or ask the{" "}
                <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
                  AI CSV analyzer
                </Link>{" "}
                what it found.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-1">Semicolon and tab files</h3>
              <p className="text-sm text-zinc-500">
                A European export often uses semicolons. This tool detects the delimiter before
                parsing, and always writes standard comma CSV on download. To keep another delimiter,
                use the{" "}
                <Link href="/tools/csv-delimiter-converter" className="text-blue-600 underline">
                  CSV delimiter converter
                </Link>
                .
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Why no upload */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why We Don&apos;t Upload Your File</h2>
          <p className="text-zinc-600 mb-6">
            The files that need cleaning are usually the ones that should not leave your laptop:
            customer lists, payroll exports, invoices. This tool reads the file with the browser
            FileReader API and cleans it in memory, so there is nothing to log, cache, or leak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">&nbsp;</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">This tool</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Typical online cleaner</th>
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
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
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
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">More Free CSV Tools &amp; Guides</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Link href="/tools/csv-analyzer">
              <Button variant="outline">CSV Analyzer</Button>
            </Link>
            <Link href="/tools/csv-splitter">
              <Button variant="outline">CSV Splitter</Button>
            </Link>
            <Link href="/tools/csv-delimiter-converter">
              <Button variant="outline">Delimiter Converter</Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/blog/how-to-clean-dirty-csv-data" className="text-blue-600 underline">
              How to clean dirty CSV data
            </Link>
            <Link href="/blog/remove-duplicates-from-csv" className="text-blue-600 underline">
              Remove duplicates from a CSV
            </Link>
            <Link href="/blog/remove-blank-rows-from-csv" className="text-blue-600 underline">
              Remove blank rows from a CSV
            </Link>
            <Link href="/blog/remove-special-characters-in-excel" className="text-blue-600 underline">
              Remove special characters in Excel
            </Link>
            <Link href="/blog/power-query-tutorial" className="text-blue-600 underline">
              Power Query tutorial
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
