# Deploy Coding Model

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
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-Coder-32B-Instruct \
    --tensor-parallel-size 1 \
    --port 8000 \
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
