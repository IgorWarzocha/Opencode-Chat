# Opencode Chatifier

Transform your OpenCode experience into a conversational coding assistant with semantic code search.

## What You Get

- **Smarter Conversations** - Two specialized chat agents optimized for natural interaction
- **Semantic Code Search** - Find code by meaning, not just keywords. Ask "where is the authentication logic?" and get relevant results
- **Task Tracking** - Built-in todo management that persists across sessions
- **Memory** - The assistant remembers important context you tell it

## Quick Start

### 1. Install

```bash
npm install opencode-chat
```

### 2. Configure

Add to your OpenCode config file (`~/.config/opencode/config.ts` or `.opencode/config.ts`):

```typescript
import { ChatifierPlugin } from "opencode-chat"

export default {
  plugins: [ChatifierPlugin],
}
```

### 3. Launch OpenCode

The plugin automatically:

- Downloads the embedding model on first run (~90MB, cached locally)
- Indexes your codebase for semantic search (incremental updates on subsequent runs)

## Chat Agents

After installing, you'll have two new agents available:

| Agent         | Best For                                                         |
| ------------- | ---------------------------------------------------------------- |
| **Just Chat** | Quick questions, web research, general conversation              |
| **Tool Chat** | Coding tasks, file editing, semantic search, full toolkit access |

## Semantic Search

Ask natural language questions about your codebase:

- "Where is the user authentication handled?"
- "Find the database connection setup"
- "Show me the API error handling"

The plugin indexes your code locally and searches by meaning, not just text matching.

## Large Codebases

For projects with 100+ files, run the indexer manually before first use:

```bash
npx opencode-chat semantic-index
```

This ensures the full codebase is indexed without blocking startup.

## Requirements

- [OpenCode](https://github.com/sst/opencode) v1.0.201+

## License

MIT
