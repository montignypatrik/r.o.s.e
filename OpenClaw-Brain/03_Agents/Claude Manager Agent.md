# Claude Manager Agent

## Purpose
Manages all interactions with Claude API through OpenClaw.

## Responsibilities
- Prompt construction
- Context management
- Response parsing
- Token optimization

## Current Implementation
Uses OpenClaw CLI:
```bash
openclaw infer model run --prompt "..." --model anthropic/claude-sonnet-4-6
```

## Context Window
- System prompt: [[Rose Personality]]
- Last 6 conversation turns
- Relevant memory from [[Rose Memory System]]

## Related
- [[Router Agent]]
- [[Claude]]
- [[Claude Code Prompts]]

---
## TODO
- [ ] Add streaming support
- [ ] Implement token counting
- [ ] Add response caching
