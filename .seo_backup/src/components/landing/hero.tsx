import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, BarChart3, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 mb-8">
          <Zap className="h-4 w-4" />
          Powered by DeepSeek AI — 10x cheaper than the competition
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.1]">
          Chat with your{" "}
          <span className="text-blue-600">CSV & Excel</span>
          <br />
          files in plain English
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-zinc-500 leading-relaxed">
          Upload any spreadsheet. Ask questions. AI builds charts, finds patterns,
          and delivers insights — no SQL, no Python, no waiting for the data team.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8">
              <Upload className="h-5 w-5" />
              Upload Your First File — Free
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="gap-2 text-base px-8">
              See How It Works
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-zinc-400">
          No credit card required. 3 free analyses per day.
        </p>
      </div>
    </section>
  );
}
