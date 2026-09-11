/** 从 AI 回答文本中提取图表数据 */
export function extractChartData(text: string) {
  const match = text.match(/---CHART---\n([\s\S]*?)\n---END---/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

/** 移除回答中的图表标记 */
export function cleanAnswer(text: string) {
  return text.replace(/---CHART---[\s\S]*?---END---/g, "").trim();
}
