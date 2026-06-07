# OpenClaw Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    CHANNELS                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │   Web   │  │ Discord │  │   API   │             │
│  └────┬────┘  └────┬────┘  └────┬────┘             │
└───────┼────────────┼────────────┼───────────────────┘
        │            │            │
        └────────────┼────────────┘
                     ▼
┌─────────────────────────────────────────────────────┐
│                 ROUTER AGENT                         │
│            [[Router Agent]]                          │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────────┐
│ Claude Agent │ │  Skills  │ │ Local Models │
│ [[Claude     │ │[[Skills  │ │ [[Model      │
│ Manager      │ │Registry]]│ │ Registry]]   │
│ Agent]]      │ │          │ │              │
└──────────────┘ └──────────┘ └──────────────┘
```

## Data Flow
1. User sends message via channel
2. Router analyzes intent
3. Routes to appropriate agent/skill
4. Response returned through channel

## Services
- **Rose Server** - Main Node.js application
- **TTS Server** - Text-to-speech (Edge TTS)
- **OpenClaw Gateway** - Model routing

## Deployment
- VPS: Ubuntu on 51.222.106.155
- Services managed via systemd
- See [[Start OpenClaw]] for startup procedures

## Related
- [[OpenClaw Overview]]
- [[Router Agent]]

---
## TODO
- [ ] Add database layer
- [ ] Document message queue
- [ ] Add monitoring layer
