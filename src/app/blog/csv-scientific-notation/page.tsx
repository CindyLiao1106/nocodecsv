import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "CSV Scientific Notation: Why Excel Rewrites Long Numbers",
  description:
    "Your CSV is fine — Excel converted the column to a number on import and truncated it to 15 digits. The documented way to stop that, and the fixes that don't work.",
  keywords: [
    "csv scientific notation",
    "csv scientific notation turn off",
    "excel scientific notation to number",
    "csv file showing scientific notation",
    "csv prevent scientific notation",
    "excel remove scientific notation from number",
    "excel scientific number format",
    "csv long numbers e+15",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/csv-scientific-notation" },
  openGraph: {
    title: "CSV Scientific Notation: Why Excel Rewrites Long Numbers",
    description:
      "1.23E+15 is not in your file. Excel writes it after import. Three documented fixes, and the two habits that destroy the original digits.",
    type: "article",
    url: "https://nocodecsv.com/blog/csv-scientific-notation",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-22",
    modifiedTime: "2026-09-22",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV Scientific Notation: Why Excel Rewrites Long Numbers",
    description:
      "Excel converts long numbers to scientific notation on import and truncates to 15 digits. Here is the setting that stops it.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CSV Scientific Notation: Why Excel Rewrites Long Numbers",
  description:
    "Why Excel shows long CSV values as scientific notation, what Microsoft documents about the automatic conversion, and the three fixes that keep the original digits.",
  url: "https://nocodecsv.com/blog/csv-scientific-notation",
  datePublished: "2026-09-22",
  dateModified: "2026-09-22",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/csv-scientific-notation",
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
      name: "CSV Scientific Notation",
      item: "https://nocodecsv.com/blog/csv-scientific-notation",
    },
  ],
};

export default function BlogPost() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is the scientific notation stored inside my CSV file?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. A CSV file is plain text, and the characters in it are whatever your export wrote. Excel applies its own number formatting when it opens the file, so 1.23E+15 on screen is a decision your spreadsheet made, not something the file contains. Microsoft describes this as an automatic data conversion: Excel converts large numbers to scientific notation so that formulas and math operations keep working.",
        },
      },
      {
        "@type": "Question",
        name: "How many digits before Excel changes a number to scientific notation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Two different things are happening, and Microsoft documents them separately. The data loss limit is precision: Excel truncates numerical data to 15 digits of precision when it converts a value to a number. The E+ display can appear earlier than that for a plain display reason, because a column that is too narrow switches to scientific notation instead of widening itself.",
        },
      },
      {
        "@type": "Question",
        name: "How do I stop Excel from converting long numbers to scientific notation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Set the column type to Text during import, before the data reaches the grid. In the Data tab choose From Text/CSV, load the file into the preview pane, press Edit to open the Query Editor, select the column, then Home, Transform, Data Type, Text, and choose Replace Current before Close & Load. Microsoft documents that later refreshes reapply the same transformation.",
        },
      },
      {
        "@type": "Question",
        name: "Can I turn the automatic data conversion off permanently?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, in Excel for Microsoft 365, Excel for Microsoft 365 for Mac, Excel 2024 and Excel 2024 for Mac. Microsoft lists a single setting that controls several of these conversions at once, including removing leading zeros, truncating numerical data to 15 digits of precision and displaying it in scientific notation, and converting a continuous string of letters and numbers to a date. In Excel 2021 and older there is no such setting, so import as text instead.",
        },
      },
      {
        "@type": "Question",
        name: "Does formatting the column as Text after import bring the digits back?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The conversion happens on entry, and Text formatting only changes how Excel treats values entered from that point on. If the digits are already gone, restyle the column and then re-import from the original file with the column set to Text during the import step.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a way to keep the value readable without changing the file?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, as long as the code is short enough. Microsoft documents a custom or special format for keeping number codes intact inside a workbook, and notes that it works for codes containing fewer than 16 digits. That is a workbook-only fix: it changes how the value looks and stays in Excel, but the underlying figure is still a number that other programs may read differently.",
        },
      },
      {
        "@type": "Question",
        name: "Why did other tools save the value correctly but Excel did not?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because the conversion is Excel's, not the format's. Database exports, payment platforms and scripts write CSV as plain text and do not apply column types. The moment a program decides that a column is numeric, it inherits that program's precision rules, which is why the same file can look right in a viewer and wrong in a spreadsheet.",
        },
      },
      {
        "@type": "Question",
        name: "Is this the same problem as Excel removing leading zeros?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is the same mechanism applied to a different symptom. Microsoft describes both under one article on keeping leading zeros and large numbers: Excel strips leading zeros, and converts large numbers to scientific notation, for the same reason, so that the values behave as numbers. The fix is also the same, which is to declare the column as text at import time.",
        },
      },
    ],
  };

  const faqVisible = faqJsonLd.mainEntity.map((item) => ({
    q: item.name,
    a: item.acceptedAnswer.text,
  }));

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
        <p className="text-blue-600 font-medium">🧹 Data Cleaning · 9 min read</p>

        <h1>CSV Scientific Notation: Why Excel Rewrites Long Numbers</h1>

        <p>
          If a long order number, account code or tracking ID opened as something like 1.23E+15,
          the CSV file is almost certainly fine. Excel converted that column to a number when it
          opened the file, and once a column is numeric the digits are subject to Excel&apos;s own
          precision rules.
        </p>

        <p>
          The conversion is documented rather than mysterious. Microsoft&apos;s support article on
          keeping leading zeros and large numbers states that Excel &quot;automatically removes
          leading zeros, and converts large numbers to scientific notation, like 1.23E+15, in
          order to allow formulas and math operations to work on them&quot;. The same article lists
          a conversion that matters more than the display, which is truncating numerical data to 15
          digits of precision.
        </p>

        <h2>Quick answer</h2>

        <p>
          Set the column type to Text during import, not after it. In Excel that means Data, then
          From Text/CSV, then Edit in the preview pane, then select the column and choose Home,
          Transform, Data Type, Text, and Replace Current. Formatting the column as text once the
          data is already on the grid is the step people try first, and it is the one that cannot
          work, because the conversion has already happened.
        </p>

        <h2>What Excel actually does when it opens a CSV</h2>

        <p>
          Excel reads a CSV as untyped text and then guesses a type for every column. That guessing
          is the feature: it is why a CSV of sales figures opens with numbers you can sum instead of
          strings you cannot. It also has four consequences that Microsoft documents in its
          automatic data conversions list:
        </p>

        <ul>
          <li>Leading zeros are removed and the value becomes a number.</li>
          <li>
            Numerical data is truncated to 15 digits of precision and displayed in scientific
            notation, so the sixteenth digit and everything after it stops existing inside the
            workbook.
          </li>
          <li>Text built around the letter E is read as scientific notation.</li>
          <li>
            A continuous string of letters and numbers is converted to a date, which is why part
            codes such as 1E10 or 12MAR2026 can arrive looking like something else entirely.
          </li>
        </ul>

        <p>
          The distinction that decides how much trouble you are in is whether the file was ever
          saved from Excel. Opening a CSV and looking at it changes nothing on disk. Opening it and
          saving it writes the workbook&apos;s values back out, and a value that has been truncated
          to 15 digits is saved as the truncated value. That is the moment the original digits are
          lost, and it is why the fix has to happen at import rather than afterwards.
        </p>

        <h2>How to tell whether the file or the spreadsheet is the problem</h2>

        <p>
          Check the file first, because that decides which fix you need. Open the CSV in any viewer
          that does not apply column types, or read the first few lines as text, and look for the
          long value. If it is intact in the file, you are dealing with an import setting. If it is
          already E+ notation in the file, the damage happened at export or at a previous save, and
          you need the source system rather than Excel. Our guide to{" "}
          <Link href="/blog/free-csv-viewer-online">opening a CSV in a viewer</Link> covers the first
          check, and a quick look at the raw header and first row with{" "}
          <Link href="/tools/csv-analyzer">the CSV analyzer</Link> tells you what the column really
          contains before a spreadsheet gets a say.
        </p>

        <h2>Fix 1: declare the column as Text in the import</h2>

        <p>
          This is the fix that holds, and the steps are Microsoft&apos;s own. Go to the Data tab and
          choose From Text/CSV next to the Get Data button. Excel loads a preview of the file. Press
          Edit in the preview pane to open the Query Editor, click the column header of the column
          that must stay text, then Home, then Transform, then Data Type, then Text. In the Change
          Column Type dialog choose Replace Current. Select Close &amp; Load when you are done, and
          the data arrives in the worksheet as text.
        </p>

        <p>
          The part worth knowing is what happens later. Microsoft notes that if the underlying data
          changes you can use Data, then Refresh, and Excel will update the data and reapply your
          transformations. The declaration is part of the query, not a one-off click, so the same
          file re-imports correctly next month without you remembering anything.
        </p>

        <h2>Fix 2: switch the automatic conversion off</h2>

        <p>
          Microsoft exposes the guesswork as a setting in Excel for Microsoft 365, Excel for
          Microsoft 365 for Mac, Excel 2024 and Excel 2024 for Mac. From there you can change the
          default behaviour for removing leading zeros, for truncating numerical data to 15 digits
          and showing it in scientific notation, for reading values around the letter E as
          scientific notation, and for turning letter-and-number strings into dates.
        </p>

        <p>
          On Excel 2021 or older, and on most web and mobile builds, that setting is not available.
          In those versions the import route above is the only reliable one, which is why the fix
          worth learning is the one built into the import rather than the one hidden in options.
        </p>

        <h2>Fix 3: keep the value readable inside the workbook</h2>

        <p>
          If the code only has to survive inside one workbook, Microsoft documents a custom or
          special number format that keeps number codes intact, and notes that it works for codes
          containing fewer than 16 digits. Read the limit honestly: a 17-digit value is past the
          precision Excel stores, so no cell format can restore digits the application never kept.
        </p>

        <p>
          This route also leaves the column as a number, which means a later export or pivot treats
          it as one. Use it for a report you are reading, not for a file you are handing to another
          system.
        </p>

        <h2>What does not work</h2>

        <ul>
          <li>
            <strong>Renaming the file or changing the extension.</strong> CSV has no place to store
            a column type, so there is nothing for Excel to read even if the name says text.
          </li>
          <li>
            <strong>Formatting the column as Text after the data has landed.</strong> The values are
            already numbers, and the format only governs what happens next.
          </li>
          <li>
            <strong>Converting to .xlsx and straight back to CSV.</strong> You get a smaller number
            out than you put in, because the workbook is the layer that truncated it.
          </li>
          <li>
            <strong>Editing the E+ cell by hand.</strong> Typing over it can work for one record and
            will not survive a refresh or a re-import.
          </li>
        </ul>

        <h2>Symptom to cause to fix</h2>

        <table>
          <thead>
            <tr>
              <th>What you see</th>
              <th>What happened</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.23E+15 instead of a 16-digit ID</td>
              <td>Column was typed as a number and displayed in scientific notation</td>
              <td>Re-import with the column set to Text</td>
            </tr>
            <tr>
              <td>Last digits changed to zeros</td>
              <td>Precision limit: the value was truncated to 15 digits</td>
              <td>Re-import as Text, or restore from the source system if the file was saved</td>
            </tr>
            <tr>
              <td>A part code turned into a date</td>
              <td>Letter-and-number strings are converted to dates automatically</td>
              <td>Same import route, column set to Text</td>
            </tr>
            <tr>
              <td>Value looks right in a viewer but wrong in Excel</td>
              <td>The file is intact; the spreadsheet is doing the converting</td>
              <td>Adjust the import, leave the file alone</td>
            </tr>
            <tr>
              <td>Every value in the file shows as E+ notation</td>
              <td>The export or a previous save already wrote the converted values</td>
              <td>Go back to the source system; Excel cannot rebuild the digits</td>
            </tr>
          </tbody>
        </table>

        <p>
          Two neighbours of this problem are worth knowing, because they arrive in the same file and
          look similar. Excel stripping leading zeros is the same conversion aimed at ZIP codes and
          phone numbers, and our{" "}
          <Link href="/blog/keep-leading-zeros-in-csv">leading zeros guide</Link> covers it. Columns
          that collapse into one are a delimiter or encoding problem rather than a type problem, and
          that is the{" "}
          <Link href="/blog/csv-opens-in-one-column">one-column diagnosis</Link>.
        </p>

        <h2>Frequently asked questions</h2>

        {faqVisible.map((item, i) => (
          <div key={i}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            The check that separates a file problem from a spreadsheet problem takes a minute if you
            have the right three things to hand:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — writing a five-line script to print the first three
              lines of a CSV as text is faster than fighting an import dialog, and that is the check
              this article opens with.{" "}
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
              <strong>Stack AI</strong> — if the cleaned file has to land somewhere as a recorded
              step, a workflow can read the CSV, keep the code column as text and write the row
              somewhere you can audit later.{" "}
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
              <strong>Softr</strong> — for a catalogue of codes that people have to look up, a
              no-code app gives each record its own page, which is one way to stop long IDs living
              only inside spreadsheets.{" "}
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
            at no extra cost to you. OpenCode Go uses our referral link; the other two currently
            point to each vendor&apos;s official page until our tracking links are approved.
          </p>
        </div>

        <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need the File Checked Before It Reaches a Spreadsheet?</h2>
          <p className="text-blue-100 mb-5">
            Paste the first rows into the analyzer and read the columns as they actually are, without
            a spreadsheet deciding what they mean.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/csv-analyzer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open the CSV Analyzer
              </Button>
            </Link>
            <Link href="/tools/csv-delimiter-converter">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Fix the Delimiter Instead
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Sources for this article: Microsoft Support, keeping leading zeros and large numbers, and
          the automatic data conversions reference it links to. Both were checked on the day this
          page was published.
        </p>

        <RelatedPosts slug="csv-scientific-notation" />
      </article>
    </>
  );
}
