import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "agent-tools.json: How an AI Agent Finds Out What Your Site Can Do",
  description:
    "What agent-tools.json holds, how it differs from llms.txt and WebMCP, and what we found checking our own file against the live pages with getTools().",
  keywords: [
    "agent tools json",
    "agent-tools.json",
    "ai agent website optimization",
    "make website agent ready",
    "webmcp tool declaration",
    "llms.txt vs agent tools",
    "ai agent website audit",
    "site tools for ai agents",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/agent-tools-json",
  },
  openGraph: {
    title: "agent-tools.json: How an AI Agent Finds Out What Your Site Can Do",
    description:
      "One file lists the actions your site offers. Here is the version we run, and the live-page check that showed which entries an agent can actually reach.",
    type: "article",
    url: "https://nocodecsv.com/blog/agent-tools-json",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-20",
    modifiedTime: "2026-09-20",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "agent-tools.json: Telling an AI Agent What Your Site Can Do",
    description:
      "The file, the fields, and a getTools() cross-check that found one entry an anonymous agent cannot reach at all.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "agent-tools.json: How an AI Agent Finds Out What Your Site Can Do",
  description:
    "A field-by-field look at agent-tools.json, the difference between it, llms.txt and WebMCP, and the results of checking our own declarations against the live pages.",
  url: "https://nocodecsv.com/blog/agent-tools-json",
  datePublished: "2026-09-20",
  dateModified: "2026-09-20",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/agent-tools-json",
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
      name: "agent-tools.json",
      item: "https://nocodecsv.com/blog/agent-tools-json",
    },
  ],
};

export default function BlogPost() {
  // FAQ 字面量放在组件体内:同一份数据既进 JSON-LD,也渲染成可见问答,
  // 结构上不可能对不上(源码级与构建产物级校验都能看见文字)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is agent-tools.json?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "agent-tools.json is a file published at a site root that lists the actions the site offers. Each entry names the action, the page it lives on, whether sign-in is required, the steps a caller should take, and the tool name that page declares to the browser. An assistant reads the file to learn what the site can do without scraping page text and guessing.",
        },
      },
      {
        "@type": "Question",
        name: "Is agent-tools.json an official standard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. There is no specification behind the name yet. llms.txt is a community convention documented at llmstxt.org, and WebMCP is a Chrome API with published documentation. agent-tools.json is the piece we wrote for ourselves, published openly so a reader can compare it with their own. Treat any file with this name as a convention that a site chose to follow, not as something a browser enforces.",
        },
      },
      {
        "@type": "Question",
        name: "How is agent-tools.json different from llms.txt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "llms.txt is a reading list: the pages worth opening, with a short description of each. agent-tools.json is a task list: the actions a site can perform, where they live, and what the caller must supply. One answers what is worth reading, the other answers what can be done. Our llms.txt is 11,004 bytes of prose and links; our agent-tools.json is 7,142 bytes of named actions.",
        },
      },
      {
        "@type": "Question",
        name: "How is agent-tools.json different from WebMCP?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WebMCP is how a page exposes a tool to a browser-based agent: forms carry toolname and tooldescription, or a script calls registerTool with an inputSchema. agent-tools.json sits one step earlier. It is a static index of what exists where, so an agent that cannot run WebMCP, or that wants to decide whether a site is worth visiting, has something to read. In our file the two are linked: each entry records the webmcp_toolname the page declares.",
        },
      },
      {
        "@type": "Question",
        name: "Where does the file go, and what should it contain?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At the site root, next to robots.txt and llms.txt, so it is reachable at /agent-tools.json. Ours carries a spec_version, an updated date, a publisher block, notes for agents, and one object per action with name, intent, page, requires_auth, steps and output. The steps field points at real DOM targets: our selectors name file inputs that exist in the page markup rather than being created on click.",
        },
      },
      {
        "@type": "Question",
        name: "Can an agent actually use any of these tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "In our test, four of the five entries resolved to a callable tool on a public page, and one did not. The dashboard pair sits behind a sign-in redirect, so an anonymous agent that follows the entry lands on a login page with no tools present. Declaring an action is not the same as granting access to it, and the file says so on that entry.",
        },
      },
      {
        "@type": "Question",
        name: "How do I check that the file is really being served?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Check the content type, not the status code. Static hosts that fall back to a single-page app answer 200 for paths that do not exist, so a 200 proves only that something came back. We measured exactly that on one of our other sites: a made-up sibling path returned 200 with content type text/html and 28,843 bytes, while agent-tools.json returned 200 with application/json and 8,223 bytes. One command shows both: curl -s -o /dev/null -w 'http=%{http_code} type=%{content_type} ' https://example.com/agent-tools.json",
        },
      },
      {
        "@type": "Question",
        name: "What can an agent still not do on a site like this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hand over a file, in the case we measured. A page whose only input is a file picker exposes a tool whose parameter list is empty, because the file input does not become a callable argument. That is why two of our declarations are imperative tools that accept the CSV or JSON as text instead. Sign-in walls are the other limit: a tool that only exists after authentication is invisible to an agent browsing without an account.",
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

        <h1>agent-tools.json: How an AI Agent Finds Out What Your Site Can Do</h1>

        <p>
          agent-tools.json is a file at a site root that lists the actions the site offers, the page
          each one lives on, whether sign-in is needed, and what the caller has to supply. An agent
          reads it instead of guessing a site&apos;s abilities from page text.
        </p>

        <p>
          It is not an official standard. We wrote the one on this site, and we check it against the
          live pages rather than trusting it. The check we ran while writing this found four entries
          that resolve to a real tool and one that an anonymous agent cannot reach at all. Both parts
          are below, because the second is the more useful half.
        </p>

        <h2>Why a reading list is not enough</h2>

        <p>
          Three files now sit at the root of a site that wants to be legible to machines, and they
          answer different questions.
        </p>

        <ul>
          <li>
            <strong>robots.txt</strong> says what may be fetched. It is a request about access, and{" "}
            <a
              href="https://www.rfc-editor.org/rfc/rfc9309.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              RFC 9309
            </a>{" "}
            is explicit that it is not a form of authorization. We covered the AI crawler tokens in{" "}
            <Link href="/blog/robots-txt-ai-crawlers">the robots.txt guide</Link>.
          </li>
          <li>
            <strong>llms.txt</strong> says what is worth opening. The convention is documented at{" "}
            <a
              href="https://llmstxt.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              llmstxt.org
            </a>
            , and ours is 11,004 bytes of grouped links with a line of description each. What it does
            not say is what the site can <em>do</em>.
          </li>
          <li>
            <strong>WebMCP</strong> is the browser API that lets a page hand tools to an agent.
            Chrome documents two forms: the{" "}
            <a
              href="https://developer.chrome.com/docs/ai/webmcp/declarative-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              declarative API
            </a>
            , where a form carries <code>toolname</code> and <code>tooldescription</code>, and the{" "}
            <a
              href="https://developer.chrome.com/docs/ai/webmcp/imperative-api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              imperative API
            </a>
            , where a script registers a tool with a typed input schema. We wrote about the whole
            layer in{" "}
            <Link href="/blog/what-is-webmcp">What Is WebMCP?</Link>
          </li>
        </ul>

        <p>
          The gap is timing and reach. A WebMCP declaration is only visible once a capable browser
          has opened the page. An agent deciding where to send a user, or an agent running in a
          browser without the trial flag switched on, has nothing structured to read. A static index
          of actions covers that case, and the name we and a few others use for it is{" "}
          <code>agent-tools.json</code>.
        </p>

        <h2>What our file contains</h2>

        <p>
          The file we measured today is 7,142 bytes, served as{" "}
          <code>application/json</code>, stamped <code>spec_version 1.1</code> and dated 19 September.
          It opens with a publisher block and a short section of notes for agents, then one object
          per action:
        </p>

        <pre>
          <code>{`{
  "spec_version": "1.1",
  "updated": "2026-09-19",
  "publisher": { "name": "NoCodeCSV", "url": "https://nocodecsv.com" },
  "notes_for_agents": [
    "All tools run in the user's browser...",
    "The /dashboard workspace requires a signed-in user."
  ],
  "tools": [
    {
      "name": "split_large_csv",
      "webmcp_toolname": "splitLargeCsv (declarative) | splitCsvText (imperative)",
      "intent": "Split a CSV that is too large for Excel into smaller files.",
      "page": "https://nocodecsv.com/tools/csv-splitter",
      "requires_auth": false,
      "steps": [
        { "action": "upload_file", "selector": "#toolFileInput" },
        { "action": "set_value", "selector": "input[type=number]" },
        { "action": "submit", "selector": "button[type=submit]" }
      ]
    }
  ]
}`}</code>
        </pre>

        <p>
          Fields that earn their place: <code>requires_auth</code>, so a caller knows whether sign-in
          is part of the job; <code>steps</code> with real selectors, so an agent does not have to
          infer the interface; and <code>webmcp_toolname</code>, so the static entry and the in-page
          declaration can be matched to each other. That last field is what makes the file testable,
          which is where the next section comes from.
        </p>

        <h2>What we measured against the live pages</h2>

        <p>
          A declaration file is only as good as the pages under it. We loaded each page in a
          Chromium build launched with the WebMCP testing flag, awaited{" "}
          <code>navigator.modelContext.getTools()</code> and compared the result with what the JSON
          claims.
        </p>

        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Declared in the file</th>
              <th>What getTools() returned</th>
              <th>Parameters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/tools/csv-delimiter-converter</td>
              <td>fixCsvDelimiter</td>
              <td>fixCsvDelimiter</td>
              <td>none</td>
            </tr>
            <tr>
              <td>/tools/csv-splitter</td>
              <td>splitLargeCsv, splitCsvText</td>
              <td>both present</td>
              <td>csvText (required), rowsPerFile</td>
            </tr>
            <tr>
              <td>/tools/json-csv-converter</td>
              <td>convertJsonCsv, convertJsonCsvText</td>
              <td>both present</td>
              <td>text and direction (both required)</td>
            </tr>
            <tr>
              <td>/dashboard</td>
              <td>uploadCsvFile, askQuestionAboutData</td>
              <td>none — the page redirects to sign-in</td>
              <td>n/a</td>
            </tr>
            <tr>
              <td>/tools/spreadsheet-charts</td>
              <td>nothing — listed as a link</td>
              <td>none</td>
              <td>n/a</td>
            </tr>
          </tbody>
        </table>

        <p>
          Four of five entries hold up. The one that does not is instructive: the dashboard entry is
          marked <code>requires_auth: true</code>, and when we loaded <code>/dashboard</code> without
          a session the browser landed on <code>/sign-in?redirect_url=...</code> with zero forms,
          zero file inputs and zero tools registered. So the declaration is accurate about the
          requirement, and an agent following it still cannot do the task. A list of capabilities is
          not a grant of access.
        </p>

        <p>
          The remaining gap is the file input. On a tool page whose only input is a file picker, the
          tool appears in the list with an empty parameter set. That is why two entries in our file
          are imperative tools that take the CSV or JSON as text:{" "}
          <code>splitCsvText</code> accepts <code>csvText</code> plus an optional{" "}
          <code>rowsPerFile</code>, and <code>convertJsonCsvText</code> accepts{" "}
          <code>text</code> and <code>direction</code>. Both were introduced for exactly that reason,
          and the file records it so the next person editing it does not remove them as duplicates.
        </p>

        <h2>The 200 that is not your file</h2>

        <p>
          Here is a check worth copying if you publish anything at a static path. On one of our other
          sites, a request to <code>/agent-tools.json</code> returns 200 with content type{" "}
          <code>application/json</code> and 8,223 bytes. A request to a path that does not exist
          returns 200 with content type <code>text/html</code> and 28,843 bytes, because the host
          falls back to the single-page app shell for unknown routes.
        </p>

        <p>
          Two different results, same status code. A curl that prints only{" "}
          <code>{"%{http_code}"}</code> cannot tell them apart, and neither can a monitoring check that
          watches for a 404. Print the type as well:
        </p>

        <pre>
          <code>{`curl -s -o /dev/null -w "http=%{http_code} type=%{content_type} " \n  https://example.com/agent-tools.json`}</code>
        </pre>

        <p>
          The check has already caught one real problem for us. On 19 September the same request
          against that site returned <code>text/html</code> for the path, which meant the file was
          not published and the agent on the other end would have received a web page. On 20
          September it returns <code>application/json</code>. Nothing about the status code changed
          in between, which is the point.
        </p>

        <h2>How to keep it from drifting</h2>

        <ol>
          <li>
            <strong>One entry per action, with a page URL.</strong> If two pages do the same job, the
            file should say which one callers should use.
          </li>
          <li>
            <strong>Test the auth flag signed out.</strong> We only know the dashboard entry behaves
            as documented because we loaded it without a session.
          </li>
          <li>
            <strong>Record the exact tool name the page declares</strong>, then re-run the check after
            any UI change. A rename in a form is silent otherwise.
          </li>
          <li>
            <strong>Point steps at markup that exists.</strong> Our selectors name file inputs that
            are in the DOM at load time, not inputs created when a button is clicked.
          </li>
          <li>
            <strong>Mark links as links.</strong> One of our five entries has no tool behind it:{" "}
            <code>webmcp_toolname</code> is null and a note explains that the page is a landing page.
            Implying a tool where there is only a page is the fastest way to make the file useless.
          </li>
          <li>
            <strong>Stamp it and re-verify the stamp.</strong> The <code>updated</code> field is only
            worth reading if someone re-runs the check on that date.
          </li>
        </ol>

        <h2>What still does not work</h2>

        <p>
          Two limits we hit ourselves, both worth stating rather than leaving for a reader to
          discover. A file picker does not become a tool parameter, so any action that begins with
          &quot;upload your spreadsheet&quot; is out of reach for a browser agent today; the workaround
          is a text-shaped tool, which is not always possible. And an authenticated tool is invisible
          to an unauthenticated agent, so the parts of a product behind a login are declared but not
          usable. Neither limit is a reason to skip the file. Both are reasons to describe the site
          accurately instead of optimistically.
        </p>

        <p>
          If your site publishes tools, the order that worked for us was robots.txt first, then{" "}
          <Link href="/blog/llms-txt-explained">llms.txt</Link>, then this file, then the WebMCP
          declarations themselves. Each one is checkable, and the checks are one command each.
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
            This article is about a JSON file, so the tools worth naming are the ones around it:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the page checks in this article were written as a
              script and run from a terminal, which is faster with an assistant than by hand.{" "}
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
              <strong>Stack AI</strong> — if an agent action needs to land somewhere you can read
              later, a workflow can turn an incoming request into a row, a summary or an alert.{" "}
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
              <strong>Softr</strong> — for a site that is really a catalogue, publishing the
              collection as a no-code app gives each item a stable URL, which is what any
              declaration file needs to point at.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Want This Layer Written and Verified for Your Site?</h2>
          <p className="text-blue-100 mb-5">
            The file in this article is public, and the cross-check output is above. If you would
            rather have someone write and re-test the same set of declarations on your own pages,
            that is the work I do.
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

        <RelatedPosts slug="agent-tools-json" />
      </article>
    </>
  );
}
