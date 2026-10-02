"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT as CLIENT } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * 真 AdSense 单元 ID = 10 位数字且【不以 0 开头】。
 * 占位值("0000000001" 这类)会被拦掉 —— 否则页面会留一个空的 90px 广告洞,
 * 看起来像坏掉的版面。与养老站 src/components/AdSlot.tsx 同款保护(2026-10-02 对齐)。
 */
const REAL_SLOT = /^[1-9]\d{9}$/;

type AdSenseProps = {
  /** Ad unit slot ID from the AdSense dashboard (data-ad-slot) */
  slot: string;
  /** Visual format — "auto" adapts, "fluid" is good in-article, "horizontal" for banners */
  format?: string;
  /** Use responsive sizing based on container width */
  responsive?: boolean;
  /** Optional fixed layout key ("-fb" + "-" and "-fs" variants supported by AdSense) */
  layout?: string;
  className?: string;
  /** Give the in-article variant a label so it does not look like broken content */
  label?: string;
};

/**
 * Renders a single AdSense unit.
 *
 * Nothing is rendered when NEXT_PUBLIC_ADSENSE_CLIENT is unset, so the site
 * stays clean in local development and before the account is approved.
 */
export default function AdSense({
  slot,
  format = "auto",
  responsive = true,
  layout,
  className = "",
  label,
}: AdSenseProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT || !REAL_SLOT.test(slot) || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense throws on double-push or when blocked; never break the page.
    }
  }, [slot]);

  if (!CLIENT || !REAL_SLOT.test(slot)) return null;

  return (
    <div className={className}>
      {label ? (
        <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      ) : null}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout ? { "data-ad-layout": layout } : {})}
      />
    </div>
  );
}
