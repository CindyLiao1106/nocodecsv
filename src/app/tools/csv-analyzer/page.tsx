import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MessageSquare, BarChart3, ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Free AI CSV Analyzer — Chat with Your CSV Files | DataAnalyzer AI",
  description: "Upload any CSV file and analyze it with AI in plain English. No SQL, no Python, no coding. Get instant charts, insights, and data summaries. Free to start.",
  keywords: ["free AI CSV analyzer", "CSV data analysis AI", "analyze CSV online free", "AI CSV tool", "chat with CSV", "CSV insights generator"],
  openGraph: { title: "Free AI CSV Analyzer — Chat with Your CSV Files", description: "Upload CSV, ask questions, get charts. No coding required." },
  alternates: { canonical: "https://nocodecsv.com/tools/csv-analyzer" },
};

const steps = [
  { title: "Upload CSV", desc: "Drag & drop your .csv file. Handles up to 25MB — orders, users, logs, anything." },
  { title: "Ask a Question", desc: '"What are total sales by region?" or "Find outliers in column B" — plain English works.' },
  { title: "Get Instant Analysis", desc: "AI computes statistics, finds patterns, and generates charts in seconds." },
];

const features = [
  "No coding — ask in plain English",
  "Auto-generated charts (bar, line, pie, scatter)",
  "Supports large CSV files up to 25MB",
  "Data privacy — files discarded after analysis",
  "Export results as CSV or PNG",
  "Powered by DeepSeek AI — free to start",
];

export default function CsvAnalyzerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 leading-tight">
            Free AI CSV Analyzer — <span className="text-blue-600">Chat With Your Data</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-zinc-500 max-w-2xl mx-auto">
            Stop wrestling with Excel formulas and Python scripts. Upload your CSV, ask questions in plain English, and let AI do the heavy lifting.
          </p>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-8 gap-2">
                <Upload className="h-5 w-5" /> Upload Your CSV — Free
              </Button>
            </Link>
            <p className="mt-3 text-sm text-zinc-400">No credit card. 3 free analyses every day.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">How to Analyze CSV Files With AI</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <Card key={s.title} className="border-zinc-200">
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold mb-3">{i + 1}</div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-500">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature list + CTA */}
      <section className="py-16 bg-zinc-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Everything you need, nothing you don&apos;t</h2>
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-zinc-600">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Link href="/dashboard">
                  <Button className="gap-2">
                    Try It Now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-6">
              <h3 className="font-semibold text-lg mb-3">Sample Questions You Can Ask</h3>
              <div className="space-y-2 text-sm text-zinc-600">
                {[
                  "\"Show me total sales by product category\"",
                  "\"What's the average order value by month?\"",
                  "\"Find the top 10 customers by revenue\"",
                  "\"Which region had the highest growth in Q3?\"",
                  "\"Are there any outliers in the pricing column?\"",
                ].map((q) => (
                  <div key={q} className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 shrink-0" />
                    <code className="text-xs bg-zinc-100 rounded px-2 py-1">{q}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">Ready to analyze your CSV?</h2>
        <p className="mt-2 text-zinc-500">First 3 analyses are free. No credit card required.</p>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button size="lg" className="text-base px-10">Start Free Analysis</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
