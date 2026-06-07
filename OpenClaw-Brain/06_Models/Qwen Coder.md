# Qwen Coder

## Overview
Qwen2.5-Coder-32B-Instruct - Alibaba's coding-focused LLM.

## Specifications
- **Parameters**: 32B
- **Context**: 32K tokens
- **Strengths**: Code generation, debugging

## Deployment
```bash
# On RunPod
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-Coder-32B-Instruct \
    --tensor-parallel-size 1 \
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
