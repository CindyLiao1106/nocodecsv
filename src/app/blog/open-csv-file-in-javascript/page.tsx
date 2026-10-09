import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "How to Read a CSV File in JavaScript (Node.js and Browser)",
  description:
    "Read a CSV in JavaScript with FileReader or File.text() in the browser, and fs plus csv-parse or Papa Parse in Node. Why split(',') breaks on quoted commas.",
  keywords: [
    "how to read a csv file in javascript",
    "read csv file in javascript",
    "javascript csv parser",
    "node js read csv",
    "papaparse",
    "csv-parse",
    "filereader csv",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/open-csv-file-in-javascript" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "How to Read a CSV File in JavaScript (Node.js and Browser)",
    description:
      "The browser and Node paths for reading a CSV, the one file that breaks a naive split, and which npm parser to reach for.",
    type: "article",
    url: "https://nocodecsv.com/blog/open-csv-file-in-javascript",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-10-09",
    modifiedTime: "2026-10-09",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Read a CSV File in JavaScript (Node.js and Browser)",
    description: "FileReader, File.text(), fs, csv-parse and Papa Parse — and why split(',') is a bug.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Read a CSV File in JavaScript (Node.js and Browser)",
  description:
    "Read a CSV in JavaScript with FileReader or File.text() in the browser, and fs plus csv-parse or Papa Parse in Node. Why split(',') breaks on quoted commas.",
  url: "https://nocodecsv.com/blog/open-csv-file-in-javascript",
  datePublished: "2026-10-09",
  dateModified: "2026-10-09",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/open-csv-file-in-javascript",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "How to Read a CSV File in JavaScript",
      item: "https://nocodecsv.com/blog/open-csv-file-in-javascript",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I read a CSV file in JavaScript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In the browser, take the File from an input or a drop event and read it as text with await file.text(), then parse the string with a quote-aware parser such as Papa Parse. In Node.js, read the file with fs.readFileSync('data.csv', 'utf8'), or stream it with fs.createReadStream() and pipe it into csv-parse. Never split the text on the comma: a field such as \"Doe, Jane\" contains a comma of its own.",
      },
    },
    {
      "@type": "Question",
      name: "Why does splitting a CSV on a comma give the wrong number of columns?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RFC 4180 lets a field contain the delimiter when it is wrapped in double quotes, and it also lets quoted fields span multiple lines. csv.split(',') and line.split(',') see every comma, so a row like \"Doe, Jane\",Paris becomes three pieces instead of two, and a quoted line break turns one record into two lines. A parser that understands quotes handles both cases.",
      },
    },
    {
      "@type": "Question",
      name: "Should I use Papa Parse or csv-parse?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Papa Parse is a single dependency that runs in both the browser and Node and reads a File or a string directly, which suits front-end uploads. csv-parse is Node-first and built as a stream transform, which suits large files and pipelines where you do not want the whole file in memory. Both are quote-aware and RFC 4180 compatible; the choice is about where the file is read, not about parsing quality.",
      },
    },
    {
      "@type": "Question",
      name: "How do I handle a BOM at the start of a CSV in JavaScript?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A UTF-8 byte-order mark becomes a literal U+FEFF character at the front of the string, so the first header name reads as \"\\uFEFFname\" and a lookup for \"name\" misses. Strip it after reading: text.replace(/^\\uFEFF/, ''). Papa Parse and csv-parse both strip a leading BOM by default, but code that reads the raw string does not.",
      },
    },
  ],
};

export default function BlogPost() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc prose-lg">
      <p className="text-blue-600 font-medium">🟨 Tutorial · 7 min read</p>
      <h1>How to Read a CSV File in JavaScript</h1>
      <p><strong>In the browser, read the file with <code>await file.text()</code> (or a <code>FileReader</code>), then parse the string with a quote-aware parser. In Node.js, read it with <code>fs.readFileSync(&apos;data.csv&apos;, &apos;utf8&apos;)</code> or stream it into <code>csv-parse</code>.</strong> The part that trips people up is not the file access, it is the parsing: any code that calls <code>text.split(&apos;,&apos;)</code> or <code>line.split(&apos;,&apos;)</code> is wrong on real data, because a comma is allowed inside a quoted field. This guide covers both environments, the one file that breaks a naive split, and which parser to reach for.</p>

      <h2>The quick answer</h2>
      <pre><code>{`// Browser: a File from <input type="file"> or a drop event
const text = await file.text();

// Node: read the whole file into a string
import { readFileSync } from "node:fs";
const text = readFileSync("data.csv", "utf8");

// Then parse with a quote-aware parser — not split(",")
`}</code></pre>
      <p>Get the text first, then hand it to a parser. Everything below is which parser, and why the shortcut is a bug rather than a style choice.</p>

      <h2>Browser: FileReader, File.text() and Blob.text()</h2>
      <p>When the user picks a file or drops one on the page, what you have is a <code>File</code>, which extends <code>Blob</code>. Modern browsers give you a promise-returning method on it, so the shortest correct read is:</p>
      <pre><code>{`const file = input.files[0];
const text = await file.text();          // Blob.text(), resolves to a UTF-8 string
`}</code></pre>
      <p>Older code — and any code that needs progress on a large file — uses <code>FileReader</code> instead:</p>
      <pre><code>{`const reader = new FileReader();
reader.onload = () => console.log(reader.result);
reader.readAsText(file, "utf-8");
`}</code></pre>
      <p>Both produce a string. If the file is not UTF-8, <code>readAsText</code> lets you pass an encoding (for example <code>&quot;windows-1252&quot;</code>); <code>file.text()</code> always assumes UTF-8, so a legacy export read that way shows <code>Ã©</code> where an accent should be. That symptom is the same one described in <Link href="/blog/fix-garbled-csv-in-excel">fixing a garbled CSV</Link>, with an encoding label instead of a file setting.</p>
      <p>What the browser will <em>not</em> do for you is parse. Read the string, then parse it.</p>

      <h2>Node.js: fs, and streaming for large files</h2>
      <p>On the server, the file is on disk and you read it with the built-in <code>fs</code> module. For a file you know fits in memory:</p>
      <pre><code>{`import { readFileSync } from "node:fs";
const text = readFileSync("data.csv", "utf8");   // or await fs.promises.readFile(...)
`}</code></pre>
      <p>For a file that does not fit — a few hundred megabytes, or a nightly export — stream it. <code>csv-parse</code> is written as a stream transform, so it reads record by record and never holds the whole file:</p>
      <pre><code>{`import { createReadStream } from "node:fs";
import { parse } from "csv-parse";

createReadStream("data.csv")
  .pipe(parse({ columns: true, bom: true }))
  .on("data", (row) => console.log(row));
`}</code></pre>
      <p>The <code>columns: true</code> option turns the first row into object keys, so each <code>row</code> is <code>&#123; name: ..., city: ... &#125;</code> rather than an array. That is usually what you want. The same streaming idea in the shell is covered in <Link href="/blog/open-csv-file-in-linux">opening a CSV in Linux</Link>, and the Python equivalent in <Link href="/blog/open-csv-file-in-python">opening a CSV in Python</Link>.</p>

      <h2>Why split(&quot;,&quot;) is wrong on real data</h2>
      <p>Here is the rule that catches everyone. RFC 4180, the CSV format definition, allows a field to contain the delimiter — and even a line break — as long as the field is enclosed in double quotes. A single row from a CRM export can look like this:</p>
      <pre><code>{`name,city,note
"Doe, Jane",Paris,"likes ""quotes""
and commas"
Bob,Tokyo,plain
`}</code></pre>
      <p>Three records. But split on the comma and you get five fragments, and split on newlines and you get four lines. Every tool that assumes one row is one line and one field is one comma-separated piece reads this file incorrectly:</p>
      <pre><code>{`text.split("\\n").map(line => line.split(","))
// [["name","city","note"],
//  ["\\"Doe"," Jane\\"","Paris","\\"likes \\"\\"quotes\\"\\""],
//  ["and commas\\""],
//  ["Bob","Tokyo","plain"]]   ← wrong: 4 rows, ragged columns
`}</code></pre>
      <p>A quote-aware parser reads the same text correctly, as three records with three fields each. The rule to carry: the moment you split a CSV on a single character, you are asserting that no field contains that character. Exports from forms, banks and CRMs break that assertion routinely.</p>

      <h2>Which parser: Papa Parse, csv-parse, or d3-dsv</h2>
      <p>Three libraries cover almost every JavaScript need. All are quote-aware.</p>
      <ul>
        <li><strong>Papa Parse</strong> — one dependency that runs in the browser and in Node. It accepts a <code>File</code> or a string, has a worker mode for large uploads, and can stream a remote URL. Best when the file arrives from a user in the browser.</li>
        <li><strong>csv-parse</strong> — part of the <code>csv</code> package, Node-first, built as a stream. Best for files on disk and for pipelines.</li>
        <li><strong>d3-dsv</strong> — small and dependency-light, with <code>d3.csvParse</code> for a string. A good fit when you are already working with data visualisation and only need a plain parse.</li>
      </ul>
      <pre><code>{`// Papa Parse (browser or Node)
Papa.parse(file, { header: true, skipEmptyLines: true,
  complete: (res) => console.log(res.data) });

// d3-dsv (string in, array of objects out)
import { csvParse } from "d3-dsv";
const rows = csvParse(text);
`}</code></pre>
      <p>Any of these beats a hand-rolled parser, but if you only need to look at the data rather than ship code, <Link href="/tools/csv-analyzer">the free CSV analyzer</Link> reads it in the browser with nothing to install. To turn the records into JSON, <Link href="/blog/convert-csv-to-json">converting CSV to JSON</Link> covers the mapping, and the <Link href="/tools/json-csv-converter">JSON ⇄ CSV converter</Link> does it interactively.</p>

      <h2>Headers, the BOM, and empty trailing lines</h2>
      <p>Three small details cause most &quot;it parsed but the fields are wrong&quot; reports.</p>
      <ul>
        <li><strong>A UTF-8 BOM.</strong> If the file was saved as &quot;UTF-8 with BOM&quot;, the first header key becomes <code>&quot;\uFEFFname&quot;</code> and <code>row.name</code> is <code>undefined</code>. Strip it with <code>text.replace(/^\uFEFF/, &quot;&quot;)</code>, or let a parser do it (<code>bom: true</code> in csv-parse, on by default in Papa Parse).</li>
        <li><strong>A trailing newline.</strong> Most editors end the last line with a newline, which yields one empty final row. Use <code>skipEmptyLines: true</code>, or filter rows with no populated fields.</li>
        <li><strong>Type inference.</strong> Parsers return strings. A zip code of <code>01234</code> stays a string only if you keep it that way — converting it to a number drops the leading zero, the same trap covered in <Link href="/blog/keep-leading-zeros-in-csv">keeping leading zeros</Link>.</li>
      </ul>

      <h2>Counting and checking the parse</h2>
      <p>After parsing, the fastest sanity check is the record count, because a quoted line break is the one thing that silently changes it. If the count disagrees with your expectation, compare it against the physical line count — the mismatch is almost always a multi-line field. <Link href="/blog/count-rows-in-csv-file">Counting rows in a CSV</Link> walks through that comparison.</p>
      <pre><code>{`const records = Papa.parse(text, { header: true }).data;
console.log(records.length);   // records, not lines
`}</code></pre>

      <h2>Frequently Asked Questions</h2>
      <h3>How do I read a CSV file in JavaScript?</h3>
      <p>In the browser, read the <code>File</code> with <code>await file.text()</code>, then parse the string with Papa Parse. In Node, use <code>fs.readFileSync(&apos;data.csv&apos;, &apos;utf8&apos;)</code>, or stream with <code>createReadStream</code> piped into <code>csv-parse</code>. Do not split on the comma.</p>
      <h3>Why does splitting on a comma give the wrong column count?</h3>
      <p>RFC 4180 allows a comma, and a line break, inside a double-quoted field. Splitting sees every comma, so <code>&quot;Doe, Jane&quot;,Paris</code> becomes three pieces instead of two. A quote-aware parser reads the field as one value.</p>
      <h3>Should I use Papa Parse or csv-parse?</h3>
      <p>Papa Parse runs in both the browser and Node and reads a <code>File</code> directly, which suits user uploads. csv-parse is a Node stream transform, which suits large files and pipelines. Both handle quotes correctly.</p>
      <h3>How do I handle a BOM at the start of a CSV?</h3>
      <p>A UTF-8 BOM becomes a literal U+FEFF at the front of the string, so the first header key reads as <code>&quot;\uFEFFname&quot;</code>. Strip it with <code>text.replace(/^\uFEFF/, &quot;&quot;)</code>, or rely on a parser that removes it by default.</p>

      {/* ===== Author byline ===== */}
      <div className="mt-8 flex items-center gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">NC</div>
        <div>
          <p className="font-semibold text-zinc-700">NoCodeCSV Team</p>
          <p>Updated October 9, 2026 · Practical guides by the NoCodeCSV team.</p>
        </div>
      </div>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Go further with AI data tools</h2>
        <p className="text-slate-600 mb-4">NoCodeCSV handles the basics for free. When your data work grows, these tools pair well with it:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — build AI workflows that process your CSVs automatically, end to end.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>Softr</strong> — turn your cleaned data into customer-facing apps and portals without code.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
          <li>
            <strong>Toggl Track</strong> — track time spent on data projects and client work.{' '}
            <a href="https://toggl.com" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Toggl</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Inspect a CSV Without Writing Code</h2>
        <p className="text-blue-100 mb-5">Upload any CSV and read it as a clean table in seconds. No signup needed.</p>
        <Link href="/dashboard"><Button size="lg" variant="secondary" className="text-base px-8">Open a CSV Free</Button></Link>
      </div>
      <RelatedPosts slug="open-csv-file-in-javascript" />
    </article>
    </>
  );
}
