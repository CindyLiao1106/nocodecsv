import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "Can AI Fill Out a Form for You? What Works on a Website (2026)",
  description:
    "An AI assistant can only fill a web form when the page publishes it as a tool. The two attributes that do it, which field types reach the assistant, which do not, and what we measured on five of our own pages.",
  keywords: [
    "can ai fill out a form for me",
    "can ai fill out online forms",
    "ai agent fill form website",
    "webmcp form",
    "form toolname tooldescription",
    "agent ready form",
    "ai autofill web form",
    "html form ai agent",
    "toolparamdescription",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/can-ai-fill-out-a-form",
  },
  openGraph: {
    title: "Can AI Fill Out a Form for You?",
    description:
      "Two HTML attributes turn a form into a tool an assistant can call. Field types, the file-input gap, and measurements from five live pages.",
    type: "article",
    url: "https://nocodecsv.com/blog/can-ai-fill-out-a-form",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-19",
    modifiedTime: "2026-09-19",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Can AI Fill Out a Form for You? What Works in 2026",
    description:
      "Yes for text boxes and dropdowns that the page declares. No for file uploads — measured, not guessed.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Can AI Fill Out a Form for You? What Works on a Website (2026)",
  description:
    "An AI assistant can complete a web form when the page declares the form as a tool with the toolname and tooldescription attributes. This page covers which field types become parameters, the file-input gap measured on five live pages, the two submission modes, and how to test your own form.",
  url: "https://nocodecsv.com/blog/can-ai-fill-out-a-form",
  datePublished: "2026-09-19",
  dateModified: "2026-09-19",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/can-ai-fill-out-a-form",
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
      name: "Can AI Fill Out a Form for You?",
      item: "https://nocodecsv.com/blog/can-ai-fill-out-a-form",
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
        name: "Can AI fill out a form for me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, if the page publishes the form as a tool. Two HTML attributes on the form element, toolname and tooldescription, register it with the browser's WebMCP layer, and an assistant running in that browser can then see the form, fill its text boxes, text areas and dropdowns, and read the values back. A form with neither attribute is invisible to the assistant, no matter how ordinary it looks to you.",
        },
      },
      {
        "@type": "Question",
        name: "Which attributes make a form usable by an AI assistant?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "toolname and tooldescription go on the form element and both are required; removing either one unregisters the tool. Optionally, toolparamdescription goes on individual fields to describe each parameter. Without toolparamdescription the browser falls back to the content of the field's associated label, and if there is no label it uses aria-description. An element marked required is listed in the parameter schema's required array.",
        },
      },
      {
        "@type": "Question",
        name: "Can AI attach a file to a form?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not today. In our own measurement, three forms whose only input was a file picker registered as tools with an empty parameter list: the assistant could see the tool by name and had nothing to pass into it. That held even when the file input carried an explicit toolparamdescription and an associated label. If a workflow depends on a file, the page needs a text path or a hand-registered tool with a typed schema.",
        },
      },
      {
        "@type": "Question",
        name: "Can AI fill out a Google Form or a PDF form?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not through this API. The declarative attributes work on a form element inside a document you control, where the browser can read the fields and write into them. A PDF is a document rather than a page, and a form inside somebody else's product belongs to that product. Those surfaces need the vendor's own automation, a file-level tool, or a copy of the form on a page of your own.",
        },
      },
      {
        "@type": "Question",
        name: "Does the assistant submit the form, or does the user?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You choose. Chrome documents two modes: the user clicks Submit as usual, or you add the toolautosubmit attribute and the browser submits and navigates when the model invokes the tool. The SubmitEvent interface carries an agentInvoked boolean, so one handler can tell which path fired. Starting without automatic submission keeps a human in the loop.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need JavaScript to make my form agent-ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No for the declarative path. Adding the attributes to server-rendered HTML is enough, and browsers that do not implement WebMCP ignore them, so the form keeps working as before. JavaScript is only needed for the imperative path, where you call navigator.modelContext.registerTool yourself to publish a tool that is not a form.",
        },
      },
      {
        "@type": "Question",
        name: "Will declaring my form as a tool break it for human visitors?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It should not. The attributes are metadata, and they do not change rendering or validation. What they do change is that a new kind of visitor can reach your endpoint, so keep the server-side checks you already have: validation, rate limits, and spam filtering all still apply to whatever the assistant sends.",
        },
      },
      {
        "@type": "Question",
        name: "How do I check whether my own form is ready?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Search your page source for toolname. If it is missing, nothing else matters. If it is there, open the page in a Chromium build with WebMCP enabled and call navigator.modelContext.getTools(), then look at the parameter list of your tool. A tool that reports no parameters is the signature of a form whose only input is a file, or of fields that were never given a name.",
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

        <h1>Can AI Fill Out a Form for You?</h1>

        <p>
          <strong>
            Yes, for text boxes and dropdowns, if the page publishes the form as a tool. Two HTML
            attributes do the publishing: <code>toolname</code> and <code>tooldescription</code>.
            File uploads do not work, and that is measurable rather than a marketing caveat.
          </strong>{" "}
          That answer covers the question people type as <em>&ldquo;can ai fill out a form for
          me&rdquo;</em> or <em>&ldquo;can ai fill out online forms&rdquo;</em>. The rest of this
          page is the two attributes, a field-by-field breakdown, and what we read back from five
          of our own pages in a browser with the feature switched on.
        </p>

        <h2>What can an AI assistant do with a form today?</h2>

        <p>
          A form on a web page is a set of labelled fields plus a submit action. Everything an
          assistant needs is already there in the markup, but the markup was written for a human
          eye, and nothing in it announces that a machine may fill it in. WebMCP is the proposal
          that adds that announcement. It comes in two shapes, and the{" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            overview page
          </a>{" "}
          lists the second one first because it is the common case: &ldquo;Fill in structured
          forms: Build a <code>submit_application</code> tool to help agents map data collected
          from the conversation with the user to form fields correctly.&rdquo;
        </p>

        <table>
          <thead>
            <tr>
              <th>Route</th>
              <th>What you write</th>
              <th>When it fits</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Declarative</td>
              <td>Attributes on your existing form element</td>
              <td>An ordinary contact, booking or enquiry form</td>
            </tr>
            <tr>
              <td>Imperative</td>
              <td>JavaScript that calls <code>registerTool</code></td>
              <td>An action that is not a form, or one that needs typed input</td>
            </tr>
          </tbody>
        </table>

        <p>
          The declarative route is worth ten minutes of anyone&apos;s time, because it needs no
          JavaScript and no new endpoint. What the browser does with it is described plainly in the{" "}
          <a
            href="https://developer.chrome.com/docs/ai/webmcp/declarative-api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            declarative API documentation
          </a>
          : when an agent calls the tool, the browser brings the form into focus and fills its
          fields, and the form stays visible to the person watching.
        </p>

        <h2>What does the page have to add?</h2>

        <p>
          Two attributes on the form. <code>toolname</code> names the tool after the action it
          performs, and <code>tooldescription</code> says what invoking it does. Removing either one
          unregisters the tool, so they travel as a pair. The documentation&apos;s own example puts
          a support form on the web:
        </p>

        <pre>
          <code>{`<form toolname="supportRequestTool"
      tooldescription="Submit a request for support."
      action="/submit">
  <label for="firstName">First Name</label>
  <input type="text" name="firstName">
  <label for="lastName">Last Name</label>
  <input type="text" name="lastName">
  <select name="select" required
          toolparamdescription="Determines what team this request is routed to.">
    <option value="Customer happiness team">Return my purchase.</option>
    <option value="Distribution team">Check where my package is.</option>
  </select>
</form>`}</code>
        </pre>

        <p>
          Field descriptions are the optional half, and they are where the fallbacks live. Add{" "}
          <code>toolparamdescription</code> and the browser uses your sentence as the parameter
          description. Leave it out and the browser reads the content of the field&apos;s associated{" "}
          <code>&lt;label&gt;</code>, skipping any labelable descendants. With no label at all it
          looks at <code>aria-description</code>. An element carrying <code>required</code> lands in
          the schema&apos;s <code>required</code> array, which is why the <code>select</code> above
          shows up as mandatory.
        </p>

        <p>
          None of this is a separate page or a second form. It is the same form, annotated, and a
          browser that has never heard of WebMCP ignores the attributes and renders exactly what it
          rendered before.
        </p>

        <h2>What we measured on five of our own pages</h2>

        <p>
          Claims about agent-readiness are easy to make and easy to get wrong, so on 19 September
          2026 we opened five of our own pages in a Chromium build with the feature enabled, awaited{" "}
          <code>navigator.modelContext.getTools()</code>, and printed the name and parameter list of
          every tool the page offered an agent.
        </p>

        <table>
          <thead>
            <tr>
              <th>Page</th>
              <th>Tool from the form</th>
              <th>Parameters it got</th>
              <th>Tool registered in code</th>
              <th>Parameters it got</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>/tools/csv-splitter</td>
              <td>splitLargeCsv</td>
              <td>none</td>
              <td>splitCsvText</td>
              <td>csvText, rowsPerFile</td>
            </tr>
            <tr>
              <td>/tools/csv-delimiter-converter</td>
              <td>fixCsvDelimiter</td>
              <td>none</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>/tools/json-csv-converter</td>
              <td>convertJsonCsv</td>
              <td>textInput</td>
              <td>convertJsonCsvText</td>
              <td>text, direction</td>
            </tr>
            <tr>
              <td>/tools/csv-analyzer</td>
              <td>(none declared)</td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>/agent-ready</td>
              <td>(none declared)</td>
              <td>—</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>

        <p>
          Read the first two rows together and the pattern is obvious. The forms that produced zero
          parameters are the ones whose only input is a file picker, and one of them even carries{" "}
          <code>toolparamdescription</code> on that input plus a matching label. Neither detail
          saved it. The assistant could see a tool called <code>splitLargeCsv</code>, could explain
          what it does, and had nothing to hand it: no <code>file</code> property, no bytes, no
          URL. Software that can be found but not used is worse than software that is not there,
          because it wastes a turn.
        </p>

        <p>
          The third row shows the other half of the lesson. That form has a{" "}
          <code>&lt;textarea name=&quot;textInput&quot;&gt;</code> and a file input, and only the
          textarea reached the agent. The same page also holds two <code>&lt;select&gt;</code>{" "}
          elements and a checkbox with labels that are not bound to them and no{" "}
          <code>name</code> attribute on any of them. Those three fields never appeared in the
          parameter list either. From one page we cannot say whether the missing piece was the{" "}
          <code>name</code> or the loose label, so the safe habit is to give every field both a{" "}
          <code>name</code> and a <code>toolparamdescription</code> and check the result.
        </p>

        <p>
          The registered tools behave as their schemas promise, which we checked the same afternoon
          by calling them. Passing five data rows and a rows-per-file value of two into{" "}
          <code>splitCsvText</code> returned three files, each repeating the header row, and the
          contents matched what we computed independently in Python. A conversion tool turned two
          JSON records into a two-column CSV and flattened a nested object into{" "}
          <code>meta.score</code>. An empty <code>csvText</code> argument came back refused with{" "}
          <em>&ldquo;csvText is empty — pass the CSV content to split&rdquo;</em>, which is the
          reason to trust the other two results: the tool is really running, not reciting a canned
          reply.
        </p>

        <h2>Which field types reach the agent, and which do not?</h2>

        <p>
          The documentation covers the common elements; our measurements fill in the edges. What we
          can support with evidence is below, and anything outside it is marked as untested rather
          than guessed.
        </p>

        <table>
          <thead>
            <tr>
              <th>Field</th>
              <th>Becomes a parameter</th>
              <th>Evidence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Text input</td>
              <td>Yes</td>
              <td>In the documentation&apos;s example form</td>
            </tr>
            <tr>
              <td>Textarea</td>
              <td>Yes</td>
              <td>Named textarea surfaced as <code>textInput</code> on our converter page</td>
            </tr>
            <tr>
              <td>Select with <code>name</code> and <code>required</code></td>
              <td>Yes</td>
              <td>Shown in the documentation example, options becoming the value set</td>
            </tr>
            <tr>
              <td>File input</td>
              <td>No</td>
              <td>Two forms, one with an explicit parameter description, both reported none</td>
            </tr>
            <tr>
              <td>Select or checkbox with no <code>name</code></td>
              <td>No, observed</td>
              <td>Three fields on our converter page never appeared</td>
            </tr>
            <tr>
              <td>Number, date, checkbox with a name</td>
              <td>Untested</td>
              <td>Not present in our pages, and not spelled out in the docs we read</td>
            </tr>
          </tbody>
        </table>

        <p>
          One more limit is worth naming, because it decides how much of your workflow can move. A
          declaration describes a form that exists in the page at the moment the browser looks. A
          multi-step wizard whose second step is created after a click, or a form hidden behind a
          sign-in, is a different problem, and the imperative API is the tool for it: you register
          a named tool with a typed schema and handle the state yourself.
        </p>

        <h2>Can AI fill out a PDF or a Google Form?</h2>

        <p>
          Not through this API, and the reason is structural rather than temporary. The attributes
          work on a <code>form</code> element in a document you control, where the browser can read
          the fields and write into them. A PDF is a file, and a form inside somebody else&apos;s
          product belongs to that product. For those surfaces you need that vendor&apos;s own
          automation, a file-level tool that parses the document, or a copy of the questions on a
          page of your own where you can annotate them.
        </p>

        <h2>Does the person still have to press Submit?</h2>

        <p>
          You decide, and there are exactly two documented options. The first is the familiar one:
          the assistant fills the fields and the user clicks Submit. The second adds the{" "}
          <code>toolautosubmit</code> attribute, and the browser submits and navigates when the
          model invokes the tool. The <code>SubmitEvent</code> interface carries an{" "}
          <code>agentInvoked</code> boolean so a single handler can branch on which path fired,
          which is the cleanest place to add a confirmation step or a different log line.
        </p>

        <p>
          Start without automatic submission. A form that submits itself on an assistant&apos;s
          say-so is a form that will eventually submit something you did not want, and the human
          click costs a second.
        </p>

        <h2>How do you check whether your own form is ready?</h2>

        <ol>
          <li>
            <strong>Search the source for <code>toolname</code>.</strong> If it is absent, nothing
            else on this list matters yet. Turn <Link href="/blog/what-is-webmcp">WebMCP</Link> on
            for the page and add the two attributes.
          </li>
          <li>
            <strong>Confirm the attributes sit on the form, not on a wrapper.</strong> The
            declaration belongs to the <code>&lt;form&gt;</code> element itself.
          </li>
          <li>
            <strong>Read the parameter list back.</strong> In an enabled browser, await{" "}
            <code>getTools()</code> and inspect your tool. No parameters at all is the signature of
            a file-only form.
          </li>
          <li>
            <strong>Cover the file path separately.</strong> If a file is genuinely required, add a
            text route or a registered tool that accepts content, the way we did for{" "}
            <Link href="/tools/csv-splitter">splitting a large CSV</Link>.
          </li>
          <li>
            <strong>Keep your server checks.</strong> Validation, rate limits and spam filtering are
            unchanged by any of this.
          </li>
        </ol>

        <p>
          A form is the cheapest agent-facing interface a small site has. You already built the
          fields and the handler; the declaration is two attributes, and the one failure mode worth
          watching for is a tool that shows up with nothing to give it.
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
            The attributes take a text editor. These are for the parts around them, where a form
            meets real traffic:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — writing the tool declaration is a five-minute job, but
              checking that every field ends up as a parameter is the sort of loop a small script
              does faster than a person clicking through the form each time.{" "}
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
              <strong>Stack AI</strong> — if a submitted form should route somewhere (a CRM row, a
              summary email, a spreadsheet), a workflow saves writing that plumbing by hand.{" "}
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
              <strong>Softr</strong> — for directory and catalogue sites, a published collection
              gives you pages with stable URLs, which is what an agent needs before it can point a
              form submission at the right record.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Want the Declaration Checked on Your Own Form?</h2>
          <p className="text-blue-100 mb-5">
            The measurements on this page come from live pages, not from a demo. If you would rather
            have someone turn your form into a working tool and verify the parameter list, that is
            the work I do.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/agent-ready">
              <Button size="lg" variant="secondary" className="text-base px-8">
                See the Agent-Ready Service
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Try the CSV Analyzer
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          I build this layer for other sites: llms.txt, agent-tools.json and WebMCP declarations,
          verified against the live pages. Details at <Link href="/agent-ready">/agent-ready</Link>.
        </p>

        <RelatedPosts slug="can-ai-fill-out-a-form" />
      </article>
    </>
  );
}
