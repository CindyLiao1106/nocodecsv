import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Is Your Website Agent-Ready? How to Check It Yourself",
  description:
    "Four machine-readable files decide whether an AI assistant can read, cite and operate your site. Here are the seven checks we run, the exact commands, and today's results on three live sites.",
  keywords: [
    "is my website agent ready",
    "is your website agent ready",
    "agent ready website test",
    "ai agent website audit",
    "how to check if your website is agent ready",
    "agent tools json test",
    "llms.txt checker",
    "webmcp test",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/is-your-website-agent-ready" },
  openGraph: {
    title: "Is Your Website Agent-Ready? How to Check It Yourself",
    description:
      "Seven checks, one terminal, about five minutes. The same audit script we run on client sites, and the three live results from today.",
    type: "article",
    url: "https://nocodecsv.com/blog/is-your-website-agent-ready",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-21",
    modifiedTime: "2026-09-21",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Your Website Agent-Ready? Seven Checks",
    description:
      "Robots, llms.txt, agent-tools.json and WebMCP declarations, checked with one command each. Three live sites measured today.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Is Your Website Agent-Ready? How to Check It Yourself",
  description:
    "A seven-step agent-readiness check for any website: robots.txt, llms.txt, agent-tools.json, sitemap host, control labels, the WebMCP origin-trial header and a browser confirmation, with measured results from three live sites.",
  url: "https://nocodecsv.com/blog/is-your-website-agent-ready",
  datePublished: "2026-09-21",
  dateModified: "2026-09-21",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/is-your-website-agent-ready",
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
      name: "Is Your Website Agent-Ready?",
      item: "https://nocodecsv.com/blog/is-your-website-agent-ready",
    },
  ],
};

export default function BlogPost() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does agent-ready mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A site is agent-ready when four machine-readable things are published and reachable: robots.txt rules that name AI crawlers, an llms.txt reading list, an agent-tools.json task list, and WebMCP tool declarations on the pages that do real work. Without them an assistant can only guess what your site does from page text.",
        },
      },
      {
        "@type": "Question",
        name: "Is agent-ready an official standard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Partly. robots.txt follows RFC 9309, which is a published standard. llms.txt is a community convention documented at llmstxt.org and is not enforced by anything. WebMCP is a Chrome API in origin trial. agent-tools.json has no specification at all; it is a naming convention we and other sites have adopted, so treat it as a convention rather than a rule.",
        },
      },
      {
        "@type": "Question",
        name: "How do I check whether my website is agent-ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run seven checks in this order: confirm robots.txt names AI crawlers, confirm llms.txt returns plain text, confirm agent-tools.json returns JSON instead of HTML, confirm the sitemap lists the host you intend to keep, confirm your key form controls have stable labels, confirm the WebMCP origin-trial header is present, and finally confirm in a browser that getTools() lists your tools.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need WebMCP to be agent-ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The three static files make your site readable and citable without any browser support. WebMCP is what lets an assistant act on a page rather than describe it, so a site can be agent-readable today and add the action layer later. In our own three-site measurement, two sites published the static files and only one had the in-page layer.",
        },
      },
      {
        "@type": "Question",
        name: "Will being agent-ready make ChatGPT cite my site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No one can promise that, including us. These files remove technical blockers: a crawler that is allowed in, a reading list, a task list and declared tools. Whether a particular assistant retrieves and quotes your page is that assistant's decision, based on its own index and policy.",
        },
      },
      {
        "@type": "Question",
        name: "How long does the work take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The two text files are an afternoon, and the agent-tools.json that follows them is another hour if you verify each entry against the live page. Tool declarations are per page, so that part scales with how many actions your site actually offers. Our own file lists five actions across four pages.",
        },
      },
      {
        "@type": "Question",
        name: "What is the fastest way to see where my site stands?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Run a single command against your domain: three fetches that check for agent-tools.json, llms.txt and the AI crawler lines in robots.txt. The open-source script we use, agent_ready_audit.py, does those three plus the sitemap, the origin-trial header and a browser check, and writes a Markdown report.",
        },
      },
      {
        "@type": "Question",
        name: "Can an assistant fill in my contact form once the declarations are in place?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "For text, dropdown and number fields, yes, and we have measured a declared form being driven end to end. For file inputs, no: in our test a file picker did not become a tool parameter, so the tool was discoverable but its parameter list came back empty. Any workflow that starts with an upload is still out of reach for a browser agent.",
        },
      },
    ],
  };

  const faqVisible = faqJsonLd.mainEntity.map((item) => ({
    q: item.name,
    a: item.acceptedAnswer.text,
  }));

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

        <h1>Is Your Website Agent-Ready? How to Check It Yourself</h1>

        <p>
          A site is agent-ready when four machine-readable things are published and reachable:
          robots.txt rules that name AI crawlers, an llms.txt reading list, an agent-tools.json
          task list, and WebMCP tool declarations on the pages that do real work. All seven checks
          below run from a terminal in about five minutes.
        </p>

        <p>
          The reason to check rather than assume is that every one of these layers fails quietly.
          A file can return 200 and still be the wrong file. A declaration can list an action that
          no page can perform. A sitemap can describe a hostname you are not testing. We run these
          checks on our own sites before we run them on anyone else&apos;s, which is where the
          numbers further down come from.
        </p>

        <h2>What each layer actually answers</h2>

        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>The question it answers</th>
              <th>Who reads it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>robots.txt</td>
              <td>May I fetch this page?</td>
              <td>Crawlers, including AI crawlers</td>
            </tr>
            <tr>
              <td>llms.txt</td>
              <td>What here is worth opening?</td>
              <td>Assistants assembling an answer</td>
            </tr>
            <tr>
              <td>agent-tools.json</td>
              <td>What can this site actually do?</td>
              <td>Assistants choosing an action</td>
            </tr>
            <tr>
              <td>WebMCP declarations</td>
              <td>How do I do it on this page?</td>
              <td>Browser agents with the trial enabled</td>
            </tr>
          </tbody>
        </table>

        <p>
          The four are not rivals. Access, reading list, task list, execution. A site can publish
          three of them and still be useful to an assistant, which is what two of the three sites
          in our own test do.
        </p>

        <h2>The seven checks, in the order we run them</h2>

        <ol>
          <li>
            <strong>Does robots.txt name AI crawlers?</strong>{" "}
            <code>curl -s https://example.com/robots.txt | head -40</code>. Look for groups that
            name GPTBot, ClaudeBot, PerplexityBot and similar. One trap is worth knowing before you
            conclude anything: consecutive <code>User-agent</code> lines form a single group and
            share whatever rules follow, so a file with sixteen agent names may carry one rule set
            rather than sixteen. We walked through the{" "}
            <Link href="/blog/robots-txt-ai-crawlers">AI crawler tokens</Link> separately.
          </li>
          <li>
            <strong>Does llms.txt come back as text?</strong> Print the type and the size, not just
            the status code:
            <pre>
              <code>{`curl -s -o /dev/null -w "http=%{http_code} type=%{content_type} bytes=%{size_download}\\n" \\
  https://example.com/llms.txt`}</code>
            </pre>
            You want <code>text/plain</code> and a byte count that looks like a real file.{" "}
            <Link href="/blog/llms-txt-explained">What to put in it</Link> is a separate article.
          </li>
          <li>
            <strong>Does agent-tools.json return JSON?</strong> The same command against{" "}
            <code>/agent-tools.json</code>. This is the check that catches a published file that is
            not published at all, and we have been burned by it once already.{" "}
            <Link href="/blog/agent-tools-json">The field-by-field guide</Link> explains what
            belongs in the file.
          </li>
          <li>
            <strong>Does the sitemap list the host you intend to keep?</strong>{" "}
            <code>curl -s https://example.com/sitemap.xml | grep -o &quot;&lt;loc&gt;[^&lt;]*&quot; | head -5</code>
            . Two of the three sites we audited answer on a preview hostname while the sitemap
            names the production domain, which is usually deliberate and always worth confirming.
          </li>
          <li>
            <strong>Do the controls an assistant needs have stable names?</strong> A file input with
            a label, a submit button with a label, no field that is generated by JavaScript after a
            click. An agent that cannot name an element cannot target it.
          </li>
          <li>
            <strong>Is the WebMCP origin-trial header present?</strong>{" "}
            <code>curl -sI https://example.com | grep -i origin-trial</code>. Nothing here works
            without the token, and the token carries an expiry date you should write down.
          </li>
          <li>
            <strong>Does a browser agree?</strong> Open a Chromium build with{" "}
            <code>chrome://flags/#enable-webmcp-testing</code> enabled and read{" "}
            <code>await navigator.modelContext.getTools()</code>, or use the Model Context Tool
            Inspector extension Chrome documents. This is the only check that proves the
            declaration reached an agent. The mechanics are in{" "}
            <Link href="/blog/what-is-webmcp">What Is WebMCP?</Link>
          </li>
        </ol>

        <h2>What we measured on three live sites today</h2>

        <p>
          All three sites are ours, so the failures are ours to publish. The audit ran on 21
          September 2026 and the numbers below are its raw output, not a summary.
        </p>

        <table>
          <thead>
            <tr>
              <th>Check</th>
              <th>nocodecsv.com</th>
              <th>carecosttool.pages.dev</th>
              <th>Second site we run</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>agent-tools.json</td>
              <td>5 tools, valid JSON</td>
              <td>2 tools, valid JSON</td>
              <td>6 tools, valid JSON</td>
            </tr>
            <tr>
              <td>llms.txt</td>
              <td>10,980 characters, has a For AI agents section</td>
              <td>2,783 characters, has the section</td>
              <td>1,436 characters, no such section</td>
            </tr>
            <tr>
              <td>AI crawlers named in robots.txt</td>
              <td>14</td>
              <td>13</td>
              <td>0</td>
            </tr>
            <tr>
              <td>sitemap.xml</td>
              <td>81 URLs, host matches</td>
              <td>7 URLs, different host</td>
              <td>11 URLs, different host</td>
            </tr>
            <tr>
              <td>WebMCP origin-trial header</td>
              <td>present, 196 characters</td>
              <td>none</td>
              <td>none</td>
            </tr>
            <tr>
              <td>Browser getTools() result</td>
              <td>3 tools listed</td>
              <td>not enabled</td>
              <td>not enabled</td>
            </tr>
          </tbody>
        </table>

        <p>
          One site out of three has the full stack. The other two publish the static files, which
          is the part that depends only on them, and neither has the in-page layer, because the
          origin-trial token depends on a Chrome programme rather than on the site owner. That
          split is the useful finding: the readable half of agent-readiness is a decision you can
          make today, and the operable half has a waiting list.
        </p>

        <h2>Three results that changed how we check</h2>

        <p>
          <strong>1. A 200 is not proof the file exists.</strong> On a static host that falls back
          to a single-page app shell, an unknown path returns 200 with content type{" "}
          <code>text/html</code> and tens of kilobytes of HTML. A monitoring check that watches for
          404 will never notice. Print the type, as in check two and three above. We caught a real
          instance of this on 19 September and confirmed it had cleared a day later; the status code
          was 200 on both days.
        </p>

        <p>
          <strong>2. A sitemap can name a host you are not testing.</strong> Two of the three sites
          answer on a preview hostname while the sitemap lists a custom domain. That is normally
          intentional, and it also means the host you audit should be the host you intend to ship,
          because the sitemap is what a crawler follows.
        </p>

        <p>
          <strong>3. A published agent-tools.json is not a crawler policy.</strong> The second site
          lists six actions and names zero AI crawlers in robots.txt. RFC 9309 makes the default
          allow, so nothing is blocked, but nothing invites the crawlers either. Naming them is the
          only way a site states a position, and the absence is what the audit reports.
        </p>

        <h2>Run the same audit on your own site</h2>

        <p>
          The script behind that table is open source at{" "}
          <a
            href="https://github.com/CindyLiao1106/agent-ready-audit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            github.com/CindyLiao1106/agent-ready-audit
          </a>
          , and it is the same one we run on client work:
        </p>

        <pre>
          <code>{`python3 agent_ready_audit.py https://example.com --md report.md`}</code>
        </pre>

        <p>
          It fetches agent-tools.json, llms.txt, robots.txt and sitemap.xml, counts the AI crawler
          names, checks the origin-trial header, probes the pages for declared tools, and where a
          browser build is available it reads the tool list from <code>getTools()</code>. It
          reports what it could not test as plainly as what it found. On our calculator project it
          prints &quot;not enabled&quot; for the browser check rather than a green tick, because no
          token is present, and that is the correct answer.
        </p>

        <h2>The order that worked for us</h2>

        <ol>
          <li>
            <strong>robots.txt first</strong>, because if crawlers are not allowed in, nothing else
            matters.
          </li>
          <li>
            <strong>llms.txt second</strong>, because it is prose and takes the least thought.
          </li>
          <li>
            <strong>agent-tools.json third</strong>, verifying every entry against a live page as
            you write it.
          </li>
          <li>
            <strong>WebMCP declarations last</strong>, page by page, because that work scales with
            the number of actions rather than the size of the site.
          </li>
          <li>
            <strong>A re-check on a date.</strong> Our trial token expires 17 November 2026. Origin
            trials end, sitemaps drift, and a declaration file stops matching the pages under it
            the moment someone renames a field.
          </li>
        </ol>

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
            Three tools that fit the work described above, and why each one is on the list:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the audit is a script, and the fixes after it are code
              edits against your own markup. That loop is faster with an assistant in the terminal.{" "}
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
              <strong>Stack AI</strong> — if an agent action should land somewhere you can read
              later, a workflow can turn an incoming request into a record instead of a page view
              you never see.{" "}
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
              <strong>Softr</strong> — check four asks whether your sitemap names the host you
              intend to keep. If your catalogue lives in a spreadsheet, publishing it as a no-code
              app gives every item a stable URL to point at.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Want Your Site Checked and Then Fixed?</h2>
          <p className="text-blue-100 mb-5">
            Send a URL and you get the same findings note the script above writes, read by a person
            and put in priority order. Implementation is quoted as a fixed scope afterwards.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/agent-tools.json" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open Our agent-tools.json
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
          I build this layer for other sites — llms.txt, agent-tools.json, WebMCP declarations —
          and verify each one against the live pages. Details at{" "}
          <Link href="/agent-ready">/agent-ready</Link>.
        </p>

        <RelatedPosts slug="is-your-website-agent-ready" />
      </article>
    </>
  );
}
