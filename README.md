# DataAnalyzer AI

Chat with your CSV & Excel files in plain English. Upload any spreadsheet, ask questions, and get instant charts and insights — powered by DeepSeek AI.

## Quick Start

```bash
pnpm install
```

Create `.env.local`:

```
DEEPSEEK_API_KEY=sk-your-deepseek-key
```

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **AI**: Vercel AI SDK + DeepSeek API
- **Charts**: Recharts
- **File Parsing**: PapaParse (CSV/TSV) + SheetJS (Excel)
- **Deploy**: Vercel (one-click)

## Features

- 📂 Drag-and-drop CSV, Excel, TSV files (up to 25MB)
- 💬 Natural language queries — "Show me revenue by region"
- 📊 Auto-generated charts (bar, line, pie, scatter)
- 📋 In-browser data preview
- 🔒 Files processed in memory, never stored
- 💰 Free tier: 3 analyses per day

## Pricing

| Free | Pro ($15/mo) | Business ($49/mo) |
|------|-------------|-------------------|
| 3/day | Unlimited | Everything in Pro |

See `/pricing` for full details.
