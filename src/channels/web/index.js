/**
 * R.O.S.E Web Dashboard
 * Real-time chat interface and activity monitoring
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dashboardPath = join(__dirname, '../../../dashboard');

let io = null;
let roseCore = null;

export async function initializeWebDashboard(rose, claw) {
  roseCore = rose;

  const app = express();
  const server = createServer(app);
  io = new SocketIO(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  // Middleware
  app.use(express.json());

  // Serve dashboard - check for built dist first, then fallback to source
  const distPath = join(dashboardPath, 'dist');
  const staticPath = existsSync(distPath) ? distPath : dashboardPath;
  app.use(express.static(staticPath));

  // SPA fallback - serve index.html for unknown routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/socket.io/')) {
      return next();
    }
    res.sendFile(join(staticPath, 'index.html'));
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.get('/api/status', (req, res) => {
    res.json({
      status: 'online',
      name: 'Rose',
      uptime: process.uptime(),
      channels: {
        web: true,
        discord: !!process.env.DISCORD_BOT_TOKEN
      }
    });
  });

  app.get('/api/activity', (req, res) => {
    const limit = parseInt(req.query.limit) || 20;
    res.json(roseCore.getRecentActivity(limit));
  });

  // WebSocket handling
  io.on('connection', (socket) => {
    console.log('[WEB] Client connected:', socket.id);

    // Send welcome message
    socket.emit('welcome', {
      message: 'Good day, Sir. Rose is online and ready to assist.',
      timestamp: new Date().toISOString()
    });

    // Handle chat messages
    socket.on('message', async (data) => {
      try {
        const response = await roseCore.processMessage(
          { content: data.content },
          {
            type: 'web',
            conversationId: `web-${socket.id}`,
            userId: socket.id,
            voiceEnabled: data.voiceEnabled || false
          }
        );

        socket.emit('response', {
          content: response.content,
          voice: response.voice ? response.voice.toString('base64') : null,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('[WEB] Error processing message:', error);
        socket.emit('error', {
          message: 'I apologize, Sir. I encountered an error.',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle voice input
    socket.on('voice', async (data) => {
      try {
        const audioBuffer = Buffer.from(data.audio, 'base64');
        const response = await roseCore.processVoice(audioBuffer, {
          type: 'web',
          conversationId: `web-${socket.id}`,
          userId: socket.id,
          voiceEnabled: true
        });

        socket.emit('response', {
          content: response.content,
          voice: response.voice ? response.voice.toString('base64') : null,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('[WEB] Error processing voice:', error);
        socket.emit('error', {
          message: 'I apologize, Sir. I could not process the audio.',
          timestamp: new Date().toISOString()
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('[WEB] Client disconnected:', socket.id);
    });
  });

  // Broadcast activity updates
  setInterval(() => {
    const activity = roseCore.getRecentActivity(5);
    io.emit('activity', activity);
  }, 5000);

  // Start server
  const port = process.env.WEB_PORT || 3000;
  const host = process.env.WEB_HOST || '0.0.0.0';

  return new Promise((resolve) => {
    server.listen(port, host, () => {
      console.log(`[WEB] ✓ Dashboard running at http://${host}:${port}`);
      resolve(server);
    });
  });
}

/**
 * Broadcast message to all connected clients
 */
export function broadcast(event, data) {
  if (io) {
    io.emit(event, data);
  }
}
