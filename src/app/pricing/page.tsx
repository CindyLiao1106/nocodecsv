import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Banknote, Mail } from "lucide-react";
import { PAYPAL, PRICING, XTRANSFER } from "@/lib/payment";
import { PayPalButton } from "@/components/paypal-button";

export const metadata: Metadata = {
  title: "Pricing — Free AI CSV Analysis, Pro $15/mo | NoCodeCSV",
  description: "Start free with 3 analyses per day. Upgrade to Pro ($15/mo) for unlimited use, or Business ($49/mo) for teams. Cancel anytime.",
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
    buttonId: PAYPAL.pro,
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
    buttonId: PAYPAL.business,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
        <p className="mt-4 text-lg text-zinc-500 max-w-xl mx-auto">
          Start free. Upgrade when you need more. Cancel anytime.
        </p>
      </div>

      {/* 定价卡片 */}
      <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${plan.highlight ? "border-blue-400 ring-2 ring-blue-100 shadow-lg" : "border-zinc-200"}`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">{plan.badge}</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-zinc-500 text-sm">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-zinc-600">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.paypal ? (
                <PayPalButton buttonId={plan.buttonId!} />
              ) : (
                <Link href={plan.href} className="w-full">
                  <Button variant={plan.highlight ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* XTransfer 企业收款 */}
      <div className="max-w-2xl mx-auto">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Banknote className="h-6 w-6 text-amber-600 mt-1 shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Enterprise / Wire Transfer</h3>
                <p className="text-sm text-zinc-600 mb-3">{XTRANSFER.note}</p>
                <p className="text-sm text-zinc-600 mb-1">
                  <strong>Accepted via XTransfer:</strong> USD wire transfer, supporting US/UK/EU/Southeast Asia bank accounts.
                </p>
                <p className="text-sm text-zinc-600 mb-4">
                  We issue formal invoices for your accounting. Ideal for teams requiring purchase orders or annual billing.
                </p>
                <a href={`mailto:${XTRANSFER.contactEmail}`} className="inline-flex items-center gap-2 text-sm text-amber-700 font-medium hover:text-amber-800">
                  <Mail className="h-4 w-4" />
                  Contact us for enterprise pricing
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 支付方式 */}
      <div className="mt-12 text-center text-sm text-zinc-400">
        <p>Payments processed securely by <strong>PayPal</strong>. No credit card details touch our servers.</p>
        <p className="mt-1">Enterprise: wire transfer via <strong>XTransfer</strong>. Invoices provided.</p>
        <p className="mt-1">Cancel anytime from your PayPal subscriptions. No questions asked.</p>
      </div>
    </div>
  );
}
