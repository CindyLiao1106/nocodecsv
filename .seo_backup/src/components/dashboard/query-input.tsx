"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Sparkles, Lock } from "lucide-react";
import Link from "next/link";

interface Props {
  onSubmit: (question: string) => void;
  loading: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Summarize the data — what are the key takeaways?",
  "Show me the top 10 rows by the largest numeric column",
  "Find any outliers or unusual values",
  "Calculate basic statistics (mean, median, min, max) for all numeric columns",
  "Show the distribution of values in the first category column",
];

export function QueryInput({ onSubmit, loading, disabled }: Props) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim() || loading || disabled) return;
    onSubmit(question.trim());
  };

  return (
    <div className="space-y-4">
      {disabled && (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm">
          <Lock className="h-4 w-4" />
          Daily limit reached.
          <Link href="/pricing" className="font-medium underline">Upgrade to Pro</Link>
          for unlimited analyses.
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder={disabled ? "Upgrade to Pro to continue..." : 'Ask about your data... e.g., "Show me total sales by region"'}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            className="min-h-[60px] resize-none pr-12"
            disabled={loading || disabled}
          />
          <Button
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            onClick={handleSubmit}
            disabled={loading || disabled || !question.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!loading && !disabled && (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setQuestion(s); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              {s.length > 55 ? s.slice(0, 55) + "…" : s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
