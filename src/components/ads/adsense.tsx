"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT as CLIENT } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

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
    if (!CLIENT || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense throws on double-push or when blocked; never break the page.
    }
  }, []);

  if (!CLIENT) return null;

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
