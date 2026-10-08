"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  RefreshCw,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LARGE_FILE_BYTES = 20 * 1024 * 1024; // 20MB
const PREVIEW_ROWS = 8;

type RuleId =
  | "trim"
  | "headers"
  | "quotes"
  | "emptyRows"
  | "emptyCols"
  | "dupes"
  | "placeholders";

type Rule = {
  id: RuleId;
  label: string;
  hint: string;
  defaultOn: boolean;
};

const RULES: Rule[] = [
  {
    id: "trim",
    label: "Trim spaces around every value",
    hint: "Removes leading and trailing spaces, and turns non-breaking spaces (character code 160) into normal spaces. Those invisible characters are the usual reason two values that look identical will not match.",
    defaultOn: true,
  },
  {
    id: "headers",
    label: "Tidy header names",
    hint: "Trims the header row, collapses double spaces, and names unnamed columns column_1, column_2, and so on.",
    defaultOn: true,
  },
  {
    id: "quotes",
    label: "Remove stray quotes around values",
    hint: "Strips one layer of straight quotes that some exports wrap around every field.",
    defaultOn: true,
  },
  {
    id: "emptyRows",
    label: "Remove empty rows",
    hint: "Deletes rows where every cell is empty. Blank lines in the middle of a file break sorting and formulas.",
    defaultOn: true,
  },
  {
    id: "emptyCols",
    label: "Remove empty columns",
    hint: "Deletes columns that have no value in any data row.",
    defaultOn: true,
  },
  {
    id: "dupes",
    label: "Remove duplicate rows",
    hint: "Compares the whole row after the other cleanups have run, so a row with an extra space counts as the duplicate it is.",
    defaultOn: true,
  },
  {
    id: "placeholders",
    label: "Drop rows that are placeholders only",
    hint: 'Removes rows where every cell is NA, N/A, null, nil, none, -, or #N/A. Off by default: in some files those cells carry meaning.',
    defaultOn: false,
  },
];

const PLACEHOLDER_VALUES = new Set([
  "n/a",
  "na",
  "null",
  "nil",
  "none",
  "-",
  "--",
  "#n/a",
  "#null!",
  "undefined",
]);

function toText(value: unknown): string {
  if (value === null || value === undefined) return "";
  return typeof value === "string" ? value : String(value);
}

function trimValue(value: string): string {
  return value.replace(/\u00a0/g, " ").replace(/^\s+|\s+$/g, "");
}

function stripOneQuoteLayer(value: string): string {
  if (value.length < 2) return value;
  const first = value[0];
  const last = value[value.length - 1];
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    return value.slice(1, -1);
  }
  return value;
}

type Stats = {
  rowsIn: number;
  rowsOut: number;
  cellsTrimmed: number;
  headersFixed: number;
  quotesStripped: number;
  emptyRowsRemoved: number;
  emptyColsRemoved: number;
  duplicateRowsRemoved: number;
  placeholderRowsRemoved: number;
};

function cleanTable(
  rowsIn: string[][],
  rules: Record<RuleId, boolean>
): { rows: string[][]; stats: Stats } {
  const stats: Stats = {
    rowsIn: rowsIn.length,
    rowsOut: 0,
    cellsTrimmed: 0,
    headersFixed: 0,
    quotesStripped: 0,
    emptyRowsRemoved: 0,
    emptyColsRemoved: 0,
    duplicateRowsRemoved: 0,
    placeholderRowsRemoved: 0,
  };

  let rows: string[][] = rowsIn.map((row) => row.map(toText));

  if (rules.trim) {
    rows = rows.map((row) =>
      row.map((cell) => {
        const next = trimValue(cell);
        if (next !== cell) stats.cellsTrimmed += 1;
        return next;
      })
    );
  }

  if (rules.headers && rows.length > 0) {
    rows[0] = rows[0].map((cell, index) => {
      const tidy = cell.replace(/\s+/g, " ").trim();
      const final = tidy === "" ? `column_${index + 1}` : tidy;
      if (final !== cell) stats.headersFixed += 1;
      return final;
    });
  }

  if (rules.quotes) {
    rows = rows.map((row, rowIndex) =>
      row.map((cell) => {
        if (rowIndex === 0) return cell;
        const next = stripOneQuoteLayer(cell);
        if (next !== cell) stats.quotesStripped += 1;
        return next;
      })
    );
  }

  const header = rows.length > 0 ? rows[0] : [];
  let body = rows.slice(1);

  if (rules.placeholders) {
    const before = body.length;
    body = body.filter(
      (row) => !row.every((cell) => PLACEHOLDER_VALUES.has(cell.trim().toLowerCase()))
    );
    stats.placeholderRowsRemoved = before - body.length;
  }

  if (rules.emptyRows) {
    const before = body.length;
    body = body.filter((row) => row.some((cell) => cell.trim() !== ""));
    stats.emptyRowsRemoved = before - body.length;
  }

  const width = Math.max(
    header.length,
    body.reduce((max, row) => Math.max(max, row.length), 0)
  );

  if (rules.emptyCols && body.length > 0 && width > 0) {
    const keep: number[] = [];
    for (let column = 0; column < width; column += 1) {
      const hasValue = body.some((row) => (row[column] ?? "").trim() !== "");
      if (hasValue) keep.push(column);
      else stats.emptyColsRemoved += 1;
    }
    if (keep.length > 0 && keep.length !== width) {
      const trimmedHeader = header.map((cell, index) => (keep.includes(index) ? cell : ""));
      const reduced = body.map((row) => keep.map((index) => row[index] ?? ""));
      const nextHeader = trimmedHeader.filter((_, index) => keep.includes(index));
      const nextRows = [nextHeader, ...reduced];
      header.length = 0;
      header.push(...nextHeader);
      body = reduced;
      rows = nextRows;
    }
  }

  if (rules.dupes) {
    const seen = new Set<string>();
    const kept: string[][] = [];
    for (const row of body) {
      const key = row.join("\u0001");
      if (seen.has(key)) {
        stats.duplicateRowsRemoved += 1;
        continue;
      }
      seen.add(key);
      kept.push(row);
    }
    body = kept;
  }

  const outRows: string[][] =
    header.length > 0 ? [header, ...body] : body;
  stats.rowsOut = outRows.length;
  return { rows: outRows, stats };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function defaultRules(): Record<RuleId, boolean> {
  const out = {} as Record<RuleId, boolean>;
  for (const rule of RULES) out[rule.id] = rule.defaultOn;
  return out;
}

export function CsvCleanerTool() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [rowsIn, setRowsIn] = useState<string[][]>([]);
  const [delimiter, setDelimiter] = useState<string>(",");
  const [dragging, setDragging] = useState(false);
  const [rules, setRules] = useState<Record<RuleId, boolean>>(defaultRules);
  const [addBom, setAddBom] = useState(true);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const result = useMemo(() => {
    if (rowsIn.length === 0) return null;
    return cleanTable(rowsIn, rules);
  }, [rowsIn, rules]);

  const outName = useMemo(() => {
    if (!fileName) return "cleaned.csv";
    const base = fileName.replace(/\.(csv|tsv|txt)$/i, "");
    return `${base}-cleaned.csv`;
  }, [fileName]);

  const downloadText = useMemo(() => {
    if (!result) return "";
    const csv = Papa.unparse(result.rows, { delimiter: "," });
    return addBom ? `\uFEFF${csv}` : csv;
  }, [result, addBom]);

  useEffect(() => {
    if (!downloadText) {
      setDownloadUrl("");
      return;
    }
    const blob = new Blob([downloadText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    setDownloadUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [downloadText]);

  const handleFile = useCallback((file: File) => {
    setError("");
    setRowsIn([]);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "tsv", "txt"].includes(ext)) {
      setError("Unsupported file type. Please choose a .csv, .tsv, or .txt file.");
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    Papa.parse<string[]>(file, {
      delimiter: "",
      skipEmptyLines: false,
      complete: (results) => {
        const data = results.data.map((row) => row.map(toText));
        if (data.length === 0) {
          setError("This file has no readable rows.");
          return;
        }
        setDelimiter(results.meta.delimiter || ",");
        setRowsIn(data);
      },
      error: () => {
        setError("Could not read this file. Make sure it is a plain-text CSV or TSV file.");
      },
    });
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const toggleRule = useCallback((id: RuleId) => {
    setRules((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  const reset = useCallback(() => {
    setRowsIn([]);
    setFileName("");
    setFileSize(0);
    setError("");
    setRules(defaultRules());
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const stats = result?.stats;
  const changed =
    stats !== undefined &&
    (stats.rowsIn !== stats.rowsOut ||
      stats.cellsTrimmed > 0 ||
      stats.headersFixed > 0 ||
      stats.quotesStripped > 0 ||
      stats.emptyColsRemoved > 0);

  return (
    <div className="space-y-6">
      {rowsIn.length === 0 && (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors duration-150 ${
            dragging ? "border-blue-600 bg-blue-50" : "border-zinc-300 bg-white hover:border-blue-400"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-blue-600" />
          <p className="mt-3 font-medium text-zinc-800">Drop your CSV here</p>
          <p className="mt-1 text-sm text-zinc-500">
            or click to choose a .csv, .tsv, or .txt file — it never leaves your device
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.tsv,.txt,text/csv"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {rowsIn.length > 0 && (
        <>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">{fileName}</span>
                <span className="mx-2 text-zinc-300">·</span>
                {formatBytes(fileSize)}
                <span className="mx-2 text-zinc-300">·</span>
                {rowsIn.length} rows
                <span className="mx-2 text-zinc-300">·</span>
                delimiter{" "}
                <code className="rounded bg-zinc-100 px-1">
                  {delimiter === "\t" ? "tab" : delimiter}
                </code>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Choose another file
              </Button>
            </div>
            {fileSize > LARGE_FILE_BYTES && (
              <p className="mt-3 text-sm text-amber-700">
                This file is over 20 MB. Cleaning still runs in your browser, but a slow device may
                pause for a few seconds.
              </p>
            )}
          </div>

          <fieldset className="rounded-xl border border-zinc-200 bg-white p-4">
            <legend className="px-1 text-sm font-semibold text-zinc-800">What to clean</legend>
            <div className="space-y-3">
              {RULES.map((rule) => (
                <label key={rule.id} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={rules[rule.id]}
                    onChange={() => toggleRule(rule.id)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-blue-600"
                  />
                  <span>
                    <span className="font-medium text-zinc-800">{rule.label}</span>
                    <span className="block text-zinc-500">{rule.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {stats && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="flex items-center gap-2 font-semibold text-zinc-900">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                What changed
              </h2>
              <ul className="mt-3 space-y-1 text-sm text-zinc-600">
                <li>
                  Rows: <strong className="text-zinc-900">{stats.rowsIn}</strong> in,{" "}
                  <strong className="text-zinc-900">{stats.rowsOut}</strong> out
                </li>
                {stats.emptyRowsRemoved > 0 && (
                  <li>{stats.emptyRowsRemoved} empty rows removed</li>
                )}
                {stats.duplicateRowsRemoved > 0 && (
                  <li>{stats.duplicateRowsRemoved} duplicate rows removed</li>
                )}
                {stats.emptyColsRemoved > 0 && (
                  <li>{stats.emptyColsRemoved} empty columns removed</li>
                )}
                {stats.cellsTrimmed > 0 && <li>{stats.cellsTrimmed} cells trimmed</li>}
                {stats.quotesStripped > 0 && (
                  <li>{stats.quotesStripped} values unquoted</li>
                )}
                {stats.headersFixed > 0 && <li>{stats.headersFixed} header cells tidied</li>}
                {stats.placeholderRowsRemoved > 0 && (
                  <li>{stats.placeholderRowsRemoved} placeholder rows removed</li>
                )}
                {!changed && <li>Nothing needed cleaning with the rules selected.</li>}
              </ul>

              <label className="mt-4 flex items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  checked={addBom}
                  onChange={() => setAddBom((value) => !value)}
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600"
                />
                Add a UTF-8 BOM so Excel opens accented characters correctly
              </label>

              <div className="mt-4">
                {downloadUrl && (
                  <a href={downloadUrl} download={outName}>
                    <Button size="lg" className="w-full sm:w-auto">
                      <Download className="mr-2 h-4 w-4" />
                      Download {outName}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}

          {result && (
            <div className="rounded-xl border border-zinc-200 bg-white p-4">
              <h2 className="font-semibold text-zinc-900">
                First {Math.min(PREVIEW_ROWS, Math.max(result.rows.length - 1, 0))} rows after
                cleaning
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {result.rows[0]?.map((cell, index) => (
                        <th
                          key={`h-${index}`}
                          className="border-b border-zinc-200 bg-zinc-50 p-2 font-semibold text-zinc-700"
                        >
                          {cell || <span className="text-zinc-400">(empty)</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.slice(1, PREVIEW_ROWS + 1).map((row, rowIndex) => (
                      <tr key={`r-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={`c-${rowIndex}-${cellIndex}`}
                            className="border-b border-zinc-100 p-2 text-zinc-600"
                          >
                            {cell}
                          </td>
                        ))}
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
  );
}
