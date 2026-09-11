/** 分析查询结果 */
export interface AnalysisResult {
  answer: string;
  chart?: ChartData;
  sampleRows: Record<string, string>[];
  columns: string[];
  rowCount: number;
}

export interface ChartData {
  type: "bar" | "line" | "pie" | "scatter";
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

/** Freemium 配额 */
export interface UsageQuota {
  daily: number;
  used: number;
  remaining: number;
  isPro: boolean;
}
