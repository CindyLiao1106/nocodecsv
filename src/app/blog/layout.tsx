import type { ReactNode } from "react";
import { AdsenseScript } from "@/components/ads/adsense-script";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdsenseScript />
    </>
  );
}
