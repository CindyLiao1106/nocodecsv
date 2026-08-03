import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — NoCodeCSV",
  description: "Terms of Service for NoCodeCSV: usage limits, payments, refunds, and acceptable use policy.",
  alternates: { canonical: "https://nocodecsv.com/terms" },
  openGraph: {
    title: "Terms of Service — NoCodeCSV",
    description: "Terms of Service for NoCodeCSV: usage limits, payments, refunds, and acceptable use policy.",
    type: "website",
    url: "https://nocodecsv.com/terms",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — NoCodeCSV",
    description: "Terms of Service for NoCodeCSV: usage limits, payments, refunds, and acceptable use policy.",
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc">
      <h1>Terms of Service</h1>
      <p className="text-zinc-500">Last updated: August 1, 2026</p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By using NoCodeCSV (&quot;the Service&quot;), you agree to these Terms of Service.
        If you do not agree, do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        NoCodeCSV is an AI-powered data analysis tool that allows users to upload CSV and Excel files,
        ask questions in natural language, and receive AI-generated insights and charts.
      </p>

      <h2>3. Free Tier</h2>
      <p>
        The free tier includes <strong>3 analyses per day</strong> with files up to 5MB.
        We reserve the right to adjust these limits with notice.
      </p>

      <h2>4. Paid Subscriptions</h2>
      <ul>
        <li><strong>Pro</strong> ($15/month): Unlimited analyses, 25MB files, priority processing, chat history, chart exports.</li>
        <li><strong>Business</strong> ($49/month): Everything in Pro, 100MB files, team workspace (5 users), API access.</li>
      </ul>
      <p>
        Subscriptions auto-renew monthly. You can cancel anytime from your account settings.
        Cancellation takes effect at the end of the current billing period — no partial refunds.
      </p>

      <h2>5. Refunds</h2>
      <p>
        If you are unsatisfied with a paid plan, contact us within <strong>7 days</strong> of purchase
        for a full refund. Refund requests after 7 days are handled case-by-case.
      </p>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Upload files containing personal data of others without consent.</li>
        <li>Use the Service for illegal activities or in violation of applicable laws.</li>
        <li>Attempt to reverse-engineer, scrape, or disrupt the Service.</li>
        <li>Use automated scripts to bypass usage limits.</li>
      </ul>

      <h2>7. Intellectual Property</h2>
      <p>
        The data you upload is <strong>yours</strong>. The AI-generated analysis output is yours to use
        for any purpose. The Service itself (code, design, branding) is owned by NoCodeCSV.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. AI-generated analysis
        may contain errors — always verify critical conclusions before making business decisions.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        NoCodeCSV shall not be liable for any indirect, incidental, or consequential damages
        arising from your use of the Service, including decisions made based on AI-generated analysis.
      </p>

      <h2>10. Termination</h2>
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms.
        You may delete your account at any time.
      </p>

      <h2>11. Changes to Terms</h2>
      <p>
        We may update these Terms. Material changes will be communicated via email.
        Continued use after changes constitutes acceptance.
      </p>

      <h2>12. Contact</h2>
      <p>
        For questions about these Terms, email <strong>legal@nocodecsv.com</strong>.
      </p>
    </div>
  );
}
