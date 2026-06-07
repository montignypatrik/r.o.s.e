# Claude

## Overview
Anthropic's Claude - Primary cloud AI model for Rose.

## Models Used
- **claude-sonnet-4-6**: Fast, capable (default)
- **claude-opus-4-5**: Most capable (complex tasks)

## Integration
Via OpenClaw CLI:
```bash
openclaw infer model run --prompt "..." --model anthropic/claude-sonnet-4-6
```

## Use Cases
- General conversation
- Complex reasoning
- Code review
- Research

## Related
- [[Claude Manager Agent]]
- [[Model Registry]]
- [[Claude Code Prompts]]

---
## TODO
- [ ] Document token limits
- [ ] Add cost tracking
- [ ] Define model selection rules
