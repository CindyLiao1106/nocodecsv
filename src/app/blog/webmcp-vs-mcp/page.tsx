import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "WebMCP vs MCP: What Each One Does and When to Use Both",
  description:
    "WebMCP and MCP are not competitors. MCP connects an AI client to backend systems; WebMCP lets a page declare tools to the browser's agent. Chrome's comparison, plus what we measured.",
  keywords: [
    "webmcp vs mcp",
    "webmcp vs mcp server",
    "webmcp vs chrome mcp",
    "mcp vs webmcp",
    "difference between mcp and webmcp",
    "mcp vs computer use",
    "model context protocol browser",
    "browser agent tools",
  ],
  alternates: { canonical: "https://nocodecsv.com/blog/webmcp-vs-mcp" },
  openGraph: {
    title: "WebMCP vs MCP: What Each One Does and When to Use Both",
    description:
      "Chrome says WebMCP is not a replacement for MCP. Here is the difference in location, the official comparison table, and the tool output we measured on a live site.",
    type: "article",
    url: "https://nocodecsv.com/blog/webmcp-vs-mcp",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-21",
    modifiedTime: "2026-09-21",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebMCP vs MCP: Partners, Not Opponents",
    description:
      "One runs on a server, one runs in a tab. The comparison table Chrome publishes, and the getTools() output we checked against it.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "WebMCP vs MCP: What Each One Does and When to Use Both",
  description:
    "A comparison of WebMCP and Model Context Protocol: where each one runs, what each one can do, Chrome's own comparison table, and the tool output we measured on a live site.",
  url: "https://nocodecsv.com/blog/webmcp-vs-mcp",
  datePublished: "2026-09-21",
  dateModified: "2026-09-21",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/webmcp-vs-mcp",
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
      name: "WebMCP vs MCP",
      item: "https://nocodecsv.com/blog/webmcp-vs-mcp",
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
        name: "Is WebMCP a replacement for MCP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Chrome's documentation states that WebMCP is not an extension or a replacement of MCP, and says the two address different needs: MCP for backend systems that agents reach from anywhere, WebMCP for the page a user is looking at in a browser.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between WebMCP and MCP in one sentence?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MCP is a protocol that connects an AI client to a server that can sit anywhere; WebMCP is a browser API that lets the page the user is visiting declare its own tools to the browser's built-in agent.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need an MCP server to use WebMCP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The two can be deployed independently. A WebMCP tool is declared in the page, either with HTML attributes on a form or with document.modelContext.registerTool, and no server process is involved. Chrome describes WebMCP as a set of MCP-inspired APIs rather than a JavaScript implementation of MCP.",
        },
      },
      {
        "@type": "Question",
        name: "Which browsers support WebMCP today?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Chrome ships WebMCP as an origin trial from Chrome 149. Our own verification covers Chromium builds launched with the WebMCP testing flag, and Chrome's documentation describes Chrome only, so we make no claim about other engines.",
        },
      },
      {
        "@type": "Question",
        name: "Does WebMCP replace robots.txt or llms.txt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No, they answer different questions. robots.txt says what may be fetched, llms.txt says what is worth reading, and WebMCP says how a browser agent operates the page. A site can and often should publish all three, which is what we do on this one.",
        },
      },
      {
        "@type": "Question",
        name: "Can an agent use my WebMCP tools when my page is closed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Chrome's documentation states that WebMCP tools are ephemeral and exist only while the page is open. Once the user navigates away or closes the tab, the agent can no longer reach the tools or the site.",
        },
      },
      {
        "@type": "Question",
        name: "How do I test WebMCP without writing a full agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enable the flag at chrome://flags/#enable-webmcp-testing, relaunch Chrome, then use the Model Context Tool Inspector extension that Chrome's WebMCP documentation links. Both steps are described on the WebMCP page in the Chrome for Developers documentation.",
        },
      },
      {
        "@type": "Question",
        name: "Does WebMCP work in headless browsers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not as a design goal. Chrome lists headless browsing as a limitation and says the API is primarily designed for local browser workflows with a human in the loop, so a server-side crawler is the wrong place to expect it to run.",
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
        <p className="text-blue-600 font-medium">🤖 AI &amp; Agents · 10 min read</p>

        <h1>WebMCP vs MCP: What Each One Does and When to Use Both</h1>

        <p>
          WebMCP and MCP are not competing standards, and you do not have to pick one. MCP connects
          an AI client to backend systems through a server that runs outside the browser. WebMCP
          lets a web page hand its own tools to the browser&apos;s built-in agent while a user has
          that page open. Chrome&apos;s documentation states outright that WebMCP is not an
          extension or a replacement of MCP.
        </p>

        <p>
          The question comes up because both names describe one idea: a machine-readable way for
          software to say what it can do. Chrome&apos;s{" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/compare-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            comparison page
          </a>{" "}
          opens with the exact question developers ask, whether WebMCP will replace MCP, and then
          answers it. What follows is that answer with the mechanics filled in, plus the tool
          output we measured on a site running both layers.
        </p>

        <h2>Short answer: they are partners, not opponents</h2>

        <p>
          Chrome explains the split with an analogy: a company&apos;s customer service call center
          against an in-store expert. The call center is reachable through any channel at any time
          and looks things up behind the scenes. The in-store expert only exists on your premises,
          in this case your page, and can see what the customer is looking at right now.
        </p>

        <p>
          The documentation then says it in one line each: MCP is for backend, WebMCP is for
          frontend. The deciding factor is not capability, it is location. An MCP server is a
          process or a hosted service. A WebMCP tool is a live tab, and only while that tab stays
          open.
        </p>

        <h2>What MCP is</h2>

        <p>
          Model Context Protocol is an open protocol that connects LLM applications with external
          data sources and tools. Two facts explain most of the differences you will read about.
        </p>

        <ul>
          <li>
            <strong>Format and transport.</strong> Messages are JSON-RPC 2.0, UTF-8 encoded. The{" "}
            <a
              href="https://modelcontextprotocol.io/specification/2025-06-18"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              specification
            </a>{" "}
            defines two standard transports: <code>stdio</code>, where the client launches the
            server as a subprocess, and Streamable HTTP. Connections are stateful and the two
            sides negotiate capabilities during initialization.
          </li>
          <li>
            <strong>Structure.</strong> The spec names three roles: a host, which is the LLM
            application; clients inside that host; and servers that provide context and
            capabilities. Servers can offer resources, prompts and tools. Only the third one is
            the &quot;call this function&quot; part people usually mean.
          </li>
        </ul>

        <p>
          The current specification is revision 2025-06-18, and the project publishes SDKs for
          Rust, Python and TypeScript, among others. In practice an agent connects to a server that
          may be running on your own machine or on someone else&apos;s, and that server&apos;s
          tools are available in every conversation the client has, whether or not your website is
          open at the time.
        </p>

        <h2>What WebMCP is</h2>

        <p>
          WebMCP is a proposed browser standard. Chrome ships it as an origin trial from Chrome
          149, which is why trying it locally means enabling the flag at{" "}
          <code>chrome://flags/#enable-webmcp-testing</code> rather than installing anything.
          Chrome describes the scope narrowly: two APIs that interact with a browser&apos;s
          built-in agent, implemented either in JavaScript or with HTML attributes.
        </p>

        <p>
          The{" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/declarative-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            declarative API
          </a>{" "}
          adds attributes to a form you already have. <code>toolname</code> names the tool,{" "}
          <code>tooldescription</code> says what it does, and individual fields can carry{" "}
          <code>toolparamdescription</code> so the parameters arrive with sensible names.
          Chrome&apos;s documentation notes that removing either <code>toolname</code> or{" "}
          <code>tooldescription</code> unregisters the tool, which makes a copy edit a breaking
          change.
        </p>

        <p>
          The{" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/imperative-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            imperative API
          </a>{" "}
          is a JavaScript call, <code>document.modelContext.registerTool</code>, which takes a
          name, a description, an <code>inputSchema</code> and an <code>execute</code> function.
          Long-running work can receive an <code>AbortSignal</code>, and as of Chrome 153 a tool
          can be unregistered without cancelling executions already in flight.
        </p>

        <p>
          Two properties of WebMCP matter more than the API shape. Tools are ephemeral: Chrome
          says they exist only while your page is open, so closing the tab ends the agent&apos;s
          access. And they are DOM-aware: a WebMCP tool runs against the live page, including the
          session state and elements that exist only in that tab.
        </p>

        <h2>The comparison, from Chrome&apos;s own table</h2>

        <p>
          Rather than paraphrase it, here is the table Chrome publishes on its comparison page,
          with the six rows that page uses.
        </p>

        <table>
          <thead>
            <tr>
              <th>Row</th>
              <th>MCP</th>
              <th>WebMCP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Purpose</td>
              <td>Makes data and actions available to agents anywhere, anytime.</td>
              <td>
                Makes a live website ready for instant interaction with agents when a user visits
                the site.
              </td>
            </tr>
            <tr>
              <td>Lifecycle</td>
              <td>Persistent (server and daemon)</td>
              <td>Ephemeral (tab-bound)</td>
            </tr>
            <tr>
              <td>Connectivity</td>
              <td>Global (desktop, mobile, cloud, web)</td>
              <td>Environment-specific (browser agents)</td>
            </tr>
            <tr>
              <td>UI interaction</td>
              <td>Headless and external</td>
              <td>Browser-integrated and DOM-aware</td>
            </tr>
            <tr>
              <td>Discovery</td>
              <td>Agent-specific registration flows</td>
              <td>Tools registered on the web page during the user&apos;s visit</td>
            </tr>
            <tr>
              <td>Use case</td>
              <td>Performs background API actions.</td>
              <td>Navigates and actuates on a live web UI.</td>
            </tr>
          </tbody>
        </table>

        <p>
          Chrome&apos;s recommendation is to run both. The MCP server carries core business logic,
          data retrieval and background tasks. WebMCP is the last step, the connection between an
          agent and the page in front of the user. Read from the table, the pair is additive rather
          than alternative.
        </p>

        <h2>What we measured on a live site</h2>

        <p>
          Our own site runs the WebMCP origin trial, and we check it instead of assuming it works.
          The token in our response headers decodes to this payload:
        </p>

        <pre>
          <code>{`{"origin":"https://nocodecsv.com:443","feature":"WebMCP","expiry":1794873600}`}</code>
        </pre>

        <p>
          1794873600 is 17 November 2026 in Unix time, and it is the moment the token stops being
          valid. Origin trials are time-boxed by design, so a declaration that passes a check
          today can fail next quarter without anyone touching the page. We put that date in our own
          re-check list for exactly that reason.
        </p>

        <p>
          Next we loaded our tool pages in a Chromium build started with the WebMCP testing flag
          and awaited <code>navigator.modelContext.getTools()</code>. The browser returned the
          following, which is the raw material for the rest of this section:
        </p>

        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Tool the browser listed</th>
              <th>Parameters reported</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/tools/csv-splitter</td>
              <td>splitCsvText</td>
              <td>csvText (required), rowsPerFile</td>
            </tr>
            <tr>
              <td>/tools/csv-splitter</td>
              <td>splitLargeCsv</td>
              <td>none</td>
            </tr>
            <tr>
              <td>/tools/csv-delimiter-converter</td>
              <td>fixCsvDelimiter</td>
              <td>none</td>
            </tr>
            <tr>
              <td>/tools/json-csv-converter</td>
              <td>convertJsonCsv</td>
              <td>textInput</td>
            </tr>
            <tr>
              <td>/tools/json-csv-converter</td>
              <td>convertJsonCsvText</td>
              <td>text, direction (both required)</td>
            </tr>
            <tr>
              <td>/tools/csv-analyzer</td>
              <td>nothing declared</td>
              <td>n/a</td>
            </tr>
          </tbody>
        </table>

        <p>
          The empty parameter lists are the interesting half. A tool whose only input is a file
          picker arrives in the agent&apos;s tool list with no parameters at all, because the file
          input does not become a callable argument. That is why two of our tools are text-shaped:
          an agent can pass CSV or JSON content as a string even when it cannot attach a file. In
          an MCP server this problem does not exist in the same form, because the tool takes the
          arguments its schema declares and the server does the file handling on its own side. In
          the browser, handing a file from agent to page has no declared path yet, and we have not
          found a workaround that survives a re-test.
        </p>

        <p>
          We also loaded two pages with no declarations, <code>/tools/csv-analyzer</code> and{" "}
          <code>/agent-ready</code>. Both returned zero tools, which is the correct behaviour
          rather than a fault: nothing declared, nothing exposed. If you are auditing your own
          site, a page that returns tools you did not know about is the result worth chasing.
        </p>

        <h2>When to use which</h2>

        <ul>
          <li>
            <strong>The action must work while your site is closed.</strong> That is MCP. Scheduled
            jobs, lookups on a phone with no browser tab open, anything an assistant does on the
            user&apos;s behalf before they decide to visit you.
          </li>
          <li>
            <strong>The action depends on the live page or the signed-in session.</strong> That is
            WebMCP, and only WebMCP, because an MCP server has no view of the DOM a user is looking
            at.
          </li>
          <li>
            <strong>An assistant should know what your site offers before deciding to send someone
            there.</strong> Neither of the above. That is a static file an agent can read without
            executing your page, which is what{" "}
            <Link href="/blog/agent-tools-json">agent-tools.json</Link> is for.
          </li>
          <li>
            <strong>You only need your content read and cited.</strong> Then you need crawler
            policy and a reading list, not an API. Our{" "}
            <Link href="/blog/llms-txt-explained">llms.txt guide</Link> covers that side.
          </li>
        </ul>

        <h2>What WebMCP still cannot do</h2>

        <p>
          Five limits, four of which come from Chrome&apos;s own documentation and one from our
          test above.
        </p>

        <ol>
          <li>
            <strong>Headless browsing.</strong> Chrome lists it as a limitation and says the API is
            primarily designed for local browser workflows with a human in the loop.
          </li>
          <li>
            <strong>Complex interfaces.</strong> The same page warns that highly complex sites
            likely need refactoring or added JavaScript before declarations are worth writing.
          </li>
          <li>
            <strong>Tab lifetime.</strong> Close the tab and the tools are gone. There is no
            server-side copy of what the agent was allowed to do.
          </li>
          <li>
            <strong>File handoff.</strong> A file picker contributes no parameters, as the table
            above shows.
          </li>
          <li>
            <strong>Sign-in walls.</strong> A tool that only exists after authentication is
            invisible to an agent browsing signed out. We measured that on our own dashboard,
            where an anonymous load redirects to a sign-in page with no tools registered.
          </li>
        </ol>

        <p>
          None of these is a reason to skip the layer. They are reasons to describe what you
          publish accurately instead of optimistically. We wrote the declaration mechanics out in{" "}
          <Link href="/blog/what-is-webmcp">What Is WebMCP?</Link> if you want the attribute-level
          version.
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
            Everything in the measurement section was written as a script and run from a terminal,
            which is where an assistant earns its place:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the Chromium probe, the token decode and the tool-schema
              dump are three small scripts. Writing and re-running them is faster with an assistant
              than by hand.{" "}
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
              <strong>Stack AI</strong> — if a WebMCP tool is meant to trigger something you can read
              later, a workflow can turn the call into a row, a summary or an alert instead of a
              one-off page update.{" "}
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
              <strong>Softr</strong> — for a catalogue-style site, publishing the collection as a
              no-code app gives every item a stable URL, which is the one thing a tool declaration
              needs to point at.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Want This Layer Declared and Verified on Your Site?</h2>
          <p className="text-blue-100 mb-5">
            The token decode and the getTools() table above come from our own pages. If you would
            rather have someone declare, test and re-test the same layer on yours, that is the work
            I do.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/blog/what-is-webmcp">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Read the WebMCP Explainer
              </Button>
            </Link>
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

        <RelatedPosts slug="webmcp-vs-mcp" />
      </article>
    </>
  );
}
