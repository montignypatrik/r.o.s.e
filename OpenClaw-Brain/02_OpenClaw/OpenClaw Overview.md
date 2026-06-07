# OpenClaw Overview

## What is OpenClaw?
OpenClaw is a multi-channel AI gateway that orchestrates AI capabilities across different interfaces.

## Core Features
- Multi-model support (Claude, local models)
- Channel management (web, Discord, API)
- Skill system for extensibility
- Agent orchestration

## Architecture
```
User -> Channels -> Router -> Agents -> Models/Skills
```

See [[Architecture]] for detailed diagrams.

## Key Components
- [[Router Agent]] - Routes requests to appropriate handlers
- [[Claude Manager Agent]] - Manages Claude API interactions
- [[Skills Registry]] - Available capabilities
- [[Model Registry]] - Available AI models

## Related
- [[Rose Overview]]
- [[Roadmap]]

---
## TODO
- [ ] Document API endpoints
- [ ] Add configuration guide
- [ ] Define scaling strategy
