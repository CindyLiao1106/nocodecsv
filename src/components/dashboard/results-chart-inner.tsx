"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#ea580c", "#0891b2", "#ca8a04", "#be185d"];

interface Props {
  data: {
    type: "bar" | "line" | "pie" | "scatter";
    title: string;
    labels: string[];
    datasets: { label: string; data: number[] }[];
  };
}

export function ResultsChartInner({ data }: Props) {
  const chartData = data.labels.map((label, i) => {
    const row: Record<string, string | number> = { name: label };
    data.datasets.forEach((ds) => { row[ds.label] = ds.data[i] ?? 0; });
    return row;
  });

  const renderChart = () => {
    switch (data.type) {
      case "bar":
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#71717a" />
            <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
            <Tooltip />
            <Legend />
            {data.datasets.map((ds, i) => (
              <Bar key={ds.label} dataKey={ds.label} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#71717a" />
            <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
            <Tooltip />
            <Legend />
            {data.datasets.map((ds, i) => (
              <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
            ))}
          </LineChart>
        );

      case "pie":
        const pieRows = data.labels.map((label, i) => ({
          name: label,
          value: data.datasets[0]?.data[i] ?? 0,
        }));
        return (
          <PieChart>
            <Pie data={pieRows} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
              {pieRows.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case "scatter":
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#71717a" />
            <YAxis tick={{ fontSize: 12 }} stroke="#71717a" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
            <Legend />
            {data.datasets.map((ds, i) => (
              <Scatter key={ds.label} name={ds.label} data={chartData} fill={COLORS[i % COLORS.length]} />
            ))}
          </ScatterChart>
        );

      default:
        return <p className="text-zinc-500">Unsupported chart type: {data.type}</p>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg">{data.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
