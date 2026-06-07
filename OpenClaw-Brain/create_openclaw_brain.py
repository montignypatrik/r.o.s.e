#!/usr/bin/env python3
"""
OpenClaw Brain - Obsidian Vault Generator
Creates the folder structure and starter markdown files for the OpenClaw second-brain.
Works on Windows, macOS, and Linux.

Usage:
    python create_openclaw_brain.py           # Create files (skip existing)
    python create_openclaw_brain.py --force   # Overwrite existing files
"""

import os
import sys
from pathlib import Path

# =============================================================================
# CONFIGURATION
# =============================================================================

VAULT_STRUCTURE = {
    "01_Rose": {
        "Rose Overview.md": """# Rose Overview

> R.O.S.E - Reasoning • Orchestration • Support • Engine

Rose is an AI executive assistant inspired by Jarvis from Iron Man.

## Core Identity
- **Name**: Rose
- **Role**: AI Executive Assistant
- **Personality**: Professional, warm, intelligent, loyal, discreet, occasionally witty

## Key Components
- [[Rose Personality]] - Character and behavior guidelines
- [[Rose Memory System]] - How Rose remembers context
- [[Rose Dashboard]] - The visual brain interface

## Architecture
Rose operates through multiple channels:
- Web Dashboard (primary interface)
- Discord (text and voice)
- API endpoints

## Related
- [[OpenClaw Overview]]
- [[Architecture]]

---
## TODO
- [ ] Define core capabilities
- [ ] Document voice settings
- [ ] Add integration points
""",
        "Rose Personality.md": """# Rose Personality

## Character Traits
- **Professional**: Always maintains composure and clarity
- **Warm**: Genuinely cares about helping
- **Intelligent**: Thinks before responding
- **Loyal**: Prioritizes user's needs
- **Discreet**: Respects privacy
- **Witty**: Occasional subtle humor

## Communication Style
- Address user as "Sir" unless told otherwise
- Be concise but thorough
- Use clear, direct language
- Avoid unnecessary jargon

## Voice Settings
- **TTS Voice**: Microsoft Edge TTS - AriaNeural
- **Tone**: Confident, professional
- **Pacing**: Measured, not rushed

## Inspiration
Think Jarvis from Iron Man - efficient, capable, subtly charming.

## Related
- [[Rose Overview]]
- [[Rose Memory System]]

---
## TODO
- [ ] Add more personality examples
- [ ] Define response templates
- [ ] Document tone variations
""",
        "Rose Memory System.md": """# Rose Memory System

## Overview
Rose needs to remember context across conversations and sessions.

## Memory Layers

### Short-term Memory
- Current conversation context
- Last 6 message exchanges
- Stored in-memory per session

### Long-term Memory
- Important user preferences
- Past decisions and outcomes
- Stored in Obsidian vault / database

### Knowledge Base
- [[OpenClaw Overview]] documentation
- [[Skills Registry]] capabilities
- [[Model Registry]] available models

## Obsidian Integration
The OpenClaw-Brain vault serves as Rose's long-term memory:
- Notes become searchable knowledge
- Links create associative memory
- Graph view shows connections

## Future: RAG Integration
- Index markdown files
- Embed for semantic search
- Retrieve relevant context per query

## Related
- [[Rose Overview]]
- [[RAG Notes]]
- [[Obsidian Graph Integration]]

---
## TODO
- [ ] Implement memory persistence
- [ ] Add RAG pipeline
- [ ] Define memory retention rules
""",
        "Rose Dashboard.md": """# Rose Dashboard

## Overview
The dashboard is Rose's visual brain - a futuristic interface showing her neural activity.

## Design Principles
- Dark, futuristic aesthetic
- Golden/orange glowing neural sphere
- Clean and practical
- Not cluttered

## Components
1. **Rose Brain Graph** - Animated neural visualization
2. **Chat Panel** - Collapsible conversation interface
3. **Node System** - Obsidian notes as brain nodes

## Visual Elements
- Glowing golden sphere at center
- Orbiting particles
- Node connections as energy trails
- Category groupings (Rose, Agents, Skills, etc.)

## Technical Stack
- Vanilla JavaScript (no framework)
- Canvas/CSS animations
- WebSocket for real-time chat

## Related
- [[Rose Overview]]
- [[Architecture]]
- [[Obsidian Graph Integration]]

---
## TODO
- [ ] Implement brain visualization
- [ ] Add node click interactions
- [ ] Connect to Obsidian parser
"""
    },

    "02_OpenClaw": {
        "OpenClaw Overview.md": """# OpenClaw Overview

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
""",
        "Architecture.md": """# OpenClaw Architecture

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
""",
        "Roadmap.md": """# OpenClaw Roadmap

## Phase 1: Foundation ✅
- [x] Basic web dashboard
- [x] Claude integration via OpenClaw CLI
- [x] Text-to-speech (Edge TTS)
- [x] Real-time WebSocket chat

## Phase 2: Intelligence (Current)
- [ ] Obsidian brain integration
- [ ] Rose Brain visualization
- [ ] Memory system
- [ ] Context persistence

## Phase 3: Expansion
- [ ] Discord integration
- [ ] Voice input (STT)
- [ ] Wake word detection
- [ ] Multi-agent orchestration

## Phase 4: Autonomy
- [ ] Task management
- [ ] Calendar integration
- [ ] Proactive notifications
- [ ] Learning from feedback

## Phase 5: Scale
- [ ] Mobile app
- [ ] Smart home integration
- [ ] Custom voice cloning (GPU)
- [ ] Self-improvement loops

## Related
- [[OpenClaw Overview]]
- [[Future Features]]
- [[Automation Ideas]]

---
## TODO
- [ ] Add timeline estimates
- [ ] Define success metrics
- [ ] Prioritize features
"""
    },

    "03_Agents": {
        "Router Agent.md": """# Router Agent

## Purpose
The Router Agent analyzes incoming requests and routes them to the appropriate handler.

## Responsibilities
- Intent classification
- Agent selection
- Request transformation
- Response aggregation

## Routing Logic
```
IF request requires Claude -> [[Claude Manager Agent]]
IF request requires code -> [[Local Coding Agent]]
IF request requires research -> [[Research Agent]]
IF request matches skill -> [[Skills Registry]]
```

## Configuration
- Model: Claude (for intent analysis)
- Fallback: Direct to Claude Manager

## Related
- [[Architecture]]
- [[Claude Manager Agent]]

---
## TODO
- [ ] Implement intent classifier
- [ ] Add routing rules
- [ ] Define fallback behavior
""",
        "Claude Manager Agent.md": """# Claude Manager Agent

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
""",
        "Local Coding Agent.md": """# Local Coding Agent

## Purpose
Handles code-related tasks using local models on RunPod.

## Responsibilities
- Code generation
- Code review
- Debugging assistance
- Refactoring suggestions

## Models
- [[Qwen Coder]] - Primary coding model
- [[DeepSeek Coder]] - Alternative

## RunPod Integration
See [[RunPod Overview]] for setup details.

## Related
- [[Router Agent]]
- [[Coding Skill]]
- [[RunPod Overview]]

---
## TODO
- [ ] Define code task routing
- [ ] Add model selection logic
- [ ] Implement code execution sandbox
""",
        "Research Agent.md": """# Research Agent

## Purpose
Handles research and information gathering tasks.

## Responsibilities
- Web search
- Document analysis
- Summarization
- Fact verification

## Capabilities
- Search integration
- RAG over knowledge base
- Citation tracking

## Related
- [[Router Agent]]
- [[RAG Notes]]
- [[Research]]

---
## TODO
- [ ] Add search API integration
- [ ] Implement RAG pipeline
- [ ] Add source tracking
"""
    },

    "04_Skills": {
        "Skills Registry.md": """# Skills Registry

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
""",
        "RunPod Skill.md": """# RunPod Skill

## Purpose
Manage GPU sessions on RunPod for running local AI models.

## Capabilities
- Start/stop GPU pods
- Deploy models
- Execute inference
- Manage environment

## Configuration
See [[Environment Variables]] for required settings.

## Usage
```
Start a coding session on RunPod with Qwen Coder
```

## Related
- [[RunPod Overview]]
- [[Start RunPod Session]]
- [[Skills Registry]]

---
## TODO
- [ ] Add pod templates
- [ ] Implement auto-scaling
- [ ] Add cost monitoring
""",
        "Coding Skill.md": """# Coding Skill

## Purpose
Provide code generation and assistance capabilities.

## Capabilities
- Generate code from description
- Review and improve code
- Debug errors
- Refactor suggestions

## Models Used
- [[Qwen Coder]] for generation
- [[Claude]] for review

## Related
- [[Local Coding Agent]]
- [[Skills Registry]]
- [[Debugging Prompts]]

---
## TODO
- [ ] Define code templates
- [ ] Add language support matrix
- [ ] Implement test generation
"""
    },

    "05_RunPod": {
        "RunPod Overview.md": """# RunPod Overview

## What is RunPod?
RunPod provides on-demand GPU instances for running AI models.

## Why RunPod?
See [[Why RunPod]] for the decision rationale.

## Quick Start
1. [[Start RunPod Session]]
2. [[SSH Connection]]
3. [[Deploy Coding Model]]

## Environment Setup
See [[Environment Variables]] for configuration.

## Related
- [[RunPod Skill]]
- [[Local Coding Agent]]
- [[Model Registry]]

---
## TODO
- [ ] Add pod templates
- [ ] Document GPU options
- [ ] Add cost estimates
""",
        "Start RunPod Session.md": """# Start RunPod Session

## Prerequisites
- RunPod account
- API key configured
- SSH key uploaded

## Steps

### 1. Select Pod Template
Choose based on model requirements:
- RTX 3090 (24GB) - Most coding models
- RTX 4090 (24GB) - Faster inference
- A100 (40GB) - Large models

### 2. Start Pod
```bash
# Via RunPod CLI or web interface
runpod start --template coding-pod
```

### 3. Connect
See [[SSH Connection]] for connection details.

### 4. Deploy Model
See [[Deploy Coding Model]].

## Related
- [[RunPod Overview]]
- [[SSH Connection]]
- [[Environment Variables]]

---
## TODO
- [ ] Add automation script
- [ ] Document startup time
- [ ] Add health checks
""",
        "Environment Variables.md": """# Environment Variables

## RunPod Variables

```env
RUNPOD_API_KEY=your_api_key
RUNPOD_POD_ID=your_pod_id
RUNPOD_SSH_KEY=/path/to/key
```

## OpenClaw Variables

```env
ANTHROPIC_API_KEY=your_claude_key
OPENCLAW_TOKEN=your_token
```

## Rose Variables

```env
WEB_PORT=3000
TTS_PORT=5050
DISCORD_TOKEN=your_discord_token
```

## Security Notes
- Never commit .env files
- Use secrets manager in production
- Rotate keys regularly

## Related
- [[RunPod Overview]]
- [[Start OpenClaw]]

---
## TODO
- [ ] Add validation script
- [ ] Document all variables
- [ ] Add example .env.example
""",
        "SSH Connection.md": """# SSH Connection

## Connect to RunPod

```bash
ssh root@<pod-ip> -p <port> -i ~/.ssh/runpod_key
```

## Common Commands

```bash
# Check GPU
nvidia-smi

# Start model server
python -m vllm.entrypoints.openai.api_server \\
    --model Qwen/Qwen2.5-Coder-32B-Instruct \\
    --port 8000
```

## Troubleshooting
See [[Troubleshooting]] for common issues.

## Related
- [[RunPod Overview]]
- [[Start RunPod Session]]

---
## TODO
- [ ] Add connection script
- [ ] Document port forwarding
- [ ] Add tmux setup
"""
    },

    "06_Models": {
        "Model Registry.md": """# Model Registry

## Available Models

### Cloud Models
| Model | Provider | Use Case |
|-------|----------|----------|
| [[Claude]] | Anthropic | General, reasoning |
| GPT-4 | OpenAI | Alternative |

### Local Models
| Model | Size | Use Case |
|-------|------|----------|
| [[Qwen Coder]] | 32B | Code generation |
| [[DeepSeek Coder]] | 33B | Code generation |

## Model Selection Logic
```
IF task == "coding" AND gpu_available:
    use [[Qwen Coder]]
ELSE:
    use [[Claude]]
```

## Related
- [[Architecture]]
- [[Local Coding Agent]]

---
## TODO
- [ ] Add model benchmarks
- [ ] Document context lengths
- [ ] Add cost comparison
""",
        "Qwen Coder.md": """# Qwen Coder

## Overview
Qwen2.5-Coder-32B-Instruct - Alibaba's coding-focused LLM.

## Specifications
- **Parameters**: 32B
- **Context**: 32K tokens
- **Strengths**: Code generation, debugging

## Deployment
```bash
# On RunPod
python -m vllm.entrypoints.openai.api_server \\
    --model Qwen/Qwen2.5-Coder-32B-Instruct \\
    --tensor-parallel-size 1 \\
    --port 8000
```

## Requirements
- GPU: 24GB+ VRAM
- See [[RunPod Overview]]

## Related
- [[Model Registry]]
- [[Local Coding Agent]]
- [[Deploy Coding Model]]

---
## TODO
- [ ] Add benchmark results
- [ ] Document fine-tuning
- [ ] Add example prompts
""",
        "DeepSeek Coder.md": """# DeepSeek Coder

## Overview
DeepSeek-Coder-33B-Instruct - Alternative coding model.

## Specifications
- **Parameters**: 33B
- **Context**: 16K tokens
- **Strengths**: Code completion, explanation

## When to Use
- Alternative to Qwen when needed
- Good for code explanation
- Strong at debugging

## Related
- [[Model Registry]]
- [[Qwen Coder]]

---
## TODO
- [ ] Add deployment guide
- [ ] Compare with Qwen
- [ ] Document best practices
""",
        "Claude.md": """# Claude

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
"""
    },

    "07_Prompts": {
        "Prompt Library.md": """# Prompt Library

## Overview
Collection of tested prompts for various tasks.

## Categories
- [[Claude Code Prompts]] - Development assistance
- [[Debugging Prompts]] - Error resolution
- System prompts - Agent personalities

## Prompt Design Principles
1. Be specific and clear
2. Provide context
3. Define expected format
4. Include examples when helpful

## Related
- [[Rose Personality]]
- [[Claude Manager Agent]]

---
## TODO
- [ ] Add more prompt templates
- [ ] Document success rates
- [ ] Add A/B testing results
""",
        "Claude Code Prompts.md": """# Claude Code Prompts

## Code Generation

```
Write a [language] function that [description].
Requirements:
- [requirement 1]
- [requirement 2]
Include error handling and comments.
```

## Code Review

```
Review this code for:
- Bugs and errors
- Security issues
- Performance improvements
- Code style

[code]
```

## Debugging

```
This code produces [error/unexpected behavior]:

[code]

Expected: [expected]
Actual: [actual]

Help me fix it.
```

## Related
- [[Prompt Library]]
- [[Debugging Prompts]]
- [[Claude]]

---
## TODO
- [ ] Add more templates
- [ ] Test effectiveness
- [ ] Add language-specific prompts
""",
        "Debugging Prompts.md": """# Debugging Prompts

## Error Analysis

```
I'm getting this error:

[error message]

In this code:

[code]

What's causing it and how do I fix it?
```

## Step-by-Step Debug

```
Help me debug this issue step by step:

Problem: [description]
Code: [code]
What I've tried: [attempts]

Walk me through the debugging process.
```

## Log Analysis

```
Analyze these logs and identify the issue:

[logs]

What went wrong and when?
```

## Related
- [[Prompt Library]]
- [[Claude Code Prompts]]
- [[Troubleshooting]]

---
## TODO
- [ ] Add more debug patterns
- [ ] Document common errors
- [ ] Add resolution templates
"""
    },

    "08_Decisions": {
        "Decision Log.md": """# Decision Log

## Overview
Record of significant technical and architectural decisions.

## Recent Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024-01 | [[Why RunPod]] | GPU access for local models |
| 2024-01 | [[Why Obsidian]] | Second-brain for Rose |
| 2024-01 | Edge TTS | Fast, free, good quality |

## Decision Template
See [[Decision Template]] for the standard format.

## Related
- [[Architecture]]
- [[Roadmap]]

---
## TODO
- [ ] Add more decisions
- [ ] Review past decisions
- [ ] Document outcomes
""",
        "Why RunPod.md": """# Why RunPod

## Decision
Use RunPod for GPU compute instead of local hardware or other cloud providers.

## Context
Need GPU access for running local coding models (Qwen, DeepSeek).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Local GPU | No ongoing cost | High upfront, always on |
| AWS/GCP | Enterprise grade | Expensive, complex |
| RunPod | Pay per use, simple | Smaller provider |
| Vast.ai | Cheapest | Less reliable |

## Decision Rationale
- Pay only when using
- Simple interface
- Good GPU availability
- Reasonable pricing

## Outcome
Working well for coding model deployment.

## Related
- [[RunPod Overview]]
- [[Decision Log]]

---
## TODO
- [ ] Track costs
- [ ] Evaluate alternatives quarterly
""",
        "Why Obsidian.md": """# Why Obsidian

## Decision
Use Obsidian as Rose's second-brain and knowledge management system.

## Context
Rose needs persistent memory and knowledge organization.

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Obsidian | Local, markdown, graph | Manual sync |
| Notion | Cloud, collaborative | API limits |
| Custom DB | Full control | Build effort |
| Vector DB | Semantic search | No UI |

## Decision Rationale
- Markdown files are portable
- Graph view shows connections
- Local-first (privacy)
- Can integrate with RAG later
- Great for human + AI use

## Outcome
Creating OpenClaw-Brain vault for Rose's memory.

## Related
- [[Rose Memory System]]
- [[Obsidian Graph Integration]]
- [[Decision Log]]

---
## TODO
- [ ] Build Obsidian parser
- [ ] Implement RAG integration
"""
    },

    "09_Runbooks": {
        "Start OpenClaw.md": """# Start OpenClaw

## Overview
Steps to start the OpenClaw/Rose system.

## Prerequisites
- VPS access (ubuntu@51.222.106.155)
- Services configured

## Steps

### 1. SSH to VPS
```bash
ssh ubuntu@51.222.106.155
```

### 2. Check Services
```bash
sudo systemctl status rose
sudo systemctl status rose-tts
sudo systemctl status openclaw
```

### 3. Start if Needed
```bash
sudo systemctl start rose
sudo systemctl start rose-tts
sudo systemctl start openclaw
```

### 4. Verify
- Dashboard: http://51.222.106.155:3000
- Health check: http://51.222.106.155:3000/health

## Troubleshooting
See [[Troubleshooting]] for common issues.

## Related
- [[Architecture]]
- [[Environment Variables]]

---
## TODO
- [ ] Add monitoring alerts
- [ ] Create startup script
""",
        "Deploy Coding Model.md": """# Deploy Coding Model

## Overview
Deploy a coding model on RunPod.

## Prerequisites
- RunPod session running (see [[Start RunPod Session]])
- SSH connected (see [[SSH Connection]])

## Steps

### 1. Install vLLM
```bash
pip install vllm
```

### 2. Download Model
```bash
huggingface-cli download Qwen/Qwen2.5-Coder-32B-Instruct
```

### 3. Start Server
```bash
python -m vllm.entrypoints.openai.api_server \\
    --model Qwen/Qwen2.5-Coder-32B-Instruct \\
    --tensor-parallel-size 1 \\
    --port 8000 \\
    --host 0.0.0.0
```

### 4. Test
```bash
curl http://localhost:8000/v1/models
```

## Related
- [[Qwen Coder]]
- [[RunPod Overview]]

---
## TODO
- [ ] Add deployment script
- [ ] Document GPU requirements
""",
        "Update RunPod Variables.md": """# Update RunPod Variables

## Overview
How to update RunPod environment variables.

## Steps

### 1. Access Pod Settings
- Go to RunPod dashboard
- Select your pod
- Click "Edit"

### 2. Update Variables
Add or modify in Environment Variables section:
```
HUGGING_FACE_TOKEN=your_token
MODEL_NAME=Qwen/Qwen2.5-Coder-32B-Instruct
```

### 3. Restart Pod
Apply changes by restarting.

## Related
- [[Environment Variables]]
- [[RunPod Overview]]

---
## TODO
- [ ] Add variable validation
- [ ] Document all variables
""",
        "Troubleshooting.md": """# Troubleshooting

## Common Issues

### Rose Not Responding
```bash
# Check service status
sudo systemctl status rose

# Check logs
sudo journalctl -u rose -n 50

# Restart
sudo systemctl restart rose
```

### TTS Not Working
```bash
# Check TTS service
sudo systemctl status rose-tts

# Test TTS directly
curl -X POST http://localhost:5050/synthesize \\
    -H "Content-Type: application/json" \\
    -d '{"text": "Hello"}'
```

### OpenClaw Errors
```bash
# Check openclaw service
sudo systemctl status openclaw

# Test manually
openclaw infer model run --prompt "test" --model anthropic/claude-sonnet-4-6
```

### RunPod Connection Issues
- Check pod is running
- Verify SSH key
- Check firewall rules

## Related
- [[Start OpenClaw]]
- [[SSH Connection]]

---
## TODO
- [ ] Add more error patterns
- [ ] Create diagnostic script
"""
    },

    "10_Research": {
        "RAG Notes.md": """# RAG Notes

## Overview
Retrieval-Augmented Generation for Rose's memory.

## Architecture
```
Query -> Embed -> Search Vector DB -> Retrieve Context -> Generate Response
```

## Components Needed
1. **Embedding Model**: Convert text to vectors
2. **Vector Store**: Store and search embeddings
3. **Retriever**: Find relevant documents
4. **Generator**: Claude with context

## Options

| Component | Options |
|-----------|---------|
| Embeddings | OpenAI, Cohere, local |
| Vector DB | Pinecone, Chroma, Qdrant |
| Framework | LangChain, LlamaIndex |

## Integration with Obsidian
- Parse markdown files
- Extract content and links
- Embed and index
- Query on user request

## Related
- [[Rose Memory System]]
- [[Obsidian Graph Integration]]

---
## TODO
- [ ] Choose stack
- [ ] Implement prototype
- [ ] Benchmark retrieval
""",
        "MCP Notes.md": """# MCP Notes

## Overview
Model Context Protocol - Standard for AI tool use.

## Key Concepts
- Tools: Functions AI can call
- Resources: Data AI can access
- Prompts: Templates for interactions

## Current Usage
- Claude Code uses MCP
- OpenClaw can expose MCP servers

## Potential Integration
- Expose Obsidian as MCP resource
- Create skills as MCP tools
- Enable cross-tool communication

## Related
- [[Architecture]]
- [[Skills Registry]]

---
## TODO
- [ ] Document MCP servers
- [ ] Create custom tools
- [ ] Test integrations
""",
        "Agent Architecture.md": """# Agent Architecture

## Overview
How agents work together in OpenClaw.

## Agent Types

### Router Agent
- Entry point for all requests
- Intent classification
- Agent selection

### Specialist Agents
- [[Claude Manager Agent]] - Cloud AI
- [[Local Coding Agent]] - Local models
- [[Research Agent]] - Information gathering

## Communication
Agents communicate through:
- Direct function calls
- Message passing
- Shared context

## Future: Multi-Agent
- Parallel execution
- Agent collaboration
- Task decomposition

## Related
- [[Architecture]]
- [[Router Agent]]

---
## TODO
- [ ] Define agent protocol
- [ ] Implement orchestrator
- [ ] Add agent monitoring
""",
        "Obsidian Graph Integration.md": """# Obsidian Graph Integration

## Overview
Using Obsidian's graph as Rose's brain visualization.

## Data Extraction
1. Parse markdown files
2. Extract wiki links [[like this]]
3. Build node/edge graph
4. Export as JSON

## Graph Structure
```json
{
    "nodes": [
        {"id": "Rose Overview", "category": "Rose"},
        {"id": "Architecture", "category": "OpenClaw"}
    ],
    "edges": [
        {"source": "Rose Overview", "target": "Architecture"}
    ]
}
```

## Visualization
- D3.js force-directed graph
- Canvas-based animation
- Golden glowing nodes
- Energy trail connections

## Real-time Updates
- Watch file changes
- Update graph dynamically
- Reflect in dashboard

## Related
- [[Rose Dashboard]]
- [[Rose Memory System]]
- [[RAG Notes]]

---
## TODO
- [ ] Build markdown parser
- [ ] Create graph exporter
- [ ] Connect to dashboard
"""
    },

    "11_Ideas": {
        "Future Features.md": """# Future Features

## High Priority
- [ ] Discord voice integration
- [ ] Wake word ("Hey Rose")
- [ ] Persistent memory
- [ ] Mobile notifications

## Medium Priority
- [ ] Calendar integration
- [ ] Task management
- [ ] Smart home control
- [ ] Email summarization

## Low Priority
- [ ] Custom voice cloning
- [ ] Video understanding
- [ ] Multi-user support
- [ ] Plugin system

## Moonshots
- [ ] Autonomous task execution
- [ ] Self-improvement loops
- [ ] Physical robot integration

## Related
- [[Roadmap]]
- [[Automation Ideas]]

---
## TODO
- [ ] Prioritize quarterly
- [ ] Add effort estimates
- [ ] Track progress
""",
        "Automation Ideas.md": """# Automation Ideas

## Daily Automations
- Morning briefing
- Calendar summary
- Priority task list
- Weather + commute

## Development Automations
- PR review notifications
- Build status updates
- Error alert summaries
- Dependency updates

## Personal Automations
- Expense tracking
- Reading list management
- Learning reminders
- Health tracking

## Home Automations
- Smart home routines
- Energy monitoring
- Security alerts
- Guest notifications

## Related
- [[Future Features]]
- [[Roadmap]]

---
## TODO
- [ ] Prioritize automations
- [ ] Design triggers
- [ ] Plan implementations
"""
    },

    "_templates": {
        "Agent Template.md": """# {{Agent Name}}

## Purpose
{{Brief description of what this agent does}}

## Responsibilities
- {{Responsibility 1}}
- {{Responsibility 2}}
- {{Responsibility 3}}

## Inputs
- {{Input type and source}}

## Outputs
- {{Output type and destination}}

## Dependencies
- [[{{Related Agent}}]]
- [[{{Related Skill}}]]

## Configuration
```yaml
name: {{agent-name}}
model: {{model}}
temperature: {{0.0-1.0}}
```

## Related
- [[Router Agent]]
- [[Architecture]]

---
## TODO
- [ ] Implement agent
- [ ] Add tests
- [ ] Document API
""",
        "Skill Template.md": """# {{Skill Name}}

## Purpose
{{Brief description of what this skill does}}

## Capabilities
- {{Capability 1}}
- {{Capability 2}}

## Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| {{param}} | {{type}} | {{yes/no}} | {{description}} |

## Returns
{{Description of return value}}

## Example
```
{{Example usage}}
```

## Related
- [[Skills Registry]]
- [[{{Related Agent}}]]

---
## TODO
- [ ] Implement skill
- [ ] Add validation
- [ ] Write tests
""",
        "Decision Template.md": """# {{Decision Title}}

## Decision
{{One sentence summary of the decision}}

## Context
{{Why was this decision needed?}}

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| {{Option 1}} | {{pros}} | {{cons}} |
| {{Option 2}} | {{pros}} | {{cons}} |

## Decision Rationale
{{Why was this option chosen?}}

## Consequences
- {{Consequence 1}}
- {{Consequence 2}}

## Related
- [[Decision Log]]
- [[{{Related Topic}}]]

---
## Review Date: {{date}}
""",
        "Runbook Template.md": """# {{Runbook Title}}

## Overview
{{Brief description of what this runbook accomplishes}}

## Prerequisites
- {{Prerequisite 1}}
- {{Prerequisite 2}}

## Steps

### 1. {{Step Title}}
```bash
{{command}}
```
{{Explanation}}

### 2. {{Step Title}}
```bash
{{command}}
```
{{Explanation}}

## Verification
{{How to verify success}}

## Rollback
{{Steps to undo if needed}}

## Troubleshooting
{{Common issues and solutions}}

## Related
- [[{{Related Runbook}}]]
- [[Troubleshooting]]

---
## Last Updated: {{date}}
""",
        "Model Template.md": """# {{Model Name}}

## Overview
{{Brief description of the model}}

## Specifications
- **Provider**: {{provider}}
- **Parameters**: {{size}}
- **Context Length**: {{tokens}}
- **Strengths**: {{strengths}}

## Deployment
```bash
{{deployment command}}
```

## Requirements
- {{Requirement 1}}
- {{Requirement 2}}

## Use Cases
- {{Use case 1}}
- {{Use case 2}}

## Prompting Tips
{{Best practices for this model}}

## Related
- [[Model Registry]]
- [[{{Related Agent}}]]

---
## TODO
- [ ] Add benchmarks
- [ ] Document quirks
"""
    }
}

# Root README
README_CONTENT = """# OpenClaw Brain

> Rose's Second Brain - Knowledge Management for the AI Executive Assistant

## Overview

This Obsidian vault serves as the long-term memory and knowledge base for Rose,
the AI executive assistant powered by OpenClaw.

## Structure

```
OpenClaw-Brain/
├── 01_Rose/          # Rose's identity and capabilities
├── 02_OpenClaw/      # System architecture and roadmap
├── 03_Agents/        # AI agent documentation
├── 04_Skills/        # Modular skill definitions
├── 05_RunPod/        # GPU deployment guides
├── 06_Models/        # AI model registry
├── 07_Prompts/       # Prompt templates and library
├── 08_Decisions/     # Architectural decision records
├── 09_Runbooks/      # Operational procedures
├── 10_Research/      # Research notes and exploration
├── 11_Ideas/         # Future features and ideas
└── _templates/       # Templates for new notes
```

## How to Use

1. **Open in Obsidian**: Open this folder as an Obsidian vault
2. **Navigate**: Use links like [[Rose Overview]] to navigate
3. **Graph View**: Press Ctrl/Cmd+G to see connections
4. **Search**: Press Ctrl/Cmd+O to quick-open notes

## Integration with Rose

### Current: Manual Reference
Rose's developers reference this vault for documentation.

### Future: Automated Memory
- RAG integration to query vault content
- Graph data exported to Rose Dashboard
- Auto-updating from Rose's learnings

## Regenerating Structure

If you need to recreate the folder structure:

```bash
python create_openclaw_brain.py          # Safe mode (skip existing)
python create_openclaw_brain.py --force  # Overwrite all
```

## Contributing

1. Follow the templates in `_templates/`
2. Use wiki links `[[Like This]]` for connections
3. Add TODO items for tracking
4. Keep notes focused and modular

---

*Created for the R.O.S.E project - Reasoning • Orchestration • Support • Engine*
"""

# =============================================================================
# SCRIPT LOGIC
# =============================================================================

def create_vault(base_path: Path, force: bool = False):
    """Create the OpenClaw Brain vault structure."""

    print(f"\n{'='*60}")
    print("  OpenClaw Brain - Obsidian Vault Generator")
    print(f"{'='*60}")
    print(f"\nBase path: {base_path}")
    print(f"Force overwrite: {force}\n")

    created_folders = 0
    created_files = 0
    skipped_files = 0

    # Create base directory
    if not base_path.exists():
        base_path.mkdir(parents=True)
        print(f"[FOLDER] Created: {base_path}")
        created_folders += 1

    # Create README
    readme_path = base_path / "README.md"
    if not readme_path.exists() or force:
        readme_path.write_text(README_CONTENT, encoding='utf-8')
        print(f"[FILE]   Created: README.md")
        created_files += 1
    else:
        print(f"[SKIP]   Exists:  README.md")
        skipped_files += 1

    # Create folder structure and files
    for folder_name, files in VAULT_STRUCTURE.items():
        folder_path = base_path / folder_name

        # Create folder
        if not folder_path.exists():
            folder_path.mkdir(parents=True)
            print(f"[FOLDER] Created: {folder_name}/")
            created_folders += 1

        # Create files
        for file_name, content in files.items():
            file_path = folder_path / file_name

            if not file_path.exists() or force:
                file_path.write_text(content, encoding='utf-8')
                print(f"[FILE]   Created: {folder_name}/{file_name}")
                created_files += 1
            else:
                print(f"[SKIP]   Exists:  {folder_name}/{file_name}")
                skipped_files += 1

    # Summary
    print(f"\n{'='*60}")
    print("  Summary")
    print(f"{'='*60}")
    print(f"  Folders created: {created_folders}")
    print(f"  Files created:   {created_files}")
    print(f"  Files skipped:   {skipped_files}")
    print(f"{'='*60}\n")

    if skipped_files > 0 and not force:
        print("Tip: Use --force to overwrite existing files\n")

    print("Done! Open this folder in Obsidian to start using your vault.\n")


def main():
    # Parse arguments
    force = "--force" in sys.argv

    # Get script directory as base
    script_dir = Path(__file__).parent.resolve()

    # Create vault
    create_vault(script_dir, force)


if __name__ == "__main__":
    main()
