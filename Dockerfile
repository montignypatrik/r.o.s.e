# R.O.S.E - AI Executive Assistant
# Multi-stage Docker build for optimized production image

# ============================================
# Stage 1: Build stage
# ============================================
FROM node:22-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# ============================================
# Stage 2: Voice models stage
# ============================================
FROM builder AS voice-models

WORKDIR /models

# Install Piper TTS
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Download Piper voice model (Amy - medium quality)
RUN mkdir -p /models/piper && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx \
    -O /models/piper/en_US-amy-medium.onnx && \
    wget -q https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/amy/medium/en_US-amy-medium.onnx.json \
    -O /models/piper/en_US-amy-medium.onnx.json

# Download Whisper model (base)
RUN mkdir -p /models/whisper && \
    wget -q https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin \
    -O /models/whisper/ggml-base.en.bin

# ============================================
# Stage 3: Production image
# ============================================
FROM node:22-slim AS production

LABEL maintainer="R.O.S.E AI Assistant"
LABEL description="Reasoning • Orchestration • Support • Engine"

WORKDIR /app

# Install runtime dependencies for voice
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy node modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy voice models
COPY --from=voice-models /models /app/models

# Copy application source
COPY . .

# Create non-root user for security
RUN groupadd -r rose && useradd -r -g rose rose && \
    chown -R rose:rose /app

USER rose

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Environment defaults
ENV NODE_ENV=production
ENV WEB_PORT=3000
ENV OPENCLAW_PORT=8080
ENV PIPER_MODEL_PATH=/app/models/piper/en_US-amy-medium.onnx
ENV WHISPER_MODEL_PATH=/app/models/whisper/ggml-base.en.bin

# Start Rose
CMD ["node", "src/index.js"]
