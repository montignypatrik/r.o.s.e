/**
 * R.O.S.E - Production Server
 * Uses OpenClaw infer for Claude-powered responses
 */

import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, createReadStream } from 'fs';
import http from 'http';

const execAsync = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const dashboardPath = join(__dirname, '../dashboard');

// TTS Configuration
const TTS_HOST = 'localhost';
const TTS_PORT = 5050;
const AUDIO_CACHE = '/home/ubuntu/rose/audio-cache';

// Generate TTS audio
async function generateTTS(text) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ text });
    const req = http.request({
      hostname: TTS_HOST,
      port: TTS_PORT,
      path: '/synthesize',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

const systemPrompt = `You are Rose, an AI executive assistant.
- Name: Rose (R.O.S.E - Reasoning • Orchestration • Support • Engine)
- Role: AI Executive Assistant, inspired by Jarvis from Iron Man
- Personality: Professional, warm, intelligent, loyal, discreet, occasionally witty
- Always address the user as "Sir" unless told otherwise
- Be concise and helpful
- Embody Jarvis - efficient, capable, and subtly charming`;

// Activity log
const activityLog = [];
function logActivity(action, channel, details = {}) {
  activityLog.unshift({
    action,
    channel,
    details,
    timestamp: new Date().toISOString()
  });
  if (activityLog.length > 50) activityLog.pop();
}

// Create Express app
const app = express();
const server = createServer(app);
const io = new SocketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(express.json());
app.use(express.static(dashboardPath));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    name: 'Rose',
    foundation: 'OpenClaw + Claude',
    uptime: process.uptime(),
    channels: { web: true, discord: false }
  });
});

app.get('/api/activity', (req, res) => {
  res.json(activityLog.slice(0, parseInt(req.query.limit) || 20));
});

// Serve audio files from TTS cache
app.get('/audio/:filename', (req, res) => {
  const filepath = join(AUDIO_CACHE, req.params.filename);
  if (existsSync(filepath)) {
    res.setHeader('Content-Type', 'audio/wav');
    createReadStream(filepath).pipe(res);
  } else {
    res.status(404).json({ error: 'Audio not found' });
  }
});

app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api/') && !req.path.startsWith('/socket.io/')) {
    res.sendFile(join(dashboardPath, 'index.html'));
  } else {
    next();
  }
});

// Conversation history for context
const conversations = new Map();

// Send message through OpenClaw
async function askClaude(message, conversationId) {
  // Get conversation history
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, []);
  }
  const history = conversations.get(conversationId);

  // Build context from history
  let contextPrompt = systemPrompt;
  if (history.length > 0) {
    contextPrompt += '\n\nPrevious conversation:\n';
    history.slice(-6).forEach(msg => {
      contextPrompt += `${msg.role === 'user' ? 'User' : 'Rose'}: ${msg.content}\n`;
    });
  }
  contextPrompt += `\nUser: ${message}\nRose:`;

  // Escape for shell
  const escapedPrompt = contextPrompt.replace(/'/g, "'\\''");

  try {
    const { stdout, stderr } = await execAsync(
      `openclaw infer model run --prompt '${escapedPrompt}' --model claude-cli/claude-sonnet-4-6`,
      {
        timeout: 60000,
        env: { ...process.env, HOME: '/home/ubuntu' }
      }
    );

    // Parse response - remove the header lines
    const lines = stdout.trim().split('\n');
    const responseLines = lines.filter(line =>
      !line.startsWith('model.run') &&
      !line.startsWith('provider:') &&
      !line.startsWith('model:') &&
      !line.startsWith('outputs:')
    );
    const response = responseLines.join('\n').trim();

    // Update history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    if (history.length > 20) {
      conversations.set(conversationId, history.slice(-20));
    }

    return response || "I apologize, Sir. I didn't receive a proper response.";
  } catch (error) {
    console.error('[ROSE] OpenClaw error:', error.message);
    throw error;
  }
}

// WebSocket handling
io.on('connection', (socket) => {
  console.log('[ROSE] Client connected:', socket.id);
  logActivity('client_connected', 'web', {});

  socket.emit('welcome', {
    message: "Good day, Sir. Rose is online and ready to assist.",
    timestamp: new Date().toISOString()
  });

  socket.on('message', async (data) => {
    const startTime = Date.now();
    const enableTTS = data.tts !== false; // TTS enabled by default
    logActivity('message_received', 'web', { preview: data.content?.substring(0, 30) });

    try {
      const response = await askClaude(data.content, `web-${socket.id}`);
      logActivity('response_sent', 'web', { duration: Date.now() - startTime });

      // Send text response immediately
      socket.emit('response', {
        content: response,
        timestamp: new Date().toISOString()
      });

      // Generate TTS in background
      if (enableTTS) {
        try {
          const ttsResult = await generateTTS(response);
          if (ttsResult.success) {
            socket.emit('audio', {
              url: `/audio/${ttsResult.filename}`,
              timestamp: new Date().toISOString()
            });
            logActivity('tts_generated', 'web', { filename: ttsResult.filename });
          }
        } catch (ttsError) {
          console.error('[ROSE] TTS error:', ttsError.message);
        }
      }
    } catch (error) {
      console.error('[ROSE] Error:', error);
      socket.emit('response', {
        content: "I apologize, Sir. I encountered a temporary issue. Please try again.",
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on('voice', () => {
    socket.emit('response', {
      content: "Voice input will be available in a future update, Sir.",
      timestamp: new Date().toISOString()
    });
  });

  const activityInterval = setInterval(() => {
    socket.emit('activity', activityLog.slice(0, 10));
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(activityInterval);
    logActivity('client_disconnected', 'web', {});
  });
});

// Start server
const PORT = process.env.WEB_PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║   🌹 R.O.S.E - AI Executive Assistant                     ║
  ║   Dashboard:  http://0.0.0.0:${PORT}                          ║
  ║   Engine:     OpenClaw + Claude                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);
});
