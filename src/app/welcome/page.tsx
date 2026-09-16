import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/lib/payment";

export const metadata: Metadata = {
  title: "Thanks — activate your Pro plan",
  description: "Payment received. Here is what happens next and how to activate your Pro plan on NoCodeCSV.",
  robots: { index: false, follow: false },
};

/**
 * 付款完成后的落地页。
 * 说明:开通是【自动】的(webhook 按 PayPal 付款邮箱写账号);本页给未自动开通的人一条兜底路径。
 */
export default function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <p className="text-sm text-zinc-500">Payment received</p>
      <h1 className="text-3xl font-bold mt-2 mb-4">Thanks — your Pro plan is being activated</h1>
      <p className="text-zinc-700 leading-relaxed">
        Activation is automatic. We match the email address on your PayPal payment to your NoCodeCSV
        account and switch it to {PRICING.pro.name} ({PRICING.pro.price}/{PRICING.pro.period}).
        This usually completes within a minute.
      </p>

      <div className="mt-8 rounded-xl border p-6 bg-zinc-50">
        <p className="font-semibold mb-2">Two things to check</p>
        <ul className="space-y-2 text-zinc-700">
          <li>1. Sign in with the <strong>same email you used on PayPal</strong>. If you signed up with a different address, see below.</li>
          <li>2. Open your dashboard — the quota line should read “Unlimited”.</li>
        </ul>
      </div>

      <div className="mt-6 rounded-xl border p-6">
        <p className="font-semibold mb-2">Signed up with a different email?</p>
        <p className="text-zinc-700">
          That is the one case where activation needs a human. Send the PayPal receipt email to{" "}
          <a className="text-blue-600 underline" href="mailto:contact@nocodecsv.com">contact@nocodecsv.com</a>{" "}
          and we will move the plan to your account. Replies are usually same-day.
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/dashboard"><Button size="lg">Go to dashboard</Button></Link>
        <Link href="/pricing"><Button size="lg" variant="outline">Back to pricing</Button></Link>
      </div>
    </div>
  );
}
