/**
 * chat_edit tool implementation.
 * Performs targeted string replacements in files.
 * Rejects ambiguous edits to prevent unintended changes.
 */
import * as fs from "fs/promises"
import path from "path"
import { tool } from "@opencode-ai/plugin"
import { resolvePath } from "../util/paths.js"
import { replaceOnce } from "../util/text.js"

export function createChatEdit(baseDir: string, repoRoot: string) {
  const run = async (args: { filePath: string; oldString: string; newString: string; replaceAll?: boolean }) => {
    const filePath = resolvePath(baseDir, args.filePath)
    const content = await fs.readFile(filePath, "utf-8").catch(() => {
      throw new Error(`File not found: ${filePath}`)
    })
    const updated = replaceOnce(content, args.oldString, args.newString, args.replaceAll)
    await fs.writeFile(filePath, updated, "utf-8")
    const title = path.relative(repoRoot, filePath)
    return `Updated ${title}`
  }

  return {
    id: "chat_edit",
    run,
    tool: tool({
      description: `Replace text in files.

Usage:
- Read the file first before editing
- EXACT MATCH REQUIRED: oldString must match character-for-character (case, whitespace, line breaks, Unicode)
- Fails if oldString not found or appears multiple times (unless replaceAll=true)
- Use replaceAll only when you want every occurrence replaced
- Prefer chat_write for large or multi-section changes`,
      args: {
        filePath: tool.schema.string().describe("The absolute path to the file to modify"),
        oldString: tool.schema.string().describe("The text to replace"),
        newString: tool.schema.string().describe("The text to replace it with (must be different from oldString)"),
        replaceAll: tool.schema.boolean().optional().describe("Replace all occurrences of oldString (default false)"),
      },
      async execute(args) {
        return await run(args)
      },
    }),
  }
}
