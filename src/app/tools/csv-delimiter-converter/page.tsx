import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap } from "lucide-react";
import { DelimiterConverterTool } from "./delimiter-converter-tool";
import { WebMcpForm } from "@/components/tools/webmcp-form";

import { ToolAnimation } from "@/components/tools/tool-animation";
export const metadata: Metadata = {
  title: "CSV Delimiter Converter — Comma, Semicolon, Tab, Pipe (Free)",
  description:
    "Convert a CSV's delimiter — comma to semicolon, tab, pipe, or custom — entirely in your browser. No upload, no signup. Preview before/after, then download.",
  keywords: [
    "csv delimiter converter",
    "change csv delimiter",
    "convert csv to semicolon",
    "csv comma to tab",
    "csv separator converter",
    "convert tsv to csv online",
  ],
  alternates: { canonical: "https://nocodecsv.com/tools/csv-delimiter-converter" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "CSV Delimiter Converter — Comma, Semicolon, Tab, Pipe (Free)",
    description: "Convert a CSV's delimiter in your browser. No upload, no signup.",
    type: "website",
    url: "https://nocodecsv.com/tools/csv-delimiter-converter",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV Delimiter Converter — Comma, Semicolon, Tab, Pipe (Free)",
    description: "Convert a CSV's delimiter in your browser. No upload, no signup.",
  },
};

const faqs = [
  {
    q: "How to convert a CSV file to a comma delimited text file?",
    a: "Open the file in a delimiter converter, let it detect the current separator (often a semicolon or tab), set the target to comma, and download. This tool does that entirely in your browser — upload the file above, pick Comma as the target, and click Convert & Download.",
  },
  {
    q: "How can I open a CSV file in Excel with a different delimiter?",
    a: "Don't double-click the file — that applies Excel's regional default and can misread it. Instead use Data > From Text/CSV, which lets you pick the real delimiter in a preview before loading. Alternatively, convert the delimiter first with a tool like this one so the file opens correctly no matter whose Excel opens it next.",
  },
  {
    q: "What delimiter should I use for CSV?",
    a: "Comma is the default defined by RFC 4180 and what most tools expect. Use semicolon if your data or region uses comma as a decimal separator, and tab (TSV) if your values themselves contain commas — it avoids the need for quoting altogether.",
  },
  {
    q: "How can I convert a column to a comma-separated list?",
    a: "That's a different operation from changing a file's delimiter — it means joining values from one column into a single line, like \"a, b, c\". Paste the column into a spreadsheet, use a formula like TEXTJOIN(\", \", TRUE, range), or use Python's \",\".join(list). This tool converts whole files, not single columns.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "CSV Delimiter Converter",
      url: "https://nocodecsv.com/tools/csv-delimiter-converter",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Convert a CSV file's delimiter — comma, semicolon, tab, pipe, or custom — entirely in the browser. No file upload, no signup required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Automatic delimiter detection",
        "Comma, semicolon, tab, pipe, and custom delimiters",
        "Before/after preview of the first 10 rows",
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
          name: "CSV Delimiter Converter",
          item: "https://nocodecsv.com/tools/csv-delimiter-converter",
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

const delimiterReference = [
  { name: "Comma ( , )", use: "Default CSV separator (RFC 4180)", regions: "US, UK, most of the English-speaking world", watch: "Breaks if a value contains an unquoted comma" },
  { name: "Semicolon ( ; )", use: "Regional CSV default from Excel", regions: "Germany, France, Spain, Italy, much of Europe/South America", watch: "Usually paired with comma as the decimal mark (3,50)" },
  { name: "Tab", use: "TSV — values rarely contain a literal tab", regions: "No strong regional pattern; common in exports and scripting", watch: "File often keeps a .csv extension despite being tab-separated" },
  { name: "Pipe ( | )", use: "Chosen when data already contains commas and semicolons", regions: "Common in logs, legacy exports, some EDI formats", watch: "Rare in consumer tools — not every importer auto-detects it" },
  { name: "Space", use: "Fixed-width or simple log exports", regions: "Scripting and legacy systems, not spreadsheet exports", watch: "Ambiguous whenever a value itself contains spaces" },
];

export default function CsvDelimiterConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero + tool (above the fold) */}
      <section className="bg-white pt-10 sm:pt-14 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              CSV Delimiter Converter
            </h1>
            <p className="mt-3 text-lg text-zinc-500 max-w-2xl mx-auto">
              Swap commas for semicolons, tabs, pipes, or anything else — right in your browser. The file never
              leaves your computer.
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

          {/* WebMCP:把该工具声明给 AI agent(客户端包装组件,旧浏览器忽略这些属性) */}
          <WebMcpForm toolname="fixCsvDelimiter" tooldescription="Converts a CSV file whose delimiter is wrong — semicolon, tab or pipe — so that the columns line up properly in Excel or Google Sheets. Use this when a user's file opens as a single column.">
            <DelimiterConverterTool />
          </WebMcpForm>
        </div>
      </section>

      {/* 产品动图(纯 canvas,零依赖) */}
      <ToolAnimation variant="delimiter" />

      {/* Three methods */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Three Ways to Change a CSV Delimiter</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">1. This tool (recommended)</h3>
              <p className="text-sm text-zinc-500">
                Auto-detects the current delimiter, previews before/after, and downloads the result — no software,
                no upload, works on any device.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">2. Excel</h3>
              <p className="text-sm text-zinc-500">
                <strong>Data &gt; From Text/CSV</strong> lets you pick the delimiter in a preview. Avoid
                double-clicking the file — that applies regional defaults and can mangle leading zeros or dates. See
                the full walkthrough in{" "}
                <Link href="/blog/change-csv-delimiter" className="text-blue-600 underline">
                  our change-delimiter guide
                </Link>
                .
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold mb-2">3. Python (pandas)</h3>
              <p className="text-sm text-zinc-500">
                One line for repeatable conversions:
              </p>
              <pre className="mt-2 rounded-lg bg-zinc-100 p-2 text-xs overflow-x-auto">
                {`pd.read_csv("in.csv", sep=";").to_csv("out.csv", sep=",", index=False)`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Common pitfalls */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Where This Usually Goes Wrong</h2>
          <ul className="space-y-4">
            <li className="rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold mb-1">European semicolon files</h3>
              <p className="text-sm text-zinc-500">
                Files from Germany, France, Spain, and Italy often use a semicolon because the comma is already
                the decimal mark (e.g. <code className="bg-zinc-100 rounded px-1">3,50</code>). Blindly replacing
                semicolons with commas turns one number into two columns. Convert decimal commas to dots first, or
                use a wizard that understands the original format.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold mb-1">Values that already contain the target delimiter</h3>
              <p className="text-sm text-zinc-500">
                A field like <code className="bg-zinc-100 rounded px-1">&quot;Paris, Texas&quot;</code> needs
                quoting once commas become the separator. This tool quotes fields automatically unless you turn
                quoting off — turn it off only if you know your data has none of the target character.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold mb-1">A TSV file renamed to .csv</h3>
              <p className="text-sm text-zinc-500">
                The extension doesn&apos;t change the content — a tab-separated export saved as{" "}
                <code className="bg-zinc-100 rounded px-1">.csv</code> still needs a tab-aware parser. See{" "}
                <Link href="/blog/convert-tsv-to-csv" className="text-blue-600 underline">
                  our TSV to CSV guide
                </Link>{" "}
                for the difference.
              </p>
            </li>
            <li className="rounded-xl border border-zinc-200 p-5">
              <h3 className="font-semibold mb-1">Everything lands in one Excel column</h3>
              <p className="text-sm text-zinc-500">
                That means Excel assumed the wrong delimiter, not that the file is broken. Re-import through Data
                &gt; From Text/CSV and select the real separator, or convert it to comma first with this tool.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Why no upload */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why We Don&apos;t Upload Your File</h2>
          <p className="text-zinc-600 mb-6">
            Customer lists, payroll exports, invoices — the files people need to reformat are usually the ones that
            shouldn&apos;t leave their laptop. This tool reads the file with the browser&apos;s FileReader API,
            converts it in memory, and offers the result as a download. Nothing is sent to a server, so there&apos;s
            nothing to log, cache, or leak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">&nbsp;</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">This tool</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Typical online converter</th>
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

      {/* Delimiter reference table */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Delimiter Quick Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-zinc-50">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Delimiter</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Typical use</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Regions</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">Watch out for</th>
                </tr>
              </thead>
              <tbody>
                {delimiterReference.map((d) => (
                  <tr key={d.name}>
                    <td className="p-3 border-b border-zinc-100 font-medium text-zinc-900">{d.name}</td>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{d.use}</td>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{d.regions}</td>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{d.watch}</td>
                  </tr>
                ))}
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
            <Link href="/tools/spreadsheet-charts">
              <Button variant="outline">Chart Generator</Button>
            </Link>
            <Link href="/ai-analytics-statistics">
              <Button variant="outline">AI Analytics Statistics</Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/blog/change-csv-delimiter" className="text-blue-600 underline">
              How to change a CSV delimiter
            </Link>
            <Link href="/blog/convert-tsv-to-csv" className="text-blue-600 underline">
              Convert TSV to CSV
            </Link>
            <Link href="/blog/fix-garbled-csv-in-excel" className="text-blue-600 underline">
              Fix garbled CSV in Excel
            </Link>
            <Link href="/blog/how-to-clean-dirty-csv-data" className="text-blue-600 underline">
              How to clean dirty CSV data
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
