import Script from "next/script";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4847137398088537";

/**
 * Loads the global AdSense loader script (adsbygoogle.js).
 *
 * Intentionally NOT included in the root layout: pages with little or no
 * content (dashboard, sign-in, sign-up) must never load ads, per AdSense
 * policy. Mount this only inside layouts for content-rich sections
 * (blog, tools).
 */
export default function AdSenseScript() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      async
      strategy="afterInteractive"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
    />
  );
}
