"use client";

import { useEffect, useRef } from "react";

/**
 * WebMCP · 命令式 API(Imperative API)接入助手
 *
 * 为什么需要这一层:
 *   声明式 API(<form toolname="…">)只能把「文本 / 下拉 / 数字」字段暴露成参数,
 *   文件框(input[type=file])拿不到参数 —— 实测 getTools() 返回
 *   {"type":"object","properties":{},"required":[]}。
 *   要让 AI agent「带着数据直接调用工具」,只能走命令式 API:
 *   navigator.modelContext.registerTool({ name, description, inputSchema, execute })
 *   —— 把 CSV / JSON 内容当【字符串参数】传进来,不再依赖文件上传。
 *
 * 官方文档:https://developer.chrome.com/docs/ai/webmcp/imperative-api
 *   · registerTool(tool, { signal }) —— 传 AbortController 的 signal,abort() 即注销
 *   · execute(args, { signal }) —— 第二个参数是 AbortSignal,长任务应传递它
 *   · annotations:
 *       readOnlyHint            true = 只读,不改变站点状态
 *       untrustedContentHint    true = 输出里含调用方/用户提供的数据(agent 需按不可信内容处理)
 *       consequentialHint       true = 有不可逆的真实世界后果(本站工具没有)
 *
 * 降级:没有 WebMCP 的浏览器(目前是绝大多数)直接跳过 —— 纯渐进增强,
 *      页面 UI 与既有声明式属性完全不受影响。
 */

/** 工具的安全提示(官方 annotations 字段) */
export type WebMcpAnnotations = {
  readOnlyHint?: boolean;
  untrustedContentHint?: boolean;
  consequentialHint?: boolean;
};

/** 一个命令式工具的定义 */
export type WebMcpToolSpec = {
  /** 工具名(驼峰式,例如 splitCsvText) */
  name: string;
  /** 作用说明 —— agent 靠它判断「什么时候该用这个工具」 */
  description: string;
  /** JSON Schema:描述参数(agent 用它填参数) */
  inputSchema: Record<string, unknown>;
  /** 安全提示 */
  annotations?: WebMcpAnnotations;
  /** 实际执行 —— 参数是 agent 传进来的 JSON,返回值可以是字符串或 JSON 字符串 */
  execute: (
    args: Record<string, unknown>,
    /** 官方约定的第二个参数:execute(args, { signal }) —— 长任务应把 signal 传给 fetch 等 */
    context?: { signal?: AbortSignal }
  ) => Promise<string> | string;
};

type ModelContextLike = {
  registerTool?: (tool: unknown, options?: { signal?: AbortSignal }) => unknown;
};

/**
 * 取 WebMCP 的 modelContext。
 * 规范的入口从 navigator.modelContext 迁到了 document.modelContext,
 * 两个都探一遍(实测线上 Chrome 149+ 两者都在);都没有就返回 null。
 */
export function getModelContext(): ModelContextLike | null {
  if (typeof navigator === "undefined" || typeof document === "undefined") return null;
  const fromNavigator = (navigator as unknown as { modelContext?: ModelContextLike }).modelContext;
  const fromDocument = (document as unknown as { modelContext?: ModelContextLike }).modelContext;
  return fromDocument ?? fromNavigator ?? null;
}

/** 浏览器是否启用了 WebMCP(仅用于自检/日志,业务逻辑不要依赖它) */
export function isWebMcpEnabled(): boolean {
  return Boolean(getModelContext()?.registerTool);
}

/**
 * 在组件挂载时注册一个命令式工具,卸载时注销。
 *
 * 用法(在已有的客户端工具组件里):
 *   useWebMcpTool({
 *     name: "splitCsvText",
 *     description: "…",
 *     inputSchema: { type: "object", properties: { … }, required: [ … ] },
 *     execute: async ({ csvText }) => doSomething(csvText),
 *   });
 *
 * 注意:execute 里必须【复用页面已有的算法】,不要另写一套 ——
 * 否则 agent 调用与用户在页面上操作会得到不同结果。
 */
export function useWebMcpTool(spec: WebMcpToolSpec): void {
  // 用 ref 保存最新的 spec:注册只做一次,但每次渲染后 execute 都是最新的闭包
  const specRef = useRef(spec);

  useEffect(() => {
    specRef.current = spec;
  });

  useEffect(() => {
    const modelContext = getModelContext();
    if (!modelContext?.registerTool) return; // 无 WebMCP → 静默降级

    const controller = new AbortController();
    const { name, description, inputSchema, annotations } = specRef.current;

    const tool = {
      name,
      description,
      inputSchema,
      annotations,
      execute: (args: Record<string, unknown> | undefined, context?: { signal?: AbortSignal }) =>
        specRef.current.execute(args ?? {}, context),
    };

    try {
      const maybePromise = modelContext.registerTool(tool, { signal: controller.signal });
      // 注册失败(例如重复注册同名工具)不应影响页面
      if (maybePromise && typeof (maybePromise as Promise<unknown>).catch === "function") {
        (maybePromise as Promise<unknown>).catch(() => {});
      }
    } catch {
      /* 忽略:渐进增强,失败不影响页面 */
    }

    return () => {
      try {
        controller.abort(); // 官方注销方式
      } catch {
        /* 忽略 */
      }
    };
  }, []);
}
