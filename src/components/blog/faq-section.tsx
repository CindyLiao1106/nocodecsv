import type { ReactNode } from "react";

/**
 * 可见 FAQ 段 —— 与页面里的 `faqJsonLd` **共用同一个数组**,所以两边文字必然一致。
 *
 * 为什么要这个组件:
 *   Google 对 FAQPage 结构化数据的硬要求是「题干与答案必须在页面上真实可见」。
 *   实测(scripts/verify_faq_built.py):有 4 篇文章的 faqJsonLd 有 8 条问答,
 *   但页面上**一个字都没渲染** —— schema 声称有内容,用户和爬虫都看不到。
 *   本组件把这些条目渲染出来,文字直接取自原有数组,**不新增也不改写任何一句**。
 *
 * 用法:
 *   import { FaqSection } from "@/components/blog/faq-section";
 *   <FaqSection items={faqJsonLd.mainEntity} />
 */
type FaqItem = {
  "@type"?: string;
  name?: string;
  acceptedAnswer?: { "@type"?: string; text?: string };
};

export function FaqSection({
  items,
  title = "Frequently asked questions",
  headingId = "faq",
}: {
  items?: FaqItem[];
  title?: ReactNode;
  headingId?: string;
}) {
  const list = (items ?? []).filter((q) => q?.name && q?.acceptedAnswer?.text);
  if (list.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mt-12">
      <h2 id={headingId}>{title}</h2>
      {list.map((q, i) => (
        <div key={`${headingId}-${i}`} className="mt-6">
          <h3>{q.name}</h3>
          <p>{q.acceptedAnswer!.text}</p>
        </div>
      ))}
    </section>
  );
}

export default FaqSection;
