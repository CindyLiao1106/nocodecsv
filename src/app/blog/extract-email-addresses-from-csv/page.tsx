import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "How to Extract Emails From a CSV or Spreadsheet (2026)",
  description:
    "Pull email addresses out of a CSV column with one formula or one line of Python, then clean and dedupe the list. Includes the anti-spam rules that apply.",
  keywords: [
    "extract email addresses from csv",
    "extract emails from spreadsheet",
    "get emails from csv",
    "email extractor csv",
    "regex extract email excel",
    "extract emails from csv python",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/extract-email-addresses-from-csv" },
  openGraph: {
    title: "How to Extract Emails From a CSV or Spreadsheet (2026) | NoCodeCSV",
    description:
      "Emails buried in a notes column can be pulled out with a formula or a script. Here is how to extract, clean and dedupe them.",
    type: "article",
    url: "https://nocodecsv.com/blog/extract-email-addresses-from-csv",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-12",
    modifiedTime: "2026-09-12",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Extract Emails From a CSV (2026)",
    description: "One formula or one Python line, plus the cleaning steps that make the list usable.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Extract Emails From a CSV or Spreadsheet (2026)",
  description:
    "Pull email addresses out of a CSV column with one formula or one line of Python, then clean and dedupe the list. Includes the anti-spam rules that apply.",
  url: "https://nocodecsv.com/blog/extract-email-addresses-from-csv",
  datePublished: "2026-09-12",
  dateModified: "2026-09-12",
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
  mainEntityOfPage: "https://nocodecsv.com/blog/extract-email-addresses-from-csv",
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
      name: "How to Extract Emails From a CSV",
      item: "https://nocodecsv.com/blog/extract-email-addresses-from-csv",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I extract email addresses from a CSV?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Match a pattern against the text of each cell and collect what matches. In Google Sheets, REGEXEXTRACT pulls the first address from a cell. Excel 365 has REGEXEXTRACT as well, added in 2024, and older Excel needs Power Query or a MID and SEARCH formula. In Python, re.findall on each cell finds every address in one pass, and pandas str.findall does the same column by column.",
      },
    },
    {
      "@type": "Question",
      name: "What regex should I use for email addresses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A practical pattern is [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+ followed by a dot and two or more letters. It allows plus addressing, dots, and subdomains, which a plain word-character pattern misses. Do not try to cover every legal address: RFC 5322 permits quoted local parts that almost never appear in real data, and a pattern that chases them becomes unreadable and slow.",
      },
    },
    {
      "@type": "Question",
      name: "Why does my formula only return one email per cell?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because REGEXEXTRACT is built to return a single match. When a cell holds several addresses, that function stops at the first one. In Excel 365 and Google Sheets you either add a helper column that peels off one match at a time, or move to a script: Python's re.findall returns every match in a cell as a list, and pandas str.findall does the same. For a one-off cleanup, splitting the cell on the separator first, then matching, is usually simpler than writing a recursive formula.",
      },
    },
    {
      "@type": "Question",
      name: "How do I remove duplicate emails from the extracted list?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lowercase the addresses first, then dedupe, because the domain part of an address is case-insensitive. Jane@Example.com and jane@example.com usually reach the same mailbox, so a case-sensitive dedupe leaves both. In a spreadsheet, use Data then Remove duplicates on the normalised column. In Python, build a set from the lowercased addresses. Our guide on removing duplicates from a CSV walks through both.",
      },
    },
    {
      "@type": "Question",
      name: "How long can an email address be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RFC 5321 caps the local part before the at sign at 64 octets and the domain at 255, which puts the practical ceiling for a full address at 254 characters. A regex that assumes a short address will miss the long ones, and a database column sized at 50 characters will silently cut them off. If you are storing the result, give the column at least 254 characters.",
      },
    },
    {
      "@type": "Question",
      name: "Is it legal to extract and email these addresses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Extracting them is a data task; emailing them is a legal one, and the rules depend on where the recipients are. In the United States, CAN-SPAM allows commercial email but requires accurate headers, a clear opt-out, and the FTC can fine each separate message that breaks the rules. For contacts in the EU or UK, an email address is personal data, and GDPR requires a lawful basis such as consent or legitimate interest, with fines under Article 83 reaching 20 million euros or 4 percent of worldwide annual turnover.",
      },
    },
    {
      "@type": "Question",
      name: "Can I extract emails from a PDF or a scanned file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Only if there is a text layer to read. A PDF exported from a word processor or a spreadsheet carries selectable text, so the pattern match works after you convert it to CSV or plain text. A scanned page is an image with no text at all, and it needs OCR before any extraction can run. The AI extraction route handles the conversion step for you.",
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
      <p className="text-blue-600 font-medium">✉️ Data Extraction · 7 min read</p>
      <h1>How to Extract Emails From a CSV or Spreadsheet (2026)</h1>
      <p><strong>To extract email addresses from a CSV, run a pattern match over the text and collect every match.</strong> In Google Sheets, <code>{'=REGEXEXTRACT(A2,"([^\\s@]+@[^\\s@]+\\.[^\\s@]+)")'}</code> pulls the first address out of a cell. Excel 365 has the same function, <code>REGEXEXTRACT</code>, added in 2024; older Excel needs Power Query or a MID and SEARCH formula. In Python, <code>re.findall</code> finds every address in one pass, and pandas <code>str.findall</code> does it column by column. Whatever you use, lowercase the results and dedupe them before the list goes anywhere near a mail tool.</p>

      <h2>Where Email Addresses Hide in a CSV</h2>
      <p>The tidy case is a column already labelled <code>email</code>. That is rare. Most of the time the addresses are scattered through text that was pasted from somewhere else:</p>
      <ul>
        <li>A <strong>notes</strong> or <strong>comments</strong> field, holding a phone number, an address, and one email in the middle of a sentence.</li>
        <li>A <strong>contact</strong> field with two or three people in it, separated by a comma or a slash.</li>
        <li>A support-ticket body, where the sender is on the first line and someone else is quoted further down.</li>
        <li>A column of raw text exported from a form, with no field separation at all.</li>
      </ul>
      <p>Because a CSV field can legally hold commas and line breaks inside quotes (that is RFC 4180), a cell can contain a whole paragraph. Matching a pattern against each cell is the right approach; splitting columns is not.</p>

      <h2>Method 1: Google Sheets</h2>
      <p>Sheets has had a regex function for years, which makes it the quickest place to test a pattern.</p>
      <ol>
        <li>Put the source text in column A.</li>
        <li>In B2, enter <code>{'=REGEXEXTRACT(A2,"([^\\s@]+@[^\\s@]+\\.[^\\s@]+)")'}</code>.</li>
        <li>Fill the formula down the column.</li>
      </ol>
      <p>One limitation to plan around: <code>REGEXEXTRACT</code> returns a single match. If a cell holds two addresses, you get the first and the second is quietly dropped. For a list where most cells are one-per-cell, that is fine. Where it is not, split the cell first with <code>SPLIT</code>, or move to Python.</p>
      <p>To split before matching, <code>{'=SPLIT(A2,",")'}</code> spreads the values across columns and you run the extract on each new column. It is crude, but it is easy to check by eye, and that matters when the list is going to be emailed.</p>

      <h2>Method 2: Excel</h2>
      <p>Excel has two eras to think about.</p>
      <p><strong>Excel 365 (2024 and later)</strong> shipped <code>REGEXEXTRACT</code>, matching Sheets. The syntax is the same, and the same one-match limit applies.</p>
      <p><strong>Excel 2016 to 2021</strong> has no regex function at all. The two workable routes are Power Query and a careful formula. Power Query is the better of the two: load the table, split the column on the separator, unpivot so every fragment lands in one column, then add a custom column with a <code>Text.</code> pattern, or filter down to the rows that contain an at sign. The advantage is that Power Query refreshes, so next month&apos;s export is one click instead of the whole job again.</p>
      <p>The formula route exists and it is unpleasant. A common pairing is <code>MID</code> with <code>SEARCH("&quot;@&quot;",A2)</code> to find the at sign, then <code>SEARCH</code> backwards for the space or comma that starts the address. It works on clean input, and it breaks on the first cell that does not look like the last one. If you find yourself nesting a fourth function, that is the signal to switch to Power Query or Python.</p>

      <h2>Method 3: Python, the Version That Handles Mess</h2>
      <p>One pass over the file pulls everything out, and the code is short enough to keep.</p>
      <pre><code>{`import csv
import re

pattern = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")

found = []
with open("contacts.csv", newline="", encoding="utf-8") as f:
    for row in csv.reader(f):
        for cell in row:
            found.extend(pattern.findall(cell))

# Domain names are case-insensitive, so normalise before deduping
unique = []
for address in found:
    key = address.lower()
    if key not in unique:
        unique.append(key)

print(len(found), "matches,", len(unique), "unique")
print(unique[:5])`}</code></pre>
      <p>Two details in that pattern earn their keep. The character class starts with <code>A-Za-z</code> so a fragment like <code>@word</code> with nothing before it is ignored. The dot before the final letters is escaped as <code>\\.</code> so it has to be a real dot, which stops a string like <code>name@localhost</code> from counting as an address.</p>
      <p>If the data is already a DataFrame, pandas does the same thing per column:</p>
      <pre><code>{`import pandas as pd

df = pd.read_csv("contacts.csv", dtype=str)
emails = (
    df["notes"]
    .str.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}")
    .explode()
    .dropna()
    .str.lower()
    .unique()
)
print(len(emails))`}</code></pre>
      <p>The <code>explode</code> call is the part people miss. <code>str.findall</code> returns a list per row, so without explode you get a column of lists rather than a flat set of addresses.</p>

      <h2>Cleaning the List Before You Use It</h2>
      <p>Extraction is the easy half. A raw match set usually needs four passes before it is usable.</p>
      <ol>
        <li><strong>Trim the whitespace.</strong> A trailing space or newline clings to the end of a match and makes a perfectly good address bounce.</li>
        <li><strong>Lowercase it.</strong> The domain is case-insensitive, and in practice every large provider treats the whole address that way. Normalising catches the duplicates that a case-sensitive pass would miss.</li>
        <li><strong>Dedupe.</strong> Then compare the count before and after. A list that halves is a sign the source had the same person in several rows. The <Link href="/blog/remove-duplicates-from-csv">duplicate removal guide</Link> covers the spreadsheet side.</li>
        <li><strong>Check the shape.</strong> Anything without an at sign, anything with two, and anything with a space inside it is worth a look. A pattern match is not a validation.</li>
      </ol>
      <p>If the source file was messy to begin with, clean it before extracting, not after. Fixing stray quotes, wrong delimiters and blank rows is simpler while the data is still tabular. The <Link href="/blog/how-to-clean-dirty-csv-data">dirty data guide</Link> is the checklist for that stage, and if the addresses live in a PDF rather than a CSV, the <Link href="/blog/extract-data-from-pdf-to-csv-ai">PDF to CSV extraction guide</Link> covers the conversion step.</p>

      <h2>The Rules That Apply Once You Have the List</h2>
      <p>Collecting addresses is a data-cleaning task. Emailing them is a regulated one, and the rule that applies depends on where the recipient is.</p>
      <p>In the United States, CAN-SPAM does not require consent for commercial email, but it requires accurate headers, a clear way to opt out, and prompt honouring of that opt-out. The FTC enforces it and can seek a civil penalty for each separate message that breaks the rules, with the adjusted maximum per email running above $50,000.</p>
      <p>For recipients in the EU or the UK it is stricter. An email address is personal data, and GDPR requires a lawful basis before you process it. Consent is one; legitimate interest is another, and it has to be documented. Fines under Article 83 reach 20 million euros or 4 percent of total worldwide annual turnover, whichever is higher, so the list itself is the smallest part of the risk.</p>
      <p>None of this bans the task. It does mean the person who scraped a list should hand it to the person who decides whether to email it, with the source written down.</p>

      <h2>Which Method Fits</h2>
      <table>
        <thead><tr><th>Method</th><th>Works in</th><th>Several emails per cell</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td>REGEXEXTRACT</td><td>Google Sheets, Excel 365</td><td>No, first match only</td><td>A quick check on one column</td></tr>
          <tr><td>Power Query</td><td>Excel 2016 and later</td><td>Yes, after split and unpivot</td><td>A report that refreshes monthly</td></tr>
          <tr><td>Python re.findall</td><td>Anywhere</td><td>Yes</td><td>Messy text, repeat runs</td></tr>
          <tr><td>pandas str.findall</td><td>Anywhere</td><td>Yes</td><td>A file you are already analysing</td></tr>
          <tr><td>Online extractor</td><td>Browser</td><td>Varies by tool</td><td>One-off, non-sensitive data</td></tr>
        </tbody>
      </table>

      <h2>Two Things to Check Before You Trust the Output</h2>
      <p>Count your rows. If a 5,000-row file returns 40 addresses, the pattern is too strict or the column is emptier than it looks, and both are worth knowing before you build anything on top of the result. The free <Link href="/tools/csv-analyzer">CSV analyzer</Link> shows column fill rates, which answers that question in a glance rather than a formula.</p>
      <p>Then spot-check ten matches against the source text by hand. A pattern that is slightly too loose picks up fragments that look right at a distance and fail on send. Ten manual checks is a few minutes and it is the difference between a list and a guess.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>How do I extract email addresses from a CSV?</h3>
      <p>Match a pattern against the text of each cell and collect what matches. Sheets and Excel 365 use REGEXEXTRACT for the first match in a cell; older Excel uses Power Query; Python&apos;s re.findall returns every match in one pass.</p>
      <h3>What regex should I use for email addresses?</h3>
      <p>A practical pattern is a run of letters, digits and the characters . _ % + - followed by an at sign, a domain, a dot, and two or more letters. It allows plus addressing and subdomains, which a plain word-character pattern misses.</p>
      <h3>Why does my formula only return one email per cell?</h3>
      <p>Because REGEXEXTRACT is built to return a single match, so it stops at the first one. Where a cell holds several addresses, split the cell first, add a helper column, or move to Python where re.findall returns the whole list.</p>
      <h3>How do I remove duplicate emails from the extracted list?</h3>
      <p>Lowercase first, then dedupe. The domain part of an address is case-insensitive, so a case-sensitive pass leaves both Jane@Example.com and jane@example.com. In a spreadsheet use Remove duplicates; in Python build a set from the lowercased values.</p>
      <h3>How long can an email address be?</h3>
      <p>RFC 5321 caps the local part at 64 octets and the domain at 255, which puts the practical ceiling for a full address at 254 characters. A regex that assumes something short will miss the long ones, and a 50-character database column will cut them off.</p>
      <h3>Is it legal to extract and email these addresses?</h3>
      <p>Extracting is a data task, emailing is a legal one. CAN-SPAM allows commercial email with accurate headers and a working opt-out, and the FTC can penalise each offending message. For EU or UK recipients, GDPR needs a lawful basis, with fines reaching 20 million euros or 4 percent of worldwide turnover.</p>
      <h3>Can I extract emails from a PDF or a scanned file?</h3>
      <p>Only if there is a text layer. A PDF exported from Word or Excel carries selectable text, so convert it to CSV or plain text first. A scanned page is an image and needs OCR before any pattern match can work.</p>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
        <p className="text-slate-600 mb-4">Want to go further with AI-powered data work? These tools pair well with NoCodeCSV:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — if the contact file arrives on a schedule, an AI workflow can extract the addresses, dedupe them and push the result to your list without anyone opening Excel.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>OpenCode Go</strong> — the extraction script above is fifteen lines, and a cheap coding subscription is enough to write and adjust it; the plan covers 19+ models including DeepSeek and GLM for around $10 a month.{' '}
            <a href="https://opencode.ai/go?ref=64V3FDAF5T" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try OpenCode Go</a>
          </li>
          <li>
            <strong>Softr</strong> — a cleaned contact list is more useful as a searchable app than as a spreadsheet everyone copies; Softr builds that from the same table without code.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you. Links currently point to each vendor&apos;s official page until our dedicated tracking links are registered. OpenCode Go uses our referral link.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">See Which Column Holds the Emails</h2>
        <p className="text-blue-100 mb-5">Run the free CSV analyzer to check how full each column is before you build a formula on top of it.</p>
        <Link href="/tools/csv-analyzer"><Button size="lg" variant="secondary" className="text-base px-8">Analyze Your CSV Free</Button></Link>
      </div>
      <RelatedPosts slug="extract-email-addresses-from-csv" />
    </article>
    </>
  );
}
