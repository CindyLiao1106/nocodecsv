import { Card, CardContent } from "@/components/ui/card";
import { FileSpreadsheet, MessageSquare, BarChart3, Download, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: FileSpreadsheet,
    title: "CSV, Excel & More",
    description: "Drag and drop any .csv, .xlsx, or .xls file. We handle parsing, even for large files.",
  },
  {
    icon: MessageSquare,
    title: "Ask in Plain English",
    description: "\"Show me top 10 products by revenue\", \"What's the trend over Q3?\" — talk like you'd talk to an analyst.",
  },
  {
    icon: BarChart3,
    title: "Instant Charts",
    description: "AI picks the best visualization. Bar, line, pie, scatter — all generated in seconds.",
  },
  {
    icon: Download,
    title: "Export & Share",
    description: "Download charts as PNG and answers as CSV. Share insights with your team in one click.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    description: "Your data never leaves the session. Files processed in memory and discarded immediately.",
  },
  {
    icon: Zap,
    title: "DeepSeek Powered",
    description: "Same reasoning as GPT-4 at 1/20th the cost. More free analyses for you, higher margins for us.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Everything you need to analyze data
          <br />
          <span className="text-blue-600">without the learning curve</span>
        </h2>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
          No formulas, no pivot tables, no waiting for the data team.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} className="border-zinc-200 hover:border-blue-200 transition-colors">
            <CardContent className="pt-6">
              <f.icon className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
