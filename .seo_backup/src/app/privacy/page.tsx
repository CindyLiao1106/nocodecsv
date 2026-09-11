import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — NoCodeCSV",
  description: "How NoCodeCSV handles your data: files processed in memory, never stored, no third-party sharing.",
  alternates: { canonical: "https://nocodecsv.com/privacy" },
  openGraph: {
    title: "Privacy Policy — NoCodeCSV",
    description: "How NoCodeCSV handles your data: files processed in memory, never stored, no third-party sharing.",
    type: "website",
    url: "https://nocodecsv.com/privacy",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — NoCodeCSV",
    description: "How NoCodeCSV handles your data: files processed in memory, never stored.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc">
      <h1>Privacy Policy</h1>
      <p className="text-zinc-500">Last updated: August 1, 2026</p>

      <h2>1. What Data We Collect</h2>
      <p>
        We collect the <strong>minimum</strong> data needed to provide the service:
      </p>
      <ul>
        <li><strong>Account data</strong> — email address and authentication provider (Google, GitHub, or email) via Clerk. We do not store passwords ourselves.</li>
        <li><strong>Usage data</strong> — how many analyses you run per day, for enforcing the free tier limit.</li>
        <li><strong>Payment data</strong> — handled entirely by PayPal / Lemon Squeezy. We never see or store your credit card number.</li>
      </ul>

      <h2>2. Files You Upload</h2>
      <p>
        <strong>CSV and Excel files are processed entirely in memory.</strong> When you upload a file:
      </p>
      <ul>
        <li>The file is parsed in your browser (client-side JavaScript).</li>
        <li>A text representation of the first 3,000 rows is sent to the DeepSeek API for analysis.</li>
        <li>The file content is <strong>discarded immediately</strong> after the API response returns.</li>
        <li>We do <strong>not</strong> store your uploaded files on any server or database.</li>
      </ul>

      <h2>3. Third-Party Services</h2>
      <p>We rely on the following providers to operate the service:</p>
      <ul>
        <li><strong>DeepSeek</strong> — receives a text sample of your CSV (up to 5,000 tokens) for AI analysis. DeepSeek does not store API inputs for training.</li>
        <li><strong>Clerk</strong> — handles user authentication. Your email and login method are stored by Clerk.</li>
        <li><strong>PayPal / Lemon Squeezy</strong> — processes payments. We do not receive full payment details.</li>
        <li><strong>Vercel</strong> — hosts the application. Access logs are retained per Vercel&apos;s standard policy.</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use only essential cookies required for authentication (session cookies via Clerk).
        We do <strong>not</strong> use tracking cookies, analytics cookies, or advertising cookies.
      </p>

      <h2>5. Your Rights (GDPR & CCPA)</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Request a copy of your personal data.</li>
        <li>Request deletion of your account and all associated data.</li>
        <li>Withdraw consent at any time.</li>
      </ul>
      <p>To exercise these rights, contact us at <strong>privacy@nocodecsv.com</strong>.</p>

      <h2>6. Data Retention</h2>
      <ul>
        <li>Account data is retained as long as your account is active.</li>
        <li>Uploaded files are <strong>never stored</strong> — they exist only in your browser&apos;s memory during analysis.</li>
        <li>Daily usage counters reset at midnight UTC.</li>
      </ul>

      <h2>7. Contact</h2>
      <p>
        For privacy questions or data requests, email <strong>privacy@nocodecsv.com</strong>.
      </p>
    </div>
  );
}
