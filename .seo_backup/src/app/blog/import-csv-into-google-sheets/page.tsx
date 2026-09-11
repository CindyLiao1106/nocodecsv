import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How to Import CSV Into Google Sheets (2026): 4 Ways | NoCodeCSV",
  description: "Import a CSV into Google Sheets four ways: upload, paste, IMPORTDATA from a URL, or a scheduled script. Plus the delimiter and encoding fixes that stop imports breaking.",
  keywords: ["import csv into google sheets", "open csv in google sheets", "import csv from url google sheets", "csv to google sheets", "google sheets import csv semicolon"],
  alternates: { canonical: "https://nocodecsv.com/blog/import-csv-into-google-sheets" },
  openGraph: {
    title: "How to Import CSV Into Google Sheets (2026): 4 Ways | NoCodeCSV",
    description: "Import a CSV into Google Sheets four ways: upload, paste, IMPORTDATA from a URL, or a scheduled script. Plus the fixes that stop imports breaking.",
    type: "article",
    url: "https://nocodecsv.com/blog/import-csv-into-google-sheets",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-07",
    modifiedTime: "2026-09-07",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Import CSV Into Google Sheets (2026): 4 Ways | NoCodeCSV",
    description: "Import a CSV into Google Sheets four ways. No Excel needed.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Import CSV Into Google Sheets: 4 Ways (2026)",
  description: "Import a CSV into Google Sheets four ways: upload, paste, IMPORTDATA from a URL, or a scheduled script. Plus the delimiter and encoding fixes that stop imports breaking.",
  url: "https://nocodecsv.com/blog/import-csv-into-google-sheets",
  datePublished: "2026-09-07",
  dateModified: "2026-09-07",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: { "@type": "Organization", name: "NoCodeCSV" },
  mainEntityOfPage: "https://nocodecsv.com/blog/import-csv-into-google-sheets",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is importing a CSV into Google Sheets free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every built-in route — file upload, clipboard paste, or the IMPORTDATA function — works on a free Google account. Marketplace add-ons that schedule imports on your behalf may charge, but the built-in routes cost nothing.",
      },
    },
    {
      "@type": "Question",
      name: "Can Google Sheets open a CSV with 500,000 rows?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on the column count. Google documents a ceiling of 10 million cells or 18,278 columns per spreadsheet, and the same limits apply to CSV imports. A single-column file can hold millions of rows, while a 20-column file tops out around 500,000 rows. Bigger files should be split or filtered before import.",
      },
    },
    {
      "@type": "Question",
      name: "Why does my CSV import with everything stuck in one column?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The delimiter does not match. European files often use semicolons instead of commas, so choose a custom separator of ; in the import dialog, or use Data, Split text to columns after pasting. Files saved with a UTF-8 BOM usually import with the right delimiter automatically.",
      },
    },
    {
      "@type": "Question",
      name: "Why do long numbers turn into 1.23E+15 after import?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Sheets stores numbers as floating point, so IDs with more than 15 digits lose precision. Format the destination column as Plain text before importing, or turn off number conversion in the import dialog, so order numbers and serials arrive untouched.",
      },
    },
    {
      "@type": "Question",
      name: "Can I auto-import a CSV from a URL into Google Sheets?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, with the IMPORTDATA function, which pulls a CSV or TSV straight from a public URL and refreshes when the spreadsheet recalculates, roughly once an hour while the file is open. For an exact schedule, Google Apps Script with a time trigger gives full control.",
      },
    },
    {
      "@type": "Question",
      name: "Does importing change my original CSV file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Import reads a copy into the spreadsheet and leaves the source file untouched. You can also go the other way with File, Download, CSV when a collaborator needs the data back as a plain file.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best way to keep a team CSV updated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Keep the master copy inside Sheets itself instead of importing the same file over and over. Everyone edits one live spreadsheet, and you export a CSV snapshot with File, Download whenever an external system needs it.",
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
      <p className="text-blue-600 font-medium">📤 Spreadsheets · 7 min read</p>
      <h1>How to Import CSV Into Google Sheets: 4 Ways (2026)</h1>
      <p><strong>Yes, Google Sheets imports CSV files for free, and you have four routes.</strong> Upload the file with File &rarr; Import, paste the raw text and split it into columns, pull a CSV from a public URL with <code>=IMPORTDATA()</code>, or schedule the whole thing with Apps Script. Pick by how often the data changes: a one-time file is an upload, an occasional batch is a paste, a live feed wants IMPORTDATA, and a recurring sync deserves a script. Nearly every failed import traces back to one of two causes: the wrong delimiter or a character encoding mismatch.</p>

      <h2>Why Move a CSV Into Sheets at All?</h2>
      <p>CSV files are fine for storage and terrible for collaboration. Two people open the same file, both save, and one set of edits silently wins. Sheets replaces that with one live file that comments, formulas, and sharing permissions all work on. It also sidesteps a hard Excel limit: Microsoft caps worksheets at 1,048,576 rows, which is why a 2-million-row export simply refuses to open in Excel.</p>
      <p>Sheets has its own documented ceiling of <strong>10 million cells or 18,278 columns</strong>, and Google states the limits are identical for Excel and CSV imports. A 100,000-row export with 20 columns fits comfortably. A 3-million-row log does not, and the FAQ below covers what to do when a file exceeds the cap.</p>

      <h2>Method 1: File &rarr; Import &rarr; Upload (One-Time Files)</h2>
      <ol>
        <li>In Sheets, open <strong>File &rarr; Import &rarr; Upload</strong> and pick your CSV.</li>
        <li>In the dialog, choose <strong>Create new spreadsheet</strong> (or replace the current sheet).</li>
        <li>Under <strong>Separator type</strong>, leave <em>Detect automatically</em> for standard commas. Semicolon files need <strong>Custom &rarr; ;</strong>.</li>
        <li>Leave <em>Convert text to numbers and dates</em> on for clean data. Turn it off when the file holds IDs, zip codes, or anything with leading zeros.</li>
        <li>Click <strong>Import data</strong> and check the first rows before you trust the rest.</li>
      </ol>
      <p><strong>Best for:</strong> one-off files, exports from CRMs and banks, anything under the 10-million-cell cap.</p>

      <h2>Method 2: Paste and Split (Quick Edits)</h2>
      <p>For a small batch you already have in your clipboard, pasting beats uploading:</p>
      <ol>
        <li>Copy the CSV text and paste it into column A of a blank sheet. Each line lands in its own row.</li>
        <li>Select the column, then open <strong>Data &rarr; Split text to columns</strong>.</li>
        <li>Pick <strong>Comma</strong>, or <strong>Custom</strong> and type <code>;</code> for semicolon files.</li>
      </ol>
      <p>The paste route skips the import dialog, which means no automatic number conversion. Long IDs stay intact by default, which is often exactly what you want when handling order numbers.</p>
      <p><strong>Best for:</strong> small batches, clipboard data, files where IDs must not be reformatted.</p>

      <h2>Method 3: =IMPORTDATA() for Live URLs</h2>
      <p>When the CSV lives at a stable public URL, one formula keeps the sheet in sync:</p>
      <pre><code>=IMPORTDATA("https://example.com/exports/sales.csv")</code></pre>
      <p>Google&apos;s documentation lists IMPORTDATA as the function that imports a CSV or TSV from a given URL. It refreshes when the spreadsheet recalculates — roughly once an hour while the file is open. That cadence suits daily reports, not anything that needs second-level freshness. The URL must be public and serve plain CSV; a page that requires login will not work. Keep feeds modest in size, since Google caps how much a single import fetch can pull.</p>
      <p><strong>Best for:</strong> public datasets, exchange rates, weather feeds, anything published on a schedule.</p>

      <h2>Method 4: Apps Script or Add-Ons (Scheduled Imports)</h2>
      <p>For imports that must run at a precise time, Google Apps Script pulls the file and writes it into the sheet:</p>
      <pre><code>{`function refreshCsv() {
  const text = UrlFetchApp.fetch("https://example.com/exports/sales.csv").getContentText();
  const rows = Utilities.parseCsv(text);
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}`}</code></pre>
      <p>Attach a time trigger in the Apps Script editor and the sheet updates itself daily. Marketplace add-ons such as Coupler or Apipheny wrap the same idea in a point-and-click UI if you would rather not read code.</p>
      <p><strong>Best for:</strong> daily or hourly syncs, dashboards that must look fresh at 9 a.m.</p>

      <h2>Four Ways to Import a CSV Compared</h2>
      <table>
        <thead><tr><th>Method</th><th>Best when</th><th>Auto-refresh</th><th>Number conversion</th><th>Skills needed</th></tr></thead>
        <tbody>
          <tr><td>File &rarr; Import &rarr; Upload</td><td>One-off file</td><td>No</td><td>Optional toggle</td><td>None</td></tr>
          <tr><td>Paste + Split text to columns</td><td>Small clipboard batch</td><td>No</td><td>No</td><td>None</td></tr>
          <tr><td>=IMPORTDATA(url)</td><td>Live public CSV</td><td>~hourly while open</td><td>Formula-level</td><td>Basic formula</td></tr>
          <tr><td>Apps Script / add-on</td><td>Fixed-schedule sync</td><td>Your schedule</td><td>Full control</td><td>Script or add-on</td></tr>
        </tbody>
      </table>

      <h2>Five Import Failures and the Fix for Each</h2>
      <ol>
        <li><strong>Everything lands in one column.</strong> The file uses semicolons or tabs. Re-import with a custom separator of <code>;</code> or <code>\t</code>, which matters for most European exports.</li>
        <li><strong>Long IDs turn into 1.23E+15.</strong> Sheets stores numbers as floating point and drops precision past 15 digits. Set the column to <em>Plain text</em> before importing, or keep number conversion off.</li>
        <li><strong>Leading zeros disappear.</strong> Zip codes and product codes such as 00742 arrive as 742. Same fix: Plain text format first, then import.</li>
        <li><strong>Characters come out garbled.</strong> The CSV was saved in ANSI or Latin-1 instead of UTF-8, or the byte order mark is missing. Re-save as UTF-8, the same fix our <Link href="/blog/fix-garbled-csv-in-excel">encoding guide</Link> covers for Excel.</li>
        <li><strong>The file refuses to import.</strong> It exceeds the 10-million-cell cap. <Link href="/blog/split-large-csv-file-online">Split the file</Link> into chunks or filter rows down before importing, and keep the master copy safe.</li>
      </ol>
      <p>If the file is messy before the import even starts, stray commas, duplicate rows, mixed date formats, run it through our <Link href="/blog/how-to-clean-dirty-csv-data">cleaning guide</Link> first. And when a colleague sends a spreadsheet you need back as CSV, the reverse trip is covered in <Link href="/blog/convert-excel-to-csv-free-online">how to convert Excel to CSV</Link>.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>Is importing a CSV into Google Sheets free?</h3>
      <p>Yes. Every built-in route — file upload, clipboard paste, or the IMPORTDATA function — works on a free Google account. Marketplace add-ons that schedule imports on your behalf may charge, but the built-in routes cost nothing.</p>
      <h3>Can Google Sheets open a CSV with 500,000 rows?</h3>
      <p>It depends on the column count. Google documents a ceiling of <strong>10 million cells or 18,278 columns</strong> per spreadsheet, and the same limits apply to CSV imports. A single-column file can hold millions of rows, while a 20-column file tops out around 500,000 rows. Bigger files should be <Link href="/blog/split-large-csv-file-online">split or filtered</Link> before import.</p>
      <h3>Why does my CSV import with everything stuck in one column?</h3>
      <p>The delimiter does not match. European files often use semicolons instead of commas, so choose a custom separator of <code>;</code> in the import dialog, or use <strong>Data &rarr; Split text to columns</strong> after pasting. Files saved with a UTF-8 BOM usually import with the right delimiter automatically.</p>
      <h3>Why do long numbers turn into 1.23E+15 after import?</h3>
      <p>Google Sheets stores numbers as floating point, so IDs with more than 15 digits lose precision. Format the destination column as <em>Plain text</em> before importing, or turn off number conversion in the import dialog, so order numbers and serials arrive untouched.</p>
      <h3>Can I auto-import a CSV from a URL into Google Sheets?</h3>
      <p>Yes, with the IMPORTDATA function, which pulls a CSV or TSV straight from a public URL and refreshes when the spreadsheet recalculates, roughly once an hour while the file is open. For an exact schedule, Google Apps Script with a time trigger gives full control.</p>
      <h3>Does importing change my original CSV file?</h3>
      <p>No. Import reads a copy into the spreadsheet and leaves the source file untouched. You can also go the other way with <strong>File &rarr; Download &rarr; CSV</strong> when a collaborator needs the data back as a plain file.</p>
      <h3>What is the best way to keep a team CSV updated?</h3>
      <p>Keep the master copy inside Sheets itself instead of importing the same file over and over. Everyone edits one live spreadsheet, and you export a CSV snapshot with <strong>File &rarr; Download</strong> whenever an external system needs it.</p>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
        <p className="text-slate-600 mb-4">Want to go further with AI-powered data work? These tools pair well with NoCodeCSV:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — connect your CSV source to Google Sheets and let an AI workflow handle the fetch-and-clean step before the data lands, on your schedule.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>Softr</strong> — connect the imported sheet to a customer portal or internal tool, since Softr reads Google Sheets as its data source.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
          <li>
            <strong>Toggl Track</strong> — recurring CSV cleanup and imports quietly eat hours; log them and see the real cost per report.{' '}
            <a href="https://toggl.com" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Toggl</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you. Links currently point to each vendor&apos;s official partnership page until our dedicated tracking links are registered.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Clean the File Before the Import</h2>
        <p className="text-blue-100 mb-5">Upload your CSV and let the AI analyzer flag duplicates, stray delimiters, and missing values before they reach Sheets.</p>
        <Link href="/tools/csv-analyzer"><Button size="lg" variant="secondary" className="text-base px-8">Analyze Your CSV Free</Button></Link>
      </div>
    </article>
    </>
  );
}
