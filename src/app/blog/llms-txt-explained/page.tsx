import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "llms.txt Explained: What to Put in the File (Real Examples, 2026)",
  description:
    "llms.txt is a Markdown file at your site root that gives AI assistants a short, curated map of your pages: an H1, a one-line summary, then links worth reading. The format, real examples, and what we measured across three of our own sites.",
  keywords: [
    "llms.txt",
    "llms txt example",
    "llms.txt what is it",
    "llms.txt format",
    "llms.txt generator",
    "llms.txt for seo",
    "llms.txt vs robots.txt",
    "how to write llms.txt",
    "llms txt file",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/llms-txt-explained",
  },
  openGraph: {
    title: "llms.txt Explained: What to Put in the File",
    description:
      "The format from the proposal, four real files measured by size, and the three llms.txt files we run on our own sites with their word counts.",
    type: "article",
    url: "https://nocodecsv.com/blog/llms-txt-explained",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-18",
    modifiedTime: "2026-09-18",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "llms.txt Explained: Format, Examples, Real Word Counts",
    description:
      "What the spec requires, what people actually put in, and the length question answered with numbers instead of opinion.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "llms.txt Explained: What to Put in the File (Real Examples, 2026)",
  description:
    "llms.txt is a Markdown file served at a site root or subpath that gives AI assistants a curated map of the pages worth reading. This page covers the required structure from the proposal, real files measured by size, the differences from robots.txt and sitemap.xml, and what we measured across three of our own sites.",
  url: "https://nocodecsv.com/blog/llms-txt-explained",
  datePublished: "2026-09-18",
  dateModified: "2026-09-18",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/llms-txt-explained",
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://nocodecsv.com/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://nocodecsv.com/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "llms.txt Explained",
      item: "https://nocodecsv.com/blog/llms-txt-explained",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is llms.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "llms.txt is a Markdown file you serve at /llms.txt, or at any subpath you want it to cover, that gives a language model a short curated map of your site: a title, a one or two sentence summary, and links to the pages worth reading. The proposal comes from llmstxt.org and describes it as a complement to sitemap.xml rather than a replacement: the sitemap lists everything for crawlers, while llms.txt picks the destinations an assistant should actually open.",
      },
    },
    {
      "@type": "Question",
      name: "What goes in an llms.txt file?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "In the order the proposal gives: an optional byte order mark, then an H1 with the project or site name, which is the only required part, then a blockquote summary, then any free-form Markdown paragraphs, then sections introduced by H2 headings where each section is a list of markdown links written as [name](url) followed optionally by a colon and a note. A section titled Optional is used by convention for links an agent can skip when context is short.",
      },
    },
    {
      "@type": "Question",
      name: "Is llms.txt an official standard?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. It is a community proposal published by Jeremy Howard at llmstxt.org, first written in 2024 and revised in a v2 that the site dates to August 2026. There is no W3C, IETF or RFC backing for the filename or the format. The strongest signals are adoption ones: the v2 page states that thousands of sites publish a file, that documentation platforms generate one automatically, that Chrome's Lighthouse audits for one during agentic browsing checks, and that OpenAI, Anthropic and Gemini publish files for their own developer documentation.",
      },
    },
    {
      "@type": "Question",
      name: "How is llms.txt different from robots.txt and sitemap.xml?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Different jobs, and they can coexist without changes to each other. robots.txt states which automated access a site considers acceptable, which is a crawling rule. sitemap.xml lists every URL you want indexed, which is a discovery feed. llms.txt is a curated reading list fetched on demand when an agent needs information about a topic. A file also covers only the path it sits under, so /docs/llms.txt describes the pages beneath /docs rather than the whole domain.",
      },
    },
    {
      "@type": "Question",
      name: "Where should the llms.txt file live?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "At the site root as /llms.txt for a whole site, or at the root of the section it describes. The proposal explicitly allows subpaths and says that when more than one file applies, an agent should use the most specific one. It also explains why the file is not placed under the well-known prefix reserved by RFC 8615: those URIs exist only at an origin root, and an author who controls just one directory on a shared host could never publish there.",
      },
    },
    {
      "@type": "Question",
      name: "How long should llms.txt be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Long enough to list the destinations that matter and short enough to keep in a context window. Our three sites came in at 382, 393 and 1,203 words, and the length followed the number of real destinations rather than any word target: the smallest file has two links because the site has two pages worth an agent's attention. If your lines are filler, delete them; every saved token is the point of the exercise.",
      },
    },
    {
      "@type": "Question",
      name: "Does llms.txt improve SEO rankings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nobody has published evidence that it moves rankings, and it is not a ranking factor you can point at in a search console. Its purpose is to help an assistant answer questions about your site accurately, which is a different channel from the blue links. Publish it because it is cheap and reusable, keep it accurate, and do not treat it as a substitute for pages that answer a real question.",
      },
    },
    {
      "@type": "Question",
      name: "Should I also publish Markdown copies of my pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "That is the second half of the v2 proposal, and it is optional. It suggests serving a clean Markdown version of a page at the same URL with .md appended or substituted, and pointing at both files with link relations: rel=alternate with type text/markdown for the Markdown copy, and rel=describedby for the llms.txt that covers the page. The same relations can be sent as HTTP Link response headers, which works for non-HTML files too. We measured our own site and found no Link headers yet, so this part of the proposal is still ahead of us.",
      },
    },
  ],
};

const faqVisible = [
  {
    q: "What is llms.txt?",
    a: "llms.txt is a Markdown file you serve at /llms.txt, or at any subpath you want it to cover, that gives a language model a short curated map of your site: a title, a one or two sentence summary, and links to the pages worth reading. The proposal comes from llmstxt.org and describes it as a complement to sitemap.xml rather than a replacement: the sitemap lists everything for crawlers, while llms.txt picks the destinations an assistant should actually open.",
  },
  {
    q: "What goes in an llms.txt file?",
    a: "In the order the proposal gives: an optional byte order mark, then an H1 with the project or site name, which is the only required part, then a blockquote summary, then any free-form Markdown paragraphs, then sections introduced by H2 headings where each section is a list of markdown links written as [name](url) followed optionally by a colon and a note. A section titled Optional is used by convention for links an agent can skip when context is short.",
  },
  {
    q: "Is llms.txt an official standard?",
    a: "No. It is a community proposal published by Jeremy Howard at llmstxt.org, first written in 2024 and revised in a v2 that the site dates to August 2026. There is no W3C, IETF or RFC backing for the filename or the format. The strongest signals are adoption ones: the v2 page states that thousands of sites publish a file, that documentation platforms generate one automatically, that Chrome's Lighthouse audits for one during agentic browsing checks, and that OpenAI, Anthropic and Gemini publish files for their own developer documentation.",
  },
  {
    q: "How is llms.txt different from robots.txt and sitemap.xml?",
    a: "Different jobs, and they can coexist without changes to each other. robots.txt states which automated access a site considers acceptable, which is a crawling rule. sitemap.xml lists every URL you want indexed, which is a discovery feed. llms.txt is a curated reading list fetched on demand when an agent needs information about a topic. A file also covers only the path it sits under, so /docs/llms.txt describes the pages beneath /docs rather than the whole domain.",
  },
  {
    q: "Where should the llms.txt file live?",
    a: "At the site root as /llms.txt for a whole site, or at the root of the section it describes. The proposal explicitly allows subpaths and says that when more than one file applies, an agent should use the most specific one. It also explains why the file is not placed under the well-known prefix reserved by RFC 8615: those URIs exist only at an origin root, and an author who controls just one directory on a shared host could never publish there.",
  },
  {
    q: "How long should llms.txt be?",
    a: "Long enough to list the destinations that matter and short enough to keep in a context window. Our three sites came in at 382, 393 and 1,203 words, and the length followed the number of real destinations rather than any word target: the smallest file has two links because the site has two pages worth an agent's attention. If your lines are filler, delete them; every saved token is the point of the exercise.",
  },
  {
    q: "Does llms.txt improve SEO rankings?",
    a: "Nobody has published evidence that it moves rankings, and it is not a ranking factor you can point at in a search console. Its purpose is to help an assistant answer questions about your site accurately, which is a different channel from the blue links. Publish it because it is cheap and reusable, keep it accurate, and do not treat it as a substitute for pages that answer a real question.",
  },
  {
    q: "Should I also publish Markdown copies of my pages?",
    a: "That is the second half of the v2 proposal, and it is optional. It suggests serving a clean Markdown version of a page at the same URL with .md appended or substituted, and pointing at both files with link relations: rel=alternate with type text/markdown for the Markdown copy, and rel=describedby for the llms.txt that covers the page. The same relations can be sent as HTTP Link response headers, which works for non-HTML files too. We measured our own site and found no Link headers yet, so this part of the proposal is still ahead of us.",
  },
];

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
        <p className="text-blue-600 font-medium">🤖 AI &amp; Agents · 9 min read</p>
        <h1>llms.txt Explained: What to Put in the File</h1>

        <p>
          <strong>
            llms.txt is a Markdown file served at your site root that tells an AI assistant which
            pages of yours are worth opening: an H1 with your site name, a one-line summary, then
            links with short notes. You write it by hand, it takes about ten minutes, and it is a
            proposal rather than an official standard.
          </strong>{" "}
          That is the whole answer to the question people arrive with, usually phrased as{" "}
          <em>&ldquo;what is llms.txt&rdquo;</em> or <em>&ldquo;llms txt example&rdquo;</em>. The
          rest of this page is the format, real files measured by size, and what happens when you
          keep three of them accurate over time.
        </p>

        <h2>What is llms.txt?</h2>

        <p>
          A web page is built for a person. It wraps the answer in navigation, banners and
          JavaScript, and a model that has to convert all of that back into text spends tokens on
          things that do not matter. The llms.txt proposal asks owners to write the important part
          down once, in Markdown, at a predictable URL. An agent fetches that file, sees a short
          list of destinations, and opens only the pages it needs.
        </p>

        <p>
          The proposal was written by Jeremy Howard and published at{" "}
          <a
            href="https://llmstxt.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            llmstxt.org
          </a>
          . The version on the site today is v2, dated <em>Modified August 10, 2026</em>, and the
          changes page lists what moved since the first draft. The parts relevant to anyone writing
          a file are unchanged: most of it is just Markdown with one structural rule about headings.
        </p>

        <h2>What goes inside the file?</h2>

        <p>
          The spec is short, and the order matters. In sequence, a file contains an optional byte
          order mark, an H1 with the project or site name, a blockquote with a short summary, then
          free-form Markdown sections such as paragraphs or lists, then any number of sections
          introduced by H2 headings. The H1 is the only required section. A file with a title, a
          summary and two links is a valid file.
        </p>

        <p>
          Each H2 section holds what the proposal calls a file list: a Markdown list where every
          entry is a link, optionally followed by a colon and a note explaining the destination. One
          convention is worth copying. A section named Optional is reserved for secondary links that
          an agent may skip when its context is tight, which is a way of saying &ldquo;here is the
          rest, if you have room&rdquo;.
        </p>

        <pre>
          <code>{`# Your Site Name

> One or two sentences on what this site is and who it is for.

## Docs
- [Getting started](https://example.com/docs/start): Install and first run.
- [Pricing](https://example.com/pricing): Plans, limits and what is free.

## Optional
- [Changelog](https://example.com/changelog)`}</code>
        </pre>

        <p>
          Two rules from the spec that people miss. The file can live at a subpath and then covers
          only the pages beneath it, so <code>/docs/llms.txt</code> describes the documentation
          rather than the whole domain, and when several files apply an agent should use the most
          specific one. And the filename is fixed: it is <code>llms.txt</code>, at the root of
          whatever it covers.
        </p>

        <h2>What do real llms.txt files look like?</h2>

        <p>
          The proposal&apos;s own page says the AI labs publish files for their developer
          documentation, so we fetched four of them on 18 September 2026 and measured the size. All
          four returned HTTP 200:
        </p>

        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Size</th>
              <th>What it covers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>docs.anthropic.com/llms.txt</td>
              <td>68,036 bytes</td>
              <td>API documentation for the whole developer site</td>
            </tr>
            <tr>
              <td>platform.openai.com/docs/llms.txt</td>
              <td>41,794 bytes</td>
              <td>Guides and conceptual documentation under /docs</td>
            </tr>
            <tr>
              <td>cloud.google.com/llms.txt</td>
              <td>41,007 bytes</td>
              <td>Product documentation across the cloud platform</td>
            </tr>
            <tr>
              <td>ai.google.dev/gemini-api/docs/llms.txt</td>
              <td>33,708 bytes</td>
              <td>The Gemini API docs, under the path it describes</td>
            </tr>
          </tbody>
        </table>

        <p>
          One detail from that table is more instructive than the sizes. The URL at the domain root,
          ai.google.dev/llms.txt, returned 404 the same day, while the file under{" "}
          <code>/gemini-api/docs/</code> returned the 33 KB document. That is the subpath rule in
          production: a large organisation does not publish one file for everything, it publishes one
          per section and lets the most specific file win.
        </p>

        <h2>What we measured across three of our own sites</h2>

        <p>
          Nobody can tell you what length to aim for from a spec. So we counted our own files, which
          sit on three very different sites.
        </p>

        <table>
          <thead>
            <tr>
              <th>Site</th>
              <th>Words</th>
              <th>Links</th>
              <th>Sections</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>nocodecsv.com</td>
              <td>1,203</td>
              <td>49</td>
              <td>Docs, Blog, For AI agents, Key Facts, Contact</td>
            </tr>
            <tr>
              <td>buildex-1dm.pages.dev</td>
              <td>382</td>
              <td>2</td>
              <td>What we supply, Key product data, Documentation, For AI agents, Contact</td>
            </tr>
            <tr>
              <td>carecosttool.pages.dev</td>
              <td>393</td>
              <td>6</td>
              <td>Tools, Data source, For AI agents, Contact</td>
            </tr>
          </tbody>
        </table>

        <p>
          The link count is what drove the length, not the other way round. The first site is a
          product with dozens of documented pages, so its file lists 49 of them. The other two are
          small business sites where only a handful of pages carry information an agent would need,
          and their files are under 400 words each. Padding either one out to 1,000 words would mean
          inventing destinations.
        </p>

        <p>
          Two findings from the same afternoon are less flattering, and worth passing on. First, a
          static count inside a file goes stale. Ours states a number of published guides that no
          longer matches the blog, which now runs to 61 article directories against a sitemap of 75
          URLs. Avoid hard-coded totals; describe the categories instead, or plan to update them.
          Second, v2 also proposes machine-readable link relations for Markdown copies of pages, and
          we checked our own headers: no <code>Link</code> header is being sent on the home page or
          on a tool page. Publishing the file and declaring the alternate versions are separate
          jobs, and we have only done the first.
        </p>

        <h2>Is llms.txt an official standard?</h2>

        <p>
          No, and saying so plainly is more useful than hedging. There is no RFC, no W3C
          specification and no IETF draft behind the filename. What exists is a proposal with real
          adoption behind it. The v2 page states that thousands of sites publish a file, that
          documentation platforms generate one automatically, that Chrome&apos;s Lighthouse audits
          sites for one as part of its agentic browsing checks, and that OpenAI, Anthropic and Gemini
          publish files for their own developer documentation. Those are adoption claims made by the
          proposal itself, and the four files we fetched are consistent with them.
        </p>

        <p>
          The practical consequence: publish it because it is cheap, honest and reusable, not because
          a vendor has promised to read it. No major assistant vendor has committed publicly to
          consuming llms.txt, which is exactly the same status that makes it low risk. A file that
          helps an assistant costs you a few hundred words; a file that does not costs you nothing
          but the time.
        </p>

        <h2>How is it different from robots.txt and sitemap.xml?</h2>

        <p>
          A site usually ends up with all three, and they do not overlap. The proposal puts the
          distinction this way: robots.txt tells automated tools what access is acceptable, while
          llms.txt is used on demand when an agent needs information about a topic.
        </p>

        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Audience</th>
              <th>Content</th>
              <th>When it is read</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>robots.txt</td>
              <td>Crawlers</td>
              <td>Allow and disallow rules per user agent</td>
              <td>Before crawling, on a schedule</td>
            </tr>
            <tr>
              <td>sitemap.xml</td>
              <td>Search engines</td>
              <td>Every URL you want indexed</td>
              <td>On the crawler&apos;s schedule</td>
            </tr>
            <tr>
              <td>llms.txt</td>
              <td>Assistants and agents</td>
              <td>A curated subset, with notes</td>
              <td>During a task, when a model needs detail</td>
            </tr>
          </tbody>
        </table>

        <p>
          That difference explains the sizing too. Our sitemap carries 75 URLs because a sitemap
          should be complete. The same site&apos;s llms.txt carries 49 links because a reading list
          should be selective. If the two files list the same thing, the llms.txt one is not doing
          its job.
        </p>

        <h2>How do you write one in ten minutes?</h2>

        <ol>
          <li>
            <strong>List the pages that answer something.</strong> Open your sitemap, then cross out
            everything that exists for navigation, legal boilerplate or marketing copy. What remains
            is your reading list.
          </li>
          <li>
            <strong>Write the title and the summary line.</strong> One H1, one blockquote. Say what
            the site is and who it is for, in a sentence or two. If you cannot summarise the site in
            two sentences, the file is not the problem.
          </li>
          <li>
            <strong>Group the links under H2 headings.</strong> Docs, pricing, guides, whatever
            matches your structure. Add a short note after each link when the title alone is not
            clear, in the form <code>[name](url): note</code>.
          </li>
          <li>
            <strong>Serve it and check it.</strong> A plain text response at <code>/llms.txt</code>{" "}
            is enough. Fetch it in a browser to confirm it is the file you think it is, and put the
            matching entry in sitemap.xml so it is discoverable.
          </li>
        </ol>

        <p>
          One more file is worth writing while you are in there. An llms.txt describes what you have;
          a tool declaration such as{" "}
          <code>agent-tools.json</code> describes what your site can do, with selectors and expected
          output, and the browser-side version of that idea is what{" "}
          <Link href="/blog/what-is-webmcp">WebMCP</Link> standardises. If an assistant can read both,
          it can describe your site and use it.
        </p>

        <h2>Frequently asked questions</h2>

        {faqVisible.map((item, i) => (
          <div key={i}>
            <h3>{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}

        {/* ===== Affiliate tools recommendation ===== */}
        <div className="my-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-bold mb-2">Tools mentioned in this guide</h2>
          <p className="text-slate-600 mb-4">
            Writing the file is manual, but keeping it current as a site grows is not, which is where
            these earn their place:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — a file that lists 49 links goes stale the moment you
              publish, and a small script that reads your sitemap and re-generates the list is
              faster to write with an assistant than to fix by hand each month.{" "}
              <a
                href="https://opencode.ai/go?ref=64V3FDAF5T"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try OpenCode Go
              </a>
            </li>
            <li>
              <strong>Stack AI</strong> — when the same summary has to feed several channels, a
              workflow can generate the file from your own content instead of you retyping
              descriptions in three places.{" "}
              <a
                href="https://www.stack-ai.com/partnership"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try Stack AI
              </a>
            </li>
            <li>
              <strong>Softr</strong> — if your site is a directory or a catalogue, publishing the
              collection as a no-code app gives you pages with stable URLs, which is exactly what a
              curated link list needs to point at.{" "}
              <a
                href="https://www.softr.io"
                target="_blank"
                rel="nofollow sponsored noopener"
                className="text-blue-600 underline"
              >
                Try Softr
              </a>
            </li>
          </ul>
          <p className="text-xs text-slate-400 mt-3">
            Some links above are affiliate links — if you buy through them we may earn a commission
            at no extra cost to you. OpenCode Go uses our referral link; the other two currently
            point to each vendor&apos;s official page until our tracking links are approved.
          </p>
        </div>

        <div className="not-prose my-10 rounded-2xl bg-blue-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Read a Real llms.txt, Then Get Yours Published</h2>
          <p className="text-blue-100 mb-5">
            The file we describe in the measurements above is live and public. If you would rather
            have someone write and verify yours, that is the work I do.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open Our llms.txt
              </Button>
            </a>
            <Link href="/agent-ready">
              <Button size="lg" variant="secondary" className="text-base px-8">
                See the Agent-Ready Service
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          I build this layer for other sites: llms.txt, agent-tools.json and WebMCP declarations,
          verified against the live pages. Details at <Link href="/agent-ready">/agent-ready</Link>.
        </p>

        <RelatedPosts slug="llms-txt-explained" />
      </article>
    </>
  );
}
