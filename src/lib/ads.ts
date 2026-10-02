export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4847137398088537";

/**
 * AdSense 广告单元 ID(data-ad-slot)—— 必须是 10 位数字且不以 0 开头。
 *
 * 2026-10-02:接入 Cindy 在 AdSense 后台建的响应式单元(名称 site-wide)。
 * 【与养老站 nursingcost.com 共用同一个单元】—— AdSense 允许同一个单元放在多个站,
 * 好处是省事;代价是两个站的收入报表混在一起。
 * 想按站分开看报表 → 回 AdSense 后台「广告 → 按广告单元 → 展示广告」另建一个,
 * 把新 ID 填到这一行(或设环境变量 NEXT_PUBLIC_ADSENSE_SLOT)。
 */
export const ADSENSE_SLOT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT || "6656957938";
