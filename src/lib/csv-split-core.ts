import Papa from "papaparse";

/**
 * CSV 拆分算法(纯函数 · 单一实现)
 *
 * 为什么单独放一个文件:
 *   页面上「Split & Download」按钮和 WebMCP 命令式工具 splitCsvText
 *   必须跑【同一套算法】—— 否则 agent 调用和人工操作会得到不同结果。
 *   逻辑从 src/app/tools/csv-splitter/csv-splitter-tool.tsx 原样提取,行为不变。
 */

export type SplitMode = "rows" | "size" | "column";

export type SplitGroup = {
  /** 文件名后缀(part1 / part2 / 列值) */
  suffix: string;
  /** 该组的数据行(不含表头) */
  rows: string[][];
};

const encoder = new TextEncoder();

export function sanitizeForFilename(value: string): string {
  const cleaned = value.trim().replace(/[^a-zA-Z0-9_-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned || "empty";
}

/** 按行数 / 文件大小 / 列值把数据行分组 */
export function groupRows(opts: {
  mode: SplitMode;
  dataRows: string[][];
  rowsPerFile: number;
  sizePerFileMB: number;
  delimiter: string;
  splitColumnIndex: number;
}): SplitGroup[] {
  const { mode, dataRows, rowsPerFile, sizePerFileMB, delimiter, splitColumnIndex } = opts;

  if (mode === "rows") {
    const groups: SplitGroup[] = [];
    for (let i = 0; i < dataRows.length; i += rowsPerFile) {
      groups.push({ suffix: `part${groups.length + 1}`, rows: dataRows.slice(i, i + rowsPerFile) });
    }
    return groups;
  }

  if (mode === "size") {
    const targetBytes = Math.max(1, sizePerFileMB) * 1024 * 1024;
    const groups: SplitGroup[] = [];
    let current: string[][] = [];
    let currentBytes = 0;
    for (const row of dataRows) {
      const rowBytes = encoder.encode(Papa.unparse([row], { delimiter })).length + 2;
      if (current.length > 0 && currentBytes + rowBytes > targetBytes) {
        groups.push({ suffix: `part${groups.length + 1}`, rows: current });
        current = [];
        currentBytes = 0;
      }
      current.push(row);
      currentBytes += rowBytes;
    }
    if (current.length > 0) groups.push({ suffix: `part${groups.length + 1}`, rows: current });
    return groups;
  }

  const map = new Map<string, string[][]>();
  for (const row of dataRows) {
    const key = row[splitColumnIndex] ?? "";
    const group = map.get(key);
    if (group) group.push(row);
    else map.set(key, [row]);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([value, rows]) => ({ suffix: sanitizeForFilename(value), rows }));
}

/** 把分组渲染成最终的 CSV 文本(可选每个文件都带表头) */
export function buildSplitFiles(opts: {
  header: string[];
  groups: SplitGroup[];
  delimiter: string;
  repeatHeader: boolean;
  prefix: string;
  bom?: string;
}): { filename: string; rows: number; csv: string }[] {
  const { header, groups, delimiter, repeatHeader, prefix, bom = "" } = opts;
  const base = prefix.trim() || "file";

  return groups.map((group, i) => {
    const includeHeader = repeatHeader || i === 0;
    const outRows = includeHeader ? [header, ...group.rows] : group.rows;
    const csvText = Papa.unparse(outRows, { delimiter });
    return {
      filename: `${base}-${group.suffix}.csv`,
      rows: group.rows.length,
      csv: bom + csvText,
    };
  });
}
