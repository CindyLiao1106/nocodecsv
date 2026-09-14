import type { ReactNode } from "react";
import AdSenseScript from "@/components/ads/adsense-script";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AdSenseScript />
    </>
  );
}
