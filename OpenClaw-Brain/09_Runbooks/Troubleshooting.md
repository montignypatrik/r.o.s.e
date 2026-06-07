# Troubleshooting

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
curl -X POST http://localhost:5050/synthesize \
    -H "Content-Type: application/json" \
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
