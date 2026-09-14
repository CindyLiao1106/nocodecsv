export const PAYPAL = {
  clientId: "BAAS5-UVG8lmNrk_c9g5CapKKPtjKVFapIpwu-e-VKCcgJeiEZup5DFMZrssIjT2k78aXL1MfVHElPVZ6s",
  pro: "B7MW2Z58DWZSY",
  business: "9AQZLC5NDG5CE",
};

// PayPal 官方托管结账页(hosted checkout)。按钮改为普通外链 → 不再用 HostedButtons SDK
// (SDK 在本站渲染时容器宽度为 0,导致卡片内文字竖排、卡片被撑高)
export const PAYPAL_URL = {
  pro: "https://www.paypal.com/ncp/payment/B7MW2Z58DWZSY",
  business: "https://www.paypal.com/ncp/payment/9AQZLC5NDG5CE",
};

export const PRICING = {
  pro: { name: "Pro", price: "$15", period: "month", features: ["Unlimited analyses","Up to 25MB files","Priority processing","Chat history saved","Advanced chart exports","CSV, Excel, TSV, JSON support","Email support"] },
  business: { name: "Business", price: "$49", period: "month", features: ["Everything in Pro","Up to 100MB files","Team workspace (5 users)","Custom AI prompts","API access","Priority support","Early access to new features"] },
};

export const XTRANSFER = {
  enabled: true,
  note: "For invoices over $500 or enterprise annual plans, we accept wire transfer via XTransfer.",
  contactEmail: "cindyliao1106@gmail.com",
};
