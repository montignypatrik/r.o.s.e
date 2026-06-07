# Start OpenClaw

## Overview
Steps to start the OpenClaw/Rose system.

## Prerequisites
- VPS access (ubuntu@51.222.106.155)
- Services configured

## Steps

### 1. SSH to VPS
```bash
ssh ubuntu@51.222.106.155
```

### 2. Check Services
```bash
sudo systemctl status rose
sudo systemctl status rose-tts
sudo systemctl status openclaw
```

### 3. Start if Needed
```bash
sudo systemctl start rose
sudo systemctl start rose-tts
sudo systemctl start openclaw
```

### 4. Verify
- Dashboard: http://51.222.106.155:3000
- Health check: http://51.222.106.155:3000/health

## Troubleshooting
See [[Troubleshooting]] for common issues.

## Related
- [[Architecture]]
- [[Environment Variables]]

---
## TODO
- [ ] Add monitoring alerts
- [ ] Create startup script
