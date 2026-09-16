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
  'convert-text-to-csv': 'convert',
  'convert-csv-to-word': 'convert',
  'convert-json-to-excel': 'convert',
  'convert-excel-to-json': 'convert',

  // B. 数据清理
  'how-to-clean-dirty-csv-data': 'clean',
  'remove-duplicates-from-csv': 'clean',
  'remove-blank-rows-from-csv': 'clean',
  'fix-garbled-csv-in-excel': 'clean',
  'keep-leading-zeros-in-csv': 'clean',
  'change-csv-delimiter': 'clean',
  'extract-email-addresses-from-csv': 'clean',
  'remove-special-characters-in-excel': 'clean',
  'find-and-replace-in-csv': 'clean',

  // C. AI 与分析
  'how-to-analyze-csv-with-ai-free': 'ai',
  'chat-with-csv': 'ai',
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
  'query-csv-with-sql': 'ops',
  'count-rows-in-csv-file': 'ops',
  'import-csv-into-google-sheets': 'ops',
  'merge-csv-files-free': 'ops',
  'excel-row-limit': 'ops',
  'csv-to-sql': 'ops',
  'csv-to-mysql': 'ops',

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
  'convert-text-to-csv': 'Convert Text to CSV',
  'convert-csv-to-word': 'Convert CSV to Word',
  'convert-json-to-excel': 'Convert JSON to Excel',
  'convert-excel-to-json': 'Convert Excel to JSON',
  'how-to-clean-dirty-csv-data': 'How to Clean Dirty CSV Data',
  'remove-duplicates-from-csv': 'Remove Duplicates from CSV',
  'remove-blank-rows-from-csv': 'Remove Blank Rows from CSV',
  'fix-garbled-csv-in-excel': 'Fix Garbled CSV in Excel',
  'keep-leading-zeros-in-csv': 'Keep Leading Zeros in CSV',
  'change-csv-delimiter': 'Change CSV Delimiter',
  'extract-email-addresses-from-csv': 'Extract Email Addresses from a CSV',
  'remove-special-characters-in-excel': 'Remove Special Characters in Excel',
  'find-and-replace-in-csv': 'Find and Replace in a CSV',
  'how-to-analyze-csv-with-ai-free': 'Analyze CSV with AI (Free)',
  'chat-with-csv': 'Chat with CSV',
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
  'query-csv-with-sql': 'Query a CSV with SQL',
  'count-rows-in-csv-file': 'Count Rows in a CSV File',
  'import-csv-into-google-sheets': 'Import CSV into Google Sheets',
  'merge-csv-files-free': 'Merge CSV Files',
  'excel-row-limit': 'Excel Row Limit',
  'csv-to-sql': 'CSV to SQL',
  'csv-to-mysql': 'CSV to MySQL',
  'csv-vs-excel': 'CSV vs Excel',
};

/** 一句话简介(slug → 简介),用于枢纽页卡片与 SEO 摘要 */
export const POST_SUMMARIES: Record<string, string> = {
  'convert-csv-to-pdf': 'Turn a plain CSV file into a clean, printable PDF document without installing extra software.',
  'convert-csv-to-excel-without-excel': 'Convert a CSV file into a proper Excel workbook even when Excel is not installed.',
  'convert-excel-to-csv-free-online': 'Export an Excel workbook to CSV format online while keeping encoding and columns intact.',
  'convert-tsv-to-csv': 'Convert tab-separated TSV files into comma-separated CSV files for tools that only accept commas.',
  'csv-to-json-free-online': 'Reshape CSV rows into JSON objects for APIs, web apps, or scripts, entirely in the browser.',
  'json-to-csv-converter-online': 'Flatten nested JSON API output back into a readable CSV table for spreadsheets.',
  'csv-to-html-table': 'Generate paste-ready HTML table markup from CSV data for web pages or emails.',
  'csv-to-markdown-table': 'Convert a CSV spreadsheet into a Markdown table for documentation, READMEs, and wikis.',
  'extract-data-from-pdf-to-csv-ai': 'Use AI to pull tables out of PDF documents and export them as clean CSV files.',
  'csv-to-chart-online-free': 'Turn a column of CSV numbers into a shareable chart directly in your browser.',
  'transpose-csv-file': 'Swap rows and columns in a CSV file without breaking quoted fields or formatting.',
  'convert-text-to-csv': 'Turn tab, space or fixed-width text files into real CSV files without shifting a column.',
  'convert-csv-to-word': 'Get CSV data into a Word document as a real table, or one document per row, without broken columns.',
  'convert-json-to-excel': 'Turn nested JSON objects, arrays and whole folders of files into one usable spreadsheet.',
  'convert-excel-to-json': 'Read a workbook the JSON tools refuse, keep every sheet, and survive dates and long ID numbers.',
  'how-to-clean-dirty-csv-data': 'A checklist for cleaning messy CSV exports: blanks, duplicates, stray quotes, and broken headers.',
  'remove-duplicates-from-csv': 'Find and remove duplicate rows from a CSV file without losing unique records.',
  'remove-blank-rows-from-csv': 'Strip empty rows from a CSV file that break imports, charts, and calculations.',
  'fix-garbled-csv-in-excel': 'Fix mojibake and garbled text when opening CSV files in Excel due to wrong encoding.',
  'keep-leading-zeros-in-csv': 'Stop Excel from stripping leading zeros from ZIP codes, IDs, and phone numbers in CSV files.',
  'change-csv-delimiter': 'Convert CSV delimiters between commas, semicolons, tabs, and pipes without corrupting the data.',
  'extract-email-addresses-from-csv': 'Pull email addresses out of free-text CSV columns, then clean and deduplicate the list.',
  'remove-special-characters-in-excel': 'Remove unwanted special characters and symbols from Excel cells without breaking formulas.',
  'find-and-replace-in-csv': 'Find and replace text values across a CSV file safely without corrupting the structure.',
  'how-to-analyze-csv-with-ai-free': 'Ask questions of a CSV spreadsheet using free AI and get instant answers, no coding required.',
  'chat-with-csv': 'Chat with a CSV file in plain English to explore data and get instant answers.',
  'best-ai-tools-for-excel-analysis': 'A comparison of the best AI tools for analyzing Excel spreadsheets and their pricing.',
  'ai-data-visualization-guide': 'A guide to turning plain spreadsheet data into charts and dashboards using AI tools.',
  'spreadsheet-automation-with-ai': 'How AI can automate repetitive spreadsheet tasks like cleaning, formulas, and reporting.',
  'free-alternative-to-chatgpt-code-interpreter': 'A free alternative to ChatGPT Code Interpreter for conversational spreadsheet and CSV analysis.',
  'excel-formula-generator-ai': 'Generate Excel formulas from plain-English descriptions using an AI formula generator.',
  'chat-with-spreadsheet-ai-free': 'A free conversational way to explore and question a spreadsheet you did not build.',
  'summarize-excel-data-with-ai': 'Get a written AI summary of a large Excel dataset instead of building a pivot table.',
  'ask-csv': 'Ask direct questions about your CSV data and get immediate, plain-English answers.',
  'analyze-survey-data-csv-with-ai': 'Use AI to analyze survey responses exported as CSV without a statistics package.',
  'visualize-sales-data-csv': 'Turn a sales data CSV export into charts and insights without writing any code.',
  'opencode-go-review-cheap-ai-models': 'A hands-on review of OpenCode Go, a cheap coding-model subscription, tested and priced honestly.',
  'sort-csv-by-column': 'Sort CSV rows by one or more columns correctly, including dates and numbers.',
  'split-large-csv-file-online': 'Break a CSV file too large to open into smaller, manageable parts online.',
  'compare-two-csv-files-online': 'Find the differences between two versions of the same CSV file online.',
  'free-csv-viewer-online': 'Open and browse large CSV files in the browser without Excel or any download.',
  'import-csv-to-sqlite-free': 'Load a CSV file into a SQLite database so you can run real SQL queries.',
  'query-csv-with-sql': 'Run SQL queries directly against a CSV file without setting up a database server.',
  'count-rows-in-csv-file': 'Quickly count the number of rows in a CSV file without opening it in Excel.',
  'import-csv-into-google-sheets': 'Import a local CSV file into Google Sheets without mangling formatting or data.',
  'merge-csv-files-free': 'Combine several CSV files into one table with a single header row, for free.',
  'excel-row-limit': "Understand Excel's maximum row limit and what to do when a CSV file exceeds it.",
  'csv-to-sql': 'Convert a CSV into SQL INSERT statements or load it with the database\'s own bulk loader.',
  'csv-to-mysql': 'Load a CSV into a MySQL table with LOAD DATA, and fix the settings that quietly drop rows.',
  'csv-vs-excel': 'A comparison of CSV and Excel formats, and which one to keep for your data.',
};

/** 发布日期(slug → "YYYY-MM-DD"),用于 sitemap 与文章元数据 */
export const POST_DATES: Record<string, string> = {
  'convert-csv-to-pdf': '2026-09-10',
  'convert-csv-to-excel-without-excel': '2026-09-02',
  'convert-excel-to-csv-free-online': '2026-09-06',
  'convert-tsv-to-csv': '2026-09-08',
  'csv-to-json-free-online': '2026-08-30',
  'json-to-csv-converter-online': '2026-09-07',
  'csv-to-html-table': '2026-09-07',
  'csv-to-markdown-table': '2026-09-11',
  'extract-data-from-pdf-to-csv-ai': '2026-09-05',
  'csv-to-chart-online-free': '2026-09-07',
  'transpose-csv-file': '2026-09-12',
  'convert-text-to-csv': '2026-09-14',
  'convert-csv-to-word': '2026-09-14',
  'convert-json-to-excel': '2026-09-15',
  'convert-excel-to-json': '2026-09-16',
  'how-to-clean-dirty-csv-data': '2026-08-31',
  'remove-duplicates-from-csv': '2026-09-03',
  'remove-blank-rows-from-csv': '2026-09-10',
  'fix-garbled-csv-in-excel': '2026-09-06',
  'keep-leading-zeros-in-csv': '2026-09-11',
  'change-csv-delimiter': '2026-09-09',
  'extract-email-addresses-from-csv': '2026-09-12',
  'remove-special-characters-in-excel': '2026-09-14',
  'find-and-replace-in-csv': '2026-08-01',
  'how-to-analyze-csv-with-ai-free': '2026-08-01',
  'chat-with-csv': '2026-09-13',
  'best-ai-tools-for-excel-analysis': '2026-08-01',
  'ai-data-visualization-guide': '2026-08-02',
  'spreadsheet-automation-with-ai': '2026-08-02',
  'free-alternative-to-chatgpt-code-interpreter': '2026-08-03',
  'excel-formula-generator-ai': '2026-08-30',
  'chat-with-spreadsheet-ai-free': '2026-09-04',
  'summarize-excel-data-with-ai': '2026-09-04',
  'ask-csv': '2026-09-06',
  'analyze-survey-data-csv-with-ai': '2026-09-01',
  'visualize-sales-data-csv': '2026-09-02',
  'opencode-go-review-cheap-ai-models': '2026-09-10',
  'sort-csv-by-column': '2026-09-08',
  'split-large-csv-file-online': '2026-09-03',
  'compare-two-csv-files-online': '2026-09-05',
  'free-csv-viewer-online': '2026-08-31',
  'import-csv-to-sqlite-free': '2026-09-01',
  'query-csv-with-sql': '2026-09-14',
  'count-rows-in-csv-file': '2026-08-01',
  'import-csv-into-google-sheets': '2026-09-07',
  'merge-csv-files-free': '2026-08-30',
  'excel-row-limit': '2026-09-14',
  'csv-to-sql': '2026-09-15',
  'csv-to-mysql': '2026-09-16',
  'csv-vs-excel': '2026-09-09',
};

/** 全站文章 slug 列表(顺序固定,用于轮转) */
export const ALL_POST_SLUGS: string[] = Object.keys(POST_CLUSTERS);

/** 数组轮转:按 seed 决定起点,避免固定字母序导致部分文章永远拿不到入链 */
function rotate(arr: string[], seed: number | string): string[] {
  if (arr.length === 0) return arr;
  const n = typeof seed === 'number' ? seed : seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const start = ((n % arr.length) + arr.length) % arr.length;
  return [...arr.slice(start), ...arr.slice(0, start)];
}

/**
 * 取相关文章:优先同集群,不足则用跨集群补充
 * @param slug 当前文章
 * @param limit 返回数量(默认 4)
 */
export function getRelatedPosts(slug: string, limit = 6): { slug: string; title: string }[] {
  const mine = POST_CLUSTERS[slug];
  const sameCluster = ALL_POST_SLUGS.filter((s) => s !== slug && POST_CLUSTERS[s] === mine);
  const others = ALL_POST_SLUGS.filter((s) => s !== slug && POST_CLUSTERS[s] !== mine);
  const withoutSelf = ALL_POST_SLUGS.filter((s) => s !== slug);
  const idx = ALL_POST_SLUGS.indexOf(slug);

  const gap = Math.min(2, limit); // 保底槽位数:取自全站轮转窗口,数学上保证无孤岛
  const picked: string[] = [];
  const seen = new Set<string>();
  const take = (seq: string[], cap: number) => {
    for (const s of seq) {
      if (picked.length >= cap || picked.length >= limit) return;
      if (seen.has(s)) continue;
      seen.add(s);
      picked.push(s);
    }
  };

  // 1) 同集群优先(集群内按当前索引轮转,不再固定字母序)
  take(rotate(sameCluster, idx), Math.max(1, limit - gap));
  // 2) 保底槽位:全站轮转窗口 —— 消除孤岛的关键
  take(rotate(withoutSelf, idx + 1), limit);
  // 3) 仍不足则按轮转补齐
  take(rotate(sameCluster, idx).concat(rotate(others, idx)), limit);

  return picked.map((s) => ({ slug: s, title: POST_TITLES[s] ?? s }));
}
