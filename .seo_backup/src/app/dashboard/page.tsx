"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { FileUploader } from "@/components/dashboard/file-uploader";
import { QueryInput } from "@/components/dashboard/query-input";
import { ResultsCard } from "@/components/dashboard/results-card";
import { ResultsChart } from "@/components/dashboard/results-chart";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, Zap, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isSignedIn } = useUser();
  const [file, setFile] = useState<{ name: string; content: string; columns: string[]; rowCount: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; chartData: any } | null>(null);
  const [sampleRows, setSampleRows] = useState<Record<string, string>[]>([]);
  const [usage, setUsage] = useState<{ used: number; remaining: number; limit: number; isPro: boolean } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 获取用量
  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/usage")
        .then((r) => r.json())
        .then(setUsage)
        .catch(() => setUsage({ used: 0, remaining: 3, limit: 3, isPro: false }));
    }
  }, [isSignedIn]);

  const handleFileParsed = (parsed: { name: string; content: string; columns: string[]; rows: Record<string, string>[] }) => {
    setFile({
      name: parsed.name,
      content: parsed.content,
      columns: parsed.columns,
      rowCount: parsed.rows.length,
    });
    setSampleRows(parsed.rows.slice(0, 100));
    setResult(null);
  };

  const handleQuery = async (question: string) => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: file.content, question }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult({ answer: data.answer, chartData: data.chart || null });

      // 刷新用量
      if (data.usage) {
        setUsage(data.usage);
      }

      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err: any) {
      setResult({ answer: `Error: ${err.message}`, chartData: null });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setSampleRows([]);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      {/* 用量状态栏 */}
      {isSignedIn && usage && (
        <div className="mb-6 flex items-center gap-3 flex-wrap">
          {usage.isPro ? (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 gap-1 text-xs">
              <Zap className="h-3 w-3" /> Pro — Unlimited
            </Badge>
          ) : (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1 text-xs">
                <BarChart3 className="h-3 w-3" />
                {usage.remaining}/{usage.limit} free analyses left today
              </Badge>
              {usage.remaining === 0 && (
                <Link href="/pricing">
                  <Button size="sm" className="gap-1 text-xs h-7">
                    <Zap className="h-3 w-3" /> Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {!file ? (
        <div className="max-w-2xl mx-auto pt-12">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Upload your file</h1>
            <p className="mt-2 text-zinc-500">CSV, Excel (.xlsx, .xls), or TSV — up to 25MB</p>
            {isSignedIn && usage && usage.remaining === 0 && !usage.isPro && (
              <Card className="mt-6 border-amber-200 bg-amber-50">
                <CardContent className="pt-4 pb-4 text-center">
                  <p className="text-amber-800 font-medium">You&apos;ve used all {usage.limit} free analyses today.</p>
                  <p className="text-amber-600 text-sm mt-1">Upgrade to Pro for unlimited analyses.</p>
                  <Link href="/pricing" className="mt-3 inline-block">
                    <Button size="sm" className="gap-1">
                      Upgrade to Pro <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
          <FileUploader onParsed={handleFileParsed} />
        </div>
      ) : (
        <div>
          {/* 文件信息栏 */}
          <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50">
            <FileSpreadsheet className="h-5 w-5 text-blue-600" />
            <span className="font-medium">{file.name}</span>
            <Badge variant="secondary" className="gap-1">{file.columns.length} columns</Badge>
            <Badge variant="secondary" className="gap-1">{file.rowCount.toLocaleString()} rows</Badge>
            <button onClick={handleReset} className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium">
              Upload different file
            </button>
          </div>

          {/* 数据预览 */}
          {sampleRows.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-zinc-500 mb-2">Data Preview (first 100 rows)</h3>
              <div className="rounded-lg border border-zinc-200 overflow-auto max-h-64">
                <DataTable columns={file.columns} rows={sampleRows} />
              </div>
            </div>
          )}

          {/* 查询输入 */}
          <QueryInput onSubmit={handleQuery} loading={loading} disabled={usage?.remaining === 0 && !usage?.isPro} />

          {/* 结果区域 */}
          <div ref={scrollRef}>
            {loading && (
              <div className="mt-8 p-8 rounded-lg border border-zinc-200 animate-pulse">
                <div className="h-4 bg-zinc-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-zinc-200 rounded w-1/2 mb-4" />
                <div className="h-40 bg-zinc-100 rounded" />
              </div>
            )}

            {result && (
              <div className="mt-8 space-y-6">
                <ResultsCard answer={result.answer} />
                {result.chartData && <ResultsChart data={result.chartData} />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
