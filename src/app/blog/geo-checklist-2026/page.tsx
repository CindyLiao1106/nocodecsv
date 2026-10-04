import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "GEO Checklist 2026: How to Make a Page AI-Readable and Citable",
  description:
    "Generative Engine Optimization checklist for 2026: the ten things that make a page easy for AI assistants to understand, cite and act on, each linked to a how-to.",
  keywords: [
    "geo checklist",
    "generative engine optimization checklist",
    "geo seo 2026",
    "ai search optimization",
    "aeo checklist",
    "how to rank in ai answers",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/geo-checklist-2026" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "GEO Checklist 2026: How to Make a Page AI-Readable and Citable",
    description:
      "Ten concrete things that make a page easy for AI assistants to understand, cite and act on, each linked to a step-by-step guide.",
    type: "article",
    url: "https://nocodecsv.com/blog/geo-checklist-2026",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-10-05",
    modifiedTime: "2026-10-05",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GEO Checklist 2026: How to Make a Page AI-Readable and Citable",
    description: "Ten concrete steps to make a page easy for AI assistants to cite and act on.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "GEO Checklist 2026: How to Make a Page AI-Readable and Citable",
  description:
    "Generative Engine Optimization checklist for 2026: the ten things that make a page easy for AI assistants to understand, cite and act on, each linked to a how-to.",
  url: "https://nocodecsv.com/blog/geo-checklist-2026",
  datePublished: "2026-10-05",
  dateModified: "2026-10-05",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: {
      "@type": "ImageObject",
      url: "https://nocodecsv.com/og-image.png",
      width: 1200,
      height: 630,
    },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/geo-checklist-2026",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "GEO Checklist 2026",
      item: "https://nocodecsv.com/blog/geo-checklist-2026",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      "name": "What is GEO (generative engine optimization)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "GEO is the practice of making a web page easy for AI assistants to understand, quote and act on. Classic SEO optimises for a ranked list of links; GEO optimises for being the source an assistant reads and cites when it answers a question, and for being a page an assistant can call a tool on.",
      },
    },
    {
      "@type": "Question",
      "name": "Is GEO the same as SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, but they overlap. Good SEO still helps: crawlable pages, clear titles, real content. GEO adds structure that machines reward directly, such as a definition in the first paragraph, question-shaped headings, FAQ schema that matches the visible text, an llms.txt file, and machine-readable declarations of any tools the page offers.",
      },
    },
    {
      "@type": "Question",
      "name": "Do I need a separate llms.txt file?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "It is optional but cheap, and it is one of the few GEO levers you fully control. An llms.txt is a plain-text map of your site written for language models, and it is served at /llms.txt. It does not replace robots.txt or sitemap.xml; it complements them.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I know if my page is ready for AI assistants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Work the checklist below and then test the live page. Confirm the page returns HTTP 200, that your FAQ schema matches the visible Q&A word for word, that /llms.txt is reachable, and, if the page has interactive tools, that they are declared and reachable by an anonymous agent.",
      },
    },
    {
      "@type": "Question",
      "name": "Can I guarantee an AI assistant will cite my page?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. No one can promise that a model will quote a specific page. What you can do is remove the reasons a page gets skipped: unclear answers, missing structure, blocked crawlers, unverifiable claims, and no machine-readable description of what the page can do.",
      },
    },
  ],
};

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12 prose prose-zinc prose-lg">
      <p className="text-blue-600 font-medium">Checklist · 7 min read</p>
      <h1>GEO Checklist 2026: How to Make a Page AI-Readable and Citable</h1>
      <p><strong>GEO (generative engine optimization) is the practice of making a page easy for AI assistants to understand, quote and act on.</strong> In 2026 that comes down to a short, concrete list: answer first, structure for questions, publish the machine-readable files, keep facts verifiable, and let the right crawlers in. This page is that list, and every item links to a deeper guide.</p>
      <p>It is written for people who build and run small sites, not for a marketing department. Every item is something you can check yourself in an afternoon, and nothing here depends on knowing how any particular model works internally.</p>

      <h2>What is GEO, and how is it different from SEO?</h2>
      <p>Search engine optimization competes for a position in a list of links. Generative engine optimization competes to be the <em>source</em>: the page an assistant pulls a fact from, links to, or calls a tool on when a person asks a question. That changes what you optimise for. A ranked page can be long and pleasant; a cited page has to be <em>extractable</em> — one sentence that answers the question, headings that match how people ask it, and claims that can be checked.</p>
      <p>The two are not enemies. Crawlable pages, fast pages, clear titles and genuine content help both. GEO simply adds a second, machine-facing layer on top: structured data, a plain-text map for models, and declarations that tell an assistant what your page can <em>do</em>, not just what it says. If you have never seen what that layer looks like, start with <Link href="/blog/what-is-webmcp">what WebMCP is</Link> — it is the clearest example of a page exposing tools to an assistant.</p>

      <h2>The 2026 GEO checklist</h2>
      <p>Work top to bottom. The first six items are content and structure; the last four are the machine layer most sites skip entirely.</p>
      <ol>
        <li><strong>Answer in the first paragraph.</strong> Give a direct, one or two sentence answer before any preamble. Assistants quote the answer first, and a definition-shaped opening is the easiest thing to lift.</li>
        <li><strong>Use question-shaped headings.</strong> Write H2s the way a person would ask the question ("What is GEO?", "Do I need llms.txt?"), so the heading itself is a match.</li>
        <li><strong>Add FAQPage schema that matches the visible text.</strong> The structured Q&amp;A and the on-page Q&amp;A must be identical, word for word. Mismatched schema is worse than none.</li>
        <li><strong>Show your work.</strong> Put a section that only you could write — a measurement, a test result, a screenshot with a date. Unique, verifiable evidence is the strongest reason to be cited. Our <Link href="/blog/can-chatgpt-analyze-csv">CSV test with a chat model</Link> is an example of this pattern.</li>
        <li><strong>Never invent numbers.</strong> If you do not have a source, do not state a statistic. An unsourced figure is a reason to be skipped, not a reason to rank.</li>
        <li><strong>Write scannable structure.</strong> Short paragraphs, real subheadings, tables where a comparison helps, and links to the pages that go deeper.</li>
        <li><strong>Publish an llms.txt.</strong> A plain-text map of your site for language models, served at <code>/llms.txt</code>. It is optional and cheap — and one of the few levers you fully control. See <Link href="/blog/llms-txt-explained">llms.txt explained</Link>.</li>
        <li><strong>Declare your tools in agent-tools.json.</strong> If your page offers a converter, a calculator or a lookup, describe it in a machine-readable file so an assistant can find and call it. See <Link href="/blog/agent-tools-json">agent-tools.json explained</Link>.</li>
        <li><strong>Mark up interactive forms with WebMCP.</strong> Attribute-level declarations let an assistant register your form fields as callable tools. See <Link href="/blog/can-ai-fill-out-a-form">can AI fill out a form?</Link> and <Link href="/blog/webmcp-vs-mcp">WebMCP vs MCP</Link>.</li>
        <li><strong>Let the right AI crawlers in.</strong> Check that your robots.txt does not accidentally block the assistants you want. See <Link href="/blog/robots-txt-ai-crawlers">AI crawlers in robots.txt</Link>.</li>
      </ol>

      <h2>The part most sites miss: the agent layer</h2>
      <p>Items one to six are content discipline. Items seven to ten are a different layer, and they are the reason a page can be <em>used</em> rather than just read. Three files and one markup convention do the work:</p>
      <table>
        <thead><tr><th>File / convention</th><th>What it does</th><th>Who reads it</th></tr></thead>
        <tbody>
          <tr><td><code>/llms.txt</code></td><td>Maps your key pages in plain text</td><td>Language models looking for sources</td></tr>
          <tr><td><code>/agent-tools.json</code></td><td>Describes the tools the site offers</td><td>Assistants deciding what they can call</td></tr>
          <tr><td>WebMCP markup</td><td>Turns form fields into callable tools</td><td>A browser-based agent on the page</td></tr>
          <tr><td><code>robots.txt</code></td><td>Allows or blocks named AI crawlers</td><td>Every automated visitor</td></tr>
        </tbody>
      </table>
      <p>None of this is guesswork on a live site: on our own pages a browser assistant can read the tool list back through <code>navigator.modelContext.getTools()</code>, and we have published the exact results — including the fields an agent still cannot use. If you want the shipped version of this layer rather than the theory, it is the service we run at <Link href="/agent-ready">/agent-ready</Link>.</p>

      <h2>What we measured on our own sites</h2>
      <p>This checklist is not a repackaged list of tips; each point comes from something we had to fix on pages we run. The useful, honest parts are the limits:</p>
      <ul>
        <li>How many tools a live page will actually advertise, and one entry an anonymous agent could not reach — see <Link href="/blog/agent-tools-json">agent-tools.json explained</Link>.</li>
        <li>Which HTML field types become agent parameters, and the file-input gap we measured across live pages — see <Link href="/blog/can-ai-fill-out-a-form">can AI fill out a form?</Link>.</li>
        <li>Why a parser check on robots.txt can read &quot;zero crawlers&quot; when the file is fine — see <Link href="/blog/robots-txt-ai-crawlers">AI crawlers in robots.txt</Link>.</li>
        <li>What an llms.txt file really contains, measured by size on three sites — see <Link href="/blog/llms-txt-explained">llms.txt explained</Link>.</li>
      </ul>
      <p>Writing the limits down is deliberate. A page that claims everything works is easier to dismiss than one that says where the gaps are, and the gaps are often the most useful thing a reader takes away.</p>

      <h2>How to test your site against this checklist</h2>
      <p>Reading a checklist is not the same as passing it. Test the live page, not the draft:</p>
      <ol>
        <li>Fetch the page and confirm it returns HTTP 200 (a soft-404 that returns 200 with the home page is a common trap).</li>
        <li>Open the page source and read the JSON-LD. Check the FAQ answers match the visible Q&amp;A word for word.</li>
        <li>Request <code>/llms.txt</code> and <code>/agent-tools.json</code> and confirm both return real content, not a 404.</li>
        <li>If the page has tools, check the declared selectors against the real DOM — a selector that points at an element that does not exist is invisible to an agent.</li>
        <li>Re-read robots.txt and confirm the crawlers you want are not blocked.</li>
      </ol>
      <p>That is the same sequence we run in <Link href="/blog/is-your-website-agent-ready">is your website agent-ready?</Link>, with the commands and the measured output on three live sites.</p>

      <h2>Frequently Asked Questions</h2>
      <h3>What is GEO (generative engine optimization)?</h3>
      <p>GEO is the practice of making a web page easy for AI assistants to understand, quote and act on. Classic SEO optimises for a ranked list of links; GEO optimises for being the source an assistant reads and cites when it answers a question, and for being a page an assistant can call a tool on.</p>
      <h3>Is GEO the same as SEO?</h3>
      <p>No, but they overlap. Good SEO still helps: crawlable pages, clear titles, real content. GEO adds structure that machines reward directly, such as a definition in the first paragraph, question-shaped headings, FAQ schema that matches the visible text, an llms.txt file, and machine-readable declarations of any tools the page offers.</p>
      <h3>Do I need a separate llms.txt file?</h3>
      <p>It is optional but cheap, and it is one of the few GEO levers you fully control. An llms.txt is a plain-text map of your site written for language models, and it is served at <code>/llms.txt</code>. It does not replace robots.txt or sitemap.xml; it complements them.</p>
      <h3>How do I know if my page is ready for AI assistants?</h3>
      <p>Work the checklist above and then test the live page. Confirm the page returns HTTP 200, that your FAQ schema matches the visible Q&amp;A word for word, that <code>/llms.txt</code> is reachable, and, if the page has interactive tools, that they are declared and reachable by an anonymous agent.</p>
      <h3>Can I guarantee an AI assistant will cite my page?</h3>
      <p>No. No one can promise that a model will quote a specific page. What you can do is remove the reasons a page gets skipped: unclear answers, missing structure, blocked crawlers, unverifiable claims, and no machine-readable description of what the page can do.</p>

      {/* ===== Author byline ===== */}
      <div className="mt-8 flex items-center gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">NC</div>
        <div>
          <p className="font-semibold text-zinc-700">NoCodeCSV Team</p>
          <p>Updated October 5, 2026 · Practical guides by the NoCodeCSV team.</p>
        </div>
      </div>

      {/* ===== Affiliate tools recommendation ===== */}
      <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-xl font-bold mb-2">Go further with AI data tools</h2>
        <p className="text-slate-600 mb-4">NoCodeCSV handles the basics for free. When your data work grows, these tools pair well with it:</p>
        <ul className="space-y-3">
          <li>
            <strong>Stack AI</strong> — build AI workflows that process your CSVs automatically, end to end.{' '}
            <a href="https://www.stack-ai.com/partnership" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Stack AI</a>
          </li>
          <li>
            <strong>Softr</strong> — turn your cleaned data into customer-facing apps and portals without code.{' '}
            <a href="https://www.softr.io" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Softr</a>
          </li>
          <li>
            <strong>Toggl Track</strong> — track time spent on data projects and client work.{' '}
            <a href="https://toggl.com" target="_blank" rel="nofollow sponsored noopener" className="text-blue-600 underline">Try Toggl</a>
          </li>
        </ul>
        <p className="text-xs text-slate-400 mt-3">Some links above are affiliate links — if you buy through them we may earn a commission at no extra cost to you.</p>
      </div>

      <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Make your site agent-ready</h2>
        <p className="text-blue-100 mb-5">I build this layer for other sites — llms.txt, agent-tools.json, WebMCP declarations — verified on the live site.</p>
        <Link href="/agent-ready"><Button size="lg" variant="secondary" className="text-base px-8">See the agent-ready service</Button></Link>
      </div>
      <RelatedPosts slug="geo-checklist-2026" />
    </article>
    </>
  );
}
