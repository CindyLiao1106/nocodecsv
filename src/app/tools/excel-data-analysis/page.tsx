import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Excel Data Analysis Tool — Ask Questions, Get Charts",
  description: "Upload .xlsx or .xls files and analyze data with AI in plain English. No formulas, no pivot tables. Get instant charts and insights. Free to start.",
  keywords: ["AI data analysis tool for Excel", "AI Excel analyzer", "analyze Excel file online", "AI spreadsheet analysis", "Excel data insights AI", "free Excel data analysis"],
  alternates: { canonical: "https://nocodecsv.com/tools/excel-data-analysis" },
  openGraph: {
    title: "AI Excel Data Analysis Tool — Ask Questions, Get Charts",
    description: "Upload Excel, ask questions, get answers. No formulas needed.",
    type: "website",
    url: "https://nocodecsv.com/tools/excel-data-analysis",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Excel Data Analysis Tool — Ask Questions, Get Charts",
    description: "Upload Excel, ask questions, get answers. No formulas needed.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Excel Data Analysis Tool",
  url: "https://nocodecsv.com/tools/excel-data-analysis",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Upload .xlsx or .xls files and analyze data with AI in plain English. Get instant charts and insights.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const useCases = [
  { title: "Sales Teams", desc: "Upload monthly sales reports and ask \"Which rep exceeded quota?\" or \"Show sales trend by quarter.\"" },
  { title: "Marketers", desc: "Analyze campaign data — \"What's the conversion rate by channel?\" or \"Best performing ad by ROI.\"" },
  { title: "Finance", desc: "Drop in expense reports — \"Categorize spending by department\" or \"Find unusual transactions.\"" },
  { title: "E-commerce", desc: "Import orders CSV — \"Top selling products this month\" or \"Average order value by country.\"" },
  { title: "HR & Recruiting", desc: "Analyze applicant data — \"Show hiring funnel by source\" or \"Time-to-hire by department.\"" },
  { title: "Students & Researchers", desc: "Upload survey results — \"Correlation between age and score\" or \"Distribution of responses.\"" },
];

export default function ExcelAnalysisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            AI Excel Data Analysis — <span className="text-blue-600">No Formulas Required</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto">
            Upload any .xlsx or .xls file. Ask questions in plain English. AI handles formulas, pivot tables, and charts — instantly.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 gap-2">
                <Upload className="h-5 w-5" /> Analyze Your Excel File — Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use cases grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Who Uses AI Excel Analysis?</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc) => (
              <Card key={uc.title} className="border-zinc-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-2">{uc.title}</h3>
                  <p className="text-sm text-zinc-500">{uc.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-16 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Why AI Over Manual Excel?</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="bg-white rounded-xl border border-zinc-200 p-6">
              <h3 className="font-semibold text-red-600 mb-3">❌ Manual Excel Analysis</h3>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>• Learn VLOOKUP, INDEX-MATCH, pivot tables</li>
                <li>• Hours building charts manually</li>
                <li>• Formula errors hard to debug</li>
                <li>• Hard to share insights with team</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-green-600 mb-3">✅ AI Excel Analysis</h3>
              <ul className="space-y-2 text-sm text-zinc-700">
                {["Upload file → ask question → get answer (seconds)", "Charts auto-generated", "No formulas to learn", "Share links with your team"].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link href="/dashboard"><Button size="sm" className="gap-1">Try Now <ArrowRight className="h-3 w-3" /></Button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related tools & guides */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold mb-6">More free AI data tools</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tools/csv-analyzer"><Button variant="outline">Analyze CSV Files</Button></Link>
            <Link href="/tools/spreadsheet-charts"><Button variant="outline">Generate Charts</Button></Link>
            <Link href="/blog/best-ai-tools-for-excel-analysis"><Button variant="outline">Best AI Excel Tools</Button></Link>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Stop fighting with Excel formulas</h2>
        <p className="mt-2 text-zinc-500">Upload, ask, get answers. Free to start.</p>
        <div className="mt-6">
          <Link href="/dashboard"><Button size="lg" className="text-base px-10">Start Free Analysis</Button></Link>
        </div>
      </section>
    </>
  );
}
