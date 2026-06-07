# Model Registry

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
