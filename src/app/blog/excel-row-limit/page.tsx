import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Excel Row Limit: Why Your CSV Won't Fit, and 6 Ways Past It (2026)",
  description:
    "Excel stops at 1,048,576 rows and truncates larger CSVs without telling you. Here is where the limit comes from, what happens when you hit it, and six ways to work with files that are too large for Excel.",
  keywords: [
    "excel row limit",
    "excel row limit per sheet",
    "excel max row limit",
    "excel row limit workaround",
    "csv file too large for excel",
    "open csv with more than 1 million rows",
    "excel csv size limit",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/excel-row-limit" },
  openGraph: {
    title: "Excel Row Limit: Why Your CSV Won't Fit, and 6 Ways Past It",
    description:
      "The 1,048,576-row wall, why CSV files hit it first, and the practical workarounds including Power Query, DuckDB and AI analysis.",
    type: "article",
    url: "https://nocodecsv.com/blog/excel-row-limit",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-14",
    modifiedTime: "2026-09-14",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel Row Limit: 6 Ways Past 1,048,576 Rows",
    description:
      "Excel silently truncates CSVs that are too large. Here is what the limit actually is and how to work with bigger files.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Excel Row Limit: Why Your CSV Won't Fit, and 6 Ways Past It (2026)",
  description:
    "Excel stops at 1,048,576 rows and truncates larger CSVs without telling you. Here is where the limit comes from, what happens when you hit it, and six ways to work with files that are too large for Excel.",
  url: "https://nocodecsv.com/blog/excel-row-limit",
  datePublished: "2026-09-14",
  dateModified: "2026-09-14",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/excel-row-limit",
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
      name: "Excel Row Limit",
      item: "https://nocodecsv.com/blog/excel-row-limit",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the Excel row limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A worksheet in the modern .xlsx format holds 1,048,576 rows by 16,384 columns. That is 2^20 rows and 2^14 columns, and it has been the ceiling since Excel 2007. The older .xls format stopped at 65,536 rows by 256 columns.",
      },
    },
    {
      "@type": "Question",
      name: "Why does my CSV file not open fully in Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A CSV file has no row limit of its own, so a file can legitimately contain more rows than a worksheet can display. When you open it, Excel loads the first 1,048,576 rows and discards the rest. Depending on your version and settings it either warns you or truncates silently, which is why the row count at the bottom of the sheet looks wrong.",
      },
    },
    {
      "@type": "Question",
      name: "How do I open a CSV file with more than 1 million rows?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Four practical routes: load it with Power Query into Excel's Data Model, which is not bound by the worksheet grid; split it into chunks under the limit; open it in a tool with a higher ceiling such as DuckDB or a Python notebook; or send it to a data analysis service that does not load the whole file into a spreadsheet.",
      },
    },
    {
      "@type": "Question",
      name: "Can Power Query get around the Excel row limit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, if you load to the Data Model rather than to a worksheet. Query results can be sent to the model, which uses a different storage engine and is not capped at 1,048,576 rows. You then analyse the model with PivotTables or DAX rather than scrolling through cells.",
      },
    },
    {
      "@type": "Question",
      name: "Does ChatGPT have the same row limit as Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, it has a different and usually much tighter constraint. Language models work within a context window measured in tokens, and a CSV is a very token-expensive format. Files that open perfectly well in a spreadsheet can be too large to analyse reliably in a chat model, which is why a 3 MB export with 20,000 rows sometimes produces summarised or truncated answers.",
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
        <p className="text-blue-600 font-medium">📊 File Limits · 7 min read</p>
        <h1>Excel Row Limit: Why Your CSV Won&apos;t Fit, and 6 Ways Past It</h1>

        <p>
          <strong>
            A modern Excel worksheet holds 1,048,576 rows and 16,384 columns. A CSV file has no such
            limit, so when the two meet, Excel wins and your data loses.
          </strong>{" "}
          The rows past the limit are not flagged as an error — they are simply not there any more.
        </p>

        <p>
          That mismatch is one of the most common reasons people go looking for a tool that can
          handle the file. The message that usually gets typed into a search box is some version of:{" "}
          <em>&ldquo;ChatGPT can&rsquo;t handle big CSV files — any other AI?&rdquo;</em> or{" "}
          <em>&ldquo;how do I open a CSV file that is too large for Excel?&rdquo;</em>
        </p>

        <p>
          Both questions have concrete answers. This page covers the numbers, what actually goes
          wrong, and six ways to work with a file that has outgrown the spreadsheet.
        </p>

        <h2>What the Excel row limit actually is</h2>

        <table>
          <thead>
            <tr>
              <th>Format</th>
              <th>Rows per sheet</th>
              <th>Columns per sheet</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>.xlsx (Excel 2007 and later)</td>
              <td>1,048,576 (2²⁰)</td>
              <td>16,384 (2¹⁴)</td>
            </tr>
            <tr>
              <td>.xls (Excel 97–2003)</td>
              <td>65,536</td>
              <td>256</td>
            </tr>
            <tr>
              <td>CSV</td>
              <td>No limit defined by the format</td>
              <td>No limit defined by the format</td>
            </tr>
          </tbody>
        </table>

        <p>
          Those four numbers are why people still search for <code>excel row limit 65536</code>{" "}
          today: a spreadsheet built on the old format has a very different ceiling, and it is often
          inherited rather than chosen.
        </p>

        <p>
          The limit is a property of the <em>worksheet grid</em>, not of your file, your disk or your
          memory. That distinction matters, because it is the reason Power Query can do something
          Excel itself cannot.
        </p>

        <h2>What happens when you open a CSV that is too large</h2>

        <p>
          Excel loads what fits and discards the rest. Depending on your version, you get one of two
          outcomes:
        </p>

        <ul>
          <li>
            <strong>A warning</strong> — &ldquo;File not loaded completely&rdquo; or a note that some
            rows were truncated.
          </li>
          <li>
            <strong>Nothing at all.</strong> The file opens normally, the sheet ends at row
            1,048,576, and every downstream number you calculate is quietly wrong.
          </li>
        </ul>

        <p>
          The second case is the dangerous one. A truncated sum, average or pivot table looks exactly
          like a correct one. If you have ever found a row count that did not match the source
          system, this is the first thing to check —{" "}
          <Link href="/blog/count-rows-in-csv-file">counting the rows correctly</Link> is a separate
          problem from the limit itself.
        </p>

        <h2>Why the file is usually a CSV</h2>

        <p>
          CSV exports from databases, CRM systems, ad platforms, billing systems and monitoring tools
          routinely cross a million rows. A single row is cheap in CSV: it is plain text, with no
          formatting, no formulas and no cell metadata.
        </p>

        <p>
          The reverse also surprises people. A CSV can be <em>bigger</em> than the equivalent .xlsx
          file, because the compressed workbook stores repeated values far more efficiently than the
          uncompressed text export does. A 900 MB CSV can write out to a 90 MB workbook — and the
          workbook will still be truncated if it has more than 1,048,576 rows.
        </p>

        <h2>Six ways to work with a file that is too large for Excel</h2>

        <h3>1. Power Query, loaded to the Data Model</h3>

        <p>
          This is the only way to keep working <em>inside Excel</em> with a file that breaks the row
          limit. The trick is not the query — it is the destination.
        </p>

        <p>
          Import with <strong>Data → Get Data → From Text/CSV</strong>, then choose{" "}
          <strong>Add this data to the Data Model</strong> instead of loading it to a worksheet. The
          Data Model uses a different storage engine and is not capped at 1,048,576 rows, so the full
          file is available. You then work through a PivotTable or DAX measures rather than by
          scrolling cells.
        </p>

        <p>
          The trade-off is that you lose the familiar grid: you cannot see row 4,000,000 sitting in a
          cell. For summing, grouping, joining and filtering, that rarely matters.
        </p>

        <h3>2. Split the file into chunks</h3>

        <p>
          Crude, but reliable, and often the fastest route if you only need one section. Split on row
          count and work through the parts:
        </p>

        <pre>
          <code>{`# Skip the header for every chunk after the first
head -1 data.csv > header.csv
tail -n +2 data.csv | split -l 1000000 - chunk_

for f in chunk_*; do
  cat header.csv "$f" > "part_$f.csv"
  rm "$f"
done`}</code>
        </pre>

        <p>
          Each <code>part_*.csv</code> opens normally. The catch is that any calculation spanning the
          whole file now has to be done per chunk and combined by hand, which is where mistakes creep
          in.
        </p>

        <h3>3. Google Sheets, if the file is medium-sized</h3>

        <p>
          Sheets is limited by cells rather than rows: 10 million cells per spreadsheet on the free
          tier. A 6-column file can therefore hold roughly 1.6 million rows — a little more headroom
          than Excel, but not a different order of magnitude. The same warning applies: importing more
          than the limit silently drops the excess.
        </p>

        <h3>4. DuckDB, for files that are genuinely large</h3>

        <p>
          If the file has tens of millions of rows, stop looking for a spreadsheet. DuckDB queries CSV
          files directly, streams them from disk and handles billions of rows on a laptop:
        </p>

        <pre>
          <code>{`-- Install: pip install duckdb  (or use the CLI)
SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue
FROM read_csv_auto('orders.csv')
GROUP BY region
ORDER BY revenue DESC;`}</code>
        </pre>

        <p>
          You get SQL, real aggregate results, and no truncation — but you also need to be comfortable
          running a command. On Windows the same work can be done in Power BI Desktop, which wraps
          Power Query in a friendlier shell.
        </p>

        <h3>5. Load it into a database</h3>

        <p>
          If this is a recurring problem rather than a one-off export, the file is a symptom: the data
          wants to live somewhere that is not a spreadsheet. PostgreSQL, SQLite, MySQL and their cloud
          equivalents all prefer millions of rows to a workbook.
        </p>

        <h3>6. Ask questions of the file, without opening it in a grid</h3>

        <p>
          The newest option, and the one that fits when the goal is <em>an answer</em> rather than{" "}
          <em>a spreadsheet</em>. Upload the file and ask for what you need in plain language — totals,
          trends, comparisons, a chart — without the whole dataset being rendered into a grid first.
        </p>

        <p>
          This is what <Link href="/">NoCodeCSV</Link> does. You upload a CSV or Excel file, ask a
          question, and get the answer and a chart back. There is no row limit to trip over because
          nothing is being laid out across 1,048,576 cells; the file is parsed and the question is
          answered directly.
        </p>

        <p>
          It is worth being precise about why this is different from pasting data into a general chat
          assistant. A language model has to fit the file into its context window, and CSV text is
          expensive — every comma and every repeated column heading costs tokens. That is the failure
          mode people describe when they say a 3 MB, 20,000-row export produced summarised or
          hallucinated answers: the model did not see all of the rows. A tool built for the job parses
          the file first and computes on it, rather than reading it as prose.
        </p>

        <h2>Which route to take</h2>

        <table>
          <thead>
            <tr>
              <th>If you need to…</th>
              <th>Use</th>
              <th>Row ceiling</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Keep working inside Excel</td>
              <td>Power Query → Data Model</td>
              <td>No grid limit</td>
            </tr>
            <tr>
              <td>Hand someone a normal workbook</td>
              <td>Split into chunks</td>
              <td>1,048,576 per part</td>
            </tr>
            <tr>
              <td>Share and collaborate quickly</td>
              <td>Google Sheets</td>
              <td>10M cells</td>
            </tr>
            <tr>
              <td>Query tens of millions of rows</td>
              <td>DuckDB / Power BI</td>
              <td>Effectively none</td>
            </tr>
            <tr>
              <td>Stop using spreadsheets for this</td>
              <td>A database</td>
              <td>Effectively none</td>
            </tr>
            <tr>
              <td>Get an answer, not a grid</td>
              <td>NoCodeCSV</td>
              <td>No grid limit</td>
            </tr>
          </tbody>
        </table>

        <h2>Frequently asked questions</h2>

        <h3>What is the Excel row limit?</h3>
        <p>
          1,048,576 rows by 16,384 columns in the modern .xlsx format — the ceiling since Excel 2007.
          The older .xls format stops at 65,536 rows by 256 columns.
        </p>

        <h3>Why does my CSV file not open fully in Excel?</h3>
        <p>
          The CSV format has no row limit, so a file can contain more rows than a worksheet can
          display. Excel loads the first 1,048,576 and discards the rest, sometimes with a warning and
          sometimes silently.
        </p>

        <h3>How do I open a CSV file with more than 1 million rows?</h3>
        <p>
          Load it into Excel&rsquo;s Data Model with Power Query, split it into chunks, open it in
          DuckDB or a Python notebook, or use a service that answers questions about the file without
          rendering it into a grid.
        </p>

        <h3>Can Power Query get around the Excel row limit?</h3>
        <p>
          Yes, if you load to the Data Model rather than to a worksheet. The model is not bound by the
          1,048,576-row grid, and you analyse it through PivotTables or DAX.
        </p>

        <h3>Does ChatGPT have the same row limit as Excel?</h3>
        <p>
          No — it has a different and usually tighter one. Models work within a token context window,
          and CSV text is token-expensive, so files that open fine in a spreadsheet can be too large
          to analyse reliably in a chat model. That is the usual cause of summarised or invented
          answers on big exports.
        </p>

        <h2>Try it on the file that broke Excel</h2>

        <p>
          If you have a CSV sitting on your desktop that Excel refuses to open properly, the fastest
          way to find out whether the question you have is answerable is to ask it. Upload the file,
          ask for the total, the trend or the outlier, and see the answer come back with a chart.
        </p>

        <div className="not-prose my-8 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard">Analyse your CSV free →</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/blog/count-rows-in-csv-file">How to count rows correctly</Link>
          </Button>
        </div>

        <RelatedPosts slug="excel-row-limit" />
      </article>
    </>
  );
}
