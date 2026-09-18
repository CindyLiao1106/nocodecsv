/**
 * WebMCP HTML 属性类型声明(渐进增强)
 *
 * WebMCP 是 Chrome 的「网站-智能体」协议,通过给标准 HTML 加属性来暴露工具:
 *   <form toolname="…" tooldescription="…">   声明一个工具
 *   字段加 toolparamdescription="…"            说明该字段的含义(参数)
 *
 * React 的类型定义里还没有这三个属性,所以在这里补齐。
 * 未知属性在旧浏览器会被忽略 —— 因此这是零风险的渐进增强。
 * 参考:https://developer.chrome.com/docs/ai/webmcp/declarative-api
 */
import "react";

declare module "react" {
  interface FormHTMLAttributes<T> {
    /** WebMCP:工具名(驼峰式,例如 uploadCsvFile) */
    toolname?: string;
    /** WebMCP:工具作用说明 —— AI 靠它判断"什么时候该用这个工具" */
    tooldescription?: string;
  }

  interface InputHTMLAttributes<T> {
    /** WebMCP:该字段作为工具参数的说明 */
    toolparamdescription?: string;
  }

  interface TextareaHTMLAttributes<T> {
    /** WebMCP:该字段作为工具参数的说明 */
    toolparamdescription?: string;
  }

  interface SelectHTMLAttributes<T> {
    /** WebMCP:该字段作为工具参数的说明 */
    toolparamdescription?: string;
  }

  interface ButtonHTMLAttributes<T> {
    /** WebMCP:该字段作为工具参数的说明 */
    toolparamdescription?: string;
  }
}
