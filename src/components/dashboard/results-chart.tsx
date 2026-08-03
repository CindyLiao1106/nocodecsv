"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

// 动态加载 Recharts — 只在有图表时才下载 ~400KB JS
const ResultsChartInner = dynamic(
  () =>
    import("./results-chart-inner").then((mod) => ({ default: mod.ResultsChartInner })),
  {
    loading: () => (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Rendering chart...</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] bg-zinc-50 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

interface Props {
  data: {
    type: "bar" | "line" | "pie" | "scatter";
    title: string;
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
}

export function ResultsChart({ data }: Props) {
  if (!data?.labels?.length) return null;
  return <ResultsChartInner data={data} />;
}
