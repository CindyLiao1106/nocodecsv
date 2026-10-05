"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { FileSpreadsheet, ShieldCheck, ArrowRight } from "lucide-react";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { QueryInput } from "@/components/dashboard/query-input";
import { ResultsCard } from "@/components/dashboard/results-card";
import { ResultsChart } from "@/components/dashboard/results-chart";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * 免注册试用器(2026-10-05 上)。
 *
 * 背景:这一页从 9 月起就挂着「no account needed」,但点进去只有登录墙 ——
 * 文案承诺了、功能不存在。这个组件把承诺兑现:访客不登录、不填邮箱,
 * 直接上传 → 提问 → 出答案和图(每天 2 次,见 lib/guest-quota.ts)。
 *
 * 与 /dashboard 的分工(故意的):
 *   · 这里 = 试用:不存历史、不能导出、每天 2 次
 *   · /dashboard = 登录后:每天 3 次、保存历史、导出、优先处理
 *   所以这里在结果之后给一个「sign in free」的提示,把试用流量接进账号体系。
 */
const GUEST_LIMIT_HINT = 2;

/** 与 ResultsChart 的 props 对齐(别用 unknown,构建会拦)。 */
type ChartData = {
  type: "bar" | "line" | "pie" | "scatter";
  title: string;
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

export function GuestAnalyzer() {
  const [file, setFile] = useState<{ name: string; content: string; columns: string[]; rowCount: number } | null>(null);
  const [sampleRows, setSampleRows] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; chartData: ChartData | null } | null>(null);
  const [notice, setNotice] = useState<string>("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFileParsed = (parsed: {
    name: string;
    content: string;
    columns: string[];
    rows: Record<string, string>[];
  }) => {
    setFile({ name: parsed.name, content: parsed.content, columns: parsed.columns, rowCount: parsed.rows.length });
    setSampleRows(parsed.rows.slice(0, 100));
    setResult(null);
    setNotice("");
  };

  const handleQuery = async (question: string) => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setNotice("");
    try {
      const res = await fetch("/api/analyze-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: file.content, question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error || "Analysis failed. Please retry.");
        if (data.usage && typeof data.usage.remaining === "number") setRemaining(data.usage.remaining);
        return;
      }
      setResult({ answer: data.answer, chartData: data.chart || null });
      if (data.usage && typeof data.usage.remaining === "number") setRemaining(data.usage.remaining);
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      setNotice("Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setSampleRows([]);
    setResult(null);
    setNotice("");
  };

  return (
    <section id="try-it" className="py-12 sm:py-16 bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-6">
          <Badge className="gap-1 bg-green-100 text-green-800 border-green-300 text-xs">
            <ShieldCheck className="h-3 w-3" /> No account needed
          </Badge>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Try it right here — upload a CSV, ask a question
          </h2>
          <p className="mt-2 text-zinc-500">
            No signup, no email, no credit card. {GUEST_LIMIT_HINT} free analyses a day in the browser.
            Nothing is stored after your question is answered.
          </p>
        </div>

        {!file ? (
          <form
            toolname="uploadCsvFileGuest"
            tooldescription="Uploads a spreadsheet (CSV, TSV, .xlsx or .xls up to 25MB) so a user can ask questions about it without creating an account. Use this when a user wants to try an analysis without signing up."
            onSubmit={(e) => e.preventDefault()}
          >
            <FileUploader onParsed={handleFileParsed} />
          </form>
        ) : (
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-5 p-4 rounded-lg border border-blue-200 bg-blue-50">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              <span className="font-medium break-all">{file.name}</span>
              <Badge variant="secondary" className="gap-1">{file.columns.length} columns</Badge>
              <Badge variant="secondary" className="gap-1">{file.rowCount.toLocaleString()} rows</Badge>
              <button
                onClick={handleReset}
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Upload different file
              </button>
            </div>

            {sampleRows.length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-medium text-zinc-500 mb-2">Data Preview (first 100 rows)</h3>
                <div className="rounded-lg border border-zinc-200 overflow-auto max-h-56">
                  <DataTable columns={file.columns} rows={sampleRows} />
                </div>
              </div>
            )}

            <form
              toolname="askQuestionAboutDataGuest"
              tooldescription="Answers a plain-English question about an already-uploaded spreadsheet and returns an explanation plus a chart, without requiring the user to sign in."
              onSubmit={(e) => e.preventDefault()}
            >
              <QueryInput onSubmit={handleQuery} loading={loading} disabled={remaining === 0} />
            </form>

            <div ref={scrollRef}>
              {loading && (
                <div className="mt-6 p-6 rounded-lg border border-zinc-200 animate-pulse">
                  <div className="h-4 bg-zinc-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-zinc-200 rounded w-1/2 mb-4" />
                  <div className="h-32 bg-zinc-100 rounded" />
                </div>
              )}

              {notice && (
                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <p>{notice}</p>
                  <Link href="/sign-up" className="mt-2 inline-flex items-center gap-1 font-medium text-blue-700 underline">
                    Create a free account <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {result && (
                <div className="mt-6 space-y-6">
                  <ResultsCard answer={result.answer} />
                  {result.chartData ? <ResultsChart data={result.chartData} /> : null}
                  <p className="text-sm text-zinc-500">
                    {typeof remaining === "number" && remaining > 0
                      ? `${remaining} free guest ${remaining === 1 ? "analysis" : "analyses"} left today. `
                      : "That was your last free guest analysis today. "}
                    <Link href="/sign-up" className="font-medium text-blue-600 underline">
                      Sign in free
                    </Link>{" "}
                    for 3 a day, saved history and exports.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
