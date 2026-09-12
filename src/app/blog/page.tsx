import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
  description:
    "Every NoCodeCSV guide in one place: converting, cleaning, analysing and reshaping CSV and Excel files, with free browser tools and step-by-step methods.",
  keywords: [
    "csv guides",
    "excel data guides",
    "csv tutorials",
    "data cleaning guides",
    "csv tools blog",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog" },
  openGraph: {
    title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
    description:
      "Converting, cleaning, analysing and reshaping CSV and Excel files. Every guide, plus free browser tools.",
    type: "website",
    url: "https://nocodecsv.com/blog",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSV, Excel & Data Guides — NoCodeCSV Blog",
    description: "Every guide for working with CSV and Excel files, plus free tools.",
  },
};

type Post = { slug: string; title: string; blurb: string };

const GROUPS: { label: string; blurb: string; posts: Post[] }[] = [
  {
    label: "Format & Conversion",
    blurb: "Moving data between CSV, Excel, PDF, JSON, HTML and Markdown without losing anything on the way.",
    posts: [
      { slug: "convert-csv-to-pdf", title: "Convert CSV to PDF", blurb: "Turn a spreadsheet into a clean, printable document without buying software." },
      { slug: "convert-csv-to-excel-without-excel", title: "Convert CSV to Excel Without Excel", blurb: "Get an .xlsx out of a .csv when Excel is not installed." },
      { slug: "convert-excel-to-csv-free-online", title: "Convert Excel to CSV Free Online", blurb: "Export a workbook to CSV with the encoding and columns intact." },
      { slug: "convert-tsv-to-csv", title: "Convert TSV to CSV", blurb: "Swap tabs for commas when a system only accepts one of the two." },
      { slug: "csv-to-json-free-online", title: "CSV to JSON Free Online", blurb: "Reshape rows into objects for an API, an app or a script." },
      { slug: "json-to-csv-converter-online", title: "JSON to CSV Converter", blurb: "Flatten API output back into a table you can actually read." },
      { slug: "csv-to-html-table", title: "CSV to HTML Table", blurb: "Paste-ready markup for a web page or an email." },
      { slug: "csv-to-markdown-table", title: "CSV to Markdown Table", blurb: "Turn a table into Markdown for docs, READMEs and wikis." },
      { slug: "csv-to-chart-online-free", title: "CSV to Chart Online Free", blurb: "Go from a column of numbers to a graph in the browser." },
      { slug: "extract-data-from-pdf-to-csv-ai", title: "Extract Data from PDF to CSV with AI", blurb: "Pull tables out of a PDF without retyping a single row." },
      { slug: "transpose-csv-file", title: "Transpose a CSV File", blurb: "Swap rows and columns in Excel, Sheets or Python without breaking quoted fields." },
    ],
  },
  {
    label: "Data Cleaning",
    blurb: "The unglamorous work that decides whether the rest of the pipeline runs at all.",
    posts: [
      { slug: "how-to-clean-dirty-csv-data", title: "How to Clean Dirty CSV Data", blurb: "The checklist for messy exports: blanks, duplicates, stray quotes and headers." },
      { slug: "remove-duplicates-from-csv", title: "Remove Duplicates from CSV", blurb: "Find and drop repeat rows without losing the ones that matter." },
      { slug: "remove-blank-rows-from-csv", title: "Remove Blank Rows from CSV", blurb: "Strip the empty rows that break imports and charts." },
      { slug: "fix-garbled-csv-in-excel", title: "Fix Garbled CSV in Excel", blurb: "Fix mojibake: UTF-8, BOM and the wrong-encoding trap." },
      { slug: "keep-leading-zeros-in-csv", title: "Keep Leading Zeros in CSV", blurb: "Stop Excel eating the zero off ZIP codes, IDs and phone numbers." },
      { slug: "change-csv-delimiter", title: "Change a CSV Delimiter", blurb: "Convert semicolons, tabs and pipes to commas, and back again." },
      { slug: "extract-email-addresses-from-csv", title: "Extract Email Addresses from a CSV", blurb: "Pull addresses out of free text, then clean and dedupe the list." },
    ],
  },
  {
    label: "AI & Analysis",
    blurb: "Getting answers, summaries and charts out of a file without writing a formula nobody can maintain.",
    posts: [
      { slug: "how-to-analyze-csv-with-ai-free", title: "Analyze CSV with AI (Free)", blurb: "Ask questions of a spreadsheet and get answers back, no coding required." },
      { slug: "best-ai-tools-for-excel-analysis", title: "Best AI Tools for Excel Analysis", blurb: "Which AI spreadsheet tools are worth a subscription, and which are not." },
      { slug: "ai-data-visualization-guide", title: "AI Data Visualization Guide", blurb: "Turn a plain table into a chart worth showing someone." },
      { slug: "spreadsheet-automation-with-ai", title: "Spreadsheet Automation with AI", blurb: "Automate the repetitive quarter of spreadsheet work." },
      { slug: "free-alternative-to-chatgpt-code-interpreter", title: "Free ChatGPT Code Interpreter Alternative", blurb: "Run the same data tasks without the paid tier." },
      { slug: "excel-formula-generator-ai", title: "Excel Formula Generator (AI)", blurb: "Describe the formula you want in plain English and get it back." },
      { slug: "chat-with-spreadsheet-ai-free", title: "Chat with Your Spreadsheet (Free)", blurb: "A conversational way to explore a file you did not build." },
      { slug: "summarize-excel-data-with-ai", title: "Summarize Excel Data with AI", blurb: "Get a written summary instead of a pivot table nobody reads." },
      { slug: "ask-csv", title: "Ask Your CSV Questions", blurb: "Ask one direct question and get the number back." },
      { slug: "analyze-survey-data-csv-with-ai", title: "Analyze Survey Data CSV with AI", blurb: "Make sense of survey responses without a statistics package." },
      { slug: "visualize-sales-data-csv", title: "Visualize Sales Data from CSV", blurb: "Chart a sales export without writing code." },
      { slug: "opencode-go-review-cheap-ai-models", title: "OpenCode Go Review", blurb: "A cheap coding-model subscription, tested and priced honestly." },
    ],
  },
  {
    label: "File Operations",
    blurb: "Splitting, sorting, comparing and loading files — the mechanical jobs that come up every week.",
    posts: [
      { slug: "sort-csv-by-column", title: "Sort CSV by Column", blurb: "Order rows by one or more columns, correctly, including dates." },
      { slug: "split-large-csv-file-online", title: "Split a Large CSV File Online", blurb: "Break a file too big to open into parts you can work with." },
      { slug: "compare-two-csv-files-online", title: "Compare Two CSV Files Online", blurb: "Find what changed between two versions of the same file." },
      { slug: "free-csv-viewer-online", title: "Free CSV Viewer Online", blurb: "Open a CSV in the browser without Excel or a download." },
      { slug: "import-csv-to-sqlite-free", title: "Import CSV to SQLite", blurb: "Load a CSV into SQLite so you can run real queries against it." },
      { slug: "import-csv-into-google-sheets", title: "Import CSV into Google Sheets", blurb: "Get a local file into a shared sheet without mangling it." },
      { slug: "merge-csv-files-free", title: "Merge CSV Files", blurb: "Combine several files into one table with a single header row." },
    ],
  },
  {
    label: "CSV Fundamentals",
    blurb: "The format itself, and the trade-offs that decide which one to keep.",
    posts: [
      { slug: "csv-vs-excel", title: "CSV vs Excel", blurb: "Which format to keep, and why the difference bites you later." },
    ],
  },
];

const allPosts = GROUPS.flatMap((g) => g.posts);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "CSV, Excel & Data Guides",
  description:
    "Every NoCodeCSV guide: converting, cleaning, analysing and reshaping CSV and Excel files, with free browser tools and step-by-step methods.",
  url: "https://nocodecsv.com/blog",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/icon.png" },
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: allPosts.length,
    itemListElement: allPosts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `https://nocodecsv.com/blog/${p.slug}`,
    })),
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
  ],
};

export default function BlogIndex() {
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
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900">
          CSV, Excel and data guides
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-zinc-600">
          Every guide we have written about CSV and Excel files, sorted by what you are trying to
          do. Each one is a step-by-step method with a comparison of the free options, and most
          link to a browser tool you can use without signing up.
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          {allPosts.length} guides. Start with a{" "}
          <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
            free CSV analysis
          </Link>{" "}
          if you are not sure what is wrong with a file yet.
        </p>

        {GROUPS.map((g) => (
          <section key={g.label} className="mt-12">
            <h2 className="text-2xl font-bold text-zinc-900">{g.label}</h2>
            <p className="mt-1 text-sm text-zinc-500">{g.blurb}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2">
              {g.posts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block h-full rounded-xl border border-zinc-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <span className="block font-semibold text-zinc-900">{p.title}</span>
                    <span className="mt-1 block text-sm text-zinc-600">{p.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-14 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-xl font-bold text-zinc-900">Free tools that go with these guides</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Everything runs in your browser and the file never leaves your machine.
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li>
              <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
                CSV Analyzer
              </Link>
              <span className="block text-sm text-zinc-600">Columns, types and fill rates at a glance.</span>
            </li>
            <li>
              <Link href="/tools/excel-data-analysis" className="text-blue-600 underline">
                Excel Data Analysis
              </Link>
              <span className="block text-sm text-zinc-600">Ask questions of a workbook in plain English.</span>
            </li>
            <li>
              <Link href="/tools/spreadsheet-charts" className="text-blue-600 underline">
                Spreadsheet Charts
              </Link>
              <span className="block text-sm text-zinc-600">Turn a table into a chart you can share.</span>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
