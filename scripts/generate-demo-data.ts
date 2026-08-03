/**
 * 生成逼真电商演示数据 — TrendVibe Shopify 店铺
 * 故事线：1-5月利润稳步增长，6-7月利润突然下降32%
 * 原因：Nevada 地区 Electronics 退货率飙升、国际运费翻倍、Fashion 折扣率失控
 */

import * as fs from "fs";

const CATEGORIES = [
  { name: "Electronics", avgPrice: 89, costPct: 0.55, returnBaseRate: 0.03 },
  { name: "Fashion", avgPrice: 45, costPct: 0.35, returnBaseRate: 0.08 },
  { name: "Home & Garden", avgPrice: 62, costPct: 0.40, returnBaseRate: 0.04 },
  { name: "Sports & Outdoors", avgPrice: 55, costPct: 0.42, returnBaseRate: 0.05 },
];

const REGIONS = [
  { name: "California", shipBase: 5.99, orderMult: 3.0 },
  { name: "Texas", shipBase: 6.99, orderMult: 2.0 },
  { name: "New York", shipBase: 5.99, orderMult: 2.2 },
  { name: "Florida", shipBase: 7.49, orderMult: 1.8 },
  { name: "Nevada", shipBase: 6.49, orderMult: 1.0 },
  { name: "International", shipBase: 14.99, orderMult: 1.5 },
];

const MONTHS = [
  "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07",
];

const PRODUCTS = [
  // Electronics
  { name: "Wireless Earbuds Pro", category: "Electronics", price: 79 },
  { name: "Smart Watch Band", category: "Electronics", price: 49 },
  { name: "USB-C Hub 7-in-1", category: "Electronics", price: 65 },
  { name: "Bluetooth Speaker Mini", category: "Electronics", price: 39 },
  { name: "Phone Stand Adjustable", category: "Electronics", price: 25 },
  // Fashion
  { name: "Premium Cotton T-Shirt", category: "Fashion", price: 32 },
  { name: "Slim Fit Chinos", category: "Fashion", price: 54 },
  { name: "Canvas Sneakers", category: "Fashion", price: 68 },
  { name: "Wool Blend Sweater", category: "Fashion", price: 72 },
  // Home & Garden
  { name: "LED Plant Grow Light", category: "Home & Garden", price: 42 },
  { name: "Bamboo Cutlery Set", category: "Home & Garden", price: 28 },
  { name: "Organic Cotton Towels (Set of 4)", category: "Home & Garden", price: 49 },
  { name: "Scented Soy Candle Trio", category: "Home & Garden", price: 36 },
  // Sports & Outdoors
  { name: "Yoga Mat Premium 6mm", category: "Sports & Outdoors", price: 44 },
  { name: "Insulated Water Bottle 32oz", category: "Sports & Outdoors", price: 34 },
  { name: "Resistance Bands Set", category: "Sports & Outdoors", price: 29 },
  { name: "Running Armband Phone Holder", category: "Sports & Outdoors", price: 22 },
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalRandom(mean: number, stddev: number) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stddev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function formatMoney(v: number) {
  return Math.round(v * 100) / 100;
}

function getMonthDateRange(month: string) {
  const [y, m] = month.split("-").map(Number);
  const lastDay = new Date(y, m, 0).getDate();
  return { start: 1, end: lastDay };
}

const rows: string[] = [];
let orderId = 10000;

const header = [
  "order_id", "date", "customer_email", "product", "category",
  "quantity", "unit_price", "discount_pct", "revenue",
  "cogs", "shipping_cost", "returned", "region", "marketing_channel",
  "customer_acquisition_cost", "is_repeat_customer",
].join(",");

rows.push(header);

for (const month of MONTHS) {
  const { start, end } = getMonthDateRange(month);
  const [year, mon] = month.split("-");
  const monthIndex = MONTHS.indexOf(month); // 0-6

  // 每月订单基数：1月少，逐月增长
  const baseOrders = 60 + monthIndex * 15;
  const totalOrders = baseOrders + rand(-10, 20);

  for (let i = 0; i < totalOrders; i++) {
    const day = rand(start, end);
    const date = `${year}-${mon}-${String(day).padStart(2, "0")}`;

    const product = PRODUCTS[rand(0, PRODUCTS.length - 1)];
    const region = REGIONS[rand(0, REGIONS.length - 1)];
    const quantity = rand(1, product.category === "Electronics" ? 2 : 5);

    // === 季节效应：让数据有真实波动 ===

    // 6-7月 Fashion 折扣失控
    let discountPct = 0;
    if (product.category === "Fashion") {
      if (monthIndex <= 3) discountPct = rand(5, 15); // 1-4月：5-15%
      else if (monthIndex <= 4) discountPct = rand(10, 25); // 5月：升温
      else discountPct = rand(25, 45); // 6-7月：清仓大甩卖
    } else if (product.category === "Electronics" && monthIndex >= 4) {
      discountPct = rand(5, 15); // 夏季促销
    } else if (product.category === "Sports & Outdoors" && monthIndex >= 3) {
      discountPct = rand(5, 20); // 春夏旺季
    } else {
      discountPct = rand(0, 8);
    }

    const baseUnitPrice = product.price * (0.9 + Math.random() * 0.2); // 价格轻微浮动
    const unitPrice = formatMoney(baseUnitPrice);
    const grossRevenue = formatMoney(baseUnitPrice * quantity);
    const revenue = formatMoney(grossRevenue * (1 - discountPct / 100));

    // COGS：商品成本
    const catMeta = CATEGORIES.find(c => c.name === product.category)!;
    const cogs = formatMoney(grossRevenue * catMeta.costPct);

    // === 运费 ===
    // 6-7月 International 运费翻倍（"carrier rate changes"）
    let shippingCost = region.shipBase + quantity * 2.5;
    if (region.name === "International" && monthIndex >= 5) {
      shippingCost *= 2.1; // 翻倍
    } else if (region.name === "International" && monthIndex >= 4) {
      shippingCost *= 1.3; // 5月开始上涨
    }
    // 加上随机波动
    shippingCost = formatMoney(shippingCost * (0.85 + Math.random() * 0.3));

    // === 退货 ===
    // Nevada 地区 6-7月 Electronics 退货率从 3% 飙升到 18%
    let returnRate = catMeta.returnBaseRate;
    if (region.name === "Nevada" && product.category === "Electronics" && monthIndex >= 5) {
      returnRate = 0.15 + Math.random() * 0.08; // 15-23%
    } else if (region.name === "Nevada" && product.category === "Electronics" && monthIndex === 4) {
      returnRate = 0.06 + Math.random() * 0.04; // 5月开始有苗头
    }
    const returned = Math.random() < returnRate ? "Yes" : "No";

    // 营销渠道
    const channels = ["Google Ads", "Instagram", "TikTok", "Email", "Organic Search", "Facebook"];
    const channel = channels[rand(0, channels.length - 1)];

    // CAC
    let cac = 0;
    if (channel === "Google Ads") cac = formatMoney(8 + Math.random() * 12);
    else if (channel === "Facebook") cac = formatMoney(5 + Math.random() * 10);
    else if (channel === "Instagram") cac = formatMoney(4 + Math.random() * 8);
    else if (channel === "TikTok") cac = formatMoney(3 + Math.random() * 7);
    else if (channel === "Email") cac = formatMoney(1 + Math.random() * 3);
    else cac = formatMoney(0.5 + Math.random() * 2);

    const repeatCustomer = Math.random() < (monthIndex * 0.03 + 0.1) ? "Yes" : "No"; // 越往后复购越多

    const email = `customer${orderId}@${["gmail", "yahoo", "outlook", "icloud", "proton"][rand(0, 4)]}.com`;

    rows.push([
      orderId++, date, email, `"${product.name}"`, product.category,
      quantity, unitPrice, `${discountPct}%`, revenue,
      cogs, shippingCost, returned, region.name, channel,
      cac, repeatCustomer,
    ].join(","));
  }
}

// 写文件
const target = process.argv[2] || "../demo-ecommerce-sales.csv";
fs.writeFileSync(target, rows.join("\n"), "utf-8");

const totalOrders = rows.length - 1;
console.log(`✅ Generated ${totalOrders} orders → ${target}`);
console.log(`📊 Story: Jan–May growth → June–July profit drop`);
console.log(`🔍 Easter eggs:`);
console.log(`   - Nevada Electronics return rate spikes Jun–Jul (3% → ~18%)`);
console.log(`   - International shipping doubles Jun–Jul`);
console.log(`   - Fashion discount rate climbs from ~10% to ~35% by July`);

// 打印一些统计让用户了解数据
const stats: Record<string, { orders: number; revenue: number; profit: number; returns: number }> = {};
for (let i = 1; i < rows.length; i++) {
  const cols = rows[i].split(",");
  const month = cols[1].slice(0, 7);
  const rev = parseFloat(cols[8]);
  const cogs = parseFloat(cols[9]);
  const ship = parseFloat(cols[10]);
  const returned = cols[11] === "Yes";
  if (!stats[month]) stats[month] = { orders: 0, revenue: 0, profit: 0, returns: 0 };
  stats[month].orders++;
  stats[month].revenue += rev;
  stats[month].profit += rev - cogs - ship;
  if (returned) stats[month].returns++;
}

console.log(`\n📈 Monthly Overview:`);
for (const m of MONTHS) {
  const s = stats[m];
  if (!s) continue;
  const avg = s.profit / s.orders;
  const retPct = ((s.returns / s.orders) * 100).toFixed(1);
  console.log(`   ${m} | ${s.orders} orders | Rev: $${Math.round(s.revenue)} | Profit: $${Math.round(s.profit)} | Avg/order: $${avg.toFixed(0)} | Returns: ${retPct}%`);
}
