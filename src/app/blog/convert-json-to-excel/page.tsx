import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Convert JSON to Excel: Nested Data and a Folder of Files (2026)",
  description:
    "JSON has no rows or columns, so Excel cannot simply open it. Four routes that turn objects, nested arrays and whole folders of .json files into a usable spreadsheet.",
  keywords: [
    "convert json to excel",
    "json to excel",
    "json to xlsx",
    "import json into excel",
    "json to excel converter",
    "open json file in excel",
    "json array to excel",
    "convert json to excel free",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/convert-json-to-excel" },
  openGraph: {
    title: "Convert JSON to Excel Without Losing Half the File",
    description:
      "Power Query, a CSV hop, pandas, and Google Sheets. Which one handles nested objects, and what to do when a batch of JSON files has to become one sheet.",
    type: "article",
    url: "https://nocodecsv.com/blog/convert-json-to-excel",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-15",
    modifiedTime: "2026-09-15",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert JSON to Excel: Nested Data and Batch Files",
    description:
      "The reason JSON lands in one column, why nested arrays multiply your row count, and the four ways to get a clean sheet out of it.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Convert JSON to Excel: Nested Data and a Folder of Files (2026)",
  description:
    "JSON has no rows or columns, so Excel cannot simply open it. How to turn JSON objects, nested arrays and whole folders of .json files into a usable spreadsheet.",
  url: "https://nocodecsv.com/blog/convert-json-to-excel",
  datePublished: "2026-09-15",
  dateModified: "2026-09-15",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/convert-json-to-excel",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Convert JSON to Excel",
      item: "https://nocodecsv.com/blog/convert-json-to-excel",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I open a JSON file in Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not by double-clicking it. Excel binds .json to nothing useful, and the Windows file association usually hands the file to a text editor instead. The supported route is Data > Get Data > From File > From JSON, which opens Power Query and parses the file for you. Excel also has a command-line limit worth knowing before you try: a worksheet holds 1,048,576 rows and 16,384 columns, and a single cell holds at most 32,767 characters.",
      },
    },
    {
      "@type": "Question",
      name: "Is it possible to import JSON into Excel without converting it first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, through Power Query. Excel 2016 and later ship a JSON connector at Data > Get Data > From File > From JSON. Power Query reads the object structure, and nested objects and arrays appear as columns containing Record or List values. You turn those into real columns with the expand button in the column header, which is the step people miss when the file looks imported but the data is still unusable.",
      },
    },
    {
      "@type": "Question",
      name: "Why does my nested JSON produce more rows than it has records?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because a JSON array inside a record is a one-to-many relationship, and a spreadsheet cannot store one-to-many in a single row. If an order object contains an array of five line items, expanding that array gives five rows for one order. RFC 8259, the JSON specification, allows arrays and objects to nest to any depth, so there is no single flattening that preserves every shape. Decide which question you are answering: one row per order, or one row per line item.",
      },
    },
    {
      "@type": "Question",
      name: "Should I convert JSON to CSV instead of straight to Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the data is tabular and you only need a flat sheet, CSV is the shorter path. Excel, Sheets, pandas and every database will read a CSV, and the format is defined by RFC 4180, so quoting behaves the same everywhere. The catch is that CSV has no way to express nesting, so any child array must be flattened, duplicated into extra rows, or dropped before the export. If you plan to go back to JSON later, keep the original file.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert a whole folder of JSON files into one spreadsheet?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Do it in code rather than by hand. In Python, walk the folder, read each file, flatten it and concatenate the frames, then write one sheet. The same job is possible in Power Query by pointing the folder connector at the directory, but you still have to expand the structure for every file, which fails as soon as one file in the folder has an extra field. Two pandas functions carry most of the work: json_normalize for nested records and concat for stacking the results.",
      },
    },
    {
      "@type": "Question",
      name: "What if the JSON file is too big for Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Excel stops at 1,048,576 rows, which large API dumps pass easily. Options: filter the rows in code before writing the sheet, split the output into one file per month or per region, or ask the question you actually need answered with a tool that reads the file where it sits. A JSON Lines file, where every line is one complete object, is the easiest large format to process because it can be read a line at a time instead of being parsed whole in memory.",
      },
    },
    {
      "@type": "Question",
      name: "Why does Power Query show Record and List instead of my values?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Record and List are Power Query's names for a nested object and a nested array. The values are there, one level down. Click the expand icon in the column header and pick the fields you want. If you expand a List column you get one row per element, which is why a 200-record file can open as a 4,000-row table without any error appearing.",
      },
    },
  ],
};

export default function Page() {
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
        <p className="text-blue-600 font-medium">📄 Format &amp; Conversion · 8 min read</p>
        <h1>Convert JSON to Excel: Nested Data and a Folder of Files (2026)</h1>

        <p>
          <strong>
            Excel cannot open a .json file directly, because JSON is a tree and a spreadsheet is a
            grid. The fastest route is Data &gt; Get Data &gt; From File &gt; From JSON, then
            expanding the columns Power Query marks as Record or List. If you want a flat sheet and
            nothing else, convert to CSV first. If a whole folder of files has to become one
            spreadsheet, do it in code, because the manual route breaks the moment one file has an
            extra field.
          </strong>{" "}
          All four routes are below, in the order most people should try them.
        </p>

        <p>
          The request that brings people here usually includes a folder, not a file. A first-time
          JSON user asking for help on Reddit put it this way:{" "}
          <em>
            &ldquo;I am working with JSON files for the first time and need to extract specific data
            from a batch of files into an excel spreadsheet.&rdquo;
          </em>{" "}
          The awkward part is not the conversion. It is deciding what a row is once you have several
          files and a nested structure.
        </p>

        <h2>Why JSON does not behave like CSV</h2>

        <p>
          RFC 8259, the JSON specification, defines six kinds of value: object, array, string,
          number, boolean and null. There is no table, no column and no row. An object is an
          unordered set of name-value pairs, and values may be objects or arrays themselves, nested
          as deep as whoever generated the file wanted. CSV is the opposite: RFC 4180 describes a
          rectangle of fields separated by commas, with a fixed number of columns per line.
        </p>

        <p>
          That mismatch is the entire problem. Converting JSON to Excel is really a decision about
          which part of the tree becomes the rows. A file with 200 order objects and five line items
          each is either 200 rows or 1,000 rows, and both answers are correct depending on what you
          plan to do with the sheet.
        </p>

        <p>
          Excel does not leave you without tools, though. Since Excel 2016 there is a JSON connector
          behind Get Data, and it handles nesting properly. It just does not announce itself.
        </p>

        <h2>Which shape is your JSON?</h2>

        <p>
          Read the first two lines of the file before choosing a method. The outer structure decides
          almost everything.
        </p>

        <table>
          <thead>
            <tr>
              <th>Outer shape</th>
              <th>Looks like</th>
              <th>Becomes in Excel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Array of flat objects</td>
              <td>
                <code>{`[{"id":1,"name":"A"},{"id":2,"name":"B"}]`}</code>
              </td>
              <td>A clean table, one row per object. Easiest case.</td>
            </tr>
            <tr>
              <td>JSON Lines / NDJSON</td>
              <td>One complete object on every line</td>
              <td>A clean table, and it streams, so file size stops mattering</td>
            </tr>
            <tr>
              <td>Single object wrapping the list</td>
              <td>
                <code>{`{"data":[...],"meta":{...}}`}</code>
              </td>
              <td>Expand <code>data</code>, drop or keep <code>meta</code> as columns</td>
            </tr>
            <tr>
              <td>Objects containing arrays</td>
              <td>
                <code>{`{"order":7,"items":[{...},{...}]}`}</code>
              </td>
              <td>
                One row per order, or one row per item. Expanding the array multiplies rows.
              </td>
            </tr>
            <tr>
              <td>Deeply nested records</td>
              <td>Address inside customer inside order</td>
              <td>
                Repeated expansion, with prefixes to keep the column names apart
              </td>
            </tr>
          </tbody>
        </table>

        <h2>Method 1: Power Query, built into Excel</h2>

        <ol>
          <li>Open a blank workbook and go to <strong>Data &gt; Get Data &gt; From File &gt; From JSON</strong>.</li>
          <li>Pick the file. Power Query opens a preview with one column, usually named after the wrapper key.</li>
          <li>
            Click the expand icon in the column header and tick the fields you want. Nested objects
            come back as <code>Record</code> and nested arrays as <code>List</code>. Expand them the
            same way, one level at a time.
          </li>
          <li>
            For a folder, use <strong>Data &gt; Get Data &gt; From Folder</strong> instead, then
            combine the files and expand. Keep a column with the file name, since that is often the
            only thing separating one batch from another.
          </li>
          <li>
            <strong>Close &amp; Load</strong> writes the result into a sheet. The transformation is
            saved, so next month&apos;s file only needs a refresh.
          </li>
        </ol>

        <p>
          Two things go wrong here often enough to be worth naming. Expanding a List column creates
          one row per element, so row counts jump, and there is no warning when it happens. And
          expanding nested records produces duplicate column names such as <code>name</code> twice;
          rename them before loading or reference them by position afterwards, which is a habit that
          ages badly.
        </p>

        <h2>Method 2: Convert to CSV first, then open it</h2>

        <p>
          If the JSON is flat, this is the least work. A{" "}
          <Link href="/blog/json-to-csv-converter-online">JSON to CSV converter</Link> gives you a
          file that Excel, Sheets and every database already understand, with quoting handled by RFC
          4180 rules. The reverse direction,{" "}
          <Link href="/blog/csv-to-json-free-online">CSV to JSON</Link>, is the one to use when you
          are heading back to an API.
        </p>

        <p>
          The limitation is the same one that makes CSV popular: it is flat. Nested arrays have to be
          flattened, repeated across rows, or dropped before export. Choose deliberately, because
          dropping a field during conversion and finding out three weeks later is a common way to
          lose data quietly.
        </p>

        <h2>Method 3: Python, for batches and repeat jobs</h2>

        <p>
          When the folder has forty files in it, read the JSON in code and write one spreadsheet. Two
          functions do most of the work: <code>json_normalize</code> flattens nested records into
          columns, and <code>concat</code> stacks the frames into a single table.
        </p>

        <pre>
          <code>{`import json, glob
import pandas as pd

frames = []
for path in glob.glob("exports/*.json"):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    df = pd.json_normalize(data, sep="_")   # nested keys become addr_city, addr_zip
    df["source_file"] = path
    frames.append(df)

pd.concat(frames, ignore_index=True).to_excel("combined.xlsx", index=False)`}</code>
        </pre>

        <p>
          For JSON Lines files, where each line is a complete object, skip the loop over lines and
          read the file in one call instead. It is faster and it handles large files without holding
          a parsed copy of the whole document in memory.
        </p>

        <p>
          Keep an eye on the{" "}
          <Link href="/blog/excel-row-limit">Excel row limit of 1,048,576 rows</Link> before the
          export, not after. It is easier to split the output into one file per month than to explain
          to someone why the last quarter of their data is missing. Writing to CSV instead of XLSX
          removes the ceiling entirely.
        </p>

        <h2>Method 4: Google Sheets, with one caveat</h2>

        <p>
          Sheets has no JSON importer. <code>IMPORTDATA</code> and <code>IMPORTHTML</code> are not
          options here, and pasting raw JSON into a cell gives you text, not columns. The practical
          route is to convert the file to CSV first and import that, or to write a small Apps Script
          that fetches the URL and writes rows. Apps Script is genuinely useful if the JSON comes
          from an API you check weekly, because the sheet then refreshes on a trigger.
        </p>

        <p>
          Sheets does raise the size ceiling: Google documents a limit of 10 million cells and 18,278
          columns, both well above Excel&apos;s grid. What it does not do is guess your structure.
        </p>

        <h2>When the sheet comes out wrong</h2>

        <table>
          <thead>
            <tr>
              <th>Symptom</th>
              <th>Cause</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Everything sits in one column as text</td>
              <td>
                The file is JSON Lines, or the tool read it as plain text
              </td>
              <td>Use Get Data &gt; From JSON, not File &gt; Open</td>
            </tr>
            <tr>
              <td>Columns named <code>Record</code> or <code>List</code></td>
              <td>Nested values not yet expanded</td>
              <td>Expand in the column header, one level at a time</td>
            </tr>
            <tr>
              <td>Row count multiplied</td>
              <td>Expanding an array creates one row per element</td>
              <td>Expand the child array last, or aggregate it first</td>
            </tr>
            <tr>
              <td>Leading zeros gone from IDs and ZIP codes</td>
              <td>Excel typed the column as a number</td>
              <td>
                Set the column type to Text in Power Query before loading.{" "}
                <Link href="/blog/keep-leading-zeros-in-csv">Keeping leading zeros</Link> is a
                separate fight once the data is already in the grid.
              </td>
            </tr>
            <tr>
              <td>Dates arrive as text, or shift by a day</td>
              <td>
                JSON has no date type, only strings and numbers
              </td>
              <td>Convert explicitly and set the locale on the column</td>
            </tr>
            <tr>
              <td>Numbers lose precision</td>
              <td>JSON numbers are doubles; long IDs do not fit exactly</td>
              <td>Read the field as text and keep it that way</td>
            </tr>
          </tbody>
        </table>

        <p>
          The last row of that table causes the most damage, because nothing looks broken. A
          19-digit account number read as a double comes back with the final digits changed. If the
          field is an identifier rather than a quantity, it is text, whatever the JSON thinks.
        </p>

        <h2>A note on encoding</h2>

        <p>
          JSON for interchange is UTF-8 by definition, so a file that renders correctly in an editor
          and turns into mojibake in Excel has usually been through a second encoding on the way in.
          Importing through Power Query rather than opening the file lets you confirm the encoding
          before anything is written to the sheet. If it has already gone wrong in a CSV, the fix is
          in{" "}
          <Link href="/blog/fix-garbled-csv-in-excel">garbled CSV in Excel</Link>.
        </p>

        <p>
          Once the data is in a sheet, the next question is usually about the data itself rather than
          the file format. Loading it into the{" "}
          <Link href="/tools/excel-data-analysis">Excel data analysis tool</Link> lets you ask for
          totals, outliers and trends in plain language, without a second conversion step, and the{" "}
          <Link href="/tools/csv-analyzer">CSV analyzer</Link> handles the same job when you exported
          to CSV instead. If you went the other way and now have a flat file you are not sure about,{" "}
          <Link href="/blog/csv-vs-excel">CSV vs Excel</Link> covers when each one is the right
          container.
        </p>

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            The conversion is free with Excel or Python. These three earn their cost when the same
            JSON feed arrives on a schedule and someone still has to hand it to a human:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the flattening script above is short until the fifth file
              in the folder has a field the other four do not; a $10-a-month subscription covers 19+
              models for writing and repairing that code, which is cheaper than an afternoon of
              guessing.{" "}
              <a
                href="https://opencode.ai/go?ref=64V3FDAF5T"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try OpenCode Go
              </a>
            </li>
            <li>
              <strong>Stack AI</strong> — if the JSON lands from an API and the sheet is expected by
              9am, a workflow can fetch, flatten and load it on arrival instead of leaving a scheduled
              script to babysit.{" "}
              <a
                href="https://www.stack-ai.com/partnership"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try Stack AI
              </a>
            </li>
            <li>
              <strong>Softr</strong> — when the converted data is really a list that colleagues keep
              asking you to email, publishing it as a searchable page saves more time than any
              spreadsheet shortcut.{" "}
              <a
                href="https://www.softr.io"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try Softr
              </a>
            </li>
          </ul>
          <p className="text-xs text-slate-400 mt-3">
            Some links above are affiliate links — if you buy through them we may earn a commission
            at no extra cost to you. Links currently point to each vendor&apos;s official page until
            our dedicated tracking links are registered. OpenCode Go uses our referral link.
          </p>
        </div>

        <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Converted It? Now Ask It a Question</h2>
          <p className="text-blue-100 mb-5">
            Upload the file and ask for the totals, the trend or the odd rows. No formulas, no import
            settings, no flattening to debug.
          </p>
          <Link href="/tools/csv-analyzer">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Analyze Your Data Free
            </Button>
          </Link>
        </div>

        <RelatedPosts slug="convert-json-to-excel" />
      </article>
    </>
  );
}
