import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";
import { FaqSection } from "@/components/blog/faq-section";

export const metadata: Metadata = {
  title: "CSV to MySQL: Why Rows Go Missing on Import (2026)",
  description:
    "LOAD DATA expects tabs by default, so a plain CSV lands in one column. The four import routes into MySQL, and the settings that silently drop rows.",
  keywords: [
    "csv to mysql",
    "import csv into mysql",
    "csv to mysql converter",
    "load data infile",
    "load data local infile",
    "mysql import csv command line",
    "mysql workbench import csv",
    "csv to mysql table",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/csv-to-mysql" },
  openGraph: {
    title: "CSV to MySQL Without Losing Rows",
    description:
      "Why the whole line lands in column one, why local loading is refused, and the four routes ranked by how many rows they can actually take.",
    type: "article",
    url: "https://nocodecsv.com/blog/csv-to-mysql",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-16",
    modifiedTime: "2026-09-16",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV to MySQL: Why Rows Go Missing on Import",
    description:
      "The tab default, the local_infile flag, and the four failures that leave you with half a table.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CSV to MySQL: Why Rows Go Missing on Import (2026)",
  description:
    "LOAD DATA expects tab-separated input by default, so an unqualified statement puts the whole CSV line into one column. Four import routes and the settings that drop rows quietly.",
  url: "https://nocodecsv.com/blog/csv-to-mysql",
  datePublished: "2026-09-16",
  dateModified: "2026-09-16",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/csv-to-mysql",
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
      name: "CSV to MySQL",
      item: "https://nocodecsv.com/blog/csv-to-mysql",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why did my whole CSV file land in one column?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because LOAD DATA has no idea your file is a CSV. The MySQL manual states that with no FIELDS or LINES clause the defaults behave as FIELDS TERMINATED BY a tab, ENCLOSED BY an empty string, ESCAPED BY a backslash and LINES TERMINATED BY a newline. A comma-separated line therefore holds no tab, so the entire line is one field and everything goes into column one. Add FIELDS TERMINATED BY ',' to the statement and the columns line up.",
      },
    },
    {
      "@type": "Question",
      name: "Why does LOAD DATA LOCAL INFILE say loading local data is disabled?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because both ends have to agree and neither one is on by default any more. The MySQL manual is explicit that local_infile is disabled by default on the server, and that this changed from earlier releases, so an upgrade can switch local loading off without anyone editing a config file. The client has to opt in as well, for example by starting the mysql client with local-infile enabled. Setting the server variable alone leaves the client still refusing.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between LOAD DATA INFILE and LOAD DATA LOCAL INFILE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Without LOCAL, the server opens the file itself, so the path is a path on the database server, the account needs the FILE privilege and secure_file_priv has to permit the directory. With LOCAL, the client reads the file from your machine and streams it over the connection, so the path is a path on your laptop and no FILE privilege is involved. The LOCAL variant carries a documented risk: a server you do not control can ask the client for other files that the client can read, which is the reason local loading is off by default.",
      },
    },
    {
      "@type": "Question",
      name: "How do I stop the header row from becoming a data row?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Add IGNORE 1 LINES to the statement. Without it the header is loaded as the first record, and the damage is worse than a stray row: a name column gets a varchar value where the header text was, and a decimal column receives the word total, which under MySQL's default strict mode raises an error or a truncation warning depending on the value. If the file has a couple of banner lines before the header, put the count in the same clause.",
      },
    },
    {
      "@type": "Question",
      name: "Why were some rows imported and others skipped with no error?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Run SHOW WARNINGS immediately after the statement, because that is where the answer is. A row containing fewer fields than the table has columns produces a warning and is skipped rather than failing the whole load, and rows whose values a column cannot accept are either truncated or rejected depending on the SQL mode. MySQL 8.0 ships with a default SQL mode that includes STRICT_TRANS_TABLES, NO_ZERO_IN_DATE and NO_ZERO_DATE, so an invalid date such as 0000-00-00 or 31 February stops the row instead of being stored as a zero date. The count of skipped rows is in the warnings, not in an exception.",
      },
    },
    {
      "@type": "Question",
      name: "How do I handle commas and quotes inside the data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tell the statement about the CSV quoting rules and let the parser deal with it. Add OPTIONALLY ENCLOSED BY with a double quote character, and LOAD DATA recognises a field that opens with that character and treats a doubled quote inside it as a literal quote, which is exactly what RFC 4180 specifies. A quoted field may also contain a line break, and that no longer ends the record, so a single row can span several physical lines in the file. A script that splits the file on newlines before importing cannot do this, which is one good reason to let the database read the file instead of writing INSERT statements yourself.",
      },
    },
    {
      "@type": "Question",
      name: "What is the fastest way to import a very large CSV into MySQL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use LOAD DATA rather than INSERT statements, and use MySQL Shell's parallel table import utility, util.importTable, when the file is measured in gigabytes. It splits the file into chunks and loads them over several threads with LOAD DATA LOCAL INFILE underneath, which is the only mainstream route into MySQL that uses more than one connection. Two further savings apply to any route: create the table without its secondary indexes, load, then add the indexes afterwards, and avoid autocommit overhead on row-by-row inserts by sending them in batches inside one transaction.",
      },
    },
    {
      "@type": "Question",
      name: "Why does my import fail with Data truncated for column?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Usually a type or length mismatch rather than a corrupt file. A column declared as INT UNSIGNED receives a negative value, a DECIMAL(5,2) receives 1234.56, a VARCHAR(20) receives a 40-character string, or a DATETIME receives text in a format the parser does not accept. Under strict mode MySQL rejects the value, and outside strict mode it stores a rounded or clipped version and logs a warning, which is how tables end up with wrong numbers and a clean import log. Check the declared widths against the longest value in each column before loading rather than after.",
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
        <p className="text-blue-600 font-medium">🗄️ File Operations · 10 min read</p>
        <h1>CSV to MySQL: Why Rows Go Missing on Import (2026)</h1>

        <p>
          <strong>
            Start with an explicit FIELDS clause. LOAD DATA defaults to tab-separated input, so a
            comma-separated file loaded without one puts the whole line into the first column. If
            the error mentions local data, the server variable local_infile is off by default in
            current releases and the client needs to opt in too. After that, most remaining
            problems are type widths, encodings and warnings that nobody read.
          </strong>{" "}
          The four routes are below, followed by the failure list that accounts for nearly every
          half-loaded table.
        </p>

        <p>
          The complaints in r/SQL and r/dataanalysis tend to be about a partial load rather than a
          refusal. One thread on importing CSV into MySQL contains a line that sums up the
          experience:{' '}
          <em>
            &ldquo;MySQL Workbench not importing all rows from csv&rdquo;
          </em>
          , followed by the equally common &ldquo;best way to import csv file into Mysql&rdquo;,
          where the accepted answer is that mysqlimport cuts the data and the wizard behaves
          differently again. The file is rarely the problem — the statement usually is.
        </p>

        <h2>The default that catches almost everyone</h2>

        <p>
          LOAD DATA is an old statement with old defaults, and the manual says so in as many words:
          with no FIELDS or LINES clause, the behaviour is the same as{" "}
          <code>FIELDS TERMINATED BY &apos;\t&apos;</code>,{" "}
          <code>ENCLOSED BY &apos;&apos;</code>, <code>ESCAPED BY &apos;\\&apos;</code> and{" "}
          <code>LINES TERMINATED BY &apos;\n&apos;</code>. Tab separated. So this fails:
        </p>

        <pre>
          <code>{`-- Loads every line, intact, into the first column
LOAD DATA LOCAL INFILE '/tmp/customers.csv'
INTO TABLE customers;`}</code>
        </pre>

        <p>
          And this works, because the file now describes itself to the parser:
        </p>

        <pre>
          <code>{`LOAD DATA LOCAL INFILE '/tmp/customers.csv'
INTO TABLE customers
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\\r\\n'
IGNORE 1 LINES
(@id, @name, @signup)
SET id     = NULLIF(@id, ''),
    name   = TRIM(@name),
    signup = STR_TO_DATE(@signup, '%Y-%m-%d');`}</code>
        </pre>

        <p>
          Five of those clauses are doing real work. <code>CHARACTER SET utf8mb4</code> stops the
          connection default from mangling accented names.{" "}
          <code>OPTIONALLY ENCLOSED BY</code> makes RFC 4180 quoting work, including a doubled
          quote inside a quoted field and a line break inside one.{" "}
          <code>LINES TERMINATED BY &apos;\r\n&apos;</code> matches a file exported on Windows,
          where a bare newline can leave a carriage return glued to the last column.{" "}
          <code>IGNORE 1 LINES</code> skips the header. The trailing SET block reads each field
          into a user variable first, so you can turn an empty string into a real NULL and parse
          the date explicitly instead of hoping MySQL guesses the format.
        </p>

        <h2>Why local loading is refused</h2>

        <p>
          LOAD DATA without LOCAL means the server opens the file, which requires the FILE
          privilege and a directory allowed by <code>secure_file_priv</code>. LOAD DATA LOCAL
          INFILE means your client reads the file and streams it, which needs neither, and is
          consequently the variant people reach for.
        </p>

        <p>
          The manual states that <code>local_infile</code> is disabled by default and notes that
          this changed from earlier versions, so a server upgrade turns it off on its own. Both
          sides must agree: enabling the server variable while the client still refuses gives the
          same error. The client opt-in is what <code>--local-infile=1</code> does when you start
          the mysql client, and MySQL Workbench 8.0 tightened the same behaviour, which is one
          reason the wizard started failing for people who had used it for years.
        </p>

        <p>
          The reason for the caution is documented as well: with LOCAL, a server you do not control
          can request files from your machine, not just the one you named. On a shared or
          third-party database that is a real consideration rather than a theoretical one. On the
          database you run yourself, enabling it for the duration of the import and turning it off
          afterwards is a reasonable habit.
        </p>

        <h2>The four routes, and what each one is for</h2>

        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>File lives</th>
              <th>Needs</th>
              <th>Realistic size</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>LOAD DATA INFILE</code>
              </td>
              <td>On the server</td>
              <td>FILE privilege, <code>secure_file_priv</code></td>
              <td>Very large</td>
              <td>Fastest, and awkward if you do not have shell access</td>
            </tr>
            <tr>
              <td>
                <code>LOAD DATA LOCAL INFILE</code>
              </td>
              <td>On your machine</td>
              <td>Server and client both allow local loading</td>
              <td>Large</td>
              <td>The usual choice for a laptop to a remote server</td>
            </tr>
            <tr>
              <td>
                <code>mysqlimport</code>
              </td>
              <td>On your machine</td>
              <td>Same as local loading</td>
              <td>Large</td>
              <td>Command-line front end to LOAD DATA; the table name comes from the file name</td>
            </tr>
            <tr>
              <td>
                <code>util.importTable</code> in MySQL Shell
              </td>
              <td>On your machine</td>
              <td>MySQL Shell</td>
              <td>Largest</td>
              <td>Chunks the file and loads it over several threads</td>
            </tr>
            <tr>
              <td>Workbench import wizard</td>
              <td>On your machine</td>
              <td>A GUI session</td>
              <td>Thousands of rows</td>
              <td>Convenient and clickable; the slowest of the five</td>
            </tr>
          </tbody>
        </table>

        <p>
          Two things are worth knowing about the parallel utility, since it is the least familiar
          option. It splits one file into chunks and loads them concurrently with LOAD DATA LOCAL
          INFILE underneath, so it is not a different engine, just several of the same one at once.
          It also means a file with a syntax error inside a quoted field can fail in a chunk rather
          than at the top, and the error message points at the chunk boundary rather than the bad
          line.
        </p>

        <h2>Create the table first, and read the header twice</h2>

        <p>
          LOAD DATA does not create tables for you, and this is where a lot of imports go wrong. A
          wizard that infers types from the first fifty rows will call a postcode a number and a
          money column a float. Declare the types deliberately:
        </p>

        <pre>
          <code>{`CREATE TABLE customers (
  id        VARCHAR(20)  NOT NULL PRIMARY KEY,  -- text: keeps leading zeros
  name      VARCHAR(120) NOT NULL,
  signup    DATE         NULL,
  revenue   DECIMAL(12,2) NULL                 -- never FLOAT for money
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}</code>
        </pre>

        <p>
          Identifiers are text even when they look numeric. A customer number of
          0001234567 becomes 1234567 in an INT column, and an 18-digit reference number loses its
          last digits in a float. Money is DECIMAL, not FLOAT or DOUBLE, because binary floating
          point cannot represent 0.10 exactly and the rounding error accumulates over a column of
          thousands of rows. Declare the table with the column widths matching the longest value in
          the file, since a VARCHAR that is too short is a truncation warning today and a rejected
          row once strict mode is on.
        </p>

        <p>
          If the CSV contains accented characters or anything outside the Latin-1 range, the table
          and the connection both need <code>utf8mb4</code>. That is four bytes per character, and
          it covers characters outside the basic multilingual plane — the older three-byte{" "}
          <code>utf8</code> in MySQL could not store those. Picking the three-byte form today is
          how an import half-succeeds with question marks in the text and no error at all.
        </p>

        <h2>When rows go missing</h2>

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
              <td>Whole line in column one</td>
              <td>Default separator is a tab</td>
              <td>
                <code>FIELDS TERMINATED BY &apos;,&apos;</code>
              </td>
            </tr>
            <tr>
              <td>Header text sitting in the first row</td>
              <td>No IGNORE clause</td>
              <td>
                <code>IGNORE 1 LINES</code>
              </td>
            </tr>
            <tr>
              <td>Some rows absent, no error shown</td>
              <td>Field count mismatch, or values a column refused</td>
              <td>
                <code>SHOW WARNINGS</code> straight after the load
              </td>
            </tr>
            <tr>
              <td>Last column full of stray characters</td>
              <td>Windows line endings read as a bare newline</td>
              <td>
                <code>LINES TERMINATED BY &apos;\r\n&apos;</code>
              </td>
            </tr>
            <tr>
              <td>Rows split in the middle of a field</td>
              <td>Comma or line break inside a quoted field</td>
              <td>
                Add <code>OPTIONALLY ENCLOSED BY</code>
              </td>
            </tr>
            <tr>
              <td>Accented names replaced by question marks</td>
              <td>Connection or table charset is not utf8mb4</td>
              <td>
                Set both, and see{" "}
                <Link href="/blog/fix-garbled-csv-in-excel">garbled text fixes</Link>
              </td>
            </tr>
            <tr>
              <td>Load stops on a duplicate key</td>
              <td>PRIMARY KEY already holds the value</td>
              <td>
                Use <code>REPLACE</code> or <code>IGNORE</code>, or load into a staging table
              </td>
            </tr>
            <tr>
              <td>Import dies partway through a big batch</td>
              <td>Statement exceeded <code>max_allowed_packet</code></td>
              <td>Load from a file rather than via INSERT batched in the client</td>
            </tr>
          </tbody>
        </table>

        <p>
          The third row of that table is the expensive one. A row with fewer fields than the table
          has columns does not stop a LOAD DATA statement; it produces a warning and the row is
          skipped. Because the statement itself returns successfully, a script that checks only for
          an exception reports success. Compare <code>SELECT COUNT(*)</code> against the number of
          lines in the file, minus the header, after every import. When the two disagree, the
          warnings hold the reason.
        </p>

        <p>
          The duplicate key case deserves a word too, because it interacts with the route you
          chose. A file reloaded after a failed attempt usually contains rows that did arrive the
          first time, so the second run hits the primary key. Loading into a staging table with no
          constraints and then inserting with a join is slower to write and much easier to re-run,
          which matters more than the extra minute when a partner sends a corrected file at 5pm.
        </p>

        <h2>Making a big import quicker</h2>

        <p>
          Three changes cover most of it. Load into a table without secondary indexes and add them
          afterwards, because every index has to be updated for every row. Use LOAD DATA rather
          than INSERT statements, since a statement that carries thousands of rows beats thousands
          of statements, and the client-side packet limit caps how many rows fit in one anyway. And
          if you must insert row by row, wrap the batch in one transaction instead of committing
          each row, which removes a disk flush per row.
        </p>

        <p>
          Once the data is in, the questions usually change from how to load it to what it says. If
          the CSV was a one-off that will not be reloaded, it is often quicker to ask the question
          of the file directly with the{" "}
          <Link href="/tools/csv-analyzer">CSV analyzer</Link> than to build a schema for it.
          Related ground on this site:{" "}
          <Link href="/blog/csv-to-sql">CSV to SQL</Link> covers turning the file into INSERT
          statements for a database you cannot reach from the command line,{" "}
          <Link href="/blog/query-csv-with-sql">querying a CSV with SQL</Link> skips MySQL
          entirely by using DuckDB or SQLite, and{" "}
          <Link href="/blog/change-csv-delimiter">changing the delimiter</Link> is the fix when the
          separator is something other than a comma in the first place. For SQLite rather than
          MySQL, <Link href="/blog/import-csv-to-sqlite-free">the .import route</Link> has no
          privileges to configure at all.
        </p>

        <FaqSection items={faqJsonLd.mainEntity} />

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            The import is free with the MySQL client. These three help when the file arrives
            monthly, from a partner, with a new column every time:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the loader script is twenty lines until someone sends
              a file with a different column order, and a $10-a-month subscription covering 19+
              models is cheaper than one evening of print debugging a LOAD DATA statement.{" "}
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
              <strong>Stack AI</strong> — if the CSV lands in cloud storage on a schedule, a
              workflow can pick it up, validate the column count and load it, so a bad file fails
              loudly instead of importing half a table.{" "}
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
              <strong>Softr</strong> — when the point of the import is that colleagues can look
              rows up, publishing a searchable page over the same database beats teaching everyone
              a SELECT statement.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Not Ready for a Schema?</h2>
          <p className="text-blue-100 mb-5">
            Upload the CSV and ask your question in plain language. Column types, indexes and
            import flags are somebody else&apos;s problem.
          </p>
          <Link href="/tools/csv-analyzer">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Analyze Your CSV Free
            </Button>
          </Link>
        </div>

        <RelatedPosts slug="csv-to-mysql" />
      </article>
    </>
  );
}
