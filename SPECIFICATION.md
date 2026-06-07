# R.O.S.E - Reasoning • Orchestration • Support • Engine

## Project Vision
An AI executive assistant inspired by Jarvis (Iron Man), built on OpenClaw, providing 24/7 intelligent support through multiple channels.

---

## Core Components

### 1. Foundation Layer
- **OpenClaw** - Multi-channel AI gateway
- **LLM Backend** - Claude/GPT/Local models
- **Memory System** - Persistent context & learning

### 2. Communication Channels
| Channel | Input | Output |
|---------|-------|--------|
| Web UI | Text, Voice | Text, Voice, Visual |
| Discord | Text, Voice | Text, Voice |

### 3. Voice System
- **STT (Speech-to-Text)**: Whisper / Deepgram / Azure
- **TTS (Text-to-Speech)**: ElevenLabs / Azure / Piper (local)
- **Wake Word**: Optional "Hey Rose" activation

### 4. Web Dashboard
- Real-time chat interface
- Activity monitor (what Rose is doing)
- Task queue visualization
- Settings & configuration
- Voice input/output controls

### 5. Discord Integration
- Text channel support
- Voice channel support (join, listen, speak)
- Slash commands
- DM support

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         R.O.S.E Core                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Web UI    │  │   Discord   │  │  Future:    │             │
│  │  Dashboard  │  │   Bot       │  │  Mobile/API │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    OpenClaw Gateway                         ││
│  │  • Message routing  • Channel abstraction  • Session mgmt  ││
│  └─────────────────────────────────────────────────────────────┘│
│                          │                                      │
│         ┌────────────────┼────────────────┐                     │
│         ▼                ▼                ▼                     │
│  ┌───────────┐    ┌───────────┐    ┌───────────┐               │
│  │  Voice    │    │   LLM     │    │  Memory   │               │
│  │  Engine   │    │  Backend  │    │  System   │               │
│  │ STT + TTS │    │ Claude/   │    │ AgentDB/  │               │
│  │           │    │ GPT/Local │    │ Vector    │               │
│  └───────────┘    └───────────┘    └───────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack (Proposed)

| Layer | Technology |
|-------|------------|
| **Foundation** | OpenClaw |
| **Runtime** | Node.js / Bun |
| **Web Framework** | Next.js / SvelteKit |
| **WebSocket** | Socket.io / native WS |
| **Discord** | discord.js / OpenClaw Discord channel |
| **Voice STT** | Whisper (local) / Deepgram (cloud) |
| **Voice TTS** | ElevenLabs / Piper (local) |
| **Database** | PostgreSQL + pgvector |
| **Memory** | AgentDB / ChromaDB |
| **VPS** | Any Linux VPS (Ubuntu recommended) |
| **Process Manager** | PM2 / systemd |
| **Reverse Proxy** | Nginx / Caddy |

---

## SPARC Phases

### Phase 1: Specification ✅
- [x] Define requirements
- [x] Choose tech stack
- [ ] Finalize voice provider selection
- [ ] Define Rose's personality/SOUL.md

### Phase 2: Pseudocode
- [ ] Message flow diagrams
- [ ] Voice pipeline design
- [ ] State management design
- [ ] API contracts

### Phase 3: Architecture
- [ ] OpenClaw configuration
- [ ] Service boundaries
- [ ] Database schema
- [ ] Deployment architecture

### Phase 4: Refinement
- [ ] TDD setup
- [ ] Security review
- [ ] Performance optimization
- [ ] Error handling

### Phase 5: Completion
- [ ] Integration testing
- [ ] Documentation
- [ ] VPS deployment
- [ ] Monitoring setup

---

## Questions to Resolve

1. **Voice Provider**: Cloud (ElevenLabs) vs Local (Piper)?
2. **LLM**: Claude API vs OpenRouter vs Local?
3. **Wake Word**: Enable "Hey Rose" activation?
4. **VPS Specs**: What are your VPS resources (RAM, CPU)?
5. **Domain**: Do you have a domain for the web UI?

---

## Next Steps
1. Answer questions above
2. Create SOUL.md (Rose's personality)
3. Set up OpenClaw foundation
4. Build web dashboard
5. Configure Discord bot
6. Integrate voice system
