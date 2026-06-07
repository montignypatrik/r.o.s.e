/**
 * R.O.S.E Inference Engine
 * Uses OpenClaw CLI for Claude API calls
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Model mapping for openclaw CLI
const MODEL_MAP = {
  'opus': 'anthropic/claude-sonnet-4-6',
  'sonnet': 'anthropic/claude-sonnet-4-6',
  'haiku': 'anthropic/claude-3-haiku',
  'claude-sonnet-4-20250514': 'anthropic/claude-sonnet-4-6',
  'claude-3-haiku-20240307': 'anthropic/claude-3-haiku'
};

/**
 * Call Claude via OpenClaw CLI
 * @param {string} prompt - The full prompt (system + user combined)
 * @param {object} options - Options like model, timeout
 * @returns {Promise<string>} The response text
 */
export async function infer(prompt, options = {}) {
  const model = MODEL_MAP[options.model] || MODEL_MAP['sonnet'];
  const timeout = options.timeout || 60000;

  // Escape prompt for shell - handle single quotes
  const escapedPrompt = prompt.replace(/'/g, "'\\''");

  try {
    const { stdout } = await execAsync(
      `openclaw infer model run --prompt '${escapedPrompt}' --model ${model}`,
      {
        timeout,
        env: { ...process.env, HOME: process.env.HOME || '/home/ubuntu' },
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      }
    );

    // Parse response - remove openclaw header lines
    const lines = stdout.trim().split('\n');
    const responseLines = lines.filter(line =>
      !line.startsWith('model.run') &&
      !line.startsWith('provider:') &&
      !line.startsWith('model:') &&
      !line.startsWith('outputs:')
    );

    return responseLines.join('\n').trim();

  } catch (error) {
    console.error('[INFERENCE] OpenClaw error:', error.message);
    throw error;
  }
}

/**
 * Call Claude with system prompt and messages
 * Formats like Anthropic SDK but uses OpenClaw CLI
 */
export async function chat(systemPrompt, messages, options = {}) {
  // Build the full prompt
  let fullPrompt = systemPrompt + '\n\n';

  // Add conversation history
  for (const msg of messages) {
    const role = msg.role === 'user' ? 'User' : 'Assistant';
    fullPrompt += `${role}: ${msg.content}\n`;
  }

  // Add the final prompt marker for assistant response
  fullPrompt += 'Assistant:';

  return infer(fullPrompt, options);
}

export default { infer, chat };
