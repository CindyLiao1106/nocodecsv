import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact NoCodeCSV — Support, Feedback & Partnerships",
  description:
    "Get in touch with the NoCodeCSV team for support, feature requests, bug reports, data-handling questions, or partnership enquiries.",
  alternates: { canonical: "https://nocodecsv.com/contact" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "Contact NoCodeCSV — Support, Feedback & Partnerships",
    description: "Questions about the tool, your data, or working together? Reach the team directly.",
    type: "website",
    url: "https://nocodecsv.com/contact",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact NoCodeCSV",
    description: "Questions about the tool, your data, or working together? Reach the team directly.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact NoCodeCSV",
  url: "https://nocodecsv.com/contact",
  mainEntity: {
    "@type": "Organization",
    name: "NoCodeCSV",
    url: "https://nocodecsv.com/",
    logo: "https://nocodecsv.com/og-image.png",
    email: "contact@nocodecsv.com",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: "contact@nocodecsv.com",
        availableLanguage: ["English"],
      },
    ],
  },
};

const TOPICS = [
  {
    title: "Product support",
    body: "Something not working, or a file that won't parse? Tell us the browser, the file type and what you expected to see.",
  },
  {
    title: "Feature requests",
    body: "Need a specific chart, a different export format, or support for another file type? We prioritise requests from real usage.",
  },
  {
    title: "Data handling & privacy",
    body: "Questions about what happens to your file, what is sent to the model, and what is stored. See our Privacy Policy for the current behaviour.",
  },
  {
    title: "Partnerships & press",
    body: "Integrations, content collaboration, or using our published statistics in your own article — get in touch.",
  },
];

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          NoCodeCSV is built and maintained by a small team. Email reaches a human — usually within
          two business days.
        </p>

        <div className="mt-8 rounded-lg border bg-card p-6">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Email</p>
          <a
            className="mt-1 block text-xl font-semibold underline underline-offset-4"
            href="mailto:contact@nocodecsv.com"
          >
            contact@nocodecsv.com
          </a>
          <p className="mt-3 text-sm text-muted-foreground">
            For faster help with the analyser, include the file type (.csv, .xlsx, .tsv), roughly how
            many rows, and a screenshot of the result you got.
          </p>
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">What to write about</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-lg border p-5">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-semibold tracking-tight">Before you write</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>
            How the tool handles files is described in our{" "}
            <Link className="underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            Usage terms — including what you may and may not do with the service — are in our{" "}
            <Link className="underline underline-offset-4" href="/terms">
              Terms of Service
            </Link>
            .
          </li>
          <li>
            For background on the tool and the team, see{" "}
            <Link className="underline underline-offset-4" href="/about">
              About
            </Link>
            .
          </li>
        </ul>
      </main>
    </>
  );
}
