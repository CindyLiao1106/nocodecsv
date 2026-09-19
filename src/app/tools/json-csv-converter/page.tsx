import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap } from "lucide-react";
import { JsonCsvConverterTool } from "./json-csv-converter-tool";
import { WebMcpForm } from "@/components/tools/webmcp-form";

import { ToolAnimation } from "@/components/tools/tool-animation";
export const metadata: Metadata = {
  title: "JSON to CSV & CSV to JSON Converter — Free, No Upload",
  description:
    "Convert JSON to CSV or CSV to JSON entirely in your browser. Nested objects flatten to dot-notation columns automatically. No upload, no signup. Preview, copy, or download.",
  keywords: [
    "json to csv",
    "csv to json",
    "json to csv converter",
    "csv to json converter",
    "convert nested json to csv",
    "json array to csv",
    "ndjson to csv",
  ],
  alternates: { canonical: "https://nocodecsv.com/tools/json-csv-converter" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "JSON to CSV & CSV to JSON Converter — Free, No Upload",
    description: "Convert JSON to CSV or CSV to JSON in your browser. Nested objects flatten automatically. No upload.",
    type: "website",
    url: "https://nocodecsv.com/tools/json-csv-converter",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON to CSV & CSV to JSON Converter — Free, No Upload",
    description: "Convert JSON to CSV or CSV to JSON in your browser. Nested objects flatten automatically. No upload.",
  },
};

const faqs = [
  {
    q: "How do I convert JSON with nested objects to CSV?",
    a: 'Nested objects need to be "flattened" into columns first, or a naive converter will print the JavaScript default string for an object — literally the text "[object Object]" — instead of the actual values. This tool flattens nested keys into dot-notation columns automatically (e.g. {"user":{"name":"Ann"}} becomes a column named user.name), and lets you switch to a shallow (1-level) or off (raw JSON text per cell) mode if you want the original structure preserved instead.',
  },
  {
    q: "How do I convert JSON to CSV in Python?",
    a: 'For a flat list of objects, pandas.json_normalize(data) followed by .to_csv("out.csv", index=False) handles nested keys the same way this tool does — dot-notation columns. For simple flat lists, csv.DictWriter with the union of all keys as fieldnames also works, but you have to flatten nested dicts yourself first or you\'ll get the same "[object Object]"-style problem (Python\'s version is the dict\'s repr string).',
  },
  {
    q: "How do I convert a CSV file to JSON in Excel?",
    a: "Excel has no built-in CSV-to-JSON export. Power Query (Data > Get Data > From Text/CSV, then Close & Load To > only create connection, then use the Advanced Editor) can produce a JSON-like table, but it's a multi-step detour for something a browser tool does in one paste. This page reads the CSV, detects the delimiter, and gives you a downloadable .json file directly.",
  },
  {
    q: "How do I convert a JSON array to CSV?",
    a: "If every element of the array is an object, each object becomes one CSV row and the union of all keys (in first-appearance order) becomes the columns — rows missing a given key just get an empty cell. If the array is itself an array of arrays (e.g. [[1,2],[3,4]]), you choose whether the first inner array is a header row or whether to generate generic column names. Paste the array into this tool and it detects which case you're in.",
  },
  {
    q: "How do I keep numbers as numbers instead of text when converting CSV to JSON?",
    a: 'CSV itself has no data types — every cell is text (RFC 4180 doesn\'t define one). This tool\'s "infer types" option (on by default) turns a cell like 42 into the JSON number 42, true/false into JSON booleans, and a blank cell into JSON null, while leaving everything else as a string. Turn it off if your data has meaningful leading zeros (like ZIP codes or IDs) that should stay text — this tool already skips inferring numbers with a leading zero for that reason.',
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "JSON to CSV & CSV to JSON Converter",
      url: "https://nocodecsv.com/tools/json-csv-converter",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      description:
        "Convert JSON to CSV or CSV to JSON entirely in the browser. Nested objects flatten to dot-notation columns, NDJSON and array-of-arrays are auto-detected, and CSV type inference recovers numbers and booleans. No file upload, no signup required.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Bidirectional: JSON to CSV and CSV to JSON",
        "Auto-detects object arrays, array-of-arrays, single objects, and NDJSON",
        "Nested objects flatten to dot-notation columns, with shallow or off modes",
        "Column name collisions are detected and renamed with a warning",
        "CSV to JSON type inference for numbers, booleans, and null",
        "Comma, semicolon, and tab delimiter support",
        "Round-trip 'convert back' button to self-check for data loss",
        "100% client-side — files never leave the browser",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
        {
          "@type": "ListItem",
          position: 2,
          name: "JSON to CSV & CSV to JSON Converter",
          item: "https://nocodecsv.com/tools/json-csv-converter",
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

const formatComparison = [
  { aspect: "Structure", csv: "Flat rows and columns only", json: "Arbitrary nesting — objects inside objects, arrays inside objects" },
  { aspect: "Data types", csv: "No native types — every cell is text (RFC 4180)", json: "String, number, boolean, null, array, object (RFC 8259)" },
  { aspect: "Comments", csv: "Not supported", json: "Not supported (despite many hand-edited config files using // anyway)" },
  { aspect: "Size for many similar rows", csv: "Compact — column names stored once, in the header", json: "Larger — each object repeats its own key names" },
  { aspect: "Typical use", csv: "Spreadsheets, databases, bulk import/export", json: "APIs, config files, anything with nested or variable-shape data" },
];

export default function JsonCsvConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero + tool (above the fold) */}
      <section className="bg-white pt-10 sm:pt-14 pb-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 leading-tight">
              JSON ⇄ CSV Converter
            </h1>
            <p className="mt-3 text-lg text-zinc-500 max-w-2xl mx-auto">
              Convert JSON to CSV or CSV to JSON in your browser. Nested objects flatten to dot-notation columns
              automatically. Nothing is uploaded.
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
          <WebMcpForm toolname="convertJsonCsv" tooldescription="Converts data between JSON and CSV in either direction: JSON (including NDJSON) to CSV, or CSV/TSV to JSON. Use this when a user needs their data in the other format.">
            <JsonCsvConverterTool />
          </WebMcpForm>
        </div>
      </section>

      {/* 产品动图(纯 canvas,零依赖) */}
      <ToolAnimation variant="jsoncsv" />

      {/* Nested JSON handling */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">How Nested JSON Is Handled</h2>
          <p className="text-zinc-600 mb-6">
            CSV has no concept of a nested object — every cell is a single flat value. Feed a nested object straight
            into a naive converter and it calls JavaScript&apos;s default <code className="bg-white rounded px-1">toString()</code>{" "}
            on it, which produces the literal text <code className="bg-white rounded px-1">[object Object]</code> —
            not an error, just a useless string that happens to look like data. This tool flattens nested keys into
            dot-notation column names instead, so the structure survives as column names rather than getting
            collapsed into that placeholder text.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Before (JSON)</p>
              <pre className="rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-700 overflow-x-auto">
                {`[
  {
    "user": {
      "name": "Ann",
      "address": { "city": "Boston" }
    }
  }
]`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 mb-1.5 uppercase tracking-wide">After (CSV, full flatten)</p>
              <pre className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-zinc-700 overflow-x-auto">
                {`user.name,user.address.city
Ann,Boston`}
              </pre>
            </div>
          </div>
          <p className="text-zinc-600 mt-6">
            The &quot;only 1 level&quot; option stops after the first dot — <code className="bg-white rounded px-1">user.address</code>{" "}
            would hold the raw <code className="bg-white rounded px-1">{`{"city":"Boston"}`}</code> as text instead of
            recursing further. The &quot;don&apos;t flatten&quot; option skips flattening entirely, so every nested
            value is stored as its original JSON text in a single cell under the top-level key. If flattening two
            different paths would produce the same column name (e.g. a literal key named{" "}
            <code className="bg-white rounded px-1">a.b</code> colliding with a nested{" "}
            <code className="bg-white rounded px-1">{`{"a":{"b":1}}`}</code>), this tool renames the second one and
            shows a warning rather than silently overwriting a column.
          </p>
        </div>
      </section>

      {/* What round trip loses */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">What Changes When You Convert Back</h2>
          <p className="text-zinc-600 mb-4">
            Use the &quot;Convert back (verify)&quot; button after a conversion to run the result through the
            opposite direction — a quick way to see what a round trip actually changes. Three things are worth
            knowing about going JSON → CSV → JSON:
          </p>
          <ul className="space-y-3 text-zinc-600">
            <li>
              <strong className="text-zinc-900">Object key order isn&apos;t guaranteed.</strong> RFC 8259 doesn&apos;t
              require JSON objects to preserve key order, even though most JavaScript engines happen to keep
              insertion order in practice. A CSV&apos;s column order is exactly what you flattened, but re-parsing
              that CSV back to JSON produces new objects — order isn&apos;t something the format promises to keep.
            </li>
            <li>
              <strong className="text-zinc-900">Very large integers can lose precision.</strong> JSON numbers
              themselves have no size limit, but{" "}
              <code className="bg-zinc-100 rounded px-1">JSON.parse</code> converts them to IEEE-754 double-precision
              floats, the same type JavaScript uses for every number — integers past{" "}
              <code className="bg-zinc-100 rounded px-1">2^53</code> can round to a nearby value on the way through.
            </li>
            <li>
              <strong className="text-zinc-900">Empty string, null, and missing key all become one blank cell.</strong>{" "}
              A CSV cell can only be empty text — RFC 4180 has no way to mark a cell as &quot;null&quot; versus
              &quot;empty string&quot; versus &quot;this field didn&apos;t exist in the original row.&quot; This tool&apos;s
              type inference turns a blank cell back into JSON <code className="bg-zinc-100 rounded px-1">null</code>{" "}
              by convention, but that&apos;s a guess — if the original value was really{" "}
              <code className="bg-zinc-100 rounded px-1">&quot;&quot;</code>, the round trip won&apos;t recover that
              distinction.
            </li>
          </ul>
        </div>
      </section>

      {/* CSV vs JSON comparison */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">CSV or JSON — Which Should You Use?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-white">
                <tr className="text-left">
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">&nbsp;</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">CSV</th>
                  <th className="p-3 font-semibold text-zinc-700 border-b border-zinc-200">JSON</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {formatComparison.map((row) => (
                  <tr key={row.aspect}>
                    <td className="p-3 border-b border-zinc-100 font-medium text-zinc-900">{row.aspect}</td>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{row.csv}</td>
                    <td className="p-3 border-b border-zinc-100 text-zinc-500">{row.json}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why no upload */}
      <section className="py-16 bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Why We Don&apos;t Upload Your File</h2>
          <p className="text-zinc-600 mb-6">
            JSON exports from an API and CSV exports from a database often contain exactly the data you&apos;d
            rather not hand to a third-party server — user records, order details, internal identifiers. This tool
            reads pasted text or a local file with the browser&apos;s <code className="bg-zinc-100 rounded px-1">FileReader</code>{" "}
            API, converts it in memory, and gives you the result as a copy or download. Nothing is sent over the
            network, so there&apos;s nothing to log, cache, or leak.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-zinc-200 rounded-xl overflow-hidden">
              <thead className="bg-zinc-50">
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
            <Link href="/tools/csv-delimiter-converter">
              <Button variant="outline">CSV Delimiter Converter</Button>
            </Link>
            <Link href="/tools/csv-splitter">
              <Button variant="outline">CSV Splitter</Button>
            </Link>
            <Link href="/ai-analytics-statistics">
              <Button variant="outline">AI Analytics Statistics</Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/blog/json-to-csv-converter-online" className="text-blue-600 underline">
              JSON to CSV converter guide
            </Link>
            <Link href="/blog/csv-to-json-free-online" className="text-blue-600 underline">
              CSV to JSON guide
            </Link>
            <Link href="/blog/convert-excel-to-json" className="text-blue-600 underline">
              Convert Excel to JSON
            </Link>
            <Link href="/blog/convert-json-to-excel" className="text-blue-600 underline">
              Convert JSON to Excel
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
