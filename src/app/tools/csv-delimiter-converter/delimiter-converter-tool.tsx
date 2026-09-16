"use client";

import { useCallback, useMemo, useState } from "react";
import Papa from "papaparse";
import { Upload, AlertCircle, AlertTriangle, CheckCircle2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const LARGE_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const PREVIEW_ROWS = 10;

const TARGET_PRESETS = [
  { value: ",", label: "Comma ( , )" },
  { value: ";", label: "Semicolon ( ; )" },
  { value: "\t", label: "Tab" },
  { value: "|", label: "Pipe ( | )" },
  { value: "custom", label: "Custom…" },
];

function delimiterLabel(d: string): string {
  switch (d) {
    case ",":
      return "Comma ( , )";
    case ";":
      return "Semicolon ( ; )";
    case "\t":
      return "Tab";
    case "|":
      return "Pipe ( | )";
    case " ":
      return "Space";
    default:
      return d ? `Custom ( ${d} )` : "Unknown";
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type Result = {
  rows: number;
  cols: number;
  url: string;
  filename: string;
};

export function DelimiterConverterTool() {
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [dragging, setDragging] = useState(false);

  const [detectedDelimiter, setDetectedDelimiter] = useState<string | null>(null);
  const [sourceDelimiter, setSourceDelimiter] = useState(",");
  const [targetPreset, setTargetPreset] = useState(",");
  const [targetCustom, setTargetCustom] = useState("");

  const [keepQuotes, setKeepQuotes] = useState(true);
  const [keepHeader, setKeepHeader] = useState(true);
  const [encoding, setEncoding] = useState<"utf8" | "utf8-bom">("utf8");

  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const targetDelimiter = targetPreset === "custom" ? targetCustom : targetPreset;
  const isLargeFile = fileSize > LARGE_FILE_BYTES;

  const refreshPreview = useCallback((file: File, delimiter: string) => {
    Papa.parse<string[]>(file, {
      delimiter,
      preview: PREVIEW_ROWS + 1,
      skipEmptyLines: true,
      complete: (results) => {
        setPreviewRows(results.data.slice(0, PREVIEW_ROWS));
      },
    });
  }, []);

  const handleFile = useCallback((file: File) => {
    setError("");
    setResult(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "tsv", "txt"].includes(ext)) {
      setError("Unsupported file type. Please upload a .csv, .tsv, or .txt file.");
      return;
    }

    setRawFile(file);
    setFileName(file.name);
    setFileSize(file.size);

    Papa.parse<string[]>(file, {
      delimiter: "", // auto-detect
      preview: PREVIEW_ROWS + 1,
      skipEmptyLines: true,
      complete: (results) => {
        const detected = results.meta.delimiter || ",";
        setDetectedDelimiter(detected);
        setSourceDelimiter(detected);
        setPreviewRows(results.data.slice(0, PREVIEW_ROWS));
      },
      error: () => {
        setError("Could not read this file. Make sure it's a plain-text CSV or TSV file.");
      },
    });
  }, []);

  const handleSourceDelimiterChange = useCallback(
    (value: string) => {
      setSourceDelimiter(value);
      if (rawFile) refreshPreview(rawFile, value);
    },
    [rawFile, refreshPreview]
  );

  const beforeText = useMemo(() => {
    if (previewRows.length === 0) return "";
    return previewRows.map((row) => row.join(sourceDelimiter === "\t" ? "  →  " : sourceDelimiter)).join("\n");
  }, [previewRows, sourceDelimiter]);

  const afterText = useMemo(() => {
    if (previewRows.length === 0) return "";
    const rows = keepHeader ? previewRows : previewRows.slice(1);
    if (rows.length === 0) return "";
    return Papa.unparse(rows, { delimiter: targetDelimiter || ",", quotes: keepQuotes });
  }, [previewRows, keepHeader, keepQuotes, targetDelimiter]);

  const handleConvert = useCallback(() => {
    if (!rawFile) return;
    if (!targetDelimiter) {
      setError("Pick or type a target delimiter.");
      return;
    }

    setProcessing(true);
    setError("");
    setResult(null);

    const rows: string[][] = [];
    Papa.parse<string[]>(rawFile, {
      delimiter: sourceDelimiter,
      skipEmptyLines: true,
      worker: rawFile.size > 2 * 1024 * 1024,
      chunk: (results) => {
        rows.push(...results.data);
      },
      complete: () => {
        try {
          const outputRows = keepHeader ? rows : rows.slice(1);
          const csvOut = Papa.unparse(outputRows, { delimiter: targetDelimiter, quotes: keepQuotes });
          const bom = encoding === "utf8-bom" ? "﻿" : "";
          const blob = new Blob([bom + csvOut], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const base = rawFile.name.replace(/\.[^./]+$/, "");

          setResult({
            rows: outputRows.length,
            cols: outputRows[0]?.length ?? 0,
            url,
            filename: `${base}-delimited.csv`,
          });
        } catch {
          setError("Conversion failed while building the output file. Please try again.");
        } finally {
          setProcessing(false);
        }
      },
      error: () => {
        setError("Conversion failed. The file may be corrupted or not valid CSV/TSV.");
        setProcessing(false);
      },
    });
  }, [rawFile, sourceDelimiter, targetDelimiter, keepHeader, keepQuotes, encoding]);

  const reset = useCallback(() => {
    setRawFile(null);
    setFileName("");
    setFileSize(0);
    setDetectedDelimiter(null);
    setPreviewRows([]);
    setResult(null);
    setError("");
  }, []);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6">
      {!rawFile ? (
        <div
          className={`relative rounded-xl border-2 border-dashed p-10 sm:p-14 text-center transition-colors cursor-pointer
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
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".csv,.tsv,.txt";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }}
        >
          <Upload className="mx-auto h-10 w-10 text-zinc-400 mb-3" />
          <p className="text-base font-medium text-zinc-700">
            Drop your file here, or <span className="text-blue-600">browse</span>
          </p>
          <p className="mt-2 text-sm text-zinc-400">.csv, .tsv, .txt — processed entirely in your browser</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File info */}
          <div className="flex items-center justify-between gap-3 rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-900 truncate">{fileName}</p>
              <p className="text-xs text-zinc-500">{formatBytes(fileSize)}</p>
            </div>
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 shrink-0">
              <RefreshCw className="h-3.5 w-3.5" /> Change file
            </Button>
          </div>

          {isLargeFile && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Large file ({formatBytes(fileSize)}) — it will be processed in chunks so your browser doesn&apos;t
                freeze. This may take a few seconds.
              </p>
            </div>
          )}

          {/* Delimiter settings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Detected separator{detectedDelimiter ? `: ${delimiterLabel(detectedDelimiter)}` : ""}
              </label>
              <select
                value={sourceDelimiter}
                onChange={(e) => handleSourceDelimiterChange(e.target.value)}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value=",">Comma ( , )</option>
                <option value=";">Semicolon ( ; )</option>
                <option value={"\t"}>Tab</option>
                <option value="|">Pipe ( | )</option>
                <option value=" ">Space</option>
                {detectedDelimiter && ![",", ";", "\t", "|", " "].includes(detectedDelimiter) && (
                  <option value={detectedDelimiter}>{delimiterLabel(detectedDelimiter)}</option>
                )}
              </select>
              <p className="mt-1 text-xs text-zinc-400">Wrong guess? Override it here.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Convert to</label>
              <div className="flex gap-2">
                <select
                  value={targetPreset}
                  onChange={(e) => setTargetPreset(e.target.value)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  {TARGET_PRESETS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {targetPreset === "custom" && (
                  <input
                    value={targetCustom}
                    onChange={(e) => setTargetCustom(e.target.value.slice(0, 3))}
                    placeholder="e.g. ~"
                    className="h-9 w-20 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">Quotes</label>
              <select
                value={keepQuotes ? "keep" : "strip"}
                onChange={(e) => setKeepQuotes(e.target.value === "keep")}
                className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="keep">Preserve where needed</option>
                <option value="strip">Remove all quotes</option>
              </select>
            </div>

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

            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={keepHeader}
                  onChange={(e) => setKeepHeader(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 accent-blue-600"
                />
                Keep header row
              </label>
            </div>
          </div>

          {/* Before / after preview */}
          {previewRows.length > 0 && (
            <div>
              <p className="text-sm font-medium text-zinc-700 mb-2">Preview (first {previewRows.length} rows)</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wide">Before</p>
                  <pre className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 overflow-x-auto whitespace-pre">
                    {beforeText}
                  </pre>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-600 mb-1.5 uppercase tracking-wide">After</p>
                  <pre className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-zinc-700 overflow-x-auto whitespace-pre">
                    {afterText}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleConvert} disabled={processing} size="lg" className="gap-2">
              <Download className="h-4 w-4" />
              {processing ? "Converting…" : "Convert & Download"}
            </Button>

            {result && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>
                  {result.rows.toLocaleString()} rows · {result.cols} columns · matches original
                </span>
              </div>
            )}
          </div>

          {result && (
            <a
              href={result.url}
              download={result.filename}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 underline"
            >
              <Download className="h-3.5 w-3.5" /> Download {result.filename}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
