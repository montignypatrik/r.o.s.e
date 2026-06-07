# Start RunPod Session

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
