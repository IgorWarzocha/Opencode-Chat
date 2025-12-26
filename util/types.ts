/**
 * Shared type definitions for chatifier tools.
 * Keeps tool signatures consistent across modules and batch execution.
 * Extend cautiously to avoid widening interfaces unnecessarily.
 */
import type { ToolDefinition } from "@opencode-ai/plugin"

export type TodoItem = {
  content: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "high" | "medium" | "low"
  id: string
}

export type ToolCall = {
  tool: string
  parameters: Record<string, unknown>
}

export type Match = {
  path: string
  modTime: number
  lineNum: number
  lineText: string
}

export type ChatTool<TArgs extends unknown[] = [Record<string, unknown>]> = {
  id: string
  run: (...args: TArgs) => Promise<string>
  tool: ToolDefinition
  buildDescription?: () => Promise<string>
}
