"use client";

import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";
import {
  Upload,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileDown,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSplitFiles, groupRows, type SplitMode } from "@/lib/csv-split-core";
import { useWebMcpTool } from "@/lib/webmcp-imperative";

const LARGE_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const DEFAULT_ROWS_PER_FILE = 50000;
const DEFAULT_SIZE_PER_FILE_MB = 5;

type Chunk = {
  filename: string;
  rows: number;
  size: number;
  url: string;
};

const MODES: { value: SplitMode; label: string }[] = [
  { value: "rows", label: "By row count" },
  { value: "size", label: "By file size" },
  { value: "column", label: "By column value" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CsvSplitterTool() {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [delimiter, setDelimiter] = useState(",");
  const [header, setHeader] = useState<string[] | null>(null);
  const [dataRows, setDataRows] = useState<string[][]>([]);

  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");

  const [splitMode, setSplitMode] = useState<SplitMode>("rows");
  const [rowsPerFile, setRowsPerFile] = useState(DEFAULT_ROWS_PER_FILE);
  const [sizePerFileMB, setSizePerFileMB] = useState(DEFAULT_SIZE_PER_FILE_MB);
  const [splitColumnIndex, setSplitColumnIndex] = useState(0);

  const [repeatHeader, setRepeatHeader] = useState(true);
  const [encoding, setEncoding] = useState<"utf8" | "utf8-bom">("utf8");
  const [prefix, setPrefix] = useState("");

  const [processing, setProcessing] = useState(false);
  const [splitError, setSplitError] = useState("");
  const [chunks, setChunks] = useState<Chunk[] | null>(null);

  const isLargeFile = fileSize > LARGE_FILE_BYTES;

  const handleFile = useCallback((file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "tsv", "txt"].includes(ext)) {
      setParseError("Unsupported file type. Please upload a .csv, .tsv, or .txt file.");
      return;
    }

    setParseError("");
    setSplitError("");
    setChunks(null);
    setHeader(null);
    setDataRows([]);
    setRawFile(file);
    setFileName(file.name);
    setFileSize(file.size);
    setPrefix(file.name.replace(/\.[^./]+$/, ""));
    setParsing(true);

    const allRows: string[][] = [];
    let detected = ",";

    Papa.parse<string[]>(file, {
      delimiter: "",
      skipEmptyLines: true,
      worker: file.size > 2 * 1024 * 1024,
      chunk: (results) => {
        if (results.meta.delimiter) detected = results.meta.delimiter;
        allRows.push(...results.data);
      },
      complete: () => {
        setDelimiter(detected);
        setHeader(allRows[0] ?? []);
        setDataRows(allRows.slice(1));
        setSplitColumnIndex(0);
        setParsing(false);
      },
      error: () => {
        setParseError("Could not read this file. Make sure it's a plain-text CSV, TSV, or TXT file.");
        setParsing(false);
      },
    });
  }, []);

  const reset = useCallback(() => {
    chunks?.forEach((c) => URL.revokeObjectURL(c.url));
    setRawFile(null);
    setFileName("");
    setFileSize(0);
    setHeader(null);
    setDataRows([]);
    setParseError("");
    setSplitError("");
    setChunks(null);
    setSplitMode("rows");
    setRowsPerFile(DEFAULT_ROWS_PER_FILE);
    setSizePerFileMB(DEFAULT_SIZE_PER_FILE_MB);
    setRepeatHeader(true);
    setEncoding("utf8");
  }, [chunks]);

  const distinctColumnCount = useMemo(() => {
    if (!header || splitMode !== "column") return 0;
    const values = new Set<string>();
    for (const row of dataRows) values.add(row[splitColumnIndex] ?? "");
    return values.size;
  }, [header, dataRows, splitColumnIndex, splitMode]);

  const estimate = useMemo(() => {
    if (!header || dataRows.length === 0) return null;

    if (splitMode === "rows") {
      if (rowsPerFile <= 0) return null;
      const count = Math.ceil(dataRows.length / rowsPerFile);
      return `Will split into ${count.toLocaleString()} file${count === 1 ? "" : "s"}, about ${rowsPerFile.toLocaleString()} rows each (the last file may have fewer).`;
    }

    if (splitMode === "size") {
      if (sizePerFileMB <= 0) return null;
      const targetBytes = sizePerFileMB * 1024 * 1024;
      const count = Math.max(1, Math.ceil(fileSize / targetBytes));
      return `Will split into about ${count.toLocaleString()} file${count === 1 ? "" : "s"}, each close to ${sizePerFileMB} MB.`;
    }

    const count = distinctColumnCount;
    return `Will split into ${count.toLocaleString()} file${count === 1 ? "" : "s"} — one per distinct value in "${header[splitColumnIndex] || `column ${splitColumnIndex + 1}`}".`;
  }, [header, dataRows, splitMode, rowsPerFile, sizePerFileMB, fileSize, splitColumnIndex, distinctColumnCount]);

  const buildGroups = useCallback((): { suffix: string; rows: string[][] }[] => {
    // 算法在 @/lib/csv-split-core —— 页面与 WebMCP 命令式工具共用同一份实现
    return groupRows({
      mode: splitMode,
      dataRows,
      rowsPerFile,
      sizePerFileMB,
      delimiter,
      splitColumnIndex,
    });
  }, [splitMode, dataRows, rowsPerFile, sizePerFileMB, delimiter, splitColumnIndex]);

  const handleSplit = useCallback(() => {
    if (!header || dataRows.length === 0) return;

    setProcessing(true);
    setSplitError("");
    chunks?.forEach((c) => URL.revokeObjectURL(c.url));
    setChunks(null);

    setTimeout(() => {
      try {
        const groups = buildGroups();
        const bom = encoding === "utf8-bom" ? "\ufeff" : "";
        const files = buildSplitFiles({ header, groups, delimiter, repeatHeader, prefix, bom });

        const built: Chunk[] = files.map((file) => {
          const blob = new Blob([file.csv], { type: "text/csv;charset=utf-8" });
          return {
            filename: file.filename,
            rows: file.rows,
            size: blob.size,
            url: URL.createObjectURL(blob),
          };
        });

        setChunks(built);
      } catch {
        setSplitError("Something went wrong while splitting the file. Please try again.");
      } finally {
        setProcessing(false);
      }
    }, 20);
  }, [header, dataRows, buildGroups, encoding, prefix, repeatHeader, delimiter, chunks]);

  const handleDownloadAll = useCallback(() => {
    if (!chunks) return;
    chunks.forEach((chunk, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = chunk.url;
        a.download = chunk.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 250);
    });
  }, [chunks]);

  // ---- WebMCP 命令式工具:让 AI agent 直接把 CSV 内容当文本传进来拆分 ----
  // 声明式 API 拿不到文件参数(实测 schema 为空),所以这里用 registerTool 把
  // 「CSV 文本 + 每文件行数」暴露成参数;算法仍走 @/lib/csv-split-core,与页面按钮同一套。
  useWebMcpTool({
    name: "splitCsvText",
    description:
      "Splits CSV content into several smaller CSV files by row count, repeating the header row in every part. Use this when a CSV is too large for Excel or Google Sheets, or when the CSV content is available as text rather than as a file. Returns the resulting CSV files as text plus a row/byte count for each.",
    inputSchema: {
      type: "object",
      properties: {
        csvText: {
          type: "string",
          description:
            "The complete CSV content to split, including the header row. Comma, semicolon or tab delimited — the delimiter is detected automatically and preserved.",
        },
        rowsPerFile: {
          type: "number",
          description:
            "Maximum number of data rows per output file. The header row is not counted. Defaults to 50000 when omitted.",
        },
      },
      required: ["csvText"],
    },
    annotations: { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false },
    execute: ({ csvText, rowsPerFile }) => {
      const text = typeof csvText === "string" ? csvText : "";
      if (!text.trim()) {
        return JSON.stringify({ ok: false, error: "csvText is empty — pass the CSV content to split." });
      }

      const perFile =
        typeof rowsPerFile === "number" && Number.isFinite(rowsPerFile) && rowsPerFile >= 1
          ? Math.floor(rowsPerFile)
          : DEFAULT_ROWS_PER_FILE;

      const parsed = Papa.parse<string[]>(text, { delimiter: "", skipEmptyLines: true });
      const rows = parsed.data.filter((row) => Array.isArray(row));
      const detectedDelimiter = parsed.meta.delimiter || ",";
      if (rows.length < 2) {
        return JSON.stringify({
          ok: false,
          error: "Need at least a header row and one data row to split.",
          totalRowsParsed: rows.length,
        });
      }

      const headerRow = rows[0];
      const dataRows = rows.slice(1);
      const groups = groupRows({
        mode: "rows",
        dataRows,
        rowsPerFile: perFile,
        sizePerFileMB: DEFAULT_SIZE_PER_FILE_MB,
        delimiter: detectedDelimiter,
        splitColumnIndex: 0,
      });
      const files = buildSplitFiles({
        header: headerRow,
        groups,
        delimiter: detectedDelimiter,
        repeatHeader: true,
        prefix: "split",
      });

      // 输出预算:返回的文本可能很大 —— 超过 150,000 字符时只带第一个文件的正文,
      // 其余只给元数据,并如实标注截断(agent 需要正文可让它自己缩小 rowsPerFile 重调)。
      const MAX_CHARS = 150000;
      let budget = MAX_CHARS;
      const outFiles: {
        filename: string;
        rows: number;
        bytes: number;
        csv?: string;
        csvOmitted?: string;
      }[] = [];
      for (const file of files) {
        const bytes = new TextEncoder().encode(file.csv).length;
        if (file.csv.length <= budget) {
          outFiles.push({ filename: file.filename, rows: file.rows, bytes, csv: file.csv });
          budget -= file.csv.length;
        } else {
          outFiles.push({
            filename: file.filename,
            rows: file.rows,
            bytes,
            csvOmitted:
              "Omitted to keep the response small — call the tool again with a smaller rowsPerFile, or fetch this file from the page download links.",
          });
        }
      }

      return JSON.stringify(
        {
          ok: true,
          mode: "rows",
          delimiter: detectedDelimiter,
          headerRow,
          totalDataRows: dataRows.length,
          rowsPerFile: perFile,
          fileCount: files.length,
          headerRepeatedInEveryFile: true,
          truncated: outFiles.some((f) => f.csvOmitted),
          files: outFiles,
          note: "Files are computed in the browser; nothing was uploaded. The same tool is described for humans at https://nocodecsv.com/tools/csv-splitter",
        },
        null,
        2
      );
    },
  });

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      {!rawFile ? (
        <div
          className={`relative rounded-xl border-2 border-dashed p-10 sm:p-14 text-center transition-colors duration-150 ease-out cursor-pointer
            ${dragging ? "border-blue-400 bg-blue-50" : "border-zinc-300 hover:border-blue-300 hover:bg-zinc-50"}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          onClick={() => document.getElementById("toolFileInput")?.click()}
        >
          {/* 真实存在的文件输入:AI agent / 屏幕阅读器靠它找到上传控件 */}
          <label htmlFor="toolFileInput" className="sr-only">
            CSV file to split
          </label>
          <input
            id="toolFileInput"
            name="file"
            type="file"
            accept=".csv,.tsv,.txt"
            aria-label="Choose a file to process"
            toolparamdescription="The file to process (.csv,.tsv,.txt). Up to 25MB."
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
          <Upload className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
          <p className="text-base font-medium text-zinc-700">
            Drop your file here, or <span className="text-blue-600">browse</span>
          </p>
          <p className="mt-2 text-sm text-zinc-400">.csv, .tsv, .txt — processed entirely in your browser</p>
          {parseError && (
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" /> {parseError}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{fileName}</p>
              <p className="text-xs text-zinc-500">
                {parsing
                  ? "Reading file…"
                  : `${dataRows.length.toLocaleString()} data rows (excluding header) · ${header?.length ?? 0} columns · ${formatBytes(fileSize)}`}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 shrink-0">
              <RefreshCw className="h-3.5 w-3.5" /> Change file
            </Button>
          </div>

          {isLargeFile && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Large file ({formatBytes(fileSize)}) — it&apos;s read in chunks so your browser doesn&apos;t freeze.
                This may take a few seconds.
              </p>
            </div>
          )}

          {parseError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {parseError}
            </div>
          )}

          {!parsing && header && (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Split mode</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setSplitMode(m.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors duration-150 ease-out
                        ${splitMode === m.value ? "border-blue-600 bg-blue-50 text-blue-700" : "border-zinc-200 text-zinc-600 hover:border-blue-300"}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {splitMode === "rows" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Rows per file</label>
                    <input
                      type="number"
                      min={1}
                      step={1000}
                      value={rowsPerFile}
                      onChange={(e) => setRowsPerFile(Math.max(1, Number(e.target.value) || 0))}
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}

                {splitMode === "size" && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Megabytes per file</label>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={sizePerFileMB}
                      onChange={(e) => setSizePerFileMB(Math.max(1, Number(e.target.value) || 0))}
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                )}

                {splitMode === "column" && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">Split by column</label>
                    <select
                      value={splitColumnIndex}
                      onChange={(e) => setSplitColumnIndex(Number(e.target.value))}
                      className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      {header.map((h, i) => (
                        <option key={i} value={i}>
                          {h || `Column ${i + 1}`}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-zinc-400">
                      {distinctColumnCount} distinct value{distinctColumnCount === 1 ? "" : "s"} found — that&apos;s
                      how many files you&apos;ll get.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Output encoding</label>
                  <select
                    value={encoding}
                    onChange={(e) => setEncoding(e.target.value as "utf8" | "utf8-bom")}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="utf8">UTF-8</option>
                    <option value="utf8-bom">UTF-8 with BOM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1.5">Filename prefix</label>
                  <input
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="flex items-end pb-1.5">
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="checkbox"
                      checked={repeatHeader}
                      onChange={(e) => setRepeatHeader(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                    />
                    Repeat header in every file
                  </label>
                </div>
              </div>

              {estimate && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  {estimate}
                </div>
              )}

              {splitError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {splitError}
                </div>
              )}

              <Button onClick={handleSplit} disabled={processing} size="lg" className="gap-2">
                <Download className="h-4 w-4" />
                {processing ? "Splitting…" : "Split & Download"}
              </Button>

              {chunks && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>
                        Split into {chunks.length} file{chunks.length === 1 ? "" : "s"}.
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDownloadAll} className="gap-1.5">
                      <FileDown className="h-3.5 w-3.5" /> Download all {chunks.length} files
                    </Button>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-zinc-200">
                    <table className="w-full text-sm">
                      <thead className="bg-zinc-50">
                        <tr className="text-left">
                          <th className="p-2.5 font-semibold text-zinc-700 border-b border-zinc-200">File</th>
                          <th className="p-2.5 font-semibold text-zinc-700 border-b border-zinc-200">Rows</th>
                          <th className="p-2.5 font-semibold text-zinc-700 border-b border-zinc-200">Size</th>
                          <th className="p-2.5 font-semibold text-zinc-700 border-b border-zinc-200">&nbsp;</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {chunks.map((c) => (
                          <tr key={c.filename}>
                            <td className="p-2.5 border-b border-zinc-100 font-medium text-zinc-900">{c.filename}</td>
                            <td className="p-2.5 border-b border-zinc-100 text-zinc-500">{c.rows.toLocaleString()}</td>
                            <td className="p-2.5 border-b border-zinc-100 text-zinc-500">{formatBytes(c.size)}</td>
                            <td className="p-2.5 border-b border-zinc-100">
                              <a
                                href={c.url}
                                download={c.filename}
                                className="inline-flex items-center gap-1 text-blue-600 underline"
                              >
                                <Download className="h-3.5 w-3.5" /> Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
