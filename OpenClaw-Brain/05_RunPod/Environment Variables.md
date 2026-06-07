# Environment Variables

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
