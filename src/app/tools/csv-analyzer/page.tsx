import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MessageSquare, BarChart3, ArrowRight, Check } from "lucide-react";

import { ToolAnimation } from "@/components/tools/tool-animation";
export const metadata: Metadata = {
  title: "Free AI CSV Analyzer — Analyse CSV & Chat With Your Data",
  description: "Analyse a CSV file with AI in plain English — ask questions, get charts, no SQL or Python. Works as an AI CSV analyser and a chat-with-CSV tool. Free to start.",
  keywords: ["free AI CSV analyzer", "CSV data analysis AI", "analyze CSV online free", "AI CSV tool", "chat with CSV", "CSV insights generator"],
  alternates: { canonical: "https://nocodecsv.com/tools/csv-analyzer" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "Free AI CSV Analyzer — Analyse CSV & Chat With Your Data",
    description: "Analyse CSV with AI: ask questions, get charts. No coding required.",
    type: "website",
    url: "https://nocodecsv.com/tools/csv-analyzer",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI CSV Analyzer — Analyse CSV & Chat With Your Data",
    description: "Analyse CSV with AI: ask questions, get charts. No coding required.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Free AI CSV Analyzer",
      url: "https://nocodecsv.com/tools/csv-analyzer",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Analyse any CSV file with AI in plain English — as an AI CSV analyser, or simply chat with your CSV. Get instant charts and insights.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a CSV file?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A CSV (comma-separated values) file stores tabular data — like a spreadsheet — as plain text, with each row on its own line and values separated by commas. It is the most common format for exporting data from databases, payment platforms, and business tools.",
          },
        },
        {
          "@type": "Question",
          name: "How do I analyze a CSV file for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Upload your CSV file to a free AI analyzer like NoCodeCSV, then ask questions in plain English — for example, \"what are total sales by region?\". The AI computes the answer and generates charts, no SQL or Python required.",
          },
        },
        {
          "@type": "Question",
          name: "Can NoCodeCSV handle large CSV files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — NoCodeCSV accepts CSV files up to 25MB, covering tens of thousands of rows. Files are processed and discarded, so your data stays private.",
          },
        },
        {
          "@type": "Question",
          name: "Does it work with semicolon-separated files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Only after the file is fixed. Semicolon exports (common in much of Europe) parse as a single column, so convert the delimiter first with our free delimiter converter, then analyse. The same applies to files with a byte-order mark glued to the first header.",
          },
        },
        {
          "@type": "Question",
          name: "Is my file uploaded to a server?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The file is parsed in your browser. The analysis step sends the parsed text to the model for that request and does not store it afterwards — no database of your data is kept.",
          },
        },
        {
          "@type": "Question",
          name: "Can I use it with Excel (.xlsx) files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — .xlsx and .csv are both accepted, up to 25MB. If a file is too large to open comfortably, split it into parts that keep the header row, then analyse each part.",
          },
        },
        {
          "@type": "Question",
          name: "What are the free limits?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Three analyses per day on the free tier, with no account needed for the first look. The Pro tier removes the daily cap; the pricing page lists what each tier includes.",
          },
        },
      ],
    },
  ],
};

const steps = [
  { title: "Upload CSV", desc: "Drag & drop your .csv file. Handles up to 25MB — orders, users, logs, anything." },
  { title: "Ask a Question", desc: '"What are total sales by region?" or "Find outliers in column B" — plain English works.' },
  { title: "Get Instant Analysis", desc: "AI computes statistics, finds patterns, and generates charts in seconds." },
];

const features = [
  "No coding — ask in plain English",
  "Auto-generated charts (bar, line, pie, scatter)",
  "Supports large CSV files up to 25MB",
  "Data privacy — files discarded after analysis",
  "Export results as CSV or PNG",
  "Powered by DeepSeek AI — free to start",
];

export default function CsvAnalyzerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Free AI CSV Analyzer — <span className="text-blue-600">Chat With Your Data</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto">
            Stop wrestling with Excel formulas and Python scripts. Upload your CSV, ask questions in plain English, and let AI do the heavy lifting.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 gap-2">
                <Upload className="h-5 w-5" /> Upload Your CSV — Free
              </Button>
            </Link>
            <p className="mt-3 text-sm text-zinc-400">No credit card. 3 free analyses every day.</p>
          </div>
        </div>
      </section>

      {/* 产品动图(纯 canvas,零依赖) */}
      <ToolAnimation variant="analyzer" />

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How to Analyze CSV Files With AI</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="border-zinc-200">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold mb-3">{i + 1}</div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-500">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list + CTA */}
      <section className="py-16 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Everything you need, nothing you don&apos;t</h2>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-zinc-600">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button className="gap-2">
                    Try It Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold text-lg mb-3">Sample Questions You Can Ask</h3>
              <div className="space-y-2 text-sm text-zinc-600">
                {[
                  "\"Show me total sales by product category\"",
                  "\"What's the average order value by month?\"",
                  "\"Find the top 10 customers by revenue\"",
                  "\"Which region had the highest growth in Q3?\"",
                  "\"Are there any outliers in the pricing column?\"",
                ].map((q) => (
                  <div key={q} className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 shrink-0" />
                    <code className="text-xs bg-zinc-100 rounded px-2 py-1">{q}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 深度内容(2026-09-21 加:针对 GSC 里"chat with csv / ai for csv"这一簇查询,第 6-10 页 → 补足内容深度) */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 prose prose-zinc">
          <h2 className="text-2xl sm:text-3xl font-bold">Chat with your CSV — what that actually means</h2>
          <p className="text-zinc-600">
            &ldquo;Chat with CSV&rdquo; is not a chatbot that has memorised your file. It is three
            mechanical steps, and knowing them tells you exactly what you can and cannot ask:
          </p>
          <ol className="text-zinc-600 list-decimal pl-6 space-y-2">
            <li>
              <strong>Your file is parsed into rows and columns.</strong> The header row becomes field
              names; everything below becomes values. This is why a file that opens in one column in
              Excel will also look wrong here — the delimiter, not the AI, is the problem.
            </li>
            <li>
              <strong>Your question is turned into a computation.</strong> &ldquo;Total sales by
              region&rdquo; becomes a group-by and a sum. The assistant is choosing the operation, not
              inventing the numbers.
            </li>
            <li>
              <strong>The result is rendered back</strong> as a table or chart you can check against
              your own file.
            </li>
          </ol>
          <p className="text-zinc-600">
            That is the whole trick — and it is why a plain-English question works at all. It is also
            why the quality of your header row decides the quality of the answer.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-12">AI for CSV: what it can and cannot answer</h2>
          <div className="grid sm:grid-cols-2 gap-6 not-prose">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5">
              <h3 className="font-semibold text-emerald-900 mb-3">Good questions to ask</h3>
              <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
                <li>Which category grew fastest between these two periods?</li>
                <li>How many rows have a blank value in this column?</li>
                <li>What is the median order value per region?</li>
                <li>Group these customers by how much they spent.</li>
                <li>Are there duplicate rows in this file?</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-5">
              <h3 className="font-semibold text-amber-900 mb-3">Where it stops (be honest about this)</h3>
              <ul className="text-sm text-zinc-700 space-y-2 list-disc pl-5">
                <li>
                  <strong>It cannot fix a broken file.</strong> Wrong delimiter, mixed encodings or a
                  stray header row all produce confident nonsense. Fix the file first.
                </li>
                <li>
                  <strong>It cannot know your business rules.</strong> Whether refunds count as
                  revenue is your call, not the model&rsquo;s.
                </li>
                <li>
                  <strong>It cannot guarantee a number is right.</strong> Every answer should be
                  checkable against the source rows — ask for the rows behind an answer when the
                  stakes are real.
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mt-12">Four ways to analyse a CSV — compared honestly</h2>
          <p className="text-zinc-600">
            There is no single best method. Each one trades setup effort against repeatability:
          </p>
          <div className="not-prose overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200">
              <thead className="bg-zinc-100 text-left">
                <tr>
                  <th className="p-3 border-b border-zinc-200">Approach</th>
                  <th className="p-3 border-b border-zinc-200">You need to know</th>
                  <th className="p-3 border-b border-zinc-200">Best when</th>
                  <th className="p-3 border-b border-zinc-200">Weakest at</th>
                </tr>
              </thead>
              <tbody className="text-zinc-600">
                <tr>
                  <td className="p-3 border-b border-zinc-200">Sorting and filtering by hand in Excel</td>
                  <td className="p-3 border-b border-zinc-200">Nothing</td>
                  <td className="p-3 border-b border-zinc-200">One-off look at a small file</td>
                  <td className="p-3 border-b border-zinc-200">Repeating it next month</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200">Formulas (SUMIF, COUNTIF, XLOOKUP)</td>
                  <td className="p-3 border-b border-zinc-200">Function syntax</td>
                  <td className="p-3 border-b border-zinc-200">The same question every month</td>
                  <td className="p-3 border-b border-zinc-200">Questions you did not anticipate</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200">Pivot tables</td>
                  <td className="p-3 border-b border-zinc-200">Field dragging, grouping</td>
                  <td className="p-3 border-b border-zinc-200">Cross-tabs and totals</td>
                  <td className="p-3 border-b border-zinc-200">Ad-hoc wording of a question</td>
                </tr>
                <tr>
                  <td className="p-3 border-b border-zinc-200">Asking an AI assistant in plain English</td>
                  <td className="p-3 border-b border-zinc-200">Nothing beyond the question</td>
                  <td className="p-3 border-b border-zinc-200">Exploring a file you have never seen</td>
                  <td className="p-3 border-b border-zinc-200">Anything that must be reproducible to the cent</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-zinc-600">
            In practice most people do both: ask the AI to find the pattern, then rebuild the two
            figures that matter as formulas so they stay reproducible.
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold mt-12">Why semicolon and BOM files break CSV tools</h2>
          <p className="text-zinc-600">
            The CSV format is not one format. <strong>RFC 4180</strong> defines commas as the
            separator and requires any field containing a comma, quote or line break to be wrapped in
            double quotes — which is why a file with unescaped commas in a text column can shift every
            row by one column. Two other failures are just as common:
          </p>
          <ul className="text-zinc-600 list-disc pl-6 space-y-2">
            <li>
              <strong>Semicolon-delimited files.</strong> Spreadsheet apps in much of Europe export
              with semicolons, because the comma is already used as the decimal separator. Parsed as
              comma-CSV, the whole row lands in column A.
            </li>
            <li>
              <strong>A BOM at the start.</strong> Some exporters prefix a UTF-8 byte-order mark,
              which becomes an invisible character glued to your first header name — so a lookup on
              &ldquo;Region&rdquo; silently fails.
            </li>
          </ul>
          <p className="text-zinc-600">
            Fix the delimiter before analysing: our free{" "}
            <Link href="/tools/csv-delimiter-converter" className="text-blue-600 underline">
              delimiter converter
            </Link>{" "}
            detects the separator and rewrites the file in your browser, and if the result is still
            too big to open, the{" "}
            <Link href="/tools/csv-splitter" className="text-blue-600 underline">
              CSV splitter
            </Link>{" "}
            cuts it into parts that keep the header row.
          </p>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is a CSV file?</h3>
              <p className="text-zinc-600">
                A CSV (comma-separated values) file stores tabular data — like
                a spreadsheet — as plain text, with each row on its own line
                and values separated by commas. It is the most common format
                for exporting data from databases, payment platforms, and
                business tools.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I analyze a CSV file for free?</h3>
              <p className="text-zinc-600">
                Upload your CSV file to a free AI analyzer like NoCodeCSV,
                then ask questions in plain English — for example, "what are
                total sales by region?". The AI computes the answer and
                generates charts, no SQL or Python required.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can NoCodeCSV handle large CSV files?</h3>
              <p className="text-zinc-600">
                Yes — NoCodeCSV accepts CSV files up to 25MB, covering tens of
                thousands of rows. Files are processed and discarded, so your
                data stays private.
              </p>
            </div>
          </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Does it work with semicolon-separated files?</h3>
              <p className="text-zinc-600">Only after the file is fixed. Semicolon exports (common in much of Europe) parse as a single column, so convert the delimiter first with our free delimiter converter, then analyse. The same applies to files with a byte-order mark glued to the first header.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is my file uploaded to a server?</h3>
              <p className="text-zinc-600">The file is parsed in your browser. The analysis step sends the parsed text to the model for that request and does not store it afterwards — no database of your data is kept.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Can I use it with Excel (.xlsx) files?</h3>
              <p className="text-zinc-600">Yes — .xlsx and .csv are both accepted, up to 25MB. If a file is too large to open comfortably, split it into parts that keep the header row, then analyse each part.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">What are the free limits?</h3>
              <p className="text-zinc-600">Three analyses per day on the free tier, with no account needed for the first look. The Pro tier removes the daily cap; the pricing page lists what each tier includes.</p>
            </div>
          <div className="mt-10 text-center">
            <Link href="/blog/how-to-analyze-csv-with-ai-free" className="text-blue-600 underline">
              Read the full guide: How to analyze CSV files with AI →
            </Link>
          </div>
        </div>
      </section>

      {/* Related tools & guides */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">More free AI data tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/excel-data-analysis"><Button variant="outline">Analyze Excel Files</Button></Link>
            <Link href="/tools/spreadsheet-charts"><Button variant="outline">Generate Charts</Button></Link>
            <Link href="/blog/how-to-analyze-csv-with-ai-free"><Button variant="outline">CSV Analysis Guide</Button></Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to analyze your CSV?</h2>
        <p className="mt-2 text-zinc-500">First 3 analyses are free. No credit card required.</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg" className="text-base px-10">Start Free Analysis</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
