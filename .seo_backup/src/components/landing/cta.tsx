import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Ready to stop wrestling with spreadsheets?
      </h2>
      <p className="mt-4 text-lg text-zinc-500 max-w-lg mx-auto">
        Your first 3 analyses are free. No credit card required.
      </p>
      <div className="mt-8">
        <Link href="/dashboard">
          <Button size="lg" className="text-base px-10">
            Start Analyzing Now — Free
          </Button>
        </Link>
      </div>
    </section>
  );
}
