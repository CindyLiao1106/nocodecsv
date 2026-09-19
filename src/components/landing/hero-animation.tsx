"use client";

import { useEffect, useRef } from "react";

/**
 * 首页 hero 数据流动画(浅色版)
 * - 纯 canvas,约 200 行,零依赖;矢量级清晰、加载成本几乎为 0
 * - 自适应容器尺寸 + DPR 高清;页面不可见时暂停(省电)
 * - 尊重 prefers-reduced-motion:静态画一帧,不做动画
 * 逻辑设计空间 1280x520,实际按宽度等比缩放
 */
export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GOLD = "#c89552";
    const BLUE = "#2f6fbe";
    const INK = "#12304c";
    const REF_W = 1280;
    const REF_H = 520;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    let SC = 1;
    let OX = 0;   // 宽屏时把构图居中(背景网格仍铺满整幅)
    let raf = 0;
    let f = 0;

    type Packet = {
      x: number; y: number; vx: number;
      col: number; row: number; hue: string;
    };
    type Bubble = { x: number; y: number; life: number; text: string };

    const COLS = 5;
    const ROWS = 6;
    const packets: Packet[] = [];
    const lit = new Map<string, number>();
    const bubbles: Bubble[] = [];

    // 表格左上角(设计空间)
    const TB_W = 56;
    const TB_H = 26;
    const GAP = 8;
    const TB_LEFT = 700;
    const TABLE_H = TB_H * ROWS + GAP * (ROWS - 1);

    // 设计空间的垂直中心(随画布实际高度变化,保证构图始终居中)
    let CY = 0.5 * REF_H;
    const cy = () => CY;

    const cellX = (c: number) => TB_LEFT + c * (TB_W + GAP);
    const cellY = (r: number) => cy() - TABLE_H / 2 + r * (TB_H + GAP);

    const cellXY = (c: number, r: number): [number, number] => [cellX(c), cellY(r)];

    const spawnPacket = () => {
      packets.push({
        x: -20,
        y: CY - 150 + Math.random() * 300,
        vx: 2.6 + Math.random() * 1.8,
        col: Math.floor(Math.random() * COLS),
        row: Math.floor(Math.random() * ROWS),
        hue: Math.random() < 0.55 ? GOLD : BLUE,
      });
    };

    const BUBBLE_TEXTS = [
      "Which region grew fastest?",
      "Rows that look wrong",
      "Chart monthly totals",
      "2,481 rows · 5 columns",
    ];
    const spawnBubble = () => {
      bubbles.push({
        x: TB_LEFT + 200,
        y: CY - 90 + Math.random() * 170,
        life: 0,
        text: BUBBLE_TEXTS[Math.floor(Math.random() * BUBBLE_TEXTS.length)],
      });
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const size = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(320, Math.round(rect.width));
      H = Math.max(200, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 等比缩放:既铺满宽度,又保证垂直不溢出(取较小者)
      SC = Math.max(0.5, Math.min(W / REF_W, H / 400));
      OX = Math.max(0, (W / SC - REF_W) / 2);
      CY = H / SC / 2;
    };

    const frame = () => {
      f++;
      ctx.clearRect(0, 0, W, H);

      // 背景网格:直接画在屏幕空间,铺满整幅画面(不随构图缩放)
      ctx.strokeStyle = "rgba(18,48,76,.055)";
      ctx.lineWidth = 1;
      for (let x = -((f * 0.3) % 40); x < W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = -((f * 0.2) % 40); y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.save();
      ctx.scale(SC, SC);
      ctx.translate(OX, 0);

      // 表格:白卡片
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const [x, y] = cellXY(c, r);
          const k = lit.get(`${c},${r}`) || 0;
          ctx.fillStyle =
            k > 0.02 ? `rgba(200,149,82,${0.1 + k * 0.42})` : "rgba(255,255,255,.92)";
          ctx.strokeStyle = "rgba(18,48,76,.14)";
          roundRect(x, y, TB_W, TB_H, 6);
          ctx.fill();
          ctx.stroke();
          if (k > 0.5) {
            ctx.fillStyle = "rgba(18,48,76,.42)";
            ctx.fillRect(x + 8, y + TB_H / 2 - 3, 18 + ((c * 7 + r * 11) % 26), 6);
          }
        }
      }

      // 数据包
      if (f % 14 === 0) spawnPacket();
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        const [tx, ty] = cellXY(p.col, p.row);
        const dx = tx - p.x;
        const dy = ty - p.y;
        const d = Math.hypot(dx, dy) || 1;
        p.x += (dx / d) * p.vx;
        p.y += (dy / d) * p.vx * 0.9;
        ctx.strokeStyle = p.hue + "55";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x - (dx / d) * 26, p.y - (dy / d) * 26);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
        ctx.fillStyle = p.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.6, 0, 7);
        ctx.fill();
        if (d < 12) {
          lit.set(`${p.col},${p.row}`, 1);
          packets.splice(i, 1);
          if (Math.random() < 0.3) spawnBubble();
        }
      }
      for (const [k, v] of lit) {
        const nv = v - 0.012;
        if (nv <= 0) lit.delete(k);
        else lit.set(k, nv);
      }

      // 表格 → 右侧的金色数据流
      for (let s = 0; s < 3; s++) {
        ctx.strokeStyle = `rgba(200,149,82,${0.55 - s * 0.12})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let t = 0; t <= 1; t += 0.02) {
          const x = TB_LEFT + TB_W * COLS + 30 + t * 260;
          const y = cy() + Math.sin(t * 7 + f * 0.03 + s * 2) * (28 + s * 10) + (s - 1) * 70;
          if (t === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // 结果气泡
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.life += 0.02;
        const a = b.life < 0.25 ? b.life / 0.25 : b.life > 0.85 ? Math.max(0, (1 - b.life) / 0.15) : 1;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.font = "15px -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
        const w = ctx.measureText(b.text).width + 28;
        ctx.save();
        ctx.shadowColor = "rgba(18,48,76,.12)";
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = "#ffffff";
        roundRect(b.x + b.life * 40, b.y, w, 38, 12);
        ctx.fill();
        ctx.restore();
        ctx.strokeStyle = "rgba(200,149,82,.55)";
        roundRect(b.x + b.life * 40, b.y, w, 38, 12);
        ctx.stroke();
        ctx.fillStyle = INK;
        ctx.fillText(b.text, b.x + 14 + b.life * 40, b.y + 24);
        ctx.globalAlpha = 1;
        if (b.life > 1) bubbles.splice(i, 1);
      }

      ctx.restore();
    };

    const loop = () => {
      if (!document.hidden) frame();
      raf = window.requestAnimationFrame(loop);
    };

    size();
    if (reduce) {
      frame(); // 静态一帧,不跑动画
      return;
    }
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="w-full bg-gradient-to-b from-white via-[#f7f2e9] to-[#efe8dd]">
        <canvas
          ref={canvasRef}
          className="block h-[300px] w-full sm:h-[380px] lg:h-[460px]"
          aria-hidden="true"
        />
      </div>
      <p className="py-3 text-center text-xs text-zinc-400">
        Files are read in your browser — nothing is uploaded.
      </p>
    </div>
  );
}

export default HeroAnimation;
