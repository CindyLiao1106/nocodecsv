import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nocodecsv.com"),
  title: "NoCodeCSV — Chat with Your CSV & Excel Files Using AI",
  description:
    "Upload any CSV or Excel file and ask questions in plain English. Get instant charts, insights, and data summaries. Free to start — no coding needed.",
  keywords: [
    "AI CSV analyzer", "AI Excel tool", "data analysis AI",
    "free CSV analysis", "AI data insights", "chat with CSV",
    "nocode csv", "no code data analysis",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "NoCodeCSV — AI Data Analysis, No Coding",
    description: "Upload CSV/Excel and ask questions in plain English. Free to start.",
    type: "website",
    url: "https://nocodecsv.com/",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "NoCodeCSV — AI Data Analysis, No Coding",
    description: "Upload CSV/Excel and ask questions in plain English. Free to start.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en">
        <body className="antialiased bg-white text-zinc-900 min-h-screen flex flex-col">
          <TooltipProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-center" richColors />
          </TooltipProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
