import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About NoCodeCSV — AI Data Analysis for Everyone",
  description:
    "NoCodeCSV helps non-technical users analyze CSV and Excel files with AI. Learn our mission and how we keep data analysis free and accessible.",
  alternates: { canonical: "https://nocodecsv.com/about" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "About NoCodeCSV — AI Data Analysis for Everyone",
    description:
      "We build free AI tools that let anyone chat with their spreadsheets — no SQL, no Python, no coding.",
    type: "website",
    url: "https://nocodecsv.com/about",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "About NoCodeCSV — AI Data Analysis for Everyone",
    description:
      "We build free AI tools that let anyone chat with their spreadsheets — no SQL, no Python, no coding.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About NoCodeCSV",
  url: "https://nocodecsv.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "NoCodeCSV",
    url: "https://nocodecsv.com/",
    logo: "https://nocodecsv.com/og-image.png",
    description:
      "NoCodeCSV is a free AI-powered platform for analyzing CSV and Excel files through natural-language chat.",
    email: "contact@nocodecsv.com",
    sameAs: [],
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc prose-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1>About NoCodeCSV</h1>

      <p className="lead">
        NoCodeCSV makes spreadsheet analysis as easy as having a conversation.
      </p>

      <h2>What we do</h2>
      <p>
        NoCodeCSV is a set of free, browser-based tools that let you upload a
        CSV or Excel file and ask questions about it in plain English. The AI
        does the heavy lifting — generating charts, spotting patterns,
        summarizing large datasets, and answering questions — so you never need
        to write SQL, Python, or complex Excel formulas.
      </p>

      <h2>Who we are</h2>
      <p>
        NoCodeCSV is built and maintained by a small independent team of
        developers and data enthusiasts who believe data analysis should not
        require a technical degree. We started NoCodeCSV because we kept
        watching smart colleagues — marketers, operations managers,
        researchers — struggle with spreadsheets when the insight they needed
        was right there in the data.
      </p>

      <h2>Our tools</h2>
      <ul>
        <li>
          <Link href="/tools/csv-analyzer" className="text-blue-600 underline">
            CSV Analyzer
          </Link>{" "}
          — chat with your CSV files and get instant answers and charts.
        </li>
        <li>
          <Link href="/tools/excel-data-analysis" className="text-blue-600 underline">
            Excel Data Analysis
          </Link>{" "}
          — analyze .xlsx files conversationally, no formulas needed.
        </li>
        <li>
          <Link href="/tools/spreadsheet-charts" className="text-blue-600 underline">
            Chart Generator
          </Link>{" "}
          — turn raw spreadsheet data into clear visualizations.
        </li>
        <li>
          Our{" "}
          <Link href="/blog/how-to-analyze-csv-with-ai-free" className="text-blue-600 underline">
            blog
          </Link>{" "}
          — practical guides on cleaning, merging, and analyzing data with AI.
        </li>
      </ul>

      <h2>Our values</h2>
      <ul>
        <li>
          <strong>Free first.</strong> Core analysis is free — we believe data
          skills should be accessible to everyone.
        </li>
        <li>
          <strong>Privacy by design.</strong> Files are processed in your
          browser and never stored on our servers.
        </li>
        <li>
          <strong>No jargon.</strong> Every feature should be usable by someone
          who has never written a line of code.
        </li>
      </ul>

      <h2>Contact</h2>
      <p>
        Questions, feedback, or partnership ideas? Reach us at{" "}
        <a href="mailto:contact@nocodecsv.com" className="text-blue-600 underline">
          contact@nocodecsv.com
        </a>
        .
      </p>
    </article>
  );
}
