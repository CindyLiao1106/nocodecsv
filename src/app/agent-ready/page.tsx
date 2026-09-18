import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Agent-Ready Websites: Make Your Site Usable by AI Assistants",
  description:
    "AI assistants can read your site but cannot use it. I implement the agent layer — llms.txt, agent-tools.json, AI-crawler robots rules and WebMCP declarations — and verify it on your live site. Free audit first.",
  keywords: [
    "agent ready website",
    "make website usable by ai agents",
    "webmcp implementation",
    "llms.txt setup",
    "agent tools json",
    "ai agent website optimization",
    "geo generative engine optimization service",
    "ai crawler robots.txt",
  ],
  alternates: { canonical: "https://nocodecsv.com/agent-ready" },
  openGraph: {
    title: "Agent-Ready Websites — make your site usable by AI assistants",
    description:
      "llms.txt, agent-tools.json, AI-crawler robots rules and WebMCP declarations, implemented and verified on your live site. Free audit, fixed-scope quote.",
    type: "website",
    url: "https://nocodecsv.com/agent-ready",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Make your website usable by AI assistants",
    description:
      "Assistants can read your site but not use it. Here is the technical layer that fixes that — verified on three live sites.",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Agent-Ready Website Implementation",
  serviceType: "Website AI-agent readiness implementation",
  description:
    "Implementation of the agent layer for an existing website: llms.txt, agent-tools.json, AI-crawler robots rules, stable form selectors and WebMCP declarations, verified on the live site with a re-runnable test report.",
  provider: {
    "@type": "Organization",
    name: "NoCodeCSV",
    url: "https://nocodecsv.com",
    email: "info@nocodecsv.com",
  },
  areaServed: "Worldwide",
  url: "https://nocodecsv.com/agent-ready",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Agent-readiness deliverables",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Free agent-readiness audit (1 site)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "llms.txt with a For AI agents section" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "agent-tools.json tool map with verified selectors" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "AI-crawler robots.txt rules" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Stable ids and accessible labels on key controls" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "WebMCP declarative implementations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Re-runnable verification report" } },
    ],
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com/" },
    { "@type": "ListItem", position: 2, name: "Agent-Ready Websites", item: "https://nocodecsv.com/agent-ready" },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does “agent-ready” mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An agent-ready website is one an AI assistant can not only read but also act on: it declares its tools in machine-readable files (llms.txt, agent-tools.json), allows AI crawlers in robots.txt, labels its form controls so an assistant can target them, and — where supported — declares those forms as callable tools with WebMCP.",
      },
    },
    {
      "@type": "Question",
      name: "Can AI assistants fill in my contact form today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Partly. Text, dropdown, number and radio fields can be declared and become available to an assistant through WebMCP in Chrome. File-upload fields cannot: we measured the generated tool schema on a live site and it came back as {\"type\":\"object\",\"properties\":{},\"required\":[]} even after associating a label with the input. So an assistant can complete a text enquiry or run a calculator, but a human still chooses files.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to rebuild my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The agent layer is additive: new files (llms.txt, agent-tools.json), robots rules, ids and labels on existing controls, and attributes on existing forms. Nothing is rewritten, and the website keeps working exactly as before for human visitors.",
      },
    },
    {
      "@type": "Question",
      name: "Is WebMCP supported in all browsers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, and that is expected. WebMCP is in an open origin trial (Chrome 149 to 156 at the time of writing, trial ending 17 November 2026). A site registers the trial, adds the token, and the declarations are then recognised in Chrome; other browsers simply ignore the attributes. The non-WebMCP layer — llms.txt, agent-tools.json, robots rules — works everywhere, today.",
      },
    },
    {
      "@type": "Question",
      name: "How do you verify the work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On the live site, not locally. You receive the exact commands and their output: fetch agent-tools.json and check it parses, count the declared AI crawlers in robots.txt, confirm the sitemap hosts resolve, and — where WebMCP is enabled — show the browser's own navigator.modelContext.getTools() output listing the declared tools. You can re-run every command yourself.",
      },
    },
    {
      "@type": "Question",
      name: "Do you guarantee AI mentions or rankings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No, and nobody should. I implement and verify the technical layer that makes a site readable, credit-able and operable. Whether a particular assistant cites you depends on its own retrieval and policy, which no vendor controls.",
      },
    },
    {
      "@type": "Question",
      name: "What does it cost and how long does it take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The audit is free: send a URL and you get a findings note listing what already works and what is missing. If you then want the implementation, it is quoted as a fixed scope for your site (page count and whether WebMCP is included are the main variables), typically delivered in three to six days including the verification report.",
      },
    },
  ],
};

export default function AgentReadyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc prose-lg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <h1>Agent-Ready Websites</h1>

      <p className="text-xl text-slate-700">
        An agent-ready website is one an AI assistant can <strong>use</strong>, not just read: its tools are declared
        in machine-readable files, its forms are labelled so an assistant can fill them, and it is explicitly open to
        AI crawlers.
      </p>

      <p>
        Assistants already read your pages. What they cannot do is <em>act</em>: they cannot find your enquiry form
        reliably, they do not know which of your features is a tool, and they cannot submit anything on a user&apos;s
        behalf. That gap is now a standard problem with a standard answer — and almost no site has implemented it yet.
      </p>

      <div className="not-prose my-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-semibold text-slate-900">What an AI assistant can do on a site today</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2 pr-4 font-medium">Capability</th>
                <th className="py-2 pr-4 font-medium">Without the agent layer</th>
                <th className="py-2 font-medium">With it</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Read and cite your content</td>
                <td className="py-2 pr-4">Usually yes</td>
                <td className="py-2">Yes, with your own site description</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Know what your site can do</td>
                <td className="py-2 pr-4">Guess, from page text</td>
                <td className="py-2">Read a declared tool list</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Fill a text or enquiry form</td>
                <td className="py-2 pr-4">Unreliable — DOM guessing</td>
                <td className="py-2">Declared as a callable tool (WebMCP)</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 pr-4">Run your calculator or converter</td>
                <td className="py-2 pr-4">Click by trial and error</td>
                <td className="py-2">Declared with its parameters</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Upload a file for the user</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Still no — measured limit, see below</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h2>What I implement</h2>
      <ul>
        <li>
          <strong>llms.txt</strong> with a dedicated <code>## For AI agents</code> section — where your tools are, what
          is free, how to cite you, and what is off-limits.
        </li>
        <li>
          <strong>agent-tools.json</strong> — a machine-readable map of every tool: its page, its real selectors, its
          accessible labels, whether login is required, and what it returns. Every selector is checked against your
          actual HTML rather than invented.
        </li>
        <li>
          <strong>robots.txt rules for AI crawlers</strong> — explicit entries for GPTBot, OAI-SearchBot, ClaudeBot,
          PerplexityBot, Google-Extended, Applebot-Extended, CCBot and the rest, so your policy is unambiguous.
        </li>
        <li>
          <strong>Stable, labelled controls</strong> — ids, names and aria-labels on the fields that matter, so an
          assistant targets the right element instead of guessing.
        </li>
        <li>
          <strong>WebMCP declarations</strong> — forms and tools declared with <code>toolname</code>,{" "}
          <code>tooldescription</code> and per-field <code>toolparamdescription</code>, plus the origin-trial token
          wired into your server headers. Browsers without WebMCP ignore all of it.
        </li>
        <li>
          <strong>A verification report</strong> — the commands I ran and their output, on your live site, so you can
          re-run them and see the same result.
        </li>
      </ul>

      <h2>Verified on live sites, not mocked up</h2>
      <p>
        These are working implementations you can inspect before you talk to me. The third command is the one that
        matters: it asks the browser itself which tools it recognised.
      </p>

      <div className="not-prose my-6 space-y-4">
        {[
          {
            name: "nocodecsv.com — a tool site",
            what: "Five tools declared, including a CSV splitter and a JSON⇄CSV converter; file input exists in the DOM so it can be targeted at all; WebMCP enabled for the whole origin.",
            cmd: "curl -sI https://nocodecsv.com/ | grep -i origin-trial",
          },
          {
            name: "A B2B enquiry site",
            what: "The quotation form is declared as a callable tool with six described fields (name, company, country, email, product family, message).",
            cmd: "curl -s https://buildex-1dm.pages.dev/agent-tools.json",
          },
          {
            name: "A calculator site",
            what: "A live-recalculating calculator declared with its real inputs, and the declaration states that there is no submit button — the detail assistants get wrong most often.",
            cmd: "curl -s https://carecosttool.pages.dev/agent-tools.json",
          },
        ].map((c) => (
          <div key={c.name} className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900">{c.name}</h3>
            <p className="mt-1 text-sm text-slate-700">{c.what}</p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              <code>{c.cmd}</code>
            </pre>
          </div>
        ))}
      </div>

      <h2>What I measured that nobody else publishes</h2>
      <p>
        On a live site with the origin trial active, the browser exposes the tools it has registered. This is the real
        output for one of the tool pages:
      </p>
      <pre className="not-prose my-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
        <code>{`> await navigator.modelContext.getTools()
[
  {
    name: "splitLargeCsv",
    description: "Splits a CSV file that is too large for Excel or Google Sheets
                  into smaller files with a chosen number of rows"
  }
]`}</code>
      </pre>
      <p>
        And here is the limit, stated plainly rather than left for you to discover: the same call reports{" "}
        <code>{`{"type":"object","properties":{},"required":[]}`}</code> when the only field on the form is a file
        input. We tested it with and without an associated <code>&lt;label&gt;</code> — the parameter stays empty. In
        practice this means an assistant can be told about a file-processing tool and can hand the user to the right
        page, but cannot attach the file itself. Text, dropdown and number fields are a different story: they do get
        declared and can be handled end to end.
      </p>

      <h2>How it works</h2>
      <ol>
        <li>
          <strong>Free audit.</strong> Send a URL. You get a short findings note: what already works, what is missing,
          what I would add — in priority order.
        </li>
        <li>
          <strong>Fixed-scope quote.</strong> If you want the implementation, I quote it for your site (page count and
          whether WebMCP is in scope are the variables). No subscriptions, no lock-in — everything I add is built on
          open, inspectable files.
        </li>
        <li>
          <strong>Implement and verify.</strong> Typically three to six days, ending with the verification report and,
          if you want it, a short walkthrough.
        </li>
        <li>
          <strong>Re-check.</strong> Thirty days later I re-run the checks and tell you if anything drifted — origin
          trials expire, and it is better to hear that from me than to guess.
        </li>
      </ol>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Send me your URL — the audit is free</h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-50">
          Tell me the one or two actions a visitor should be able to complete on your site, and I will send back what an
          assistant can and cannot do there today.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/ai-analytics-statistics">
            <Button size="lg" variant="secondary">
              See a source-linked example page
            </Button>
          </Link>
          <a href="mailto:info@nocodecsv.com?subject=Agent-ready%20audit%20request">
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Email info@nocodecsv.com
            </Button>
          </a>
        </div>
        <p className="mt-4 text-xs text-blue-100">
          Reference material: the free audit script and the full checklist are documented on this site.
        </p>
      </div>

      <h2>What I will not claim</h2>
      <ul>
        <li>
          No guaranteed AI mentions or rankings. I implement and verify the technical layer; retrieval is the
          assistant&apos;s decision.
        </li>
        <li>
          No file-upload automation — measured, not assumed (see above).
        </li>
        <li>
          WebMCP currently requires an origin trial and expires; the other layers work in every browser, today, and are
          the part that keeps working regardless of what happens to the trial.
        </li>
      </ul>

      <h2>Frequently asked questions</h2>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">What does &ldquo;agent-ready&rdquo; mean?</h3>
        <p className="mt-2 text-slate-700">
          An agent-ready website is one an AI assistant can not only read but also act on: it declares its tools in
          machine-readable files (llms.txt, agent-tools.json), allows AI crawlers in robots.txt, labels its form
          controls so an assistant can target them, and — where supported — declares those forms as callable tools with
          WebMCP.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Can AI assistants fill in my contact form today?</h3>
        <p className="mt-2 text-slate-700">
          Partly. Text, dropdown, number and radio fields can be declared and become available to an assistant through
          WebMCP in Chrome. File-upload fields cannot: we measured the generated tool schema on a live site and it came
          back as <code>{`{"type":"object","properties":{},"required":[]}`}</code> even after associating a label with
          the input. So an assistant can complete a text enquiry or run a calculator, but a human still chooses files.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Do I need to rebuild my website?</h3>
        <p className="mt-2 text-slate-700">
          No. The agent layer is additive: new files (llms.txt, agent-tools.json), robots rules, ids and labels on
          existing controls, and attributes on existing forms. Nothing is rewritten, and the website keeps working
          exactly as before for human visitors.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Is WebMCP supported in all browsers?</h3>
        <p className="mt-2 text-slate-700">
          No, and that is expected. WebMCP is in an open origin trial (Chrome 149 to 156 at the time of writing, trial
          ending 17 November 2026). A site registers the trial, adds the token, and the declarations are then recognised
          in Chrome; other browsers simply ignore the attributes. The non-WebMCP layer — llms.txt, agent-tools.json,
          robots rules — works everywhere, today.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">How do you verify the work?</h3>
        <p className="mt-2 text-slate-700">
          On the live site, not locally. You receive the exact commands and their output: fetch agent-tools.json and
          check it parses, count the declared AI crawlers in robots.txt, confirm the sitemap hosts resolve, and — where
          WebMCP is enabled — show the browser&apos;s own <code>navigator.modelContext.getTools()</code> output listing
          the declared tools. You can re-run every command yourself.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Do you guarantee AI mentions or rankings?</h3>
        <p className="mt-2 text-slate-700">
          No, and nobody should. I implement and verify the technical layer that makes a site readable, credit-able and
          operable. Whether a particular assistant cites you depends on its own retrieval and policy, which no vendor
          controls.
        </p>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">What does it cost and how long does it take?</h3>
        <p className="mt-2 text-slate-700">
          The audit is free: send a URL and you get a findings note listing what already works and what is missing. If
          you then want the implementation, it is quoted as a fixed scope for your site (page count and whether WebMCP
          is included are the main variables), typically delivered in three to six days including the verification
          report.
        </p>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Related reading: <Link href="/ai-analytics-statistics">AI and data analysis statistics</Link> ·{" "}
        <Link href="/tools/csv-splitter">CSV splitter</Link> ·{" "}
        <Link href="/tools/json-csv-converter">JSON ⇄ CSV converter</Link>
      </p>
    </article>
  );
}
