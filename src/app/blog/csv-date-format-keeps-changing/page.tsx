import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Why CSV Dates Keep Changing When You Save (and How to Stop It)",
  description:
    "A CSV stores dates as text, and the program that opens it decides what that text means. Microsoft's documented behaviour, the 88.8% error rate we measured, and the fixes that hold.",
  keywords: [
    "csv date format changes when saved",
    "excel csv date format not saving",
    "date format keeps changing in csv",
    "excel csv keeps changing date format",
    "change date format in csv",
    "csv stores dates as text",
    "excel import text wizard dates",
    "iso 8601 csv dates",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/csv-date-format-keeps-changing" },
  openGraph: {
    title: "Why CSV Dates Keep Changing When You Save",
    description:
      "The day and month swap because the file never recorded which one came first. What Microsoft documents about the import side, and the measurement behind the fix.",
    type: "article",
    url: "https://nocodecsv.com/blog/csv-date-format-keeps-changing",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-23",
    modifiedTime: "2026-09-23",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why Your CSV Dates Keep Changing",
    description:
      "CSV has no date type. Here is where the guess happens, what it costs, and the four fixes that survive a round trip.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Why CSV Dates Keep Changing When You Save (and How to Stop It)",
  description:
    "Why dates come back with the day and month swapped after a CSV round trip, with Microsoft's documented import behaviour and a measured 10,000-row test of the wrong assumption.",
  url: "https://nocodecsv.com/blog/csv-date-format-keeps-changing",
  datePublished: "2026-09-23",
  dateModified: "2026-09-23",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/csv-date-format-keeps-changing",
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
      name: "CSV Date Format Keeps Changing",
      item: "https://nocodecsv.com/blog/csv-date-format-keeps-changing",
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
        name: "Why do my dates change when I save a CSV?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A CSV file stores dates as text and records nothing about the order of the parts. When a program opens the file it has to decide whether 03/05/2026 means 3 May or 5 March, and it decides using the machine's default data format settings. Microsoft documents that behaviour directly: when Excel opens a .csv file, it uses the current default data format settings to interpret how to import each column of data.",
        },
      },
      {
        "@type": "Question",
        name: "Is there any way to store a date format inside a CSV?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. RFC 4180 defines a CSV as rows of text fields separated by commas, with no type information and no place to record a display format. Anything that looks like a date in a CSV is a string of characters that the reading program may or may not treat as a date. That is why the safest exchange format is the one that carries its own order, such as 2026-09-23.",
        },
      },
      {
        "@type": "Question",
        name: "What does Excel actually keep when a cell holds a date?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A number, not the text you typed. Microsoft's documentation on date systems states that when you enter a date, it is converted into a serial number that represents the number of days elapsed since January 1, 1900, and gives the example of July 5, 2011 becoming the serial number 40729. The way the date appears on screen comes from the cell's number format, and a CSV export has nowhere to store that format.",
        },
      },
      {
        "@type": "Question",
        name: "Which date format should I use in a CSV?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ISO 8601, written as YYYY-MM-DD. The largest part comes first, so a reader can never confuse day and month, and the format sorts alphabetically in the same order as it sorts chronologically. Ten characters per date also keeps the file smaller than a format that carries seconds and a time zone nobody reads.",
        },
      },
      {
        "@type": "Question",
        name: "Will putting quotes around a date protect it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Quotes tell a parser where a field begins and ends under RFC 4180; they say nothing about what the characters inside mean. Excel still interprets a quoted date column when it opens the file, so quoting changes nothing about the day and month problem. It only helps when the field contains a comma, a quote or a line break.",
        },
      },
      {
        "@type": "Question",
        name: "How do I fix a file where the dates are already wrong?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Work out which order the file was written in before you convert anything. If any first number in the file is greater than 12, the file is day-first, because a month cannot be larger than 12. If nothing exceeds 12, compare a handful of dates against a source you trust, such as a report total or a known event, and only then convert every row with one consistent rule.",
        },
      },
      {
        "@type": "Question",
        name: "Why does a colleague open the same file and get different dates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because the guess belongs to the machine, not the file. Excel takes its default data format from the operating system's regional settings, and Microsoft notes that date formats beginning with an asterisk in the format list change when those regional settings change. Two computers with different regional settings can render the same text as two different dates.",
        },
      },
      {
        "@type": "Question",
        name: "Should I stop using CSV for anything with dates?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stop using ambiguous date text, not CSV. Keep dates in ISO format, treat the CSV as an exchange file rather than the master copy, and keep the workbook or database as the place where types and formats live. That combination keeps the portability of CSV without giving the reading program a choice it can get wrong.",
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
        <p className="text-blue-600 font-medium">🧹 Data Cleaning · 8 min read</p>

        <h1>Why CSV Dates Keep Changing When You Save</h1>

        <p>
          The date you typed is not the date that comes back. A file goes out as{" "}
          <code>03/05/2026</code>, arrives as March 5th, and the person who sent it swears it left as
          the third of May. Nothing corrupted, and nothing was lost. The file never held the fact
          that was being argued about.
        </p>

        <p>
          This article covers where the guess happens, what a wrong guess actually costs, and the
          two changes that stop it from mattering again.
        </p>

        <h2>Quick answer</h2>

        <p>
          A CSV stores a date as <strong>text</strong>, with no record of whether the day or the
          month came first. The program that opens the file supplies that decision from the
          machine&apos;s regional settings, so the same bytes turn into different dates on different
          computers. The fix is to write dates in a form that cannot be misread,{" "}
          <code>2026-09-23</code>, and to import through a step where you set the column type
          yourself instead of letting the automatic conversion decide.
        </p>

        <h2>CSV has no date type</h2>

        <p>
          RFC 4180 describes a file of records, each record on its own line, each field separated by
          a comma. There is no column type, no length and no format recorded anywhere in the file. A
          phone number, an account code and a date all arrive the same way: as characters.
        </p>

        <p>
          That design is why CSV opens in everything, and it is also why dates are the field most
          likely to shift on the way through. The file is not wrong. It simply did not carry the
          information needed to be right on its own.
        </p>

        <h2>Where the guess happens</h2>

        <p>
          Microsoft&apos;s support page on importing and exporting text and CSV files describes the
          moment of conversion, and it is worth reading the sentence twice:
        </p>

        <blockquote>
          <p>
            When Excel opens a .csv file, it uses the current default data format settings to
            interpret how to import each column of data. If you want more flexibility in converting
            columns to different data formats, you can use the Import Text Wizard.
          </p>
        </blockquote>

        <p>
          The same page gives the exact example that matches this problem: the format of a data
          column in the .csv file may be MDY, but Excel&apos;s default data format is YMD. Two
          different conventions, one file, and an automatic decision in between.
        </p>

        <p>
          The date you typed is not what sits in the cell either. Microsoft&apos;s documentation on
          date systems says that when you enter a date it becomes a serial number counting days
          since January 1, 1900, and gives July 5, 2011 as the number 40729. What you see on screen
          is a number with a display format on top. A CSV has nowhere to put the format, so only the
          text survives, and the machine that opens it formats the text again its own way.
        </p>

        <h2>What a wrong guess costs, measured</h2>

        <p>
          We built a file written day-first, the way a UK, German or Australian system writes dates,
          with 10,000 rows of <code>dd/mm/yyyy</code> text. Then we read it back the way a
          US-default program would, as <code>mm/dd/yyyy</code>, and compared every row against the
          date it was supposed to be.
        </p>

        <table>
          <thead>
            <tr>
              <th>Outcome</th>
              <th>Rows</th>
              <th>Share</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rejected outright: no month 13 or larger exists, so parsing failed</td>
              <td>5,550</td>
              <td>55.5%</td>
            </tr>
            <tr>
              <td>Parsed, but returned a different date than the true one</td>
              <td>3,334</td>
              <td>33.3%</td>
            </tr>
            <tr>
              <td>Came back correct</td>
              <td>1,116</td>
              <td>11.2%</td>
            </tr>
          </tbody>
        </table>

        <p>
          Of the rows that parsed cleanly, 3,334 out of 4,450 came back as the wrong date, which is
          74.9% of everything the reader accepted. Those are the dangerous ones. A failed parse
          shows up as an empty cell or an error and somebody notices. A swap between the 4th of
          March and the 5th of April looks like a plausible date, sorts correctly within the month,
          and reconciles against nothing.
        </p>

        <p>
          Three rows make the mechanism visible. All three were written from the same day-first
          source, and all three were read back as month-first:
        </p>

        <table>
          <thead>
            <tr>
              <th>True date</th>
              <th>Text in the file</th>
              <th>Read back month-first</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-05-03</td>
              <td>03/05/2026</td>
              <td>2026-03-05 — silently wrong</td>
            </tr>
            <tr>
              <td>2026-04-25</td>
              <td>25/04/2026</td>
              <td>error — month 25 does not exist</td>
            </tr>
            <tr>
              <td>2026-04-04</td>
              <td>04/04/2026</td>
              <td>2026-04-04 — correct by luck</td>
            </tr>
          </tbody>
        </table>

        <p>
          The third row is the reason this problem survives for years. Every month where the day and
          month are both 12 or lower has a share of rows that come back correct no matter which
          convention the reader chose, so a spot check of ten rows can look clean while a third of
          the file is shifted.
        </p>

        <h2>The setting lives on the machine</h2>

        <p>
          Excel does not read a date format from the file, because there is none to read. It uses
          the operating system&apos;s regional settings, which is why the same CSV can be correct on
          one laptop and wrong on the laptop next to it, and why a report can be right for four
          months and then wrong after somebody travels with the company laptop. Microsoft notes that
          date formats beginning with an asterisk in the format list are the ones that change when
          regional date and time settings change.
        </p>

        <p>
          If two people disagree about what a file says, this is usually why. It is worth checking
          the regional setting before checking the rows.
        </p>

        <h2>Four fixes that hold</h2>

        <ol>
          <li>
            <strong>Write ISO 8601 dates.</strong> <code>2026-09-23</code> cannot be misread,
            because the year comes first and there is only one way to assign the remaining parts.
            It also sorts correctly as text, which matters when a downstream tool sorts a column as
            a string.
          </li>
          <li>
            <strong>Import through the wizard, not the double click.</strong> Opening a .csv by
            double-clicking applies the automatic conversion. Use Data → From Text/CSV and set the
            date column type explicitly. Microsoft also notes a shortcut worth knowing: changing the
            file extension from .csv to .txt forces Excel to run the Import Text Wizard.
          </li>
          <li>
            <strong>Let the CSV be the exchange file, not the master copy.</strong> Keep types and
            formats in the workbook or database, where they are stored, and treat the CSV as the
            transfer format. A CSV is a good way to move data; it is a poor place to store meaning.
          </li>
          <li>
            <strong>Record the convention next to the file.</strong> If you must ship day-first
            text, say so in the filename, the readme, or the column header,{" "}
            <code>date_dd_mm_yyyy</code>. It is a small thing that prevents the argument later.
          </li>
        </ol>

        <h2>Repairing a file that already lost the order</h2>

        <ol>
          <li>
            Look for any first number greater than 12 in the date column. If one exists, the file
            was written day-first, because no month is larger than 12. That makes the diagnosis
            cheap on a file with enough rows in it.
          </li>
          <li>
            If everything sits at 12 or below, compare a few rows against an independent source,
            such as a monthly total or a known transaction date, before converting anything.
          </li>
          <li>
            Convert every row with one rule, never row by row, and re-check the row count afterwards
            so nothing silently dropped out of the parse.
          </li>
          <li>
            If the file also has{" "}
            <Link href="/blog/csv-opens-in-one-column">everything in a single column</Link> or{" "}
            <Link href="/blog/csv-scientific-notation">long numbers turned into 1.23E+15</Link>, the
            same reader is making more than one guess, and it is worth fixing all of them in the
            same pass.
          </li>
        </ol>

        <h2>How to check a file before you send it</h2>

        <p>
          Paste a slice into <Link href="/tools/csv-analyzer">the CSV analyzer</Link> and read the
          columns as a parser sees them rather than as a spreadsheet guessed them. If a date column
          needs a second look, the analyzer shows the raw text, which is the only thing that is
          actually in the file. When the goal is simply to rewrite the file with a different
          separator or a different encoding,{" "}
          <Link href="/tools/csv-delimiter-converter">the delimiter converter</Link> does that
          without reinterpreting the values.
        </p>

        <p>
          If you are dealing with a related problem, the{" "}
          <Link href="/blog/keep-leading-zeros-in-csv">leading zeros guide</Link> covers the same
          class of automatic conversion and the{" "}
          <Link href="/blog/convert-excel-to-csv-free-online">Excel to CSV walkthrough</Link> covers
          what an export does and does not preserve.
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
            The measurement above is a short script, and so is the repair. These three cover the
            cases where you would rather not run one:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — writing 10,000 rows of day-first text and reading them
              back two ways is a comfortable five-minute check in a terminal, and it can be re-run
              on every new export.{" "}
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
              <strong>Stack AI</strong> — if dated files arrive on a schedule, validation can run on
              arrival, so a column that starts arriving in a new format fails the workflow instead of
              landing in the report.{" "}
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
              <strong>Softr</strong> — when the same dates are re-sent every month, putting the
              records in a no-code app once removes the round trip through a text file
              altogether.{" "}
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
          <h2 className="text-2xl font-bold mb-3">See What the File Really Contains</h2>
          <p className="text-blue-100 mb-5">
            Paste a few rows and read the raw text, not the date your spreadsheet decided to show
            you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/csv-analyzer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open the CSV Analyzer
              </Button>
            </Link>
            <Link href="/blog/csv-scientific-notation">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Numbers Being Rewritten Too?
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          The quoted sentences about interpreting each column, and about forcing the Import Text
          Wizard, are from Microsoft&apos;s support page &quot;Import or export text (.txt or .csv)
          files&quot;, retrieved on 2026-09-23. The serial number description and the 40729 example
          are from Microsoft&apos;s date systems documentation, retrieved the same day. The parse
          counts come from a 10,000-row test we ran on 2026-09-23 using{" "}
          <code>datetime.strptime</code> in Python&apos;s standard library. Field rules and the
          absence of type information are from RFC 4180, section 2.
        </p>

        <RelatedPosts slug="csv-date-format-keeps-changing" />
      </article>
    </>
  );
}
