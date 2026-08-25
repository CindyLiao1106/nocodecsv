import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CTA } from "@/components/landing/cta";

export const metadata: Metadata = {
  title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
  description:
    "Upload a CSV or Excel file and ask questions in plain English. AI generates charts, finds patterns, and summarizes your data. Free to start.",
  alternates: { canonical: "https://nocodecsv.com/" },
  openGraph: {
    title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
    description:
      "Upload a CSV or Excel file and ask questions in plain English. AI generates charts, finds patterns, and summarizes your data.",
    type: "website",
    url: "https://nocodecsv.com/",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
    description: "Upload a CSV or Excel file and ask questions in plain English. AI generates charts and insights instantly.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "NoCodeCSV",
      url: "https://nocodecsv.com/",
      description: "Chat with your CSV & Excel files using AI. No coding needed.",
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "NoCodeCSV",
      url: "https://nocodecsv.com/",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered CSV and Excel data analysis. Upload a file, ask questions in plain English, and get charts and insights instantly.",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "15", priceCurrency: "USD" },
        { "@type": "Offer", name: "Business", price: "49", priceCurrency: "USD" },
      ],
      author: { "@type": "Organization", name: "NoCodeCSV" },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <HowItWorks />

      {/* Internal links: tools & guides */}
      <section className="bg-white border-t border-zinc-100 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Free AI data tools & guides
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-zinc-200 p-6">
              <h3 className="font-semibold text-lg mb-3">Tools</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/tools/csv-analyzer" className="hover:text-blue-600">Free AI CSV Analyzer</Link></li>
                <li><Link href="/tools/excel-data-analysis" className="hover:text-blue-600">AI Excel Data Analysis</Link></li>
                <li><Link href="/tools/spreadsheet-charts" className="hover:text-blue-600">AI Chart Generator</Link></li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6">
              <h3 className="font-semibold text-lg mb-3">Guides</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li><Link href="/blog/how-to-analyze-csv-with-ai-free" className="hover:text-blue-600">How to Analyze CSV With AI</Link></li>
                <li><Link href="/blog/ai-data-visualization-guide" className="hover:text-blue-600">AI Data Visualization Guide</Link></li>
                <li><Link href="/blog/best-ai-tools-for-excel-analysis" className="hover:text-blue-600">Best AI Tools for Excel</Link></li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-6 flex flex-col">
              <h3 className="font-semibold text-lg mb-3">Start now</h3>
              <p className="text-sm text-zinc-500 mb-4">Upload a CSV or Excel file and ask your first question — free.</p>
              <Link href="/dashboard">
                <Button className="gap-2">Open Dashboard <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
