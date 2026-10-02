import type { ReactNode } from "react";
import { AdsenseScript } from "@/components/ads/adsense-script";
import AdSense from "@/components/ads/adsense";
import { ADSENSE_SLOT } from "@/lib/ads";

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      {/* 工具页底部广告位(2026-10-02:接入真单元。未过审/无真单元 ID 时组件自动不渲染) */}
      <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
        <AdSense slot={ADSENSE_SLOT} format="auto" responsive />
      </div>
      <AdsenseScript />
    </>
  );
}
