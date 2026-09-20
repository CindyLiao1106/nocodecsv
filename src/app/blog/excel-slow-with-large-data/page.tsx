import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Excel Slow With Large Data? Why It Happens and What to Do",
  description:
    "Excel recalculates after nearly every edit, so a workbook past a few hundred thousand rows spends its time thinking. The causes and a five-minute check.",
  keywords: [
    "excel slow with large data",
    "why is excel so slow with large data",
    "excel slow with large files",
    "how to make excel faster with lots of data",
    "excel slow performance",
    "excel slow to calculate",
    "excel not responding large file",
    "excel slowness issue",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/excel-slow-with-large-data",
  },
  openGraph: {
    title: "Excel Slow With Large Data? Why It Happens and What to Do",
    description:
      "Volatile functions, whole-column references, formatting dragged to the last row, and a used range far past the data. How to find the real cause and stop fighting the file.",
    type: "article",
    url: "https://nocodecsv.com/blog/excel-slow-with-large-data",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-17",
    modifiedTime: "2026-09-17",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel Slow With Lots of Data: Diagnose It in Five Minutes",
    description:
      "The four things that slow a workbook down, how to tell which one you have, and when to stop fixing Excel and keep the file as data instead.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Excel Slow With Large Data? Why It Happens and What to Do (2026)",
  description:
    "A workbook that has grown past a few hundred thousand rows spends its time recalculating rather than responding. The four causes of Excel slowness with large data, a five-minute diagnostic, and the fixes that hold.",
  url: "https://nocodecsv.com/blog/excel-slow-with-large-data",
  datePublished: "2026-09-17",
  dateModified: "2026-09-17",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/excel-slow-with-large-data",
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
      name: "Excel Slow With Large Data",
      item: "https://nocodecsv.com/blog/excel-slow-with-large-data",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why is Excel so slow with large data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because a spreadsheet holds formulas as well as data, and in automatic mode Excel recalculates after nearly every edit. The cost tracks the number of formula cells rather than the number of rows, so 200,000 rows with ten formula columns is two million calculations to redo every time you type in a cell. Formatting applied past the data and a used range that reaches thousands of empty rows multiply the same problem.",
      },
    },
    {
      "@type": "Question",
      name: "How many rows before Excel slows down?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no fixed number, because rows alone are cheap. A sheet of plain values with no formulas opens a million rows without trouble, while a 50,000 row sheet full of lookups, whole-column references and conditional formatting can crawl. The worksheet ceiling is 1,048,576 rows by 16,384 columns; the practical ceiling is the point where recalculation stops feeling instant, and that depends on what you put in the cells.",
      },
    },
    {
      "@type": "Question",
      name: "Which Excel functions make a workbook slow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The volatile ones. OFFSET, INDIRECT, NOW, TODAY, RAND, RANDBETWEEN and CELL with a format argument are recalculated on every calculation, whether or not anything they depend on changed. That list is documented by Microsoft. A single volatile function feeding a few thousand cells turns each keystroke into a full pass over those cells.",
      },
    },
    {
      "@type": "Question",
      name: "Does deleting rows make an Excel file smaller?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not much, on its own. An .xlsx file is a compressed package of XML parts, and rows you delete leave behind the used range, the leftover styles and any formatting that was applied to them. Save a copy and check the size rather than assuming. Clearing formatting across the old range, or copying just the data into a fresh workbook, is what usually drops the file size.",
      },
    },
    {
      "@type": "Question",
      name: "Should I switch Excel to manual calculation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It is the right move while you are working on a heavy file, and the wrong move to leave on. Manual calculation, at File, Options, Formulas, stops the recalculation after each edit and lets you press F9 when you want the numbers to update. The risk is obvious: if you save or export without pressing F9, the file keeps stale values, and nothing on screen tells you so.",
      },
    },
    {
      "@type": "Question",
      name: "Does Excel use all my CPU cores?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For calculation, it can. Multi-threaded calculation is on by default and the thread count lives at File, Options, Advanced, Formulas, so independent formulas genuinely run in parallel. What it cannot split is a dependency chain: if each formula reads the one above it, the work is serial no matter how many cores are free, which is why a large block of lookup formulas does not speed up with a better processor.",
      },
    },
    {
      "@type": "Question",
      name: "Why is Excel only slow when the file is on OneDrive or SharePoint?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AutoSave. With the file synced, every change is uploaded and versioned, so the cost of each edit is now network plus disk instead of just disk. Turning AutoSave off while you work on a heavy sheet, and saving deliberately, is usually enough to tell whether sync is the culprit.",
      },
    },
    {
      "@type": "Question",
      name: "Is CSV faster than Excel for large files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For reading, usually yes, because a CSV carries no formulas, no conditional formatting and no calculation to trigger. It is also plain text, so getting it into a grid is a single parse. The trade-off is that CSV stores no formulas, no charts and no multiple sheets, so it suits data that is meant to be read rather than worked on. An .xlsx is a compressed ZIP of XML parts, so it can be smaller on disk than the CSV holding the same values.",
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
        <p className="text-blue-600 font-medium">⚙️ File Operations · 8 min read</p>
        <h1>Excel Slow With Large Data? Why It Happens and What to Do</h1>

        <p>
          <strong>
            Excel is slow because it holds formulas, not just data, and it recalculates after nearly
            every edit. The cost scales with the number of formula cells, so the fastest fix is
            usually to stop making one workbook hold everything: split the data into parts that
            recalculate quickly, or keep it as data and ask your question outside the grid.
          </strong>{" "}
          Before you buy more RAM, it is worth knowing which of the four things below you actually
          have, because three of them cost nothing to fix and one of them is not fixable at all.
        </p>

        <p>
          This is one of the loudest complaints people make about spreadsheets, in every phrasing:{" "}
          <em>&ldquo;why is Excel so slow with large data&rdquo;</em>,{" "}
          <em>&ldquo;how to make Excel faster with lots of data&rdquo;</em>, and{" "}
          <em>&ldquo;Excel slow with large files&rdquo;</em> all describe the same afternoon of
          watching a spinner.
        </p>

        <h2>Match the symptom before you change settings</h2>

        <table>
          <thead>
            <tr>
              <th>When it is slow</th>
              <th>Most likely cause</th>
              <th>Where to look</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Slow to open, then fine</td>
              <td>A used range and formatting that reach far past the data</td>
              <td>Ctrl and End, to see where Excel thinks the sheet ends</td>
            </tr>
            <tr>
              <td>Slow after every edit, cursor stuttering</td>
              <td>Volatile functions and long formula columns recalculating</td>
              <td>Search the formulas for OFFSET, INDIRECT, NOW, TODAY, RAND</td>
            </tr>
            <tr>
              <td>Slow when scrolling or selecting</td>
              <td>Conditional formatting and data validation applied to whole columns</td>
              <td>
                Home, then Conditional Formatting, Manage Rules, and read the ranges
              </td>
            </tr>
            <tr>
              <td>Slow only for the shared copy</td>
              <td>AutoSave syncing every change to OneDrive or SharePoint</td>
              <td>The AutoSave switch in the title bar</td>
            </tr>
            <tr>
              <td>Slow to open, and the file is enormous on disk</td>
              <td>Leftover formatting, unused styles, embedded objects, old pivot caches</td>
              <td>
                File size beside an .xlsx copy of just the data
              </td>
            </tr>
          </tbody>
        </table>

        <p>
          The last row is the one people misdiagnose, because a big file and a slow file are not the
          same thing. An .xlsx carries a compressed package of XML parts alongside the values, so a
          workbook can be slow at 40 MB or quick at 200 MB depending on what is inside it.
        </p>

        <h2>Why recalculation is the expensive part</h2>

        <p>
          A spreadsheet is a dependency graph, and Excel rebuilds and walks that graph whenever it
          calculates. In automatic mode, that happens after nearly every edit. The bill is set by how
          many formula cells have to be revisited, not by how many rows you have.
        </p>

        <p>
          A worked example. Take 250,000 rows and ten formula columns of lookups and arithmetic. That
          is 2.5 million formula cells, and each edit can send the engine back over the ones that
          depend on what changed. Now delete nine of those columns and keep the data. Nothing about
          the file got smaller in rows, and it becomes usable again, because the cells left behind are
          values rather than computations.
        </p>

        <p>
          Multithreading helps less than people expect here. Excel does calculate independent formulas
          in parallel, and the thread count is configurable at{" "}
          <strong>File → Options → Advanced → Formulas</strong>, but a dependency chain cannot be
          split across cores. A column where each row reads the row above it is a serial program
          wearing a spreadsheet costume, and a faster processor changes nothing.
        </p>

        <p>
          There is a hard ceiling on all of this, and it is worth stating once: a worksheet holds
          1,048,576 rows by 16,384 columns, and a single cell holds 32,767 characters. Those numbers
          belong to the grid. If you are near them, the problem is size rather than speed, and{" "}
          <Link href="/blog/excel-row-limit">the row limit explainer</Link> covers what happens there.
        </p>

        <h2>The five-minute diagnostic</h2>

        <p>
          Do these in order. Stop when the numbers look wrong.
        </p>

        <ol>
          <li>
            <strong>Press Ctrl and End.</strong> If it takes you to a row far below your last record,
            the sheet has formatting or stray cells down there, and Excel is carrying them around. Go
            to the row after your data, select to the bottom of the grid with Ctrl, Shift and Down,
            then delete the rows and clear their formatting.
          </li>
          <li>
            <strong>Count the formula cells.</strong> Ctrl and End gives you the corner of the used
            range. Multiply by your formula columns. If the answer is in the millions, that is your
            bottleneck, and no setting will hide it.
          </li>
          <li>
            <strong>Look for volatile functions.</strong> Search for OFFSET, INDIRECT, NOW, TODAY,
            RAND, RANDBETWEEN and CELL. Those are recalculated every time anything recalculates,
            whether or not their inputs changed, and a single one feeding a large range is enough to
            make a workbook feel broken.
          </li>
          <li>
            <strong>Read your conditional formatting ranges.</strong> A rule applied to{" "}
            <code>A:A</code> is evaluated against more than a million rows. Fifty rules like that is a
            million evaluations per refresh, before any formula runs.
          </li>
          <li>
            <strong>Check Save As for both .xlsx and .csv.</strong> If the .xlsx is far larger than
            the CSV of the same data, the workbook is carrying formatting, styles or objects that the
            data does not need.
          </li>
        </ol>

        <h2>Fixes ranked by effort</h2>

        <table>
          <thead>
            <tr>
              <th>Fix</th>
              <th>Effort</th>
              <th>What it buys you</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Switch to manual calculation while you work</td>
              <td>One setting</td>
              <td>An instant, responsive sheet. Remember to press F9</td>
            </tr>
            <tr>
              <td>Clear formatting below the data and shrink the used range</td>
              <td>A few minutes</td>
              <td>Faster open, smaller file, quicker selection</td>
            </tr>
            <tr>
              <td>Replace whole-column references with bounded ranges</td>
              <td>An hour</td>
              <td>Removes most of the per-edit cost permanently</td>
            </tr>
            <tr>
              <td>Split the file into parts that stay light</td>
              <td>About a minute</td>
              <td>Files you can actually work in, at the cost of having several</td>
            </tr>
            <tr>
              <td>Keep the data as CSV and analyse it outside Excel</td>
              <td>Minutes</td>
              <td>An answer without a recalculation graph at all</td>
            </tr>
            <tr>
              <td>Move the data into the Data Model or a database</td>
              <td>An afternoon</td>
              <td>Removes the ceiling entirely for recurring data</td>
            </tr>
          </tbody>
        </table>

        <h3>Manual calculation, and when to turn it back on</h3>

        <p>
          <strong>File → Options → Formulas → Manual</strong> stops the recalculation after each edit.
          Press F9 to recalculate, or Shift and F9 for just the open sheet. This is the single fastest
          way to make a heavy file usable while you tidy it up.
        </p>

        <p>
          Leave it on by accident and you have a worse problem than slowness. Every number on screen
          is from the last calculation, and a saved file keeps those values. If you are going to work
          in manual mode, put the setting back before you save, or check that the word{" "}
          <em>Calculate</em> has appeared in the status bar, which is Excel telling you the sheet is
          out of date.
        </p>

        <h3>Cut the formula surface</h3>

        <p>
          The changes that stick are the ones that reduce the number of cells Excel has to visit.
          Bounded ranges instead of whole columns. A helper column computed once instead of the same
          lookup written three times in three formulas. Static values where a formula is no longer
          needed, pasted with Paste Special, Values. Remove the volatile functions, especially
          INDIRECT and OFFSET, which exist for reasons that a modern version rarely needs.
        </p>

        <p>
          If the sheet is a report rather than a working model, the Data Model is the better answer.
          Load the file with Power Query and choose{" "}
          <strong>Close &amp; Load To → Only Create Connection</strong>, then build the pivot against
          the model instead of the grid. The rows are held in a compressed in-memory engine rather
          than in cells, no formulas sit on a sheet, and there is no grid limit to run into. It is
          also the supported way to work with a data set that exceeds the grid.
        </p>

        <h3>Split the file when the data itself is the weight</h3>

        <p>
          If the slowness is plain volume with no formula problem to fix, give each part a size it can
          handle. <Link href="/tools/csv-splitter">The CSV splitter</Link> reads the file in your
          browser and writes out parts by row count or target size, repeating the header row in each
          so every part opens as a normal file. Nothing is uploaded, which matters when the data is
          client records or payroll. The same split is the standard answer when a file will not open
          at all, and{" "}
          <Link href="/blog/open-csv-file-too-big-for-excel">that case is covered separately</Link>.
        </p>

        <p>
          For ad-hoc questions, splitting is more machinery than the question deserves. If all you
          need is the total, the trend or the outlier,{" "}
          <Link href="/tools/csv-analyzer">the analyzer</Link> reads the file, answers the question and
          returns a chart. There is no recalculation graph involved, so the size of the file stops
          being a performance issue and becomes a background detail.
        </p>

        <h2>Habits that keep a workbook fast</h2>

        <p>
          Most slow workbooks are slow because of three habits, and none of them is exotic.
        </p>

        <ul>
          <li>
            <strong>Formatting the whole column instead of the data.</strong> Setting a column to
            currency or a date format applies it to every row to the bottom of the grid unless you
            select only the rows you have.
          </li>
          <li>
            <strong>One sheet doing two jobs.</strong> Raw data wants to be a plain block of values
            with no formatting. Formulas belong on a summary sheet that references bounded ranges from
            the data sheet.
          </li>
          <li>
            <strong>Re-importing instead of appending.</strong> Monthly exports stacked into one
            growing workbook will eventually be unworkable. Keep each export as a{" "}
            <Link href="/blog/csv-vs-excel">CSV file</Link> and query the folder, which is what Power
            Query is for, and it never has to hold the whole history in cells.
          </li>
        </ul>

        <p>
          One small check worth adopting: after any import, confirm the row count before you start
          working.{" "}
          <Link href="/blog/count-rows-in-csv-file">
            Counting the rows without opening the file in Excel
          </Link>{" "}
          takes seconds, and an import that quietly dropped rows is far more expensive than one that
          is merely slow.
        </p>

        <h2>Frequently asked questions</h2>

        <h3>Why is Excel so slow with large data?</h3>
        <p>
          Because a spreadsheet holds formulas as well as data, and in automatic mode Excel
          recalculates after nearly every edit. The cost tracks the number of formula cells rather
          than the number of rows, so 200,000 rows with ten formula columns is two million
          calculations to redo every time you type in a cell. Formatting applied past the data and a
          used range that reaches thousands of empty rows multiply the same problem.
        </p>

        <h3>How many rows before Excel slows down?</h3>
        <p>
          There is no fixed number, because rows alone are cheap. A sheet of plain values with no
          formulas opens a million rows without trouble, while a 50,000 row sheet full of lookups,
          whole-column references and conditional formatting can crawl. The worksheet ceiling is
          1,048,576 rows by 16,384 columns; the practical ceiling is the point where recalculation
          stops feeling instant, and that depends on what you put in the cells.
        </p>

        <h3>Which Excel functions make a workbook slow?</h3>
        <p>
          The volatile ones. OFFSET, INDIRECT, NOW, TODAY, RAND, RANDBETWEEN and CELL with a format
          argument are recalculated on every calculation, whether or not anything they depend on
          changed. Microsoft documents this list in its own article on volatile functions. A single
          volatile function feeding a few thousand cells turns each keystroke into a full pass over
          those cells.
        </p>

        <h3>Does deleting rows make an Excel file smaller?</h3>
        <p>
          Not much, on its own. An .xlsx file is a compressed package of XML parts, and rows you delete
          leave behind the used range, the leftover styles and any formatting that was applied to them.
          Save a copy and check the size rather than assuming. Clearing formatting across the old range,
          or copying just the data into a fresh workbook, is what usually drops the file size.
        </p>

        <h3>Should I switch Excel to manual calculation?</h3>
        <p>
          It is the right move while you are working on a heavy file, and the wrong move to leave on.
          Manual calculation, at File, Options, Formulas, stops the recalculation after each edit and
          lets you press F9 when you want the numbers to update. The risk is obvious: if you save or
          export without pressing F9, the file keeps stale values, and nothing on screen tells you so.
        </p>

        <h3>Does Excel use all my CPU cores?</h3>
        <p>
          For calculation, it can. Multi-threaded calculation is on by default and the thread count
          lives at File, Options, Advanced, Formulas, so independent formulas genuinely run in
          parallel. What it cannot split is a dependency chain: if each formula reads the one above it,
          the work is serial no matter how many cores are free, which is why a large block of lookup
          formulas does not speed up with a better processor.
        </p>

        <h3>Why is Excel only slow when the file is on OneDrive or SharePoint?</h3>
        <p>
          AutoSave. With the file synced, every change is uploaded and versioned, so the cost of each
          edit is now network plus disk instead of just disk. Turning AutoSave off while you work on a
          heavy sheet, and saving deliberately, is usually enough to tell whether sync is the culprit.
        </p>

        <h3>Is CSV faster than Excel for large files?</h3>
        <p>
          For reading, usually yes, because a CSV carries no formulas, no conditional formatting and no
          calculation to trigger. It is also plain text, so getting it into a grid is a single parse.
          The trade-off is that CSV stores no formulas, no charts and no multiple sheets, so it suits
          data that is meant to be read rather than worked on. An .xlsx is a compressed ZIP of XML
          parts, so it can be smaller on disk than the CSV holding the same values.
        </p>

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            The splitter and the analyzer are free and need no account. These three help when the
            heavy file is a monthly event rather than a one-off:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — when a folder of monthly exports keeps landing on you, a
              short script that splits, filters and re-saves them is faster to write than to do by
              hand for the fourth month running, and a subscription covering 19+ models costs less
              than the afternoon.{" "}
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
              <strong>Stack AI</strong> — if the heavy file arrives on a schedule from a system you
              do not control, a workflow can pick it up, trim it and hand you something Excel can
              open, so the slowness stops being your problem to solve each time.{" "}
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
              <strong>Softr</strong> — once the data is out of the sheet, publishing it as a
              searchable page is often what the spreadsheet was standing in for, and it saves
              rebuilding the same report every month.{" "}
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
            at no extra cost to you. OpenCode Go uses our referral link; the other two currently point
            to each vendor&apos;s official page until our tracking links are approved.
          </p>
        </div>

        <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Stop Waiting on the Spinner</h2>
          <p className="text-blue-100 mb-5">
            Split a heavy file into parts Excel can recalculate quickly, or keep it as data and let
            the analyzer answer the question instead.
          </p>
          <div className="flex sm:flex-row flex-col gap-3 justify-center">
            <Link href="/tools/csv-splitter">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Split a Large File Free
              </Button>
            </Link>
            <Link href="/tools/csv-analyzer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Analyze Your CSV Free
              </Button>
            </Link>
          </div>
        </div>

      <section className="mt-10 rounded-xl border border-blue-100 bg-blue-50/60 p-5">
        <h2 className="text-lg font-semibold text-zinc-900">
          If the bottleneck is your machine, not the file
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          Trimming and splitting the file fixes most of this. If you are still fighting your
          hardware, two upgrades genuinely move the needle for CSV work: <strong>more RAM</strong>{" "}
          and <strong>fast external storage</strong>. Our guide to{" "}
          <Link href="/blog/best-cheap-usb-flash-drives-under-50" className="text-blue-700 underline">
            cheap drives under $50 for large CSV files
          </Link>{" "}
          covers what actually matters (USB 3.2 vs 3.0, flash drive vs portable SSD lifespan, and
          exFAT so Windows and macOS both read the same drive) — and what to skip.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          As an Amazon Associate I earn from qualifying purchases.{" "}
          <a
            href="https://www.amazon.com/s?k=portable+ssd+500gb&tag=nocodecsv-20"
            rel="nofollow sponsored noopener"
            target="_blank"
            className="underline hover:text-blue-700"
          >
            Portable SSDs on Amazon
          </a>
        </p>
      </section>

        <RelatedPosts slug="excel-slow-with-large-data" />
      </article>
    </>
  );
}
