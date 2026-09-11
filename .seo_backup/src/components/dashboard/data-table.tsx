interface Props {
  columns: string[];
  rows: Record<string, string>[];
}

export function DataTable({ columns, rows }: Props) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-zinc-50 sticky top-0">
        <tr>
          <th className="text-left px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b">#</th>
          {columns.map((col) => (
            <th key={col} className="text-left px-3 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b whitespace-nowrap">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-100">
        {rows.slice(0, 100).map((row, i) => (
          <tr key={i} className="hover:bg-zinc-50">
            <td className="px-3 py-1.5 text-zinc-400 text-xs">{i + 1}</td>
            {columns.map((col) => (
              <td key={col} className="px-3 py-1.5 whitespace-nowrap max-w-[200px] truncate">
                {row[col] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
