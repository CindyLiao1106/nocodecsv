# DataAnalyzer AI — Agent Guide

This file provides guidance to Claude Code when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # TypeScript type-check + production build
pnpm start        # Serve production build
pnpm lint         # Run ESLint
```

## Architecture

```
src/
├── app/
│   ├── layout.tsx              # Root: Header + Footer + Toaster
│   ├── page.tsx                # Landing (Hero → Features → HowItWorks → CTA)
│   ├── globals.css             # Tailwind v4 + shadcn CSS variables
│   ├── dashboard/page.tsx      # "use client" — upload → query → results
│   ├── api/analyze/route.ts    # POST { csvContent, question } → DeepSeek
│   └── pricing/page.tsx        # Static pricing (Free/Pro/Business)
├── components/
│   ├── landing/    # hero, features, how-it-works, cta
│   ├── dashboard/  # file-uploader, query-input, results-card, results-chart, data-table
│   ├── layout/     # header, footer
│   └── ui/         # shadcn/ui (button, card, dialog, input, table, tabs, etc.)
└── lib/
    ├── utils.ts    # cn() helper (clsx + tailwind-merge)
    ├── ai.ts       # extractChartData(), cleanAnswer(), estimateTokens()
    └── types.ts    # AnalysisResult, ChartData, UsageQuota
```

## Key technical decisions

- **No server state**: No database, no auth. Files parsed client-side (`papaparse` + `xlsx`), CSV text sent to API route for AI analysis, discarded after request. Session is ephemeral.
- **Tailwind v4**: Uses CSS-based config (`@theme inline` in globals.css). No `tailwind.config.ts`. `@apply` in `@layer base` is NOT supported — use plain CSS instead.
- **System fonts only**: Google Fonts removed (build env cannot reach `fonts.gstatic.com`). System font stack used.
- **DeepSeek via Vercel AI SDK**: `@ai-sdk/deepseek` with `deepseek-chat` model. Requires `DEEPSEEK_API_KEY` in `.env.local`.
- **shadcn/ui**: Installed via `pnpm dlx shadcn@latest add <name>`. Use this to add more components.

## Env vars

```
DEEPSEEK_API_KEY=sk-...    # Required. Get from https://platform.deepseek.com
```

## Freemium model (not yet implemented)

Pricing page defines Free (3/day) / Pro ($15/mo) / Business ($49/mo). All features currently unrestricted. Auth (Clerk) + payments (Lemon Squeezy) to be added post-MVP validation.
