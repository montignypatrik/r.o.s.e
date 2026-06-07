# Router Agent

## Purpose
The Router Agent analyzes incoming requests and routes them to the appropriate handler.

## Responsibilities
- Intent classification
- Agent selection
- Request transformation
- Response aggregation

## Routing Logic
```
IF request requires Claude -> [[Claude Manager Agent]]
IF request requires code -> [[Local Coding Agent]]
IF request requires research -> [[Research Agent]]
IF request matches skill -> [[Skills Registry]]
```

## Configuration
- Model: Claude (for intent analysis)
- Fallback: Direct to Claude Manager

## Related
- [[Architecture]]
- [[Claude Manager Agent]]

---
## TODO
- [ ] Implement intent classifier
- [ ] Add routing rules
- [ ] Define fallback behavior
