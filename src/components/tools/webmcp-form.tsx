"use client";

/**
 * WebMcpForm —— 把工具包成一个"能被 AI agent 识别"的表单
 *
 * 为什么需要这个客户端组件:
 *   服务端组件(Server Component)不能向客户端组件传事件处理函数,
 *   而 WebMCP 的 <form> 需要一个 onSubmit 阻止默认提交(否则按回车会整页刷新)。
 *   所以把 form 放在这个 "use client" 组件里,页面照旧可以是服务端组件。
 *
 * 兼容性:toolname / tooldescription 是 WebMCP(Chrome 源试验)属性,
 *        未实现的浏览器会直接忽略 —— 属于零风险的渐进增强。
 * 规范:https://developer.chrome.com/docs/ai/webmcp/declarative-api
 */
export function WebMcpForm({
  toolname,
  tooldescription,
  children,
  className,
}: {
  /** WebMCP 工具名(驼峰式,例如 splitLargeCsv) */
  toolname: string;
  /** 工具作用说明 —— AI 靠它判断"什么时候该用这个工具" */
  tooldescription: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      className={className}
      toolname={toolname}
      tooldescription={tooldescription}
      onSubmit={(e) => e.preventDefault()}
    >
      {children}
    </form>
  );
}
