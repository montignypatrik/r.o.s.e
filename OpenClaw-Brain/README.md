# OpenClaw Brain

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
