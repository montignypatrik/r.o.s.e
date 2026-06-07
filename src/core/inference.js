/**
 * R.O.S.E Inference Engine
 * Uses OpenClaw Gateway via WebSocket for Claude API calls
 */

import WebSocket from 'ws';
import crypto from 'crypto';

// OpenClaw Gateway configuration
const OPENCLAW_HOST = process.env.OPENCLAW_HOST || '172.17.0.1';
const OPENCLAW_PORT = process.env.OPENCLAW_PORT || 8080;
const OPENCLAW_TOKEN = process.env.OPENCLAW_GATEWAY_TOKEN || '';
const OPENCLAW_URL = `ws://${OPENCLAW_HOST}:${OPENCLAW_PORT}`;

let openclawWs = null;
let openclawConnected = false;
let openclawReady = false;
const pendingRequests = new Map();

/**
 * Connect to OpenClaw Gateway
 */
function connectToOpenClaw() {
  return new Promise((resolve) => {
    if (openclawReady && openclawWs) {
      resolve(true);
      return;
    }

    const wsUrl = OPENCLAW_TOKEN
      ? `${OPENCLAW_URL}?auth.token=${OPENCLAW_TOKEN}`
      : OPENCLAW_URL;

    console.log(`[INFERENCE] Connecting to OpenClaw at ${OPENCLAW_URL}...`);
    openclawWs = new WebSocket(wsUrl);

    openclawWs.on('open', () => {
      openclawConnected = true;
      console.log('[INFERENCE] WebSocket connected, waiting for handshake...');
    });

    openclawWs.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // Handle challenge-response handshake
        if (msg.type === 'event' && msg.event === 'connect.challenge') {
          const nonce = msg.payload?.nonce;
          if (nonce && OPENCLAW_TOKEN) {
            // Create HMAC response
            const response = crypto
              .createHmac('sha256', OPENCLAW_TOKEN)
              .update(nonce)
              .digest('hex');

            openclawWs.send(JSON.stringify({
              type: 'event',
              event: 'connect.response',
              payload: { response }
            }));
            console.log('[INFERENCE] Challenge response sent');
          }
          return;
        }

        // Handle successful connection
        if (msg.type === 'event' && msg.event === 'connect.success') {
          openclawReady = true;
          console.log('[INFERENCE] ✓ Connected to OpenClaw gateway');
          resolve(true);
          return;
        }

        // Handle JSON-RPC responses
        if (msg.id && pendingRequests.has(msg.id)) {
          const { resolve, reject } = pendingRequests.get(msg.id);
          pendingRequests.delete(msg.id);

          if (msg.error) {
            reject(new Error(msg.error.message || 'OpenClaw error'));
          } else {
            resolve(msg.result);
          }
        }
      } catch (e) {
        console.error('[INFERENCE] Failed to parse message:', e);
      }
    });

    openclawWs.on('close', () => {
      openclawConnected = false;
      openclawReady = false;
      console.log('[INFERENCE] OpenClaw connection closed, reconnecting in 5s...');
      setTimeout(connectToOpenClaw, 5000);
    });

    openclawWs.on('error', (err) => {
      console.error('[INFERENCE] OpenClaw WebSocket error:', err.message);
      resolve(false);
    });

    // Timeout for initial connection
    setTimeout(() => {
      if (!openclawReady) {
        resolve(false);
      }
    }, 10000);
  });
}

/**
 * Send request to OpenClaw gateway
 */
async function sendToOpenClaw(method, params) {
  if (!openclawReady || !openclawWs) {
    await connectToOpenClaw();
    if (!openclawReady) {
      throw new Error('OpenClaw not connected');
    }
  }

  const id = Date.now().toString() + Math.random().toString(36).slice(2);

  return new Promise((resolve, reject) => {
    pendingRequests.set(id, { resolve, reject });

    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    openclawWs.send(JSON.stringify(message));

    // Timeout after 60 seconds
    setTimeout(() => {
      if (pendingRequests.has(id)) {
        pendingRequests.delete(id);
        reject(new Error('OpenClaw request timeout'));
      }
    }, 60000);
  });
}

/**
 * Call Claude via OpenClaw Gateway
 * @param {string} prompt - The full prompt
 * @param {object} options - Options like model, timeout
 * @returns {Promise<string>} The response text
 */
export async function infer(prompt, options = {}) {
  const result = await sendToOpenClaw('agent.chat', {
    message: prompt,
    system: ''
  });

  return result?.content || result?.message || result || '';
}

/**
 * Call Claude with system prompt and messages
 */
export async function chat(systemPrompt, messages, options = {}) {
  // Get the last user message
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';

  // Build context from previous messages
  let context = '';
  if (messages.length > 1) {
    context = messages.slice(0, -1).map(m =>
      `${m.role === 'user' ? 'User' : 'Rose'}: ${m.content}`
    ).join('\n') + '\n\n';
  }

  const result = await sendToOpenClaw('agent.chat', {
    message: context + userMessage,
    system: systemPrompt
  });

  return result?.content || result?.message || result || '';
}

// Initialize connection on module load
connectToOpenClaw();

export default { infer, chat };
