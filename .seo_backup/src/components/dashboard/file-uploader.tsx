"use client";

import { useCallback, useState } from "react";
import { Upload, FileSpreadsheet, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface Props {
  onParsed: (data: { name: string; content: string; columns: string[]; rows: Record<string, string>[] }) => void;
}

const MAX_SIZE = 25 * 1024 * 1024; // 25MB

function parseCSV(text: string): { columns: string[]; rows: Record<string, string>[]; csvText: string } {
  const result = Papa.parse(text, { header: true, skipEmptyLines: true });
  const columns = result.meta.fields || [];
  const rows = result.data as Record<string, string>[];
  // Re-serialize for AI: generate clean CSV
  const csvText = Papa.unparse({ fields: columns, data: rows });
  return { columns, rows, csvText };
}

function parseExcel(buffer: ArrayBuffer): { columns: string[]; rows: Record<string, string>[]; csvText: string } {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws, { defval: "" });
  const columns = json.length > 0 ? Object.keys(json[0]) : [];
  const csvText = Papa.unparse({ fields: columns, data: json });
  return { columns, rows: json, csvText };
}

export function FileUploader({ onParsed }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const processFile = useCallback((file: File) => {
    setError("");

    if (file.size > MAX_SIZE) {
      setError("File too large. Maximum size is 25MB.");
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["csv", "xlsx", "xls", "tsv"].includes(ext)) {
      setError("Unsupported format. Please upload CSV, Excel (.xlsx, .xls), or TSV.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const isExcel = ext === "xlsx" || ext === "xls";
        let result: { columns: string[]; rows: Record<string, string>[]; csvText: string };

        if (isExcel) {
          result = parseExcel(e.target!.result as ArrayBuffer);
        } else {
          result = parseCSV(e.target!.result as string);
        }

        if (result.columns.length === 0 || result.rows.length === 0) {
          setError("File appears to be empty. Please check and try again.");
          return;
        }

        onParsed({
          name: file.name,
          content: result.csvText,
          columns: result.columns,
          rows: result.rows,
        });
      } catch {
        setError("Failed to parse file. Make sure it's a valid CSV or Excel file.");
      }
    };

    if (ext === "xlsx" || ext === "xls") {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  }, [onParsed]);

  return (
    <div>
      <div
        className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors cursor-pointer
          ${dragging ? "border-blue-400 bg-blue-50" : "border-zinc-300 hover:border-blue-300 hover:bg-zinc-50"}
          ${error ? "border-red-300 bg-red-50" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          if (file) processFile(file);
        }}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".csv,.tsv,.xlsx,.xls";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) processFile(file);
          };
          input.click();
        }}
      >
        <Upload className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
        <p className="text-lg font-medium text-zinc-700">
          Drop your file here, or <span className="text-blue-600">browse</span>
        </p>
        <p className="mt-2 text-sm text-zinc-400">CSV, Excel (.xlsx, .xls), TSV — up to 25MB</p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
