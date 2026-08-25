import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <h4 className="font-semibold text-sm mb-3">Product</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <Link href="/dashboard" className="block hover:text-zinc-700">Dashboard</Link>
              <Link href="/pricing" className="block hover:text-zinc-700">Pricing</Link>
              <Link href="/#features" className="block hover:text-zinc-700">Features</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Tools</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <Link href="/tools/csv-analyzer" className="block hover:text-zinc-700">CSV Analyzer</Link>
              <Link href="/tools/excel-data-analysis" className="block hover:text-zinc-700">Excel Analysis</Link>
              <Link href="/tools/spreadsheet-charts" className="block hover:text-zinc-700">Chart Generator</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Blog</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <Link href="/blog/how-to-analyze-csv-with-ai-free" className="block hover:text-zinc-700">Analyze CSV With AI</Link>
              <Link href="/blog/best-ai-tools-for-excel-analysis" className="block hover:text-zinc-700">Best AI Excel Tools</Link>
              <Link href="/blog/ai-data-visualization-guide" className="block hover:text-zinc-700">AI Chart Guide</Link>
              <Link href="/blog/spreadsheet-automation-with-ai" className="block hover:text-zinc-700">Spreadsheet Automation</Link>
              <Link href="/blog/free-alternative-to-chatgpt-code-interpreter" className="block hover:text-zinc-700">ChatGPT Alternative</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Company</h4>
            <div className="space-y-2 text-sm text-zinc-500">
              <Link href="/pricing" className="block hover:text-zinc-700">Pricing</Link>
              <Link href="/privacy" className="block hover:text-zinc-700">Privacy</Link>
              <Link href="/terms" className="block hover:text-zinc-700">Terms</Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-zinc-200 text-center text-sm text-zinc-400">
          <p>© 2026 DataAnalyzer AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
