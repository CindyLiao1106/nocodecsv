import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "How Many Columns Can a CSV File Have? The Real Limit",
  description:
    "CSV has no column limit in the spec, and stream parsers handle 10 million columns. We measured where wide files actually break: memory for the full table, and cell counts.",
  keywords: [
    "csv column limit",
    "how many columns can a csv file have",
    "csv too many columns",
    "csv maximum columns",
    "csv 1000 columns",
    "excel column limit 16384",
    "wide csv file memory",
    "csv file format limit",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/csv-column-limit" },
  openGraph: {
    title: "How Many Columns Can a CSV File Have? The Real Limit",
    description:
      "The format sets no column count. We measured where wide files actually break: 10 million columns parsed fine, and a 30,000 by 3,000 table ate 6.3 GB in memory.",
    type: "article",
    url: "https://nocodecsv.com/blog/csv-column-limit",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-24",
    modifiedTime: "2026-09-24",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Many Columns Can a CSV Have?",
    description:
      "RFC 4180 sets no column count. The limits live in the programs reading the file, and we measured exactly where they bite.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Many Columns Can a CSV File Have? The Real Limit",
  description:
    "The CSV format sets no column count. Measured results for wide files: 10,000,000 columns parsed in 0.45 seconds on one row, while a full 30,000-by-3,000 table needed 6,273 MB to load.",
  url: "https://nocodecsv.com/blog/csv-column-limit",
  datePublished: "2026-09-24",
  dateModified: "2026-09-24",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/csv-column-limit",
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
      name: "CSV Column Limit",
      item: "https://nocodecsv.com/blog/csv-column-limit",
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
        name: "How many columns can a CSV file have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The CSV format itself sets no column count. RFC 4180 defines a record as one or more fields separated by commas, and it states that each line should contain the same number of fields throughout the file, but it never names a maximum number of fields. Any column ceiling you hit comes from the program reading the file, not from the file format. In our test a streaming parser read a single row of 10,000,000 columns in 0.45 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Can a CSV have more than 1,000 columns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We wrote and read a CSV with 3,000 columns and 30,000 rows, which is 90,003,000 cells and 761.9 MB on disk, and a streaming reader processed every row in 7.28 seconds. The same file became slow only when we loaded the whole table into memory at once, which took 16.82 seconds and 6,273 MB of peak memory on a machine with 15 GB of RAM. Column count is rarely the thing that breaks first; total cell count is.",
        },
      },
      {
        "@type": "Question",
        name: "What is Excel's column limit for a CSV?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Excel's worksheet grid holds 1,048,576 rows by 16,384 columns, so columns beyond the 16,384th have nowhere to land when a CSV opens in a worksheet. Microsoft's specifications page also notes that a cell can contain at most 32,767 characters. The file keeps all of its columns on disk, which is why a 40,000-column export can look complete in a text editor and truncated in Excel.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a limit on the size of a single field?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not in the format, but several readers impose one. Python's csv module defaults field_size_limit to 131,072 bytes, and a quoted 140,000-byte field raised \"field larger than field limit (131072)\" in our test. Raising the limit with csv.field_size_limit() and re-running let the same reader accept a 5,000,000-byte field in 0.10 seconds. Databases and cloud warehouse loaders often default to a max field length as well, so check the loader before blaming the file.",
        },
      },
      {
        "@type": "Question",
        name: "Why does a wide CSV make my computer run out of memory?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because a program that reads the whole table at once stores every cell as a separate object in memory. In our measurements the peak memory grew from 174 MB for 3,003,000 cells to 4,868 MB for 72,003,000 cells, between 59 and 71 bytes per cell, so a table with tens of millions of cells needs gigabytes of RAM even though the file on disk is far smaller. Reading row by row keeps memory flat, because each row is discarded before the next one is parsed.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know whether my wide file will load?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply rows by columns to get the cell count, then count on roughly 60 to 70 bytes of memory per cell for a loader that holds the whole table. A 500,000-row export with 300 columns is 150,000,000 cells, which is on the order of 10 GB, and that will fail on most laptops regardless of how well formed the CSV is. If the number is large, split the file by columns before it reaches the tool rather than after it crashes.",
        },
      },
      {
        "@type": "Question",
        name: "Which is more likely to break a CSV, rows or columns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Rows, for the tools people actually use. A streaming parser stays fast on enormous row counts because each row is handled on its own, and long files (rather than wide ones) are what run into per-file upload caps, memory ceilings in spreadsheet programs, and the row grid limit of 1,048,576 that Excel enforces. Wide files break in a different place: memory, because the cell count multiplies rows by columns instead of adding to it.",
        },
      },
      {
        "@type": "Question",
        name: "Does a wide CSV mean the export was done wrong?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Usually it means the data was stored in a wide layout rather than a long one. A monthly report with one column per day becomes 365 columns a year later and 730 the year after, and it keeps growing. Reshaping those columns into one date column and one value column keeps the cell count the same but removes the width problem, and it is the change that survives the next year of data.",
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
        <p className="text-blue-600 font-medium">📐 CSV Fundamentals · 7 min read</p>

        <h1>How Many Columns Can a CSV File Have?</h1>

        <p>
          A 3,000-column export opens fine on one machine and dies on another, and the file itself
          is identical in both cases. Nothing about the CSV changed. What changed is the program on
          the other end, which is where every column limit actually lives.
        </p>

        <h2>Quick answer</h2>

        <p>
          A CSV file has <strong>no column limit in the format</strong>. RFC 4180 defines a record as
          fields separated by commas and says each line should hold the same number of fields, but
          it never specifies a maximum. Every ceiling you meet is set by a reader: 16,384 columns in
          an Excel worksheet grid, 131,072 bytes per field in Python&apos;s csv module by default,
          or your own memory, which is what breaks first on wide files. In our tests a streaming
          parser read a 10,000,000-column row in 0.45 seconds, while a full 30,000-row by 3,000-column
          table needed 6,273 MB of RAM to load at once.
        </p>

        <h2>The format says nothing about how many columns</h2>

        <p>
          RFC 4180 is short and, on this question, silent. Section 2 defines a record as{" "}
          <code>field *(COMMA field)</code>, and the accompanying text says that within each record
          there may be one or more fields separated by commas, and that each line should contain the
          same number of fields throughout the file. There is no count in it, and the same document
          admits why: it describes the format that most implementations seem to follow, in a file
          where no formal specification existed.
        </p>

        <p>
          The MIME registration in the same RFC lists the optional parameters as charset and header.
          No column count, no row count, no size. So when a tool refuses your file for having too
          many columns, it is quoting its own limit, and it is worth finding out which one.
        </p>

        <h2>What we measured: a streaming reader on very wide rows</h2>

        <p>
          We wrote single-row CSVs of increasing width and read them back with a streaming parser
          (Python&apos;s <code>csv.reader</code>, which follows RFC 4180 quoting rules) on a machine
          with 4 vCPUs and 15 GB of RAM, on 2026-09-24.
        </p>

        <table>
          <thead>
            <tr>
              <th>Columns in one row</th>
              <th>Result</th>
              <th>Fields parsed</th>
              <th>Time</th>
              <th>Row size</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1,000</td>
              <td>parsed</td>
              <td>1,000</td>
              <td>0.00 s</td>
              <td>0.002 MB</td>
            </tr>
            <tr>
              <td>100,000</td>
              <td>parsed</td>
              <td>100,000</td>
              <td>0.00 s</td>
              <td>0.2 MB</td>
            </tr>
            <tr>
              <td>1,000,000</td>
              <td>parsed</td>
              <td>1,000,000</td>
              <td>0.03 s</td>
              <td>2.0 MB</td>
            </tr>
            <tr>
              <td>4,000,000</td>
              <td>parsed</td>
              <td>4,000,000</td>
              <td>0.16 s</td>
              <td>8.0 MB</td>
            </tr>
            <tr>
              <td>10,000,000</td>
              <td>parsed</td>
              <td>10,000,000</td>
              <td>0.45 s</td>
              <td>20.0 MB</td>
            </tr>
          </tbody>
        </table>

        <p>
          Ten million columns came back in under half a second. Column count on its own is not what
          breaks a parser, and a file that refuses to open is refusing for a different reason than
          you think. The useful number is not the column count but the total number of cells, which
          is what the next measurement shows.
        </p>

        <h2>What we measured: a realistic wide table</h2>

        <p>
          We generated a 30,000-row by 3,000-column CSV, the shape a wide monthly export takes, with
          unique numbers in every cell: 90,003,000 cells, 761.9 MB on disk.
        </p>

        <table>
          <thead>
            <tr>
              <th>How it was read</th>
              <th>Cells handled</th>
              <th>Time</th>
              <th>Peak memory</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Row by row (streaming)</td>
              <td>90,003,000</td>
              <td>7.28 s</td>
              <td>281 MB</td>
            </tr>
            <tr>
              <td>Whole table held in memory</td>
              <td>90,003,000</td>
              <td>16.82 s</td>
              <td>6,273 MB</td>
            </tr>
          </tbody>
        </table>

        <p>
          The same file, read two ways, is the difference between using a fifth of a gigabyte and
          using six. Every browser-based CSV tool that parses in the tab you are looking at is doing
          the second thing, which is why a file of this shape is where those tools start failing.
        </p>

        <p>
          We pushed the second method to find the trend, since the interesting part is the rate
          rather than the single figure:
        </p>

        <table>
          <thead>
            <tr>
              <th>Rows</th>
              <th>Cells</th>
              <th>File on disk</th>
              <th>Time to load</th>
              <th>Peak memory</th>
              <th>Bytes per cell</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1,000</td>
              <td>3,003,000</td>
              <td>21.8 MB</td>
              <td>0.36 s</td>
              <td>174 MB</td>
              <td>60.9</td>
            </tr>
            <tr>
              <td>4,000</td>
              <td>12,003,000</td>
              <td>92.4 MB</td>
              <td>1.60 s</td>
              <td>694 MB</td>
              <td>60.6</td>
            </tr>
            <tr>
              <td>8,000</td>
              <td>24,003,000</td>
              <td>195.4 MB</td>
              <td>3.15 s</td>
              <td>1,528 MB</td>
              <td>66.8</td>
            </tr>
            <tr>
              <td>16,000</td>
              <td>48,003,000</td>
              <td>401.4 MB</td>
              <td>6.66 s</td>
              <td>3,198 MB</td>
              <td>69.9</td>
            </tr>
            <tr>
              <td>24,000</td>
              <td>72,003,000</td>
              <td>607.4 MB</td>
              <td>12.96 s</td>
              <td>4,868 MB</td>
              <td>70.9</td>
            </tr>
          </tbody>
        </table>

        <p>
          Stay between 59 and 71 bytes per cell and the arithmetic does the rest. A 500,000-row
          export with 300 columns is 150,000,000 cells, which lands near 10 GB and will not fit on a
          laptop even though the CSV on disk is under 2 GB.{" "}
          <strong>Rows times columns is the number that decides whether a file opens</strong>, not
          either one alone. That is also why the row-limit advice you find elsewhere does not help
          here: a file can be comfortably inside every row ceiling and still be unopenable.
        </p>

        <h2>Where the limits actually sit</h2>

        <p>
          Once you stop expecting a limit in the file, the practical question becomes which reader
          is refusing you. These are the four that show up in most reports.
        </p>

        <table>
          <thead>
            <tr>
              <th>Layer</th>
              <th>Limit</th>
              <th>What you see</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CSV format (RFC 4180)</td>
              <td>none stated</td>
              <td>nothing: the file is fine</td>
            </tr>
            <tr>
              <td>Excel worksheet grid</td>
              <td>16,384 columns by 1,048,576 rows</td>
              <td>columns past XFD have nowhere to land; a cell holds at most 32,767 characters</td>
            </tr>
            <tr>
              <td>Streaming parsers (e.g. Python&apos;s csv)</td>
              <td>131,072 bytes per field by default</td>
              <td>
                <code>field larger than field limit (131072)</code>, measured on a 140,000-byte field
              </td>
            </tr>
            <tr>
              <td>Your machine</td>
              <td>about 60 to 71 bytes per cell</td>
              <td>the tab or the process dies with no error message at all</td>
            </tr>
          </tbody>
        </table>

        <p>
          The 16,384-column and 1,048,576-row figures, and the 32,767-character cell ceiling, are
          from Microsoft&apos;s Excel specifications and limits page. On the same page Microsoft
          notes that 32-bit Excel works inside 2 GB of virtual address space shared by Excel, the
          workbook and any add-ins, and that the 64-bit build imposes no hard file size limit and is
          bounded only by available memory and system resources. That is the same shape of limit we
          measured from the other side, one layer lower.
        </p>

        <h2>How to open a file that is too wide</h2>

        <ol>
          <li>
            <strong>Check the cell count before you check anything else.</strong> Rows times columns.
            If that number is in the tens of millions, plan for the memory rather than for the error
            message.
          </li>
          <li>
            <strong>Read it row by row if you can.</strong> Streaming kept our 90-million-cell file
            at 281 MB instead of 6,273 MB, and most languages and databases offer a streaming path
            for exactly this reason.
          </li>
          <li>
            <strong>Split by columns, not only by rows.</strong> Splitting by rows is what every
            CSV splitter does and it solves the grid limit, not the memory problem, because each part
            still has all the columns. If the width is the issue, cut the file into two sets of
            columns that share an ID column, and join them again in the tool that needs them.
          </li>
          <li>
            <strong>Reshape wide into long if the columns are repeating.</strong> One column per
            month or per sensor becomes one date column and one value column, by the same data in
            fewer cells, and the file stops growing by a column every period.
          </li>
        </ol>

        <p>
          With a file like that in hand, <Link href="/tools/csv-analyzer">the CSV analyzer</Link>{" "}
          will show you the header row, the field count per row, and whether any row disagrees with
          the header about how wide the file is. If the file also opens with{" "}
          <Link href="/blog/csv-opens-in-one-column">everything in a single column</Link> or with{" "}
          <Link href="/blog/csv-scientific-notation">long numbers rewritten as 1.23E+15</Link>, those
          come from the same reader making guesses and are worth fixing in the same pass.
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
            Measuring a wide file and splitting it are both short scripts. These cover the cases
            where you would rather not write one:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — generating a 30,000 by 3,000 table and reading it two
              ways is a few lines, and re-running it on your own export tells you which limit you
              are about to hit before the tool does.{" "}
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
              <strong>Stack AI</strong> — if wide exports arrive on a schedule, a workflow can split
              or reshape them on arrival, so an export that doubles in width fails the workflow
              instead of landing in the report.{" "}
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
              <strong>Softr</strong> — when the same wide sheet is re-sent every month, holding the
              records in a no-code app once removes the round trip through a text file altogether.{" "}
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
          <h2 className="text-2xl font-bold mb-3">See How Wide Your File Really Is</h2>
          <p className="text-blue-100 mb-5">
            Paste the first rows and check the field count per row before the tool refuses the whole
            file.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/csv-analyzer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open the CSV Analyzer
              </Button>
            </Link>
            <Link href="/blog/open-csv-file-too-big-for-excel">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Too Many Rows Instead?
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          The record, field and header wording is from RFC 4180, section 2, and the absence of a
          maximum field count from the same section and its MIME registration in section 3. The
          16,384-column, 1,048,576-row, 32,767-character and 2 GB virtual address space figures are
          from Microsoft&apos;s Excel specifications and limits page, retrieved on 2026-09-24. Every
          timing and memory figure in the two measurement tables comes from scripts we wrote and ran
          on 2026-09-24 on a 4-vCPU, 15 GB machine with Python 3.13.5, using the standard library
          <code>csv</code> module; the raw output is kept with our other measurement records.
        </p>

        <RelatedPosts slug="csv-column-limit" />
      </article>
    </>
  );
}
