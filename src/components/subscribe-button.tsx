import * as React from "react";

import { cn } from "@/lib/utils";

interface SubscribeButtonProps {
  href: string;
  label: string;
  variant?: "primary" | "outline";
  note?: React.ReactNode;
}

export function SubscribeButton({
  href,
  label,
  variant = "primary",
  note,
}: SubscribeButtonProps) {
  return (
    <div className="w-full">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "flex h-12 w-full items-center justify-center whitespace-nowrap rounded-lg px-4 text-[15px] font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          variant === "primary"
            ? "bg-blue-600 text-white shadow-[0_2px_6px_rgba(37,99,235,0.28)] hover:bg-blue-700"
            : "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50"
        )}
      >
        {label}
      </a>
      {note ? (
        <div className="mt-2.5 text-center text-xs text-zinc-400">{note}</div>
      ) : null}
    </div>
  );
}
