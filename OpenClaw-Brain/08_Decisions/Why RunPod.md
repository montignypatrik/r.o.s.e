# Why RunPod

## Decision
Use RunPod for GPU compute instead of local hardware or other cloud providers.

## Context
Need GPU access for running local coding models (Qwen, DeepSeek).

## Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Local GPU | No ongoing cost | High upfront, always on |
| AWS/GCP | Enterprise grade | Expensive, complex |
| RunPod | Pay per use, simple | Smaller provider |
| Vast.ai | Cheapest | Less reliable |

## Decision Rationale
- Pay only when using
- Simple interface
- Good GPU availability
- Reasonable pricing

## Outcome
Working well for coding model deployment.

## Related
- [[RunPod Overview]]
- [[Decision Log]]

---
## TODO
- [ ] Track costs
- [ ] Evaluate alternatives quarterly
