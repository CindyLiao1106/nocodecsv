"use client";

import { useEffect, useRef } from "react";

/**
 * 工具页专用的"产品动图"(纯 canvas,零依赖,和首页 hero 同一套视觉)
 * variant:
 *   analyzer  表格 + 提问 → 扫过 → 答案卡片 + 柱状图
 *   delimiter 一列糊在一起 → 分列成 4 列 + 表头
 *   splitter  一份大文件 → 切成 4 份飞开(每份带表头)
 *   jsoncsv   嵌套 JSON 折叠块 → 摊平成列
 * 设计空间 1280x360,等比缩放;尊重 prefers-reduced-motion;切后台暂停。
 */
type Variant = "analyzer" | "delimiter" | "splitter" | "jsoncsv";

const INK = "#12304c";
const GOLD = "#c89552";
const BLUE = "#2f6fbe";
const LINE = "rgba(18,48,76,.16)";
const CARD = "rgba(255,255,255,.95)";

function ease(t: number) {
  return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
}
function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}

export function ToolAnimation({ variant }: { variant: Variant }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const REF_W = 1280;
    const REF_H = 360;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0, SC = 1, OX = 0;
    let raf = 0;
    let start = performance.now();

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(320, Math.round(rect.width));
      H = Math.max(160, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      SC = Math.max(0.45, Math.min(W / REF_W, H / REF_H));
      OX = Math.max(0, (W / SC - REF_W) / 2);
    };

    const rr = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const label = (
      text: string, x: number, y: number, font: string, color = INK, align: CanvasTextAlign = "left",
    ) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(text, x, y);
      ctx.textAlign = "left";
    };

    /** 表格:白卡片网格 */
    const table = (
      x: number, y: number, cols: number, rows: number,
      cw: number, rh: number, gap: number,
      litFn?: (c: number, r: number) => number, headerRow = true,
    ) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const k = litFn ? litFn(c, r) : 0;
          const px = x + c * (cw + gap);
          const py = y + r * (rh + gap);
          ctx.fillStyle = r === 0 && headerRow
            ? `rgba(200,149,82,${0.14 + k * 0.5})`
            : k > 0.03 ? `rgba(200,149,82,${0.06 + k * 0.42})` : CARD;
          ctx.strokeStyle = LINE;
          rr(px, py, cw, rh, 5);
          ctx.fill();
          ctx.stroke();
          // 单元格里的"内容条"
          ctx.fillStyle = r === 0 && headerRow ? "rgba(18,48,76,.5)" : "rgba(18,48,76,.30)";
          ctx.fillRect(px + 8, py + rh / 2 - 2.5, Math.min(cw - 16, 12 + ((c * 11 + r * 7) % (cw - 22))), 5);
        }
      }
    };

    // ── 各变体的绘制 ──
    const drawAnalyzer = (t: number) => {
      const q = "Which region grew fastest?";
      const typed = Math.floor(clamp01((t - 0.05) / 0.30) * q.length);
      const scan = clamp01((t - 0.38) / 0.18);
      const ans = ease(clamp01((t - 0.56) / 0.16));
      const bars = clamp01((t - 0.66) / 0.22);

      label("Your file", 120, 92, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");
      table(120, 104, 4, 5, 74, 26, 7, (c, r) =>
        scan > 0 && Math.abs(r / 4 - scan) < 0.16 ? 0.9 : 0);

      // 提问气泡
      const bw = 26 + typed * 8.6;
      ctx.save();
      ctx.shadowColor = "rgba(18,48,76,.12)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#ffffff";
      rr(120, 40, Math.max(60, bw), 34, 12);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = "rgba(200,149,82,.5)";
      rr(120, 40, Math.max(60, bw), 34, 12);
      ctx.stroke();
      label(q.slice(0, typed), 136, 63, "15px -apple-system,Segoe UI,Roboto,sans-serif", INK);
      if (typed < q.length) {
        ctx.fillStyle = GOLD;
        ctx.fillRect(136 + typed * 8.6, 46, 2, 22);
      }

      // 扫描线
      if (scan > 0 && scan < 1) {
        const sy = 104 + scan * (5 * 26 + 4 * 7);
        ctx.strokeStyle = "rgba(200,149,82,.65)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(112, sy);
        ctx.lineTo(452, sy);
        ctx.stroke();
      }

      // 答案卡片
      if (ans > 0) {
        const cx = 700 - (1 - ans) * 40;
        ctx.globalAlpha = ans;
        ctx.save();
        ctx.shadowColor = "rgba(18,48,76,.14)";
        ctx.shadowBlur = 14;
        ctx.shadowOffsetY = 3;
        ctx.fillStyle = "#ffffff";
        rr(cx, 60, 440, 220, 14);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(200,149,82,.5)";
        rr(cx, 60, 440, 220, 14);
        ctx.stroke();
        label("Answer", cx + 24, 96, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.6)");
        label("EMEA grew fastest", cx + 24, 124, "600 20px -apple-system,Segoe UI,Roboto,sans-serif", INK);
        label("sample data — your file, your numbers", cx + 24, 146,
          "12px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.45)");
        // 迷你柱状图
        const bx = cx + 24, by = 250, bwid = 300, maxh = 96;
        const vals = [0.42, 0.68, 1.0];
        const names = ["APAC", "AMER", "EMEA"];
        vals.forEach((v, i) => {
          const h = maxh * v * ease(clamp01(bars * 1.4 - i * 0.18));
          ctx.fillStyle = i === 2 ? GOLD : "rgba(47,111,190,.55)";
          rr(bx + i * 104, by - h, 74, Math.max(2, h), 6);
          ctx.fill();
          label(names[i], bx + i * 104, by + 20, "13px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.6)");
        });
        ctx.globalAlpha = 1;
      }
    };

    const drawDelimiter = (t: number) => {
      const rows = ["Ann;Berlin;12,50", "Bo;Paris;9,99", "Cy;Milan;1.234,00", "Dee;Oslo;45,00"];
      const sweep = clamp01((t - 0.30) / 0.34);   // 竖线扫过
      const headers = ease(clamp01((t - 0.66) / 0.16));
      const colX = [120, 118, 178, 258, 358];      // 第 0 列起点 + 4 列的落位
      label("One column — wrong delimiter", 120, 52, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");
      label("Semicolon detected → 4 columns", 820, 52, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");

      rows.forEach((row, i) => {
        const y = 92 + i * 34;
        const parts = row.split(";");
        // 未分列时的整行
        ctx.font = "17px ui-monospace,SFMono-Regular,Menlo,monospace";
        const merged = row;
        const mx = 120 + (1 - sweep) * 0;
        if (sweep < 1) {
          ctx.globalAlpha = 1 - sweep * 0.9;
          ctx.fillStyle = INK;
          ctx.fillText(merged, mx, y);
          ctx.globalAlpha = 1;
        }
        // 分列后的每一列
        if (sweep > 0) {
          parts.forEach((p, c) => {
            const local = clamp01((sweep - c * 0.12) * 1.6);
            if (local <= 0) return;
            const x = colX[1 + c];
            ctx.globalAlpha = local;
            ctx.font = "17px ui-monospace,SFMono-Regular,Menlo,monospace";
            ctx.fillStyle = c === 2 ? GOLD : INK;
            ctx.fillText(p, x, y);
            ctx.globalAlpha = 1;
          });
        }
      });

      // 竖线扫过
      if (sweep > 0 && sweep < 1) {
        const sx = colX[1] - 12 + sweep * (colX[4] - colX[1] + 120);
        ctx.strokeStyle = "rgba(200,149,82,.75)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, 70);
        ctx.lineTo(sx, 240);
        ctx.stroke();
      }

      // 表头 + 标签
      if (headers > 0) {
        ctx.globalAlpha = headers;
        ["name", "city", "amount"].forEach((h, c) => {
          const x = colX[1 + c];
          label(h, x, 74, "600 13px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(200,149,82,.95)");
        });
        ctx.fillStyle = "rgba(200,149,82,.14)";
        ctx.strokeStyle = "rgba(200,149,82,.5)";
        rr(820, 84, 320, 40, 10);
        ctx.fill();
        ctx.stroke();
        label("CSV ready — headers kept", 840, 110, "600 14px -apple-system,Segoe UI,Roboto,sans-serif", INK);
        ctx.globalAlpha = 1;
      }
    };

    const drawSplitter = (t: number) => {
      const cut = clamp01((t - 0.28) / 0.12);
      const fly = ease(clamp01((t - 0.42) / 0.34));
      label("One huge CSV", 120, 48, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");
      label("4 files — each keeps the header", 760, 48, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");

      // 大文件卡片
      const fx = 120 - fly * 40, fy = 70, fw = 300, fh = 230;
      ctx.globalAlpha = 1 - fly * 0.85;
      ctx.save();
      ctx.shadowColor = "rgba(18,48,76,.14)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#ffffff";
      rr(fx, fy, fw, fh, 12);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = LINE;
      rr(fx, fy, fw, fh, 12);
      ctx.stroke();
      for (let r = 0; r < 8; r++) {
        ctx.fillStyle = r === 0 ? "rgba(200,149,82,.35)" : "rgba(18,48,76,.16)";
        ctx.fillRect(fx + 16, fy + 18 + r * 24, fw - 32 - (r % 3) * 26, 8);
      }
      // 切分线
      if (cut > 0 && cut < 1) {
        ctx.setLineDash([8, 6]);
        ctx.strokeStyle = "rgba(200,149,82,.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fx, fy + 18 + cut * 190);
        ctx.lineTo(fx + fw, fy + 18 + cut * 190);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      ctx.globalAlpha = 1;

      // 4 份文件飞开
      const targets = [700, 850, 1000, 1150];
      const labels = ["part1.csv", "part2.csv", "part3.csv", "part4.csv"];
      targets.forEach((tx, i) => {
        const local = ease(clamp01(fly * 1.3 - i * 0.14));
        if (local <= 0) return;
        const x = fx + (tx - fx) * local;
        const y = fy + (i % 2 === 0 ? -6 : 14) * local;
        ctx.globalAlpha = local;
        ctx.save();
        ctx.shadowColor = "rgba(18,48,76,.14)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ffffff";
        rr(x, y, 130, 150, 10);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(200,149,82,.45)";
        rr(x, y, 130, 150, 10);
        ctx.stroke();
        // 每份都带表头
        ctx.fillStyle = "rgba(200,149,82,.30)";
        ctx.fillRect(x + 12, y + 12, 106, 12);
        for (let r = 0; r < 6; r++) {
          ctx.fillStyle = "rgba(18,48,76,.15)";
          ctx.fillRect(x + 12, y + 32 + r * 16, 106 - (r % 3) * 14, 6);
        }
        label(labels[i], x + 12, y + 140, "600 12px -apple-system,Segoe UI,Roboto,sans-serif", INK);
        ctx.globalAlpha = 1;
      });
    };

    const drawJsonCsv = (t: number) => {
      const unfold = ease(clamp01((t - 0.22) / 0.34));
      const back = clamp01((t - 0.78) / 0.16);   // 变回去
      const flat = unfold * (1 - back * 0.85);

      label("JSON", 120, 48, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");
      label("CSV", 860, 48, "600 15px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)");

      // 左侧:嵌套块
      const bob = Math.sin(t * Math.PI * 2) * 3;
      ctx.globalAlpha = 1 - flat * 0.45;
      ctx.save();
      ctx.shadowColor = "rgba(18,48,76,.12)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffffff";
      rr(120, 70 + bob, 300, 190, 12);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = LINE;
      rr(120, 70 + bob, 300, 190, 12);
      ctx.stroke();
      ctx.font = "15px ui-monospace,SFMono-Regular,Menlo,monospace";
      ctx.fillStyle = INK;
      ctx.fillText('{ "user": {', 140, 106 + bob);
      ctx.fillText('    "name": "Ann"', 140, 132 + bob);
      ctx.fillText('  },', 140, 158 + bob);
      ctx.fillText('  "score": 95', 140, 184 + bob);
      ctx.fillText('}', 140, 210 + bob);
      // 嵌套高亮框
      ctx.strokeStyle = "rgba(200,149,82,.5)";
      rr(180, 92 + bob, 150, 50, 8);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 展开箭头
      const ax = 440;
      const arrowGrow = clamp01((t - 0.12) / 0.2);
      ctx.strokeStyle = `rgba(200,149,82,${0.25 + arrowGrow * 0.6})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ax, 150);
      ctx.lineTo(ax + 60 * arrowGrow, 150);
      ctx.stroke();
      if (arrowGrow > 0.6) {
        ctx.beginPath();
        ctx.moveTo(ax + 60 * arrowGrow, 150);
        ctx.lineTo(ax + 48 * arrowGrow, 143);
        ctx.lineTo(ax + 48 * arrowGrow, 157);
        ctx.closePath();
        ctx.fillStyle = "rgba(200,149,82,.7)";
        ctx.fill();
      }

      // 右侧:扁平的 CSV
      if (flat > 0) {
        const x = 540 + (1 - flat) * -80;
        ctx.globalAlpha = flat;
        ctx.save();
        ctx.shadowColor = "rgba(18,48,76,.12)";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ffffff";
        rr(x, 96, 420, 116, 12);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(200,149,82,.5)";
        rr(x, 96, 420, 116, 12);
        ctx.stroke();
        // 表头 + 数据行
        ctx.fillStyle = "rgba(200,149,82,.30)";
        ctx.fillRect(x + 18, 114, 120, 18);
        ctx.fillRect(x + 170, 114, 100, 18);
        ctx.font = "600 13px -apple-system,Segoe UI,Roboto,sans-serif";
        ctx.fillStyle = INK;
        ctx.fillText("user.name", x + 24, 128);
        ctx.fillText("score", x + 176, 128);
        ctx.font = "15px ui-monospace,SFMono-Regular,Menlo,monospace";
        ctx.fillStyle = INK;
        ctx.fillText("Ann", x + 24, 168);
        ctx.fillStyle = GOLD;
        ctx.fillText("95", x + 176, 168);
        ctx.globalAlpha = 1;
      }

      // 双向箭头提示
      const yy = 250;
      ctx.strokeStyle = "rgba(18,48,76,.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(560, yy);
      ctx.lineTo(940, yy);
      ctx.stroke();
      label("nested → flat  ·  and back again", 750, yy + 22,
        "13px -apple-system,Segoe UI,Roboto,sans-serif", "rgba(18,48,76,.55)", "center");
    };

    const DUR = 10.5; // 每个循环 10.5 秒

    const frame = (now: number) => {
      const t = ((now - start) / 1000) % DUR / DUR;
      ctx.clearRect(0, 0, W, H);

      // 背景网格(屏幕空间,铺满)
      ctx.strokeStyle = "rgba(18,48,76,.05)";
      ctx.lineWidth = 1;
      const off = (now / 60) % 40;
      for (let x = -off; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = -off; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.save();
      ctx.scale(SC, SC);
      ctx.translate(OX, 0);
      if (variant === "analyzer") drawAnalyzer(t);
      else if (variant === "delimiter") drawDelimiter(t);
      else if (variant === "splitter") drawSplitter(t);
      else drawJsonCsv(t);
      ctx.restore();
    };

    const loop = (now: number) => {
      if (!document.hidden) frame(now);
      raf = window.requestAnimationFrame(loop);
    };

    size();
    if (reduce) {
      start = performance.now() - 1000 * 0.55;  // 静态跳到"已完成"的一帧
      frame(performance.now());
      return;
    }
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    raf = window.requestAnimationFrame(loop);
    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [variant]);

  return (
    <div className="w-full bg-transparent">
      <canvas
        ref={ref}
        className="block h-[220px] w-full sm:h-[280px] lg:h-[340px]"
        aria-hidden="true"
      />
    </div>
  );
}

export default ToolAnimation;
