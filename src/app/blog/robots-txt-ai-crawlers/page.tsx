import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RelatedPosts } from "@/components/blog/related-posts";

export const metadata: Metadata = {
  title: "AI Crawlers in robots.txt: Which to Allow, Which to Block (2026)",
  description:
    "Which AI crawler tokens exist, what each vendor says it does, and the grouping rule that silently gives every bot in your list the same rules. Includes the parser test we ran on our own robots.txt.",
  keywords: [
    "robots.txt ai crawler",
    "block gptbot robots txt",
    "gptbot robots.txt",
    "ai crawler allow list",
    "should i block gptbot",
    "claude-searchbot robots.txt",
    "robots.txt ai bots",
    "google-extended robots.txt",
    "ai crawler user agents",
  ],
  alternates: {
    canonical: "https://nocodecsv.com/blog/robots-txt-ai-crawlers",
  },
  openGraph: {
    title: "AI Crawlers in robots.txt: Which to Allow, Which to Block",
    description:
      "Separate training from retrieval, then check the grouping rule that catches almost every hand-written file.",
    type: "article",
    url: "https://nocodecsv.com/blog/robots-txt-ai-crawlers",
    siteName: "NoCodeCSV",
    locale: "en_US",
    publishedTime: "2026-09-19",
    modifiedTime: "2026-09-19",
    authors: ["NoCodeCSV Team"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Crawlers in robots.txt: Which to Allow",
    description:
      "Two independent switches per vendor, one grouping rule most files get wrong, and measurements from a live robots.txt.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "AI Crawlers in robots.txt: Which to Allow, Which to Block (2026)",
  description:
    "A guide to the AI crawler tokens in robots.txt: the vendor-documented purpose of each, the RFC 9309 grouping rule that makes consecutive user-agent lines share one rule set, and a parser test run against our own live file.",
  url: "https://nocodecsv.com/blog/robots-txt-ai-crawlers",
  datePublished: "2026-09-19",
  dateModified: "2026-09-19",
  inLanguage: "en",
  author: { "@type": "Organization", name: "NoCodeCSV Team" },
  publisher: {
    "@type": "Organization",
    name: "NoCodeCSV",
    logo: { "@type": "ImageObject", url: "https://nocodecsv.com/og-image.png" },
  },
  mainEntityOfPage: "https://nocodecsv.com/blog/robots-txt-ai-crawlers",
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
      name: "AI Crawlers in robots.txt",
      item: "https://nocodecsv.com/blog/robots-txt-ai-crawlers",
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
        name: "Should I block GPTBot in robots.txt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That depends on which switch you mean. OpenAI documents GPTBot and OAI-SearchBot as independent settings: a site can allow OAI-SearchBot so its content appears in search results while disallowing GPTBot to signal that the content should not be used for training foundation models. If you want to be quoted by an assistant, blocking the training bot costs you nothing; blocking the search bot removes you from the answers.",
        },
      },
      {
        "@type": "Question",
        name: "Do AI crawlers obey robots.txt?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It varies, and you should plan for the weaker case. RFC 9309 says plainly that the rules are not a form of access authorization, so a file is a request rather than a wall. Google states that its common crawlers always obey robots.txt rules when crawling automatically, while OpenAI notes that ChatGPT-User acts on a user's behalf and that robots.txt rules may not apply to those requests. For enforcement you need something at the network edge.",
        },
      },
      {
        "@type": "Question",
        name: "Which AI bots should be allowed for AI search visibility?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The retrieval ones, not the training ones. In OpenAI's naming those are OAI-SearchBot and ChatGPT-User; Anthropic documents Claude-SearchBot for search relevance and Claude-User for queries made by people using Claude; Perplexity-User appears in Cloudflare's taxonomy under AI Assistant, meaning a bot driven by user action. The training tokens, GPTBot and ClaudeBot and CCBot and Applebot-Extended, are a separate decision that does not affect whether you are cited.",
        },
      },
      {
        "@type": "Question",
        name: "Why do several User-agent lines in my robots.txt share one set of rules?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because that is what the specification says. RFC 9309 defines a group as one or more user-agent lines followed by one or more rules, and its grammar repeats the user-agent line inside a group. The specification's own example shows barbot and bazbot in a single group, described as a group that is relevant for more than one user agent. Listing names on consecutive lines is a deliberate shorthand for giving them identical rules.",
        },
      },
      {
        "@type": "Question",
        name: "How do I give one bot different rules from another?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Break the list. A group ends when a rule line has been read and a new user-agent line appears, so put a blank line between the two blocks and repeat the rules you want for each. The parser test we ran on a synthetic file with GPTBot and ClaudeBot stacked above a single disallow assigns that rule to both names; separating them into two groups with their own rules gives each its own.",
        },
      },
      {
        "@type": "Question",
        name: "What is Google-Extended, and will it appear in my logs?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Google-Extended is a standalone product token rather than a crawler. Google's documentation states that it has no separate HTTP request user agent string: crawling is done with existing Google user agent strings, and the token is used in a control capacity. So it will never show up in your server log, and a search for it there proves nothing.",
        },
      },
      {
        "@type": "Question",
        name: "Does disallowing Applebot-Extended stop Apple from crawling my site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Apple's support page is explicit that even if you disallow Applebot-Extended and tag content with nosnippet, your site instructions may still allow Applebot to crawl your pages, and your content stays discoverable through Spotlight, Siri and Safari. Applebot-Extended is an opt-out from training generative foundation models, not a crawling block.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to update robots.txt if I am not sure yet?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can leave the decision open and still be deliberate about it. One practical middle ground is what we do: keep the disallow list to private paths, allow the retrieval bots, and put the training question on a calendar rather than guessing at it today. Note that OpenAI documents a lag of roughly 24 hours from a robots.txt update to a change in search behaviour, so a change is not instant in either direction.",
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

        <h1>AI Crawlers in robots.txt: Which to Allow, Which to Block</h1>

        <p>
          <strong>
            Allow the retrieval bots whose answers you want to be part of, and treat the training
            bots as a separate decision. A vendor like OpenAI gives you two independent switches for
            exactly that. Before you write the list, know one rule that catches almost every
            hand-written file: consecutive User-agent lines share a single group of rules.
          </strong>{" "}
          Then comes the part nobody enjoys, which is that a robots.txt file is a request and not a
          wall. RFC 9309 says so in its second paragraph, and the wording is worth keeping in mind
          while reading the rest of this page.
        </p>

        <h2>Which AI crawler tokens exist, and what does each one do?</h2>

        <p>
          The naming is not decorative. Vendors split their traffic by intent, and the intent
          decides whether blocking costs you anything. The table below only lists tokens whose
          purpose we could read on the vendor&apos;s own page, with the token in the form it takes
          in the file.
        </p>

        <table>
          <thead>
            <tr>
              <th>Token</th>
              <th>Vendor</th>
              <th>What the vendor says it does</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GPTBot</td>
              <td>OpenAI</td>
              <td>Independent setting; disallowing signals crawled content should not train foundation models</td>
            </tr>
            <tr>
              <td>OAI-SearchBot</td>
              <td>OpenAI</td>
              <td>Independent setting; allow it to appear in search results</td>
            </tr>
            <tr>
              <td>ChatGPT-User</td>
              <td>OpenAI</td>
              <td>Fetches a page on a user&apos;s behalf; not used for automatic crawling</td>
            </tr>
            <tr>
              <td>ClaudeBot</td>
              <td>Anthropic</td>
              <td>Collects content that may contribute to training its models</td>
            </tr>
            <tr>
              <td>Claude-SearchBot</td>
              <td>Anthropic</td>
              <td>Navigates the web to improve the quality of search results</td>
            </tr>
            <tr>
              <td>Claude-User</td>
              <td>Anthropic</td>
              <td>Fetches pages for people using Claude; disabling may cut visibility in user-directed search</td>
            </tr>
            <tr>
              <td>Google-Extended</td>
              <td>Google</td>
              <td>Control token with no separate HTTP user agent; governs use of crawled content</td>
            </tr>
            <tr>
              <td>Applebot-Extended</td>
              <td>Apple</td>
              <td>Opt-out from training generative models; does not stop Applebot crawling</td>
            </tr>
            <tr>
              <td>CCBot</td>
              <td>Common Crawl</td>
              <td>Builds an open repository of web crawl data, published for anyone to analyse</td>
            </tr>
          </tbody>
        </table>

        <p>
          Two of those rows deserve a longer look, because they are the ones people misread. Google
          documents <code>Google-Extended</code> as a token with no user agent string of its own:
          the crawl happens under ordinary Google user agents and the token acts as a control
          switch. That means you cannot find it in a log, and you cannot treat its appearance there
          as evidence of anything. Apple makes a similar distinction from the other direction,
          noting that disallowing <code>Applebot-Extended</code> does not stop{" "}
          <code>Applebot</code> from crawling, and that content stays discoverable in Spotlight,
          Siri and Safari either way.
        </p>

        <p>
          OpenAI frames it as two independent tags rather than one crawler with a mood. Their
          overview says each setting works separately: a site can allow{" "}
          <code>OAI-SearchBot</code> to appear in search results while disallowing{" "}
          <code>GPTBot</code> to indicate the content should stay out of training data, and if a
          site allows both, one crawl may serve both purposes. They also note that a robots.txt
          change takes roughly 24 hours to show up in search behaviour. Anthropic splits its traffic
          three ways, with training, search indexing and user-initiated fetches on separate names,
          and adds the consequence that disabling user-initiated fetching may reduce how often your
          site surfaces when someone asks Claude a question.
        </p>

        <p>
          Cloudflare&apos;s bot documentation is a useful second opinion on the categories, since it
          sits between sites and this traffic at scale. Under the taxonomy the company introduced on
          1 July 2026 it labels AI Assistant as a bot driven by a user action, giving Perplexity-User
          and DuckAssistBot as examples, AI Crawler as traffic that gathers content for training,
          and AI Search as the bots behind AI-driven search experiences, with OAI-SearchBot as the
          example.
        </p>

        <h2>The grouping rule, and the file that gets it wrong</h2>

        <p>
          Here is the part that turns a tidy list of names into a surprise.{" "}
          <a
            href="https://www.rfc-editor.org/rfc/rfc9309.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            RFC 9309
          </a>{" "}
          defines a group as one or more user-agent lines followed by one or more rules, and its
          grammar repeats the user-agent line within a group rather than after it. The example in
          the specification prints <code>barbot</code> and <code>bazbot</code> on two consecutive
          lines above a single rule, and describes that as a group relevant for more than one user
          agent. So this:
        </p>

        <pre>
          <code>{`User-agent: GPTBot
User-agent: ClaudeBot
Disallow: /private`}</code>
        </pre>

        <p>
          is not two rules. Both names get the same one. The same document covers the other half of
          the behaviour: if more than one group matches a product token, the matching groups&apos;
          rules are combined, and <code>*</code> applies to user agents that have no explicit match
          at all. Nothing about group order changes the outcome.
        </p>

        <p>
          Longest match is the last piece. Where an allow and a disallow both match a path, the more
          specific pattern wins, which is how you exempt one folder from a broader block.
        </p>

        <h2>What we measured on our own robots.txt</h2>

        <p>
          We wrote a small parser against the specification&apos;s grammar and ran it on our live
          file rather than on a copy, because a copy drifts. On 19 September 2026 our robots.txt
          came back as two groups: a wildcard group with one user-agent line and six rules, and a
          second group carrying sixteen user-agent lines that share the same six rules. Among the
          sixteen are GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-Web,
          anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot,
          meta-externalagent, cohere-ai, Bytespider and Amazonbot.
        </p>

        <table>
          <thead>
            <tr>
              <th>Test token</th>
              <th>How it matched</th>
              <th>Rules inherited</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GPTBot</td>
              <td>Explicit group</td>
              <td>6</td>
            </tr>
            <tr>
              <td>PerplexityBot</td>
              <td>Explicit group</td>
              <td>6</td>
            </tr>
            <tr>
              <td>Claude-SearchBot</td>
              <td>Wildcard fallback</td>
              <td>6</td>
            </tr>
            <tr>
              <td>An invented bot name</td>
              <td>Wildcard fallback</td>
              <td>6</td>
            </tr>
          </tbody>
        </table>

        <p>
          The count is identical in every row, and that is the finding worth passing on. Our private
          paths are closed to everything by the wildcard group already, so listing sixteen names
          beneath the same rules changes nothing about what any of them may fetch. The list is
          documentation rather than control, which is a fair thing to be honest about. It exists so
          that a person reading the file can see which bots we thought about.
        </p>

        <p>
          Running the same parser over a synthetic file turned up the second finding, and it is the
          reason the trap above is worth printing. With GPTBot and ClaudeBot stacked above a single
          disallow, the parser assigned that rule to both, exactly as the specification requires.
          Anyone who intended two different policies has written one policy twice.
        </p>

        <p>
          Two details of our own file are less flattering. We carry{" "}
          <code>Claude-Web</code> and <code>anthropic-ai</code> alongside Anthropic&apos;s current
          names, and the page we read describes the company&apos;s crawlers as three: ClaudeBot,
          Claude-SearchBot and Claude-User. Legacy tokens are harmless in a list, since an unused
          name simply never matches, but a file that documents a set which partly no longer exists
          is a file that has stopped being maintained. We also noticed that our wildcard block comes
          first in the file and the named block second, which is legal and irrelevant to matching,
          and would confuse anyone who assumed the order carried meaning.
        </p>

        <h2>So should you block GPTBot?</h2>

        <p>
          The useful version of this question separates two things that get discussed as one. Being
          cited in an answer is a retrieval path. Being included in a training set is a separate
          use of the same content, and the vendors have given you separate switches for them, which
          suggests they consider the distinction real. Blocking the training token while allowing
          the retrieval tokens is the documented combination, not a hack.
        </p>

        <table>
          <thead>
            <tr>
              <th>What you want</th>
              <th>Retrieval tokens</th>
              <th>Training tokens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Answers may cite the site</td>
              <td>Allow</td>
              <td>Your call</td>
            </tr>
            <tr>
              <td>No training use</td>
              <td>Allow</td>
              <td>Disallow</td>
            </tr>
            <tr>
              <td>Nothing automated at all</td>
              <td>Disallow</td>
              <td>Disallow</td>
            </tr>
          </tbody>
        </table>

        <p>
          What we would not do is claim this guarantees anything. No vendor has promised that
          allowing a bot produces a citation, and a file that asks for a behaviour is a long way
          from a system that enforces it. The honest summary is that the retrieval switches are
          cheap to leave open and the training switches are yours to argue about.
        </p>

        <h2>Do AI crawlers actually obey robots.txt?</h2>

        <p>
          Varies by bot, and the two clearest statements come from opposite sides of the line.{" "}
          <a
            href="https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Google&apos;s documentation
          </a>{" "}
          states that its common crawlers always obey robots.txt rules when crawling automatically.
          OpenAI, describing the fetches made on a user&apos;s behalf, notes that ChatGPT-User is
          not used for crawling the web in an automatic fashion and that robots.txt rules may not
          apply, because a person asked for that page.
        </p>

        <p>
          RFC 9309 already told you where this lands. Its introduction states that the rules are not
          a form of access authorization. If the difference matters to you, handle it where requests
          actually arrive, at the edge or in the application, and treat the file as a published
          statement of intent that most well-behaved crawlers will read.
        </p>

        <h2>How do you write the file so each bot gets its own rules?</h2>

        <ol>
          <li>
            <strong>Decide by intent, not by name.</strong> Retrieval, training, and private paths.
            Three decisions, three blocks.
          </li>
          <li>
            <strong>One group per policy.</strong> Put the names that share a policy on consecutive
            lines, and separate policies with their own user-agent line followed by their own rules.
          </li>
          <li>
            <strong>Keep a wildcard block.</strong> Whatever has no explicit match falls back to{" "}
            <code>*</code>, so this is where your private paths belong.
          </li>
          <li>
            <strong>Parse it after you edit it.</strong> A grammar of this size is worth checking
            with a script rather than an eye, especially when your list grows past a handful of
            names.
          </li>
          <li>
            <strong>Pair it with a reading list.</strong> A robots.txt states what may be fetched.
            An <Link href="/blog/llms-txt-explained">llms.txt</Link> states what is worth opening,
            and the two answer different questions.
          </li>
        </ol>

        <p>
          One more file belongs in the same afternoon&apos;s work if your site offers tools rather
          than text. Declaring those tools is what <Link href="/blog/what-is-webmcp">WebMCP</Link>{" "}
          covers, and it is the difference between a site an assistant can read and one it can use.
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
            A robots.txt is a text file, and these are for the work around it:
          </p>
          <ul className="space-y-3">
            <li>
              <strong>OpenCode Go</strong> — the parser we ran against our own file started as a
              handful of lines, and writing that kind of check is faster with an assistant than
              clicking through a validator for each edit.{" "}
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
              <strong>Stack AI</strong> — if crawler and agent traffic needs to land somewhere, a
              workflow can route a visit into a row, a summary or an alert without custom glue.{" "}
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
              <strong>Softr</strong> — for catalogue and directory sites, publishing the collection
              as a no-code app produces stable URLs, which is what makes any crawler directive worth
              writing in the first place.{" "}
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
          <h2 className="text-2xl font-bold mb-3">Want Your Crawler Rules Checked, Not Just Written?</h2>
          <p className="text-blue-100 mb-5">
            The file we parsed above is live and public, and the parser output is in this article.
            If you would rather have someone write, parse and verify the same set of files for your
            site, that is the work I do.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="text-base px-8">
                Open Our robots.txt
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
          I build this layer for other sites: robots.txt, llms.txt, agent-tools.json and WebMCP
          declarations, verified against the live pages. Details at{" "}
          <Link href="/agent-ready">/agent-ready</Link>.
        </p>

        <RelatedPosts slug="robots-txt-ai-crawlers" />
      </article>
    </>
  );
}
