import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Banknote, Mail } from "lucide-react";
import { PRICING, PAYPAL_URL, XTRANSFER } from "@/lib/payment";
import { SubscribeButton } from "@/components/subscribe-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing — Free AI CSV Analysis, Pro $15/mo | NoCodeCSV",
  description: "Start free with 3 analyses per day. Upgrade to Pro ($15/mo) for unlimited use, or Business ($49/mo) for teams. Cancel anytime.",
  alternates: { canonical: "https://nocodecsv.com/pricing" },
  openGraph: {
    images: [{ url: "https://nocodecsv.com/og-image.png", width: 1200, height: 630, alt: "NoCodeCSV" }],
    title: "Pricing — Free AI CSV Analysis, Pro $15/mo | NoCodeCSV",
    description: "Start free with 3 analyses per day. Upgrade to Pro or Business for unlimited AI data analysis.",
    type: "website",
    url: "https://nocodecsv.com/pricing",
    siteName: "NoCodeCSV",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — Free AI CSV Analysis, Pro $15/mo | NoCodeCSV",
    description: "Start free with 3 analyses per day. Upgrade to Pro or Business for unlimited AI data analysis.",
  },
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    features: ["3 analyses per day", "Up to 5MB files", "CSV & Excel support", "Charts & visualizations", "Export as CSV"],
    cta: "Get Started Free",
    href: "/dashboard",
    highlight: false,
    paypal: false,
  },
  {
    name: PRICING.pro.name,
    price: PRICING.pro.price,
    period: PRICING.pro.period,
    badge: "Most Popular",
    features: PRICING.pro.features,
    cta: `Subscribe — ${PRICING.pro.price}/mo`,
    href: "",
    highlight: true,
    paypal: true,
    paypalHref: PAYPAL_URL.pro,
  },
  {
    name: PRICING.business.name,
    price: PRICING.business.price,
    period: PRICING.business.period,
    badge: null,
    features: PRICING.business.features,
    cta: `Subscribe — ${PRICING.business.price}/mo`,
    href: "",
    highlight: false,
    paypal: true,
    paypalHref: PAYPAL_URL.business,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-3.5 text-lg text-zinc-500">
          Start free. Upgrade when you need more. Cancel anytime.
        </p>
      </div>

      {/* 定价卡片 */}
      <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "relative flex flex-col gap-0 rounded-2xl bg-white p-6 ring-0",
              plan.highlight
                ? "border-2 border-blue-600 shadow-[0_10px_30px_rgba(37,99,235,0.12)]"
                : "border border-zinc-200"
            )}
          >
            {plan.badge && (
              <Badge className="mb-3 h-auto self-start rounded-full bg-blue-600 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white uppercase">
                {plan.badge}
              </Badge>
            )}

            <div className="text-lg font-semibold text-zinc-700">{plan.name}</div>

            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight text-zinc-900">
                {plan.price}
              </span>
              <span className="text-sm text-zinc-400">/ {plan.period}</span>
            </div>

            <div className="my-4 border-t border-zinc-100" />

            <ul className="flex flex-col gap-2.5">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm text-zinc-600">
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      plan.paypal ? "text-blue-600" : "text-green-600"
                    )}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              {plan.paypal ? (
                <SubscribeButton
                  href={plan.paypalHref!}
                  label={plan.cta}
                  variant={plan.highlight ? "primary" : "outline"}
                  note={
                    <>
                      Pay with{" "}
                      <strong className="font-semibold text-[#003087] italic">
                        PayPal
                      </strong>{" "}
                      · cancel anytime
                      <br />
                      <Link href="/welcome" className="underline hover:text-zinc-600">
                        After paying: activation is automatic
                      </Link>
                    </>
                  }
                />
              ) : (
                <>
                  <Link href={plan.href} className="block w-full">
                    <Button
                      variant="outline"
                      className="h-12 w-full border-zinc-300 bg-white text-[15px] text-zinc-900 hover:bg-zinc-50"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                  <div className="mt-2.5 text-center text-xs text-zinc-400">
                    No account needed
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* 信任条 */}
      <div className="mt-6 flex flex-wrap justify-center gap-6 text-[13px] text-zinc-500">
        <span>🔒 Secure PayPal checkout</span>
        <span>💳 No card details stored</span>
        <span>↩️ Cancel anytime</span>
      </div>

      {/* XTransfer 企业收款 */}
      <div className="mx-auto mt-9 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start gap-3.5">
          <Banknote className="mt-0.5 h-6 w-6 shrink-0 text-zinc-500" />
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              Enterprise / Wire Transfer
            </h2>
            <p className="mt-1.5 text-[13.5px] text-zinc-600">{XTRANSFER.note}</p>
            <p className="mt-1.5 text-[13.5px] text-zinc-600">
              Accepted via <strong>XTransfer</strong>: USD wire transfer, supporting
              US/UK/EU/Southeast Asia bank accounts. Formal invoices provided for
              your accounting.
            </p>
            <a
              href={`mailto:${XTRANSFER.contactEmail}`}
              className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-blue-600 hover:text-blue-700"
            >
              <Mail className="h-4 w-4" />
              Contact us for enterprise pricing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
