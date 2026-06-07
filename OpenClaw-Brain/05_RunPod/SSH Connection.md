# SSH Connection

## Connect to RunPod

```bash
ssh root@<pod-ip> -p <port> -i ~/.ssh/runpod_key
```

## Common Commands

```bash
# Check GPU
nvidia-smi

# Start model server
python -m vllm.entrypoints.openai.api_server \
    --model Qwen/Qwen2.5-Coder-32B-Instruct \
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
