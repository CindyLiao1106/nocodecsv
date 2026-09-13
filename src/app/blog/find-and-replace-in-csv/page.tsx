import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Find and Replace in a CSV: 4 Ways That Work (2026)",
  description:
    "Replace values across a CSV with Excel, Google Sheets, sed or Python, plus the reason a whole-file text replace can corrupt a file with quoted fields.",
  keywords: [
    "find and replace in csv",
    "replace text in csv",
    "bulk replace in csv",
    "replace values in csv file",
    "edit csv online",
    "search and replace csv",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/find-and-replace-in-csv" },
  openGraph: {
    title: "Find and Replace in a CSV: 4 Ways That Work | NoCodeCSV",
    description:
      "Excel, Sheets, sed and Python compared, with the quoting trap that turns a replace into a broken file.",
    type: "article",
    url: "https://nocodecsv.com/blog/find-and-replace-in-csv",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-13",
    modifiedTime: "2026-09-13",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find and Replace in a CSV (2026)",
    description: "Four methods, and the quoting trap to avoid.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Find and Replace in a CSV: 4 Ways That Work (2026)",
  description:
    "Replace values across a CSV with Excel, Google Sheets, sed or Python, plus the reason a whole-file text replace can corrupt a file with quoted fields.",
  url: "https://nocodecsv.com/blog/find-and-replace-in-csv",
  datePublished: "2026-09-13",
  dateModified: "2026-09-13",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: {
      "@type": "ImageObject",
      url: "https://nocodecsv.com/icon.png",
    },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/find-and-replace-in-csv",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Find and Replace in a CSV",
      item: "https://nocodecsv.com/blog/find-and-replace-in-csv",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I find and replace in a CSV file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Open the file in Excel or Google Sheets and press Ctrl+H, or run a command over the text. Excel gives you Match case and Match entire cell contents options and can apply the change to a sheet or the whole workbook. Google Sheets offers the same shortcut with an optional regular expression mode. In the terminal, sed -i 's|old|new|g' file.csv replaces every occurrence. In Python, a pandas column has str.replace, which takes a literal string when you pass regex=False.",
      },
    },
    {
      "@type": "Question",
      name: "Why is a whole-file text replace dangerous on a CSV?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because a CSV is not plain text. RFC 4180 allows a field to contain a comma, a double quote or a line break as long as the field is wrapped in double quotes. A replace that runs over the raw characters cannot tell a value from syntax, so changing a comma or a quote, or matching a string that happens to appear inside a quoted multi-line field, can change the structure of the file. Edit the values inside a parsed column instead of the file text whenever the data has quoted fields.",
      },
    },
    {
      "@type": "Question",
      name: "Does Excel replace across the whole workbook?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It can. In the Find and Replace dialog, the Within dropdown offers Sheet or Workbook, so you can push a change through every sheet at once. Two defaults are worth checking before you click Replace All: Match case is off, so a search for banana also hits Banana, and Match entire cell contents is off, so a search for banana also rewrites part of banana bread. Both boxes are in the Options section of the dialog. Excel also caps a sheet at 1,048,576 rows, so a bigger CSV is trimmed before the replace ever runs.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use regular expressions in Google Sheets find and replace?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, there is a Search using regular expressions checkbox in the Find and replace dialog. It uses RE2, Google's regular expression engine, so the common patterns work but two features do not exist: lookbehind and backreferences. A pattern like (?<=USD )\\d+ will not run, and a pattern that refers back to a captured group by number will not either. If you need lookbehind, do the replacement in Python with the re module instead, which supports both.",
      },
    },
    {
      "@type": "Question",
      name: "How do I replace values in only one column?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Do not replace over the file; replace over one column of a parsed table. In pandas, df['status'] = df['status'].str.replace('N/A', 'Unknown', regex=False) touches nothing outside that column. In SQL, an UPDATE with a WHERE clause on the same column is the equivalent. In a spreadsheet, select the column range before opening Find and Replace, because Excel and Sheets both restrict Replace All to the current selection when a range is selected. Scoping the change is what prevents a common word in one column from being rewritten everywhere else.",
      },
    },
    {
      "@type": "Question",
      name: "How do I make a find and replace case-insensitive?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In Excel and Google Sheets, case-insensitivity is the default: Match case is a separate checkbox and it starts off. In Python, re.sub with the re.IGNORECASE flag does it, and in pandas the case argument on str.replace controls it. When you are normalising values before a merge, decide the case deliberately rather than relying on a default, because a status column holding both Open and open will fail to join against a lookup table that only ever lists one of them.",
      },
    },
    {
      "@type": "Question",
      name: "How do I replace text in a huge CSV without opening it in Excel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use a streaming tool. sed -i edits a file in place without loading it into a spreadsheet, and Python's csv module reads and writes one record at a time, so memory stays flat no matter how large the file is. DuckDB can also rewrite a CSV with a SELECT that applies a replace function to one column. Excel is a poor fit above its 1,048,576-row limit because it truncates on open and gives no warning that rows were dropped.",
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
      <p className="text-blue-600 font-medium">🔁 Data Cleaning · 6 min read</p>
      <h1>Find and Replace in a CSV: 4 Ways That Work (2026)</h1>
      <p><strong>To find and replace in a CSV, edit the values inside a parsed table rather than the raw text of the file.</strong> In Excel or Google Sheets, press <code>Ctrl</code> plus <code>H</code> and use Replace All. In the terminal, <code>sed -i &apos;s|old|new|g&apos; data.csv</code> does it without opening anything. In Python, <code>df[&quot;status&quot;].str.replace(&quot;N/A&quot;, &quot;Unknown&quot;, regex=False)</code> scopes the change to one column. The distinction matters because a CSV is not plain text: a field is allowed to contain commas, quotes and line breaks, so a replace that runs over raw characters can rewrite the structure of the file as well as the data.</p>

      <h2>Why a Raw Text Replace Can Break a CSV</h2>
      <p>RFC 4180 lets a field hold a comma, a double quote or a line break, as long as the whole field is wrapped in double quotes and any internal quote is doubled. That rule is the reason a CSV can carry a whole paragraph in one cell, and it is also the reason character-level editing is risky.</p>
      <ul>
        <li><strong>Replacing a comma</strong> changes the number of columns in every row it touches. A field that used to be one value is now two.</li>
        <li><strong>Replacing a quote</strong> can unbalance the quotes around a field, and everything after it is parsed differently. One stray edit reshuffles the columns for the rest of the row.</li>
        <li><strong>Matching a common word</strong> hits it wherever it appears, including inside a quoted field that has nothing to do with the column you had in mind.</li>
      </ul>
      <p>None of this means the job is hard. It means the edit belongs at the level of field values, where the tool knows what a value is. Every method below does that except <code>sed</code>, which is included because it is genuinely useful and worth using with eyes open.</p>

      <h2>Method 1: Excel</h2>
      <p>Excel finds and replaces within a selection, a sheet, or the whole workbook.</p>
      <ol>
        <li>Press <code>Ctrl</code> plus <code>H</code>.</li>
        <li>Type the Find what and Replace with values.</li>
        <li>Open Options. Check <strong>Match entire cell contents</strong> if a search for <code>N/A</code> should not also rewrite <code>N/A - pending</code>.</li>
        <li>Set Within to Sheet or Workbook, then click Replace All.</li>
      </ol>
      <p>Two defaults catch people out. Match case is off, so the search is case-insensitive unless you tick it. And if you have a range selected when you open the dialog, Replace All is limited to that range, which is usually what you want but is worth knowing rather than discovering. Excel also stops at 1,048,576 rows, so a larger file is silently truncated on open before any replace runs.</p>

      <h2>Method 2: Google Sheets</h2>
      <p>The same <code>Ctrl</code> plus <code>H</code> opens Find and replace, and it adds one option Excel does not have: <strong>Search using regular expressions</strong>.</p>
      <p>That regex mode runs on RE2, Google&apos;s regular expression engine. Common patterns work, and two features are simply absent: lookbehind and backreferences. A pattern that tries to look behind a currency symbol, or to reuse a captured group by number, will not run. When you need either, move the job to Python, where the <code>re</code> module supports both.</p>
      <p>Sheets also lets you restrict the search to a range by selecting it first, and it will offer to search within formulas rather than values, which is a useful way to fix a formula typo across a sheet.</p>

      <h2>Method 3: The Terminal, With a Backup</h2>
      <p><code>sed</code> rewrites a file in place and does not care about quoting at all. Use it on columns where the replaced text cannot contain a delimiter or a quote, and take a copy first.</p>
      <pre><code>{`cp data.csv data.csv.bak
sed -i 's|N/A|Unknown|g' data.csv`}</code></pre>
      <p>The pipe character is the delimiter above, which avoids escaping the slashes that appear inside dates and file paths. On macOS the same command needs an empty argument after <code>-i</code>, because the BSD version of sed requires it and the GNU version does not:</p>
      <pre><code>{`sed -i '' 's|N/A|Unknown|g' data.csv   # macOS / BSD`}</code></pre>
      <p>That difference is the single most common reason a copy-and-pasted sed command fails on a laptop. If sed is the wrong tool for the shape of your data, <code>perl -i -pe &apos;s|old|new|g&apos; data.csv</code> is the usual substitute and handles larger files more comfortably.</p>

      <h2>Method 4: Python, the Version That Knows About Columns</h2>
      <p>This is the method to use when the data has quoted fields and the change should only touch one column.</p>
      <pre><code>{`import pandas as pd

df = pd.read_csv("orders.csv", dtype=str)
df["status"] = df["status"].str.replace("N/A", "Unknown", regex=False)
df.to_csv("orders_clean.csv", index=False)`}</code></pre>
      <p>The <code>regex=False</code> argument is not decoration. pandas treats the search string as a regular expression by default, so a literal value containing a dot, a bracket or a plus sign matches something else or raises an error. Passing <code>regex=False</code> says plainly that you mean the characters you typed.</p>
      <p>When you do want a pattern, <code>re.sub</code> is the tool, and it needs the backslashes written as backslashes:</p>
      <pre><code>{String.raw`import re

text = re.sub(r"\s+", " ", text)      # collapse runs of whitespace
text = re.sub(r"^\s+", "", text)      # strip leading space`}</code></pre>
      <p>Working on a parsed table also means the file structure takes care of itself. If a replacement introduces a comma or a quote into a value, the writer quotes that field on the way out, so the row still has the right number of columns.</p>

      <h2>Which Method Fits</h2>
      <table>
        <thead><tr><th>Method</th><th>Regex</th><th>Can scope to one column</th><th>Safe with quoted fields</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td>Excel</td><td>No</td><td>Yes, select the column first</td><td>Yes</td><td>Small files, one-off edits</td></tr>
          <tr><td>Google Sheets</td><td>Yes, RE2</td><td>Yes, select the range</td><td>Yes</td><td>Pattern matches, shared sheets</td></tr>
          <tr><td>sed</td><td>Yes, POSIX</td><td>No</td><td>No</td><td>Simple literal swaps, big files</td></tr>
          <tr><td>Python / pandas</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Messy data, repeatable jobs</td></tr>
          <tr><td>DuckDB</td><td>Yes</td><td>Yes</td><td>Yes</td><td>Renaming a CSV without loading it</td></tr>
        </tbody>
      </table>

      <h2>Restrict the Change to the Column You Meant</h2>
      <p>Most find-and-replace accidents are not exotic. They are a word like <code>Open</code> or <code>None</code> that means one thing in a status column and something else in a notes column, rewritten everywhere because the tool was pointed at the whole file. Two habits avoid nearly all of it: select the column before you replace in a spreadsheet, and in code name the column explicitly instead of operating on the table.</p>
      <p>It is also worth checking what you are about to change. A word you think is rare may be load-bearing in a column you have not read. The free <Link href="/tools/csv-analyzer">CSV analyzer</Link> shows unique values and fill rates per column, so you can see how many rows a replacement will actually touch before you run it. For a broader pass over a messy export, the <Link href="/blog/how-to-clean-dirty-csv-data">dirty data checklist</Link> puts replacement in the right order relative to duplicates, blanks and encoding fixes, and the <Link href="/blog/remove-duplicates-from-csv">duplicate removal guide</Link> is the next step if the same value arrives under several spellings.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>How do I find and replace in a CSV file?</h3>
      <p>Press <code>Ctrl</code> plus <code>H</code> in Excel or Google Sheets and use Replace All, or run <code>sed -i &apos;s|old|new|g&apos; data.csv</code> in the terminal, or use a pandas column with <code>str.replace(..., regex=False)</code>. Edit values inside a parsed column whenever the file has quoted fields.</p>
      <h3>Why is a whole-file text replace dangerous on a CSV?</h3>
      <p>Because a CSV is not plain text. RFC 4180 allows a field to contain a comma, a quote or a line break inside double quotes, so a character-level replace cannot tell a value from syntax. Replacing a comma or a quote can change the column count of every row it touches.</p>
      <h3>Does Excel replace across the whole workbook?</h3>
      <p>The Within dropdown in the Find and Replace options offers Sheet or Workbook, so yes. Check Match case and Match entire cell contents first: both default to off, which means a search for <code>banana</code> also hits <code>Banana</code> and rewrites part of <code>banana bread</code>.</p>
      <h3>Can I use regular expressions in Google Sheets find and replace?</h3>
      <p>Yes, via the Search using regular expressions checkbox. It uses RE2, which supports common patterns but has no lookbehind and no backreferences. Where you need those, use Python&apos;s <code>re</code> module instead.</p>
      <h3>How do I replace values in only one column?</h3>
      <p>Select the column range before opening Find and Replace in a spreadsheet, or name the column in code: <code>df[&quot;status&quot;].str.replace(...)</code>. In SQL, an UPDATE with a WHERE clause on the same column. The scoping is what stops a common word being rewritten across every column.</p>
      <h3>How do I make a find and replace case-insensitive?</h3>
      <p>Excel and Sheets are case-insensitive by default, with Match case as an opt-in. In Python, <code>re.sub</code> takes <code>re.IGNORECASE</code> and pandas has a <code>case</code> argument. Decide it deliberately when normalising values for a merge, because <code>Open</code> and <code>open</code> will not join against a lookup table that lists only one of them.</p>
      <h3>How do I replace text in a huge CSV without opening it in Excel?</h3>
      <p>Use something that streams. <code>sed -i</code> edits in place, and Python&apos;s csv module processes one record at a time with flat memory use. DuckDB can rewrite a CSV from a SELECT with a replace function applied to one column. Excel is the wrong tool above 1,048,576 rows because it truncates silently.</p>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
        <p className="text-slate-600 mb-4">Want to go further with AI-powered data work? These tools pair well with NoCodeCSV:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — if the same cleanup runs every time a file lands, an AI workflow can apply the replacements on arrival and write the corrected file back, with no one opening a spreadsheet.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>OpenCode Go</strong> — the pandas snippet above is short, and a $10-a-month coding subscription is enough to write and adjust that kind of script; the plan covers 19+ models including DeepSeek and GLM.{' '}
            <a href="https://opencode.ai/go?ref=64V3FDAF5T" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try OpenCode Go</a>
          </li>
          <li>
            <strong>Softr</strong> — once the status values are consistent, the table is worth more as a searchable app than as a file people copy; Softr builds that from the same data without code.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you. Links currently point to each vendor&apos;s official page until our dedicated tracking links are registered. OpenCode Go uses our referral link.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">See the Values Before You Replace Them</h2>
        <p className="text-blue-100 mb-5">Run the free CSV analyzer to see unique values and fill rates per column, so you know how many rows a replacement will touch.</p>
        <Link href="/tools/csv-analyzer"><Button size="lg" variant="secondary" className="text-base px-8">Analyze Your CSV Free</Button></Link>
      </div>
      <RelatedPosts slug="find-and-replace-in-csv" />
    </article>
    </>
  );
}
