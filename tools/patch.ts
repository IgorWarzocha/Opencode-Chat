/**
 * chat_patch tool implementation.
 * Apply patches to create, update, delete, or move files.
 */
import { tool } from "@opencode-ai/plugin"
import * as path from "path"
import { parsePatch, applyHunksToFiles, type Hunk } from "../util/patch.js"

import type { ChatTool } from "../util/types"

export function createChatPatch(baseDir: string): ChatTool {
  const run = async (args: { patchText: string }) => {
    const { hunks } = parsePatch(args.patchText)

    const resolved: Hunk[] = hunks.map((hunk) => {
      if (hunk.type === "update" && hunk.move_path) {
        return { ...hunk, path: path.resolve(baseDir, hunk.path), move_path: path.resolve(baseDir, hunk.move_path) }
      }
      return { ...hunk, path: path.resolve(baseDir, hunk.path) }
    })

    const result = await applyHunksToFiles(resolved)

    const summary: string[] = []
    if (result.added.length) summary.push(`Added: ${result.added.join(", ")}`)
    if (result.modified.length) summary.push(`Modified: ${result.modified.join(", ")}`)
    if (result.deleted.length) summary.push(`Deleted: ${result.deleted.join(", ")}`)

    return summary.length ? summary.join("\n") : "No changes applied"
  }

  return {
    id: "chat_patch",
    run: run as (...args: unknown[]) => Promise<string>,
    tool: tool({
      description: `Apply a patch to create, update, or delete files.

FORMAT RULES:
- Start with: *** Begin Patch
- End with: *** End Patch
- Use *** Add File / *** Update File / *** Delete File
- Lines starting with "-" are REMOVED
- Lines starting with "+" are ADDED
- Lines starting with " " are CONTEXT
- @@ line is required for updates and must include a context line that exists in the target file

NEW FILE (all content lines MUST start with "+"):
*** Begin Patch
*** Add File: path/to/new.txt
+first line
+second line
*** End Patch

UPDATE (must include both "-" and "+" for replacements):
*** Begin Patch
*** Update File: path/to/file.txt
@@ exact existing line
-old line
+new line
*** End Patch

INSERT (use context + then "+" lines):
*** Begin Patch
*** Update File: path/to/file.txt
@@ exact existing line
 exact existing line
+inserted line
*** End Patch

DELETE FILE:
*** Begin Patch
*** Delete File: path/to/remove.txt
*** End Patch`,
      args: {
        patchText: tool.schema
          .string()
          .describe(
            "The patch text in the format shown above. Must include *** Begin Patch and *** End Patch markers.",
          ),
      },
      async execute(args) {
        return await run(args)
      },
    }),
  }
}
