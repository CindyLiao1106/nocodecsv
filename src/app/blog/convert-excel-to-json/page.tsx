import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Convert Excel to JSON: Sheets, Dates and Nested Rows (2026)",
  description:
    "An .xlsx file is a ZIP of XML parts, so JSON tools cannot read it directly. Four routes from a workbook to clean JSON, and the five things that break on the way.",
  keywords: [
    "convert excel to json",
    "excel to json",
    "xlsx to json",
    "convert xlsx to json",
    "excel to json converter",
    "excel to json python",
    "export excel to json",
    "convert excel to json online free",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/convert-excel-to-json" },
  openGraph: {
    title: "Convert Excel to JSON Without Losing Data",
    description:
      "Only the active sheet survives a CSV save. Dates arrive as serial numbers. Here are the four routes that work, and what each one costs you.",
    type: "article",
    url: "https://nocodecsv.com/blog/convert-excel-to-json",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-16",
    modifiedTime: "2026-09-16",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Excel to JSON: Sheets, Dates and Nested Rows",
    description:
      "Why xlsx resists JSON tools, how to keep every sheet, and the tricks that quietly lose data.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Convert Excel to JSON: Sheets, Dates and Nested Rows (2026)",
  description:
    "An .xlsx file is a ZIP archive of XML parts, so JSON tools cannot read it directly. Four working routes from a workbook to clean JSON, and the details that break.",
  url: "https://nocodecsv.com/blog/convert-excel-to-json",
  datePublished: "2026-09-16",
  dateModified: "2026-09-16",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/convert-excel-to-json",
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
      name: "Convert Excel to JSON",
      item: "https://nocodecsv.com/blog/convert-excel-to-json",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why can't I just upload an xlsx file to a JSON converter?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because .xlsx is not a text table. The format is OOXML, standardised as ECMA-376 and ISO/IEC 29500, and an .xlsx file is a ZIP archive holding several XML parts: workbook.xml lists the sheets, each sheet has its own worksheet XML part, and text values are often pooled in a shared strings part. A parser has to unzip the file, follow the relationships and resolve those references. CSV needs none of that, which is why most online converters ask you to save as CSV first.",
      },
    },
    {
      "@type": "Question",
      name: "Why do my dates turn into numbers like 44927?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Excel does not store a date in a cell. It stores a number and formats it as a date, counting days from a 1900 epoch where serial 1 is 1900-01-01. A converter that reads raw cell values therefore hands you the serial, not the date. Two further details matter: the 1900 system contains a deliberate error that treats 1900 as a leap year, so serials before March 1900 are off by one, and some older Mac workbooks use the 1904 date system instead, which shifts every date by exactly 1,462 days. JSON has no date type at all, so whatever you convert to is a decision you have to make in code.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert every sheet, not just the first one?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Do not go through CSV. The Save As CSV route writes the active sheet only, because CSV has no concept of a sheet. Read the workbook with pandas using sheet_name=None, which returns a dictionary of DataFrames keyed by sheet name, then write one JSON file per sheet or one object keyed by sheet name. If you stay in Excel, Power Query's workbook connector can read each sheet, but you will build a separate query per sheet and combine them yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Why are my long ID numbers different in the JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JSON numbers follow IEEE 754 double precision, so integers above 2^53 lose exactness, and RFC 8259, the JSON specification, notes that implementations may disagree about how many digits they keep. A 19-digit account or order number read as a number comes back with changed trailing digits, and nothing in the output looks wrong. The same problem exists on the Excel side of the trip: when a workbook opens a CSV, a numeric-looking column can lose leading zeros and become a number. Read identifiers as text, in both programs.",
      },
    },
    {
      "@type": "Question",
      name: "Can Power Query export JSON?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Power Query reads JSON well and writes it poorly. The connector at Data > Get Data > From File > From JSON parses incoming files, but an outgoing query lands in a worksheet or the data model, not in a .json file. In Microsoft 365 the practical escape is Office Scripts, which ships an official sample that turns a table into JSON through JSON.stringify, and which can be triggered from Power Automate. On the desktop app you need a subscription that includes Office Scripts, or you generate the file outside Excel.",
      },
    },
    {
      "@type": "Question",
      name: "Is it better to convert Excel to CSV first?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It is the fastest route and the one that loses the most. CSV keeps one sheet, no formatting, no formulas and no cell types, and the values are re-typed when the file is opened again, which is where leading zeros disappear. Treat the CSV hop as fine when the workbook is one clean table of text and numbers. Skip it when there are several sheets, dates, or identifiers longer than 15 digits, and read the workbook directly instead.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my formula column empty after conversion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because a formula and its result are stored in different places, and readers disagree about which one they return. With openpyxl, the default returns the formula text, while data_only=True returns the value cached the last time Excel read the sheet. That cache is written by Excel itself, so a workbook produced by a script and never opened in Excel can return None for every formula cell even with data_only=True. Open the file in Excel and save it once, or compute the column yourself.",
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
        <p className="text-blue-600 font-medium">📄 Format &amp; Conversion · 9 min read</p>
        <h1>Convert Excel to JSON: Sheets, Dates and Nested Rows (2026)</h1>

        <p>
          <strong>
            A workbook is not a text file, which is why JSON tools refuse it. The workable routes
            are: save one clean sheet as CSV and convert that, read the workbook with pandas and
            write JSON from the frame, or stay inside Microsoft 365 with Get Data and Office
            Scripts. Three details cause most of the damage on the way: only the active sheet
            survives a CSV save, dates arrive as serial numbers, and identifiers longer than 15
            digits come back changed.
          </strong>{" "}
          The rest of this page is the four routes in the order worth trying, then the failure list.
        </p>

        <p>
          The question arriving in developer forums is usually a frustration about the file type
          rather than the conversion itself. One answer on r/node put the situation plainly:{" "}
          <em>
            &ldquo;My suggestion is exporting that Excel spreadsheet to csv which it will be easier
            to convert to json. Closed formats like Excel are difficult to&rdquo;
          </em>{" "}
          handle in a script. That advice is half right. The CSV hop works, and it quietly drops
          everything the workbook knows beyond the grid: the other sheets, the number formats, and
          the fact that a column was ever meant to hold a date.
        </p>

        <h2>What is actually inside the file</h2>

        <p>
          The format is OOXML, published as ECMA-376 and adopted as ISO/IEC 29500. An .xlsx file is
          a ZIP archive. Unzip one and you find <code>workbook.xml</code> listing the sheets, one
          worksheet part per sheet, a <code>sharedStrings.xml</code> holding repeated text once,
          and a relationships file tying it together. Cell values are stored by reference, with the
          type in an attribute rather than in the text.
        </p>

        <p>
          That is the whole reason a converter asks for CSV. The older .xls format is worse in this
          respect, since it is a binary compound file rather than a ZIP of XML, which is why
          libraries that handle .xlsx cleanly often need a different dependency for .xls.
        </p>

        <p>
          Excel does impose limits, and they matter once JSON is the output. A worksheet holds up
          to 1,048,576 rows and 16,384 columns, a cell holds at most 32,767 characters, and
          formulas are capped by nesting depth rather than length. JSON has no per-cell limit at
          all. When somebody says a conversion &ldquo;lost data&rdquo;, the data usually left the
          workbook long before the converter saw it.
        </p>

        <h2>Method 1: Save as CSV, then convert</h2>

        <p>
          File &gt; Save As &gt; CSV UTF-8 (Comma delimited), then run the CSV through any JSON
          converter. Two minutes of work, and it is the right answer for a single flat table.
        </p>

        <p>
          It fails in predictable places. The save writes the active sheet only, with no error and
          no warning about the other tabs. Formulas are replaced by their current values, so the
          arithmetic is gone. Values are re-typed when the CSV is read back, so a ZIP code column
          becomes integers, and any identifier with leading zeros loses them. If the JSON output
          will be read by a program rather than a person, that last point is a data loss bug rather
          than a cosmetic one.{" "}
          <Link href="/blog/keep-leading-zeros-in-csv">Keeping leading zeros</Link> is a fight you
          can win, but it is easier to avoid the CSV hop entirely.
        </p>

        <h2>Method 2: pandas, for anything with more than one sheet</h2>

        <p>
          <code>read_excel</code> with <code>sheet_name=None</code> returns a dictionary of
          DataFrames, one per sheet, keyed by sheet name. From there, one JSON file per sheet, or
          one object keyed by sheet:
        </p>

        <pre>
          <code>{`import pandas as pd

sheets = pd.read_excel("orders.xlsx", sheet_name=None)

for name, frame in sheets.items():
    frame.to_json(
        f"{name}.json",
        orient="records",
        force_ascii=False,
        indent=2,
    )`}</code>
        </pre>

        <p>
          Three settings earn their place in that snippet. <code>orient=&quot;records&quot;</code>{" "}
          produces an array of objects, which is what APIs and front-end code expect, instead of
          the column-oriented default. <code>force_ascii=False</code> keeps accented characters as
          characters rather than turning them into \u escapes. <code>indent=2</code> makes the
          output diffable, which matters the moment the file is committed to a repository.
        </p>

        <p>
          For large workbooks, read with <code>read_only=True</code> in openpyxl to avoid loading
          the whole sheet into memory, and pass <code>dtype=str</code> to <code>read_excel</code>{" "}
          for the identifier columns. That single argument prevents the 19-digit problem described
          below, at the cost of typing every number as text and converting the arithmetic columns
          yourself.
        </p>

        <p>
          If a column is empty in the output, the cause is usually formulas. openpyxl documents{" "}
          <code>data_only=True</code> as returning the value stored the last time Excel read the
          sheet, not a recalculation. A file generated by a script and never opened in Excel has no
          cached values, so every formula cell reads as None. Either open and save the file in
          Excel once, or compute that column in pandas instead.
        </p>

        <h2>Method 3: Inside Excel, with Microsoft 365</h2>

        <p>
          Power Query reads workbooks well through Data &gt; Get Data &gt; From File &gt; From
          Workbook, and it reads JSON through the same menu. Writing JSON is where it stops: a
          query loads into a worksheet or the data model, and neither of those is a .json file.
        </p>

        <p>
          Office Scripts closes that gap in Excel on the web. Microsoft ships a sample called
          Output Excel data as JSON that takes a table, converts it with{" "}
          <code>JSON.stringify</code> and writes the result out, and a Power Automate flow can run
          it on a schedule so that the file is regenerated without anyone opening Excel. The
          requirement is a Microsoft 365 licence that includes Office Scripts.
        </p>

        <p>
          The manual version still shows up in answers: build the JSON in a helper column with
          concatenation, then copy the column into a text editor. It works for twenty rows — and
          breaks on the first value containing a double quote or a backslash, because JSON, unlike
          CSV, has no quoting convention that makes an unescaped quote safe.
        </p>

        <h2>Method 4: An online converter</h2>

        <p>
          Fine for a file you would happily post. xlsx parsing runs in the browser in the tools
          worth using, including the ones built on SheetJS, so it is worth checking whether the
          upload happens at all before handing over a payroll file. If the sheet contains customer
          names, anything covered by a data processing agreement, or a column someone would object
          to seeing indexed, use one of the three routes above.
        </p>

        <h2>Which route to take</h2>

        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>Keeps every sheet</th>
              <th>Good to</th>
              <th>Weak at</th>
              <th>File leaves your machine</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Save as CSV, convert</td>
              <td>No</td>
              <td>A single clean table</td>
              <td>Dates, IDs, formulas</td>
              <td>Only if the converter uploads</td>
            </tr>
            <tr>
              <td>pandas</td>
              <td>Yes, with <code>sheet_name=None</code></td>
              <td>Repeatable jobs, big files</td>
              <td>Setup on a machine without Python</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Get Data + Office Scripts</td>
              <td>One query per sheet</td>
              <td>Files that change weekly</td>
              <td>Needs Microsoft 365</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Browser converter</td>
              <td>No</td>
              <td>One-off, non-sensitive</td>
              <td>Confidential data</td>
              <td>Sometimes</td>
            </tr>
          </tbody>
        </table>

        <h2>The five details that break the output</h2>

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
              <td>Only the first sheet appears</td>
              <td>CSV has no sheet concept</td>
              <td>
                Read the workbook directly, or export one CSV per sheet
              </td>
            </tr>
            <tr>
              <td>Dates come out as 44927</td>
              <td>Excel stores dates as day serials</td>
              <td>
                Convert in code and state the format, since{" "}
                <Link href="/blog/csv-vs-excel">JSON has no date type</Link>
              </td>
            </tr>
            <tr>
              <td>Trailing digits of a long ID changed</td>
              <td>JSON numbers are IEEE 754 doubles</td>
              <td>Export the column as a string</td>
            </tr>
            <tr>
              <td>Blank cells missing from some objects</td>
              <td>Some writers emit null, others omit the key</td>
              <td>Pick one convention and tell the consumer</td>
            </tr>
            <tr>
              <td>Merged cell values only on one row</td>
              <td>The value lives in the top-left cell of the merge</td>
              <td>Unmerge and fill down before exporting</td>
            </tr>
          </tbody>
        </table>

        <p>
          The date problem deserves one more sentence, because it produces silent wrong answers
          rather than empty ones. Two epoch systems are in circulation: the default 1900 system,
          which contains a fictional 29 February 1900 so that it can mimic an older spreadsheet
          program, and the 1904 system still found in workbooks created on older Mac versions.
          Their outputs differ by 1,462 days, so a converter that guesses the wrong one is wrong by
          four years, not by four seconds.
        </p>

        <h2>Deciding what a record is</h2>

        <p>
          &ldquo;Convert to JSON&rdquo; hides a design choice. The four shapes that come up:
        </p>

        <pre>
          <code>{`// 1. Array of objects - the usual answer
[{"id": "A-1001", "total": 249.5}]

// 2. Keyed by sheet, for multi-sheet workbooks
{"January": [...], "February": [...]}

// 3. Keyed by primary key, for lookups
{"A-1001": {"total": 249.5}}

// 4. JSON Lines - one object per line, for streaming
{"id": "A-1001", "total": 249.5}
{"id": "A-1002", "total": 88.0}`}</code>
        </pre>

        <p>
          Shape 4 is the one to remember for big exports. A JSON Lines file can be written and read
          one record at a time, so it never needs to fit in memory, and appending a day of data is
          a file append rather than a reparse. pandas writes it with <code>lines=True</code>. The
          other three are all perfectly good for anything a spreadsheet can hold in one sitting.
        </p>

        <h2>When the workbook is too big</h2>

        <p>
          Excel stops at 1,048,576 rows, and a JSON array of that size is a few hundred megabytes
          of text. Convert to JSON Lines, filter rows in the same script that reads the workbook,
          or skip the conversion and ask the question you actually need answered. Loading the file
          into the{" "}
          <Link href="/tools/csv-analyzer">CSV analyzer</Link> gives you totals, outliers and
          trends in plain language without a file format in the middle, and the{" "}
          <Link href="/tools/excel-data-analysis">Excel data analysis tool</Link> does the same for
          a workbook. If you are still deciding between the two containers,{" "}
          <Link href="/blog/convert-json-to-excel">the reverse direction</Link> covers the nested
          JSON that refuses to become a flat sheet, and{" "}
          <Link href="/blog/json-to-csv-converter-online">JSON to CSV</Link> is the flatter,
          cheaper neighbour of this job.
        </p>

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            The conversion itself is free with Python or Microsoft 365. These three pay for
            themselves when the workbook arrives on a schedule and someone still has to hand the
            JSON to another system:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the pandas snippet above is short until the third
              workbook has merged cells and a 1904 epoch; a $10-a-month subscription covering 19+
              models is cheaper than an afternoon spent debugging date arithmetic by print
              statement.{" "}
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
              <strong>Stack AI</strong> — when the xlsx is dropped into a shared folder weekly and
              the JSON has to reach an API, a workflow does the read, the transform and the send
              without a scheduled script to babysit.{" "}
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
              <strong>Softr</strong> — if the point of the JSON is that colleagues can browse the
              records, publishing a searchable page from the same data replaces the weekly email
              with a link.{" "}
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
            at no extra cost to you. Stack AI and Softr links point to their official pages until
            our tracking links are registered; OpenCode Go uses our referral link.
          </p>
        </div>

        <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Skip the Format Question Entirely</h2>
          <p className="text-blue-100 mb-5">
            Keep the workbook as it is and ask about the numbers inside it: totals, outliers, the
            rows that look wrong. No conversion step, no schema to invent.
          </p>
          <Link href="/tools/excel-data-analysis">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Analyze Your Spreadsheet Free
            </Button>
          </Link>
        </div>

        <RelatedPosts slug="convert-excel-to-json" />
      </article>
    </>
  );
}
