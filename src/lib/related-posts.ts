// 博客主题集群 — 用于自动生成"相关文章"内链
// 每个集群内的文章互链,提升站内链接密度与主题权威性

export type Cluster = 'convert' | 'clean' | 'ai' | 'ops' | 'basics';

export const CLUSTER_LABELS: Record<Cluster, string> = {
  convert: 'Format Conversion',
  clean: 'Data Cleaning',
  ai: 'AI & Analysis',
  ops: 'File Operations',
  basics: 'CSV Fundamentals',
};

/** slug → 集群 */
export const POST_CLUSTERS: Record<string, Cluster> = {
  // A. 格式转换
  'convert-csv-to-pdf': 'convert',
  'convert-csv-to-excel-without-excel': 'convert',
  'convert-excel-to-csv-free-online': 'convert',
  'convert-tsv-to-csv': 'convert',
  'csv-to-json-free-online': 'convert',
  'json-to-csv-converter-online': 'convert',
  'csv-to-html-table': 'convert',
  'csv-to-markdown-table': 'convert',
  'extract-data-from-pdf-to-csv-ai': 'convert',
  'csv-to-chart-online-free': 'convert',
  'transpose-csv-file': 'convert',

  // B. 数据清理
  'how-to-clean-dirty-csv-data': 'clean',
  'remove-duplicates-from-csv': 'clean',
  'remove-blank-rows-from-csv': 'clean',
  'fix-garbled-csv-in-excel': 'clean',
  'keep-leading-zeros-in-csv': 'clean',
  'change-csv-delimiter': 'clean',
  'extract-email-addresses-from-csv': 'clean',

  // C. AI 与分析
  'how-to-analyze-csv-with-ai-free': 'ai',
  'best-ai-tools-for-excel-analysis': 'ai',
  'ai-data-visualization-guide': 'ai',
  'spreadsheet-automation-with-ai': 'ai',
  'free-alternative-to-chatgpt-code-interpreter': 'ai',
  'excel-formula-generator-ai': 'ai',
  'chat-with-spreadsheet-ai-free': 'ai',
  'summarize-excel-data-with-ai': 'ai',
  'ask-csv': 'ai',
  'analyze-survey-data-csv-with-ai': 'ai',
  'visualize-sales-data-csv': 'ai',
  'opencode-go-review-cheap-ai-models': 'ai',

  // D. 文件操作
  'sort-csv-by-column': 'ops',
  'split-large-csv-file-online': 'ops',
  'compare-two-csv-files-online': 'ops',
  'free-csv-viewer-online': 'ops',
  'import-csv-to-sqlite-free': 'ops',
  'import-csv-into-google-sheets': 'ops',
  'merge-csv-files-free': 'ops',

  // E. 基础
  'csv-vs-excel': 'basics',
};

/** 文章标题(slug → 显示标题),用于内链锚文本 */
export const POST_TITLES: Record<string, string> = {
  'convert-csv-to-pdf': 'Convert CSV to PDF',
  'convert-csv-to-excel-without-excel': 'Convert CSV to Excel Without Excel',
  'convert-excel-to-csv-free-online': 'Convert Excel to CSV Free Online',
  'convert-tsv-to-csv': 'Convert TSV to CSV',
  'csv-to-json-free-online': 'CSV to JSON Free Online',
  'json-to-csv-converter-online': 'JSON to CSV Converter',
  'csv-to-html-table': 'CSV to HTML Table',
  'csv-to-markdown-table': 'CSV to Markdown Table',
  'extract-data-from-pdf-to-csv-ai': 'Extract Data from PDF to CSV with AI',
  'csv-to-chart-online-free': 'CSV to Chart Online Free',
  'transpose-csv-file': 'Transpose a CSV File',
  'how-to-clean-dirty-csv-data': 'How to Clean Dirty CSV Data',
  'remove-duplicates-from-csv': 'Remove Duplicates from CSV',
  'remove-blank-rows-from-csv': 'Remove Blank Rows from CSV',
  'fix-garbled-csv-in-excel': 'Fix Garbled CSV in Excel',
  'keep-leading-zeros-in-csv': 'Keep Leading Zeros in CSV',
  'change-csv-delimiter': 'Change CSV Delimiter',
  'extract-email-addresses-from-csv': 'Extract Email Addresses from a CSV',
  'how-to-analyze-csv-with-ai-free': 'Analyze CSV with AI (Free)',
  'best-ai-tools-for-excel-analysis': 'Best AI Tools for Excel Analysis',
  'ai-data-visualization-guide': 'AI Data Visualization Guide',
  'spreadsheet-automation-with-ai': 'Spreadsheet Automation with AI',
  'free-alternative-to-chatgpt-code-interpreter': 'Free ChatGPT Code Interpreter Alternative',
  'excel-formula-generator-ai': 'Excel Formula Generator (AI)',
  'chat-with-spreadsheet-ai-free': 'Chat with Your Spreadsheet (Free)',
  'summarize-excel-data-with-ai': 'Summarize Excel Data with AI',
  'ask-csv': 'Ask Your CSV Questions',
  'analyze-survey-data-csv-with-ai': 'Analyze Survey Data CSV with AI',
  'visualize-sales-data-csv': 'Visualize Sales Data from CSV',
  'opencode-go-review-cheap-ai-models': 'OpenCode Go Review',
  'sort-csv-by-column': 'Sort CSV by Column',
  'split-large-csv-file-online': 'Split a Large CSV File Online',
  'compare-two-csv-files-online': 'Compare Two CSV Files Online',
  'free-csv-viewer-online': 'Free CSV Viewer Online',
  'import-csv-to-sqlite-free': 'Import CSV to SQLite',
  'import-csv-into-google-sheets': 'Import CSV into Google Sheets',
  'merge-csv-files-free': 'Merge CSV Files',
  'csv-vs-excel': 'CSV vs Excel',
};

/**
 * 取相关文章:优先同集群,不足则用跨集群补充
 * @param slug 当前文章
 * @param limit 返回数量(默认 4)
 */
export function getRelatedPosts(slug: string, limit = 4): { slug: string; title: string }[] {
  const mine = POST_CLUSTERS[slug];
  const sameCluster = Object.keys(POST_CLUSTERS).filter(
    (s) => s !== slug && POST_CLUSTERS[s] === mine
  );
  const others = Object.keys(POST_CLUSTERS).filter(
    (s) => s !== slug && POST_CLUSTERS[s] !== mine
  );
  // 同集群优先;组内按当前 slug 轮转起点,避免字母序靠后的文章永远拿不到入链
  const rotate = (arr: string[], seed: string): string[] => {
    if (arr.length === 0) return arr;
    const start = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % arr.length;
    return [...arr.slice(start), ...arr.slice(0, start)];
  };
  const picked = [
    ...rotate(sameCluster.sort(), slug),
    ...rotate(others.sort(), slug),
  ].slice(0, limit);
  return picked.map((s) => ({ slug: s, title: POST_TITLES[s] || s }));
}
