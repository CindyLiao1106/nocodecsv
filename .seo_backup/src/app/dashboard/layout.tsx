import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Data Analysis Dashboard — Analyze CSV & Excel Online",
  description: "Upload your CSV, Excel, or TSV file and ask questions in plain English. Get instant charts, insights, and summaries — right in your browser.",
  alternates: { canonical: "https://nocodecsv.com/dashboard" },
  openGraph: {
    title: "AI Data Analysis Dashboard — Analyze CSV & Excel Online",
    description: "Upload your CSV, Excel, or TSV file and ask questions in plain English. Get instant charts and insights.",
    type: "website",
    url: "https://nocodecsv.com/dashboard",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Data Analysis Dashboard — Analyze CSV & Excel Online",
    description: "Upload your CSV, Excel, or TSV file and ask questions in plain English.",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
