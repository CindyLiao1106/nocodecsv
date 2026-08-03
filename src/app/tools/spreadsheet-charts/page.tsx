import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Upload, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Chart Generator — Instant Bar, Line & Pie Charts",
  description: "Upload CSV or Excel and AI generates the chart you describe instantly — bar, line, pie, scatter. No design skills needed. Free to start.",
  keywords: ["AI chart generator from CSV", "AI chart maker", "auto chart from spreadsheet", "AI graph generator", "free chart maker from Excel", "data visualization AI"],
  alternates: { canonical: "https://nocodecsv.com/tools/spreadsheet-charts" },
  openGraph: {
    title: "AI Chart Generator — Instant Bar, Line & Pie Charts",
    description: "Upload data, describe the chart. AI creates it in seconds.",
    type: "website",
    url: "https://nocodecsv.com/tools/spreadsheet-charts",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Chart Generator — Instant Bar, Line & Pie Charts",
    description: "Upload data, describe the chart. AI creates it in seconds.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Chart Generator",
  url: "https://nocodecsv.com/tools/spreadsheet-charts",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Upload CSV or Excel and AI generates the chart you describe instantly — bar, line, pie, scatter.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const chartTypes = [
  { type: "Bar Chart", icon: "📊", use: "Compare categories — \"Sales by product\", \"Revenue by region\"" },
  { type: "Line Chart", icon: "📈", use: "Show trends — \"Monthly growth\", \"Temperature over time\"" },
  { type: "Pie Chart", icon: "🥧", use: "Show proportions — \"Market share\", \"Budget allocation\"" },
  { type: "Scatter Plot", icon: "⚬", use: "Find correlations — \"Price vs. sales\", \"Age vs. spending\"" },
];

export default function SpreadsheetChartsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Generate Charts From Spreadsheets — <span className="text-blue-600">Just Describe What You Want</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto">
            No Excel chart wizard. No data viz coding. Upload your data, type what chart you need, and AI builds it — bar, line, pie, scatter, all in one click.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 gap-2">
                <BarChart3 className="h-5 w-5" /> Create Your First Chart — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">4 Chart Types, Unlimited Questions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {chartTypes.map((ct) => (
              <Card key={ct.type} className="border-zinc-200">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-3">{ct.icon}</div>
                  <h3 className="font-semibold text-lg mb-1">{ct.type}</h3>
                  <p className="text-sm text-zinc-500">{ct.use}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl bg-blue-600 p-8 sm:p-12 text-center text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Turn any spreadsheet into beautiful charts</h2>
            <p className="text-blue-100 text-lg mb-6">CSV, Excel, TSV — upload, describe, done.</p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-base px-8 gap-2">
                <Upload className="h-5 w-5" /> Upload & Chart — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related tools & guides */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">More free AI data tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/csv-analyzer"><Button variant="outline">Analyze CSV Files</Button></Link>
            <Link href="/tools/excel-data-analysis"><Button variant="outline">Analyze Excel Files</Button></Link>
            <Link href="/blog/ai-data-visualization-guide"><Button variant="outline">Data Viz Guide</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}
