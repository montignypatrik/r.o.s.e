# Obsidian Graph Integration

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
