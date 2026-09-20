import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "What Is WebMCP? How a Website Hands Tools to an AI Agent",
  description:
    "WebMCP is a proposed browser standard that lets a site declare its own tools in HTML or JavaScript, so an agent can call them instead of clicking a button.",
  keywords: [
    "what is webmcp",
    "webmcp",
    "webmcp chrome",
    "webmcp example",
    "webmcp tools",
    "how does webmcp work",
    "webmcp vs mcp",
    "webmcp declarative api",
    "agent ready website",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/what-is-webmcp",
  },
  openGraph: {
    title: "What Is WebMCP? How a Website Hands Its Tools to an AI Agent",
    description:
      "A proposed browser standard with two APIs, one for HTML forms and one for JavaScript. What the documentation says, what we measured on a live site, and where it still stops short.",
    type: "article",
    url: "https://nocodecsv.com/blog/what-is-webmcp",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-18",
    modifiedTime: "2026-09-18",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is WebMCP? Websites Declaring Their Own Tools",
    description:
      "Two APIs, one HTML-only. What the Chrome documentation specifies, plus the tool list we read back from a live site.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is WebMCP? How a Website Hands Its Tools to an AI Agent (2026)",
  description:
    "WebMCP is a proposed browser standard that lets a website declare its own tools, in HTML form annotations or in JavaScript, so a browser-based AI agent can call a defined tool instead of clicking through the interface. This page covers the declarative API attributes, the imperative API, how it differs from MCP, and the tool list we read back from a live site.",
  url: "https://nocodecsv.com/blog/what-is-webmcp",
  datePublished: "2026-09-18",
  dateModified: "2026-09-18",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/what-is-webmcp",
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
      name: "What Is WebMCP?",
      item: "https://nocodecsv.com/blog/what-is-webmcp",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is WebMCP in plain terms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebMCP is a proposed browser standard that lets a website describe its own tools, so an AI agent running inside the browser can call a named tool with typed parameters instead of reading the page and guessing which button to press. It has a declarative form, which is HTML attributes on a normal form, and an imperative form, which is JavaScript that registers tools at runtime.",
      },
    },
    {
      "@type": "Question",
      name: "Does WebMCP replace MCP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Chrome's own comparison page states that WebMCP is not an extension of MCP and not a replacement for it. MCP connects agents to external systems and data sources and works on any platform, while WebMCP is a frontend browser standard that only interacts with the browser's built-in agent. The two are meant to be used together, not chosen between.",
      },
    },
    {
      "@type": "Question",
      name: "How do I add WebMCP to my website?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Start with the declarative API: add toolname and tooldescription attributes to a form that already does something useful, then add toolparamdescription to the individual fields that need explaining. The browser turns that form into a tool with a JSON Schema built from its fields. Removing either toolname or tooldescription unregisters the tool, so both attributes are required.",
      },
    },
    {
      "@type": "Question",
      name: "Is WebMCP available in Chrome today?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The declarative API is listed as an origin trial in Chrome's documentation, and pages on an enrolled origin receive the API. Enrollment is per origin and time limited: the origin trial token our own domain serves carries a feature name of WebMCP and an expiry date of 17 November 2026. Without enrollment, or in a browser that does not implement the API, the tool attributes are ignored and the page behaves as a normal form.",
      },
    },
    {
      "@type": "Question",
      name: "Can an AI agent upload a file to my form through WebMCP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not on the evidence we have. When we read the tool list back from our own tool pages, each declared tool came back with an empty parameter schema: properties was an empty object and required was an empty array, even though the page contains a labelled file input. The tool is discoverable by name and description, but the agent has no typed field to put a file into. Text, number and select fields are the ones the declarative API maps into parameters.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need WebMCP to be cited by AI assistants?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Reading and citing your content is a separate mechanism from calling your tools. Files such as llms.txt and agent-tools.json help an assistant find and describe what is on your site, and unlike WebMCP they are plain files that work today in every client that chooses to fetch them. WebMCP is for actions inside the browser, and it is still in preview.",
      },
    },
    {
      "@type": "Question",
      name: "Which pages on a site can declare tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any page that can render a form or run the imperative API, and there is no rule that each page may declare only one. In practice the limit is useful ones: we declared one tool per tool page and left two explanation-only pages alone, and those two pages correctly reported zero tools. A page with no tool declaration exposes nothing to the agent, which is the right default for marketing copy.",
      },
    },
  ],
};

const faqVisible = [
  {
    q: "What is WebMCP in plain terms?",
    a: "WebMCP is a proposed browser standard that lets a website describe its own tools, so an AI agent running inside the browser can call a named tool with typed parameters instead of reading the page and guessing which button to press. It has a declarative form, which is HTML attributes on a normal form, and an imperative form, which is JavaScript that registers tools at runtime.",
  },
  {
    q: "Does WebMCP replace MCP?",
    a: "No. Chrome's own comparison page states that WebMCP is not an extension of MCP and not a replacement for it. MCP connects agents to external systems and data sources and works on any platform, while WebMCP is a frontend browser standard that only interacts with the browser's built-in agent. The two are meant to be used together, not chosen between.",
  },
  {
    q: "How do I add WebMCP to my website?",
    a: "Start with the declarative API: add toolname and tooldescription attributes to a form that already does something useful, then add toolparamdescription to the individual fields that need explaining. The browser turns that form into a tool with a JSON Schema built from its fields. Removing either toolname or tooldescription unregisters the tool, so both attributes are required.",
  },
  {
    q: "Is WebMCP available in Chrome today?",
    a: "The declarative API is listed as an origin trial in Chrome's documentation, and pages on an enrolled origin receive the API. Enrollment is per origin and time limited: the origin trial token our own domain serves carries a feature name of WebMCP and an expiry date of 17 November 2026. Without enrollment, or in a browser that does not implement the API, the tool attributes are ignored and the page behaves as a normal form.",
  },
  {
    q: "Can an AI agent upload a file to my form through WebMCP?",
    a: "Not on the evidence we have. When we read the tool list back from our own tool pages, each declared tool came back with an empty parameter schema: properties was an empty object and required was an empty array, even though the page contains a labelled file input. The tool is discoverable by name and description, but the agent has no typed field to put a file into. Text, number and select fields are the ones the declarative API maps into parameters.",
  },
  {
    q: "Do I need WebMCP to be cited by AI assistants?",
    a: "No. Reading and citing your content is a separate mechanism from calling your tools. Files such as llms.txt and agent-tools.json help an assistant find and describe what is on your site, and unlike WebMCP they are plain files that work today in every client that chooses to fetch them. WebMCP is for actions inside the browser, and it is still in preview.",
  },
  {
    q: "Which pages on a site can declare tools?",
    a: "Any page that can render a form or run the imperative API, and there is no rule that each page may declare only one. In practice the limit is useful ones: we declared one tool per tool page and left two explanation-only pages alone, and those two pages correctly reported zero tools. A page with no tool declaration exposes nothing to the agent, which is the right default for marketing copy.",
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
        <p className="text-blue-600 font-medium">🤖 AI &amp; Agents · 8 min read</p>
        <h1>What Is WebMCP? How a Website Hands Its Tools to an AI Agent</h1>

        <p>
          <strong>
            WebMCP is a proposed browser standard that lets a website declare its own tools, so an
            AI agent inside the browser can call a defined function instead of guessing which button
            to click ({" "}
            <a
              href="https://developer.chrome.com/docs/ai/webmcp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Chrome for Developers
            </a>
            ). It comes in two forms: HTML attributes on an ordinary form, and a JavaScript API for
            interactions that cannot be expressed as a form.
          </strong>{" "}
          That is the whole idea. Everything else is detail about how a form becomes a tool, what an
          agent sees when it asks the browser what your page can do, and how far the preview
          actually goes today.
        </p>

        <p>
          The question shows up in several forms. People type{" "}
          <em>&ldquo;what is webmcp&rdquo;</em>, <em>&ldquo;webmcp vs mcp&rdquo;</em> and{" "}
          <em>&ldquo;how does webmcp work&rdquo;</em>, which are three ways of asking the same thing.
          This page answers all three, and adds something the documentation cannot: the tool list we
          read back from a live site, including the part that does not work yet.
        </p>

        <h2>What is WebMCP?</h2>

        <p>
          WebMCP defines how a page tells a browser agent what it can do. Instead of the agent
          inferring actions from the rendered interface, the site publishes a machine-readable list
          of tools with names, descriptions and parameter schemas. The documentation describes two
          APIs for doing that ({" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            developer.chrome.com/docs/ai/webmcp
          </a>
          ):
        </p>

        <table>
          <thead>
            <tr>
              <th>API</th>
              <th>Written as</th>
              <th>Suited to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Declarative</td>
              <td>HTML attributes on an existing form</td>
              <td>Standard actions: submit a ticket, run a converter, request a quote</td>
            </tr>
            <tr>
              <td>Imperative</td>
              <td>JavaScript, through <code>navigator.modelContext</code></td>
              <td>Dynamic work: tools that appear or change depending on state</td>
            </tr>
          </tbody>
        </table>

        <p>
          Chrome&apos;s documentation lists the declarative API as an origin trial. That matters for
          anyone planning work around it: the API is live for enrolled origins, not for the web at
          large, and it is not something you can rely on a random visitor&apos;s browser to
          implement.
        </p>

        <h2>How does the declarative API actually work?</h2>

        <p>
          You annotate a form you already have. Two attributes are required, and the documentation is
          blunt about the consequence of leaving one out: removing either{" "}
          <code>toolname</code> or <code>tooldescription</code> unregisters the tool. The optional{" "}
          <code>toolparamdescription</code> attribute goes on individual fields when the browser
          cannot work out what a field means. Without it, the browser uses the field&apos;s{" "}
          <code>&lt;label&gt;</code>, and if there is no label it falls back to{" "}
          <code>aria-description</code>.
        </p>

        <pre>
          <code>{`<form toolname="splitLargeCsv"
      tooldescription="Splits a CSV file that is too large for Excel.">
  <label for="rows">Rows per file</label>
  <input type="number" name="rows" id="rows"
         toolparamdescription="How many data rows each output file should hold.">
  <button type="submit">Split</button>
</form>`}</code>
        </pre>

        <p>
          The browser turns that markup into JSON. For a form with text, number and select inputs,
          the generated tool carries an <code>inputSchema</code> whose <code>properties</code> are
          the named fields, plus a <code>required</code> array for the ones marked required. That is
          the mechanism that makes an agent&apos;s call predictable rather than a click simulation.
        </p>

        <p>
          Three more pieces of the declarative API are worth knowing, because they decide how the
          interaction ends. <code>toolautosubmit</code> lets the model submit the form instead of
          waiting for a person to press the button. The <code>SubmitEvent</code> interface gains an{" "}
          <code>agentInvoked</code> boolean, so a site can tell an agent submission from a human one,
          and a <code>respondWith(Promise)</code> method that returns a value to the model as the
          tool&apos;s output. On the page there are <code>toolactivated</code> and{" "}
          <code>toolcancel</code> events on <code>window</code>, and the CSS pseudo-classes{" "}
          <code>:tool-form-active</code> and <code>:tool-submit-active</code> for showing a user
          which form an agent is currently filling ({" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/declarative-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            declarative API reference
          </a>
          ).
        </p>

        <h2>What did we measure on a live site?</h2>

        <p>
          Documentation tells you what should happen. So we enrolled our own domain in the origin
          trial and read the tools back out of the browser. These are the results from 18 September
          2026, on nocodecsv.com:
        </p>

        <ul>
          <li>
            The served page carries an <code>origin-trial</code> response header. Decoded, its
            payload reads{" "}
            <code>
              {`{"origin":"https://nocodecsv.com:443","feature":"WebMCP","expiry":1794873600}`}
            </code>
            , which is 17 November 2026 in UTC. The enrollment is per origin and it runs out.
          </li>
          <li>
            On <Link href="/tools/csv-splitter">the CSV splitter</Link>,{" "}
            <code>getTools()</code> returned exactly one tool: <code>splitLargeCsv</code>, with the
            description we wrote in the markup.
          </li>
          <li>
            On <Link href="/tools/csv-delimiter-converter">the delimiter converter</Link> it
            returned <code>fixCsvDelimiter</code>, and on{" "}
            <Link href="/tools/json-csv-converter">the JSON and CSV converter</Link> it returned{" "}
            <code>convertJsonCsv</code>. One tool per page, matching the markup.
          </li>
          <li>
            On two pages that explain a workflow without containing a tool,{" "}
            <code>getTools()</code> returned zero tools. No declaration, nothing exposed.
          </li>
          <li>
            <code>navigator.modelContext.executeTool</code> existed on the page, so an agent could
            in principle call the tool it had discovered.
          </li>
        </ul>

        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Tool the agent saw</th>
              <th>Parameters the agent saw</th>
            </tr>
          </thead>
          <tbody>
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
              <td>none</td>
            </tr>
            <tr>
              <td>/tools/csv-analyzer</td>
              <td>nothing declared</td>
              <td>not applicable</td>
            </tr>
            <tr>
              <td>/tools/spreadsheet-charts</td>
              <td>nothing declared</td>
              <td>not applicable</td>
            </tr>
          </tbody>
        </table>

        <p>
          The empty parameter column is the finding, not a formatting quirk. For{" "}
          <code>convertJsonCsv</code> the returned schema was{" "}
          <code>{`{"type":"object","properties":{},"required":[]}`}</code> while the page contains a
          labelled file input. The tool is discoverable and described, but there is no typed field
          for the file, so an agent can see the capability and cannot supply the input. If your
          product depends on an agent handing you a file, that is the gap to plan around, and it is
          the reason we also publish{" "}
          <Link href="/agent-ready">a plain-file description of what the site does</Link> rather than
          relying on the trial alone.
        </p>

        <h2>What is the difference between WebMCP and MCP?</h2>

        <p>
          They are not competitors, and Chrome&apos;s comparison page says so directly: WebMCP is not
          an extension or a replacement of the Model Context Protocol. The same page draws the line
          by where the functionality lives. MCP connects an agent to external systems, data sources
          and workflows, works on any platform, commonly speaks JSON-RPC and is implemented through
          language SDKs. WebMCP is a frontend browser standard whose two APIs interact only with the
          browser&apos;s own agent, and it leaves out server-side concepts such as resources ({" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/compare-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            WebMCP versus MCP
          </a>
          ).
        </p>

        <table>
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>MCP</th>
              <th>WebMCP</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Where the function lives</td>
              <td>Backend or external service</td>
              <td>The page the user is looking at</td>
            </tr>
            <tr>
              <td>Who can reach it</td>
              <td>Any MCP-capable client</td>
              <td>The browser&apos;s built-in agent</td>
            </tr>
            <tr>
              <td>How it is built</td>
              <td>Server process plus an SDK</td>
              <td>HTML attributes, or JavaScript in the page</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>Established protocol with published SDKs</td>
              <td>Origin trial in the browser</td>
            </tr>
          </tbody>
        </table>

        <h2>Do you need WebMCP if you already have llms.txt?</h2>

        <p>
          They answer different questions. A file such as{" "}
          <Link href="/blog/llms-txt-explained">llms.txt</Link> describes your content so an
          assistant can read the right pages; WebMCP declares your actions so an agent can perform
          one. Publishing the file is available to everyone today, needs no enrollment and no
          browser support, and it is the part that already shows up in audits. WebMCP is the part
          that will matter when browser agents are common, and the markup cost of adding it to a
          form you already have is two attributes.
        </p>

        <h2>What should a site owner do about it this month?</h2>

        <p>
          Three things, in this order, and none of them require committing to the trial.
        </p>

        <ol>
          <li>
            <strong>Inventory the forms that do real work.</strong> A form that submits a quote
            request or runs a converter is a candidate. A newsletter box is not, because the agent
            gains nothing. Write down what each one produces.
          </li>
          <li>
            <strong>Annotate one form and check what an agent sees.</strong> Add{" "}
            <code>toolname</code> and <code>tooldescription</code>, put{" "}
            <code>toolparamdescription</code> on the fields whose purpose is not obvious from a
            label, and confirm each field shows up as a typed parameter. This is where our own test
            caught an empty schema.
          </li>
          <li>
            <strong>Describe the site in plain files regardless.</strong> Join the origin trial if
            you want the API, and publish llms.txt plus a machine-readable tool list anyway, because
            those work in clients that will never implement an origin trial.
          </li>
        </ol>

        <p>
          One honest caveat to close on. WebMCP is described as an early preview, the token expires,
          and the field annotations omit at least file inputs today. Anyone selling you a guaranteed
          outcome from it is selling something the specification does not yet deliver. What you can
          verify is narrow and real: whether your page declares a tool, and whether a browser reads
          it back. Our pages do, and we showed the output above.
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
            Declaring tools across a site with more than a handful of forms is mostly typing and
            checking, which is where these help:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — annotating every form on a large site is repetitive work
              that a coding assistant handles well: add the attributes, then grep the markup to
              confirm the descriptions actually landed on the fields that needed them.{" "}
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
              <strong>Stack AI</strong> — useful when the action an agent should take is not a form
              at all but a workflow behind one, such as normalising a file before it reaches your
              own tool. Workflows can be exposed as tools in their own right.{" "}
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
              <strong>Softr</strong> — if your site has no interactive form to declare yet, a
              no-code app gives you something concrete for an agent to call, which is easier than
              retrofitting a tool into a brochure page.{" "}
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
          <h2 className="text-2xl font-bold mb-3">See a Declared Tool, Then Get Yours Declared</h2>
          <p className="text-blue-100 mb-5">
            The splitter page above carries a real WebMCP tool declaration you can inspect. If you
            want the same layer on your own site, verified on the live pages rather than in a
            document, that is the work I do.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools/csv-splitter">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open the Declared Tool
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
          I build this layer for other sites: llms.txt, agent-tools.json and WebMCP declarations,
          verified against the live pages. Details at <Link href="/agent-ready">/agent-ready</Link>.
          The audit tool I use is open source —{" "}
          <a
            href="https://github.com/CindyLiao1106/agent-ready-audit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-700"
          >
            run it on your own site
          </a>
          .
        </p>

        <RelatedPosts slug="what-is-webmcp" />
      </article>
    </>
  );
}
