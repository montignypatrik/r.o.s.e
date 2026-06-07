# Skills Registry

## Overview
Skills are modular capabilities that can be invoked by agents.

## Available Skills

| Skill | Status | Description |
|-------|--------|-------------|
| [[RunPod Skill]] | Active | Manage RunPod GPU sessions |
| [[Coding Skill]] | Planned | Code generation and review |
| TTS Skill | Active | Text-to-speech conversion |
| Search Skill | Planned | Web search integration |

## Skill Interface
```javascript
{
  name: "skill-name",
  description: "What this skill does",
  parameters: [...],
  execute: async (params) => result
}
```

## Adding New Skills
See [[Skill Template]] for the standard format.

## Related
- [[Router Agent]]
- [[Architecture]]

---
## TODO
- [ ] Implement skill discovery
- [ ] Add skill validation
- [ ] Document skill API
