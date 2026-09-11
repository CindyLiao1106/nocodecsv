import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How to Change a CSV Delimiter: Semicolon to Comma and Back (2026) | NoCodeCSV",
  description: "CSV opens as one column? The file uses a different delimiter, usually semicolons. Fix it in Excel's import wizard, Google Sheets, LibreOffice, or the terminal.",
  keywords: ["change csv delimiter", "csv semicolon to comma", "open semicolon csv in excel", "csv delimiter not working", "semicolon separated values", "change delimiter in excel csv", "csv opens in one column"],
  alternates: { canonical: "https://nocodecsv.com/blog/change-csv-delimiter" },
  openGraph: {
    title: "How to Change a CSV Delimiter: Semicolon to Comma and Back (2026) | NoCodeCSV",
    description: "CSV opens as one column? The file uses a different delimiter, usually semicolons from a European locale. Four free fixes, no data loss.",
    type: "article",
    url: "https://nocodecsv.com/blog/change-csv-delimiter",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-09",
    modifiedTime: "2026-09-09",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Change a CSV Delimiter: Semicolon to Comma and Back (2026)",
    description: "Everything in one column? Change the delimiter, not the data.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Change a CSV Delimiter: Semicolon to Comma and Back (2026)",
  description: "CSV opens as one column? The file uses a different delimiter, usually semicolons. Fix it in Excel's import wizard, Google Sheets, LibreOffice, or the terminal.",
  url: "https://nocodecsv.com/blog/change-csv-delimiter",
  datePublished: "2026-09-09",
  dateModified: "2026-09-09",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: { "@type": "Organization", name: "NoCodeCSV" },
  mainEntityOfPage: "https://nocodecsv.com/blog/change-csv-delimiter",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why does my CSV open with semicolons instead of commas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The file was written on a system whose regional list separator is a semicolon, common in Germany, France, Spain, Italy, and other locales where the decimal mark is a comma. Excel follows the operating system's region settings when it writes CSVs, per Microsoft's documentation.",
      },
    },
    {
      "@type": "Question",
      name: "How do I change the delimiter in Excel without losing data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use Data > From Text/CSV and select the delimiter in the import dialog. Do not open the file by double-clicking, which applies regional defaults and can drop leading zeros or mangle dates before you see the data.",
      },
    },
    {
      "@type": "Question",
      name: "How do I change a semicolon-delimited CSV to comma in Notepad?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A find-and-replace of semicolons to commas works only when no field contains a semicolon or comma inside quotes and no column uses comma decimals. Otherwise use Excel's import wizard, LibreOffice, or a Python one-liner that understands quoting.",
      },
    },
    {
      "@type": "Question",
      name: "Why is my CSV all in one column in Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The delimiter Excel assumed does not match the file. Open it through Data > From Text/CSV, preview with Semicolon or Custom as the delimiter, and the columns will split correctly.",
      },
    },
    {
      "@type": "Question",
      name: "Does changing the delimiter break numbers with decimal commas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It can. In locales that write 3,50, a blanket replace turns one value into two columns once the file is comma-delimited. Convert decimal commas to dots in the same pass, or import with a wizard that reads the file in its original format.",
      },
    },
    {
      "@type": "Question",
      name: "What delimiter should my CSV use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Comma is the default defined by RFC 4180 and what most tools expect. Semicolon and tab exist because of regional settings and embedded commas in data. If your data contains commas inside fields, tab (TSV) is the safer choice.",
      },
    },
    {
      "@type": "Question",
      name: "Google Sheets imports my CSV as one column. What now?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Re-import through File > Import and set Separator type to Custom with the correct character, or paste the data and use Data > Split text to columns with a custom separator. Sheets also auto-detects most delimiters if the file has no encoding issues.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc prose-lg">
      <p className="text-blue-600 font-medium">🧹 Data Prep · 7 min read</p>
      <h1>How to Change a CSV Delimiter: Semicolon to Comma and Back (2026)</h1>
      <p><strong>If a CSV opens as one long column in Excel, the file uses a different delimiter than your Excel expects, usually semicolons from a European locale.</strong> The clean fix never touches the file itself: in Excel, go to <strong>Data &gt; From Text/CSV</strong> and pick the delimiter in the import dialog. Google Sheets has the same option at import, LibreOffice asks on open, and the terminal handles one-off conversions in seconds. Do not do a blanket find-and-replace of commas, because quoted fields and decimal commas survive that badly.</p>

      <h2>Why Some CSVs Use Semicolons Instead of Commas</h2>
      <p>The separator is not a file property, it is a regional setting. Excel writes CSV files using the list separator from your operating system&apos;s region settings, and Microsoft documents that behavior. In the United States and the UK, that separator is a comma. In Germany, France, Spain, Italy, and much of Europe and South America, the decimal point belongs to numbers written as 1.234,56, so the region swaps the list separator to a semicolon.</p>
      <p>The result is a file that is perfectly valid in Berlin and looks broken in Boston. A colleague in Munich exports their CRM data and you open it in a US-configured Excel, and every row lands in column A.</p>

      <h2>Method 1: Excel&apos;s Import Wizard (Safest)</h2>
      <p>Excel 2016 and Microsoft 365 ship with a proper CSV importer that does not mangle the file:</p>
      <ol>
        <li>Open Excel and go to <strong>Data &gt; From Text/CSV</strong>.</li>
        <li>Pick your file. A preview pane appears.</li>
        <li>In <em>File Origin</em>, choose 65001: UTF-8 when the file shows mojibake.</li>
        <li>In <em>Delimiter</em>, select Semicolon, Comma, Tab, or Custom and type your own.</li>
        <li>The preview updates instantly. When columns line up, click <strong>Load</strong>.</li>
      </ol>
      <p>The same dialog fixes the encoding problem at the same time, so if you have seen garbled characters, the <Link href="/blog/fix-garbled-csv-in-excel">fix for garbled CSV in Excel</Link> guide uses this exact wizard.</p>

      <h2>Method 2: Google Sheets</h2>
      <p>Google Sheets detects the delimiter when you import, and lets you override it:</p>
      <ol>
        <li>Open sheets.google.com and go to <strong>File &gt; Import &gt; Upload</strong>.</li>
        <li>Select the CSV. In the import dialog, open <em>Separator type</em>.</li>
        <li>Pick <strong>Custom</strong> and type <code>;</code>, or let it auto-detect.</li>
        <li>Choose where the data goes and click <strong>Import data</strong>.</li>
      </ol>
      <p>For text already pasted into a sheet, select the column and use <strong>Data &gt; Split text to columns</strong>, then choose Custom and enter <code>;</code>.</p>

      <h2>Method 3: LibreOffice Calc</h2>
      <p>LibreOffice opens a <strong>Text Import</strong> dialog whenever you open a CSV, which is its quiet advantage over Excel. In that dialog:</p>
      <ol>
        <li>Under <em>Separator options</em>, tick the delimiter your file uses, for example Semicolon.</li>
        <li>Tick <em>Merge delimiters</em> if empty fields collapse in your preview.</li>
        <li>Check the preview at the bottom, then click <strong>OK</strong>.</li>
      </ol>
      <p>The dialog also offers a text qualifier setting for files where fields contain the delimiter inside quotes.</p>

      <h2>Method 4: The Terminal or a Script</h2>
      <p>For a one-off conversion where the file has no quoted fields containing semicolons, sed does the job:</p>
      <pre><code>{`# semicolons to commas, only safe when no field contains a semicolon or comma inside quotes
sed 's/;/,/g' customers.csv > customers_fixed.csv`}</code></pre>
      <p>For files with quoted fields, Python&apos;s csv module parses the real structure and rewrites it correctly:</p>
      <pre><code>{`import csv

with open("customers.csv", newline="", encoding="utf-8") as f:
    rows = list(csv.reader(f, delimiter=";"))

with open("customers_fixed.csv", "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows(rows)`}</code></pre>
      <p>The same two lines work for any delimiter pair, including tab to comma, which our <Link href="/blog/convert-tsv-to-csv">TSV to CSV guide</Link> covers in detail.</p>

      <h2>When NOT to Blindly Replace</h2>
      <p>A global replace of <code>;</code> with <code>,</code> corrupts files in two situations.</p>
      <p>The first is quoted fields. If a column contains text like <code>&quot;Paris; Texas&quot;</code>, the semicolon inside quotes is data, not a separator, and sed will happily split the field in half.</p>
      <p>The second is decimal commas. A German price column stores <code>3,50</code> as one value, so a file with <code>M&uuml;ller;3,50</code> becomes <code>M&uuml;ller,3,50</code> after replacement, which a US Excel reads as three columns instead of two. If your numeric columns use comma decimals, convert them to dots in the same pass, or use the import wizard, which treats the original file as a single format and never confuses the two.</p>

      <h2>Method Comparison</h2>
      <table>
        <thead><tr><th>Method</th><th>Best when</th><th>Risk of corrupting data</th><th>Skills needed</th></tr></thead>
        <tbody>
          <tr><td>Excel import wizard</td><td>You use Excel and want a clean load</td><td>Low</td><td>None</td></tr>
          <tr><td>Google Sheets import</td><td>You work in the browser</td><td>Low</td><td>None</td></tr>
          <tr><td>LibreOffice</td><td>Desktop, no Microsoft products</td><td>Low</td><td>None</td></tr>
          <tr><td>sed replace</td><td>Simple files, one-off conversion</td><td>High with quotes or decimal commas</td><td>Command line</td></tr>
          <tr><td>Python csv</td><td>Quoted fields, repeated conversions</td><td>Low</td><td>Scripting</td></tr>
        </tbody>
      </table>

      <h2>Frequently Asked Questions</h2>
      <h3>Why does my CSV open with semicolons instead of commas?</h3>
      <p>The file was written on a system whose regional list separator is a semicolon, common in Germany, France, Spain, Italy, and other locales where the decimal mark is a comma. Excel follows the operating system&apos;s region settings when it writes CSVs, per Microsoft&apos;s documentation.</p>
      <h3>How do I change the delimiter in Excel without losing data?</h3>
      <p>Use <strong>Data &gt; From Text/CSV</strong> and select the delimiter in the import dialog. Do not open the file by double-clicking, which applies regional defaults and can drop leading zeros or mangle dates before you see the data.</p>
      <h3>How do I change a semicolon-delimited CSV to comma in Notepad?</h3>
      <p>A find-and-replace of <code>;</code> to <code>,</code> works only when no field contains a semicolon or comma inside quotes and no column uses comma decimals. Otherwise use Excel&apos;s import wizard, LibreOffice, or a Python one-liner that understands quoting.</p>
      <h3>Why is my CSV all in one column in Excel?</h3>
      <p>The delimiter Excel assumed does not match the file. Open it through <strong>Data &gt; From Text/CSV</strong>, preview with Semicolon or Custom as the delimiter, and the columns will split correctly.</p>
      <h3>Does changing the delimiter break numbers with decimal commas?</h3>
      <p>It can. In locales that write <code>3,50</code>, a blanket replace turns one value into two columns once the file is comma-delimited. Convert decimal commas to dots in the same pass, or import with a wizard that reads the file in its original format.</p>
      <h3>What delimiter should my CSV use?</h3>
      <p>Comma is the default defined by RFC 4180 and what most tools expect. Semicolon and tab exist because of regional settings and embedded commas in data. If your data contains commas inside fields, tab (TSV) is the safer choice.</p>
      <h3>Google Sheets imports my CSV as one column. What now?</h3>
      <p>Re-import through <strong>File &gt; Import</strong> and set Separator type to Custom with the correct character, or paste the data and use <strong>Data &gt; Split text to columns</strong> with a custom separator. Sheets also auto-detects most delimiters if the file has no encoding issues.</p>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
        <p className="text-slate-600 mb-4">Want to go further with AI-powered data work? These tools pair well with NoCodeCSV:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — if semicolon files arrive from European partners on a schedule, an AI workflow can normalize delimiter and encoding at ingest, before the data ever lands in your warehouse.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>Softr</strong> — after the delimiter fix, load the cleaned CSV into Airtable or Sheets and Softr gives partners a portal to view it, so emailed files and their quirks stop circulating entirely.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
          <li>
            <strong>Toggl Track</strong> — &quot;fix the delimiter&quot; Fridays are a recurring time sink that never makes it onto a timesheet; measure it once and the automation case becomes obvious.{' '}
            <a href="https://toggl.com" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Toggl</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you. Links currently point to each vendor&apos;s official partnership page until our dedicated tracking links are registered.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Not Sure What Delimiter Your File Uses?</h2>
        <p className="text-blue-100 mb-5">Run it through the free CSV analyzer, which flags stray delimiters and mixed formats before they cost you an afternoon.</p>
        <Link href="/tools/csv-analyzer"><Button size="lg" variant="secondary" className="text-base px-8">Analyze Your CSV Free</Button></Link>
      </div>
    </article>
    </>
  );
}
