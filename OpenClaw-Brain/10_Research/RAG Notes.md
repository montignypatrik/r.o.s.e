# RAG Notes

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
