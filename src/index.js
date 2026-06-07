/**
 * R.O.S.E - Reasoning • Orchestration • Support • Engine
 * AI Executive Assistant powered by OpenClaw
 */

import 'dotenv/config';
import { OpenClaw } from 'openclaw';
import { initializeDiscord } from './channels/discord/index.js';
import { initializeWebDashboard } from './channels/web/index.js';
import { initializeVoice } from './voice/index.js';
import { initializeMemory } from './memory/index.js';
import { RoseCore } from './core/rose.js';

async function main() {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🌹 R.O.S.E - AI Executive Assistant                     ║
  ║   Reasoning • Orchestration • Support • Engine            ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);

  try {
    // Initialize core systems
    console.log('[ROSE] Initializing core systems...');

    // Memory system
    const memory = await initializeMemory();
    console.log('[ROSE] ✓ Memory system online');

    // Voice system (STT + TTS)
    const voice = await initializeVoice();
    console.log('[ROSE] ✓ Voice system online');

    // Initialize Rose's core intelligence
    const rose = new RoseCore({
      memory,
      voice,
      model: process.env.LLM_MODEL || 'claude-sonnet-4-20250514'
    });
    console.log('[ROSE] ✓ Core intelligence online');

    // Initialize OpenClaw gateway
    const claw = new OpenClaw({
      port: process.env.OPENCLAW_PORT || 8080,
      logLevel: process.env.OPENCLAW_LOG_LEVEL || 'info'
    });

    // Register message handler
    claw.onMessage(async (message, channel) => {
      return await rose.processMessage(message, channel);
    });

    // Initialize channels
    await Promise.all([
      initializeWebDashboard(rose, claw),
      initializeDiscord(rose, claw)
    ]);

    console.log('[ROSE] ✓ All channels online');
    console.log('[ROSE] ═══════════════════════════════════════');
    console.log('[ROSE] Rose is ready to assist.');
    console.log(`[ROSE] Web Dashboard: http://localhost:${process.env.WEB_PORT || 3000}`);
    console.log('[ROSE] ═══════════════════════════════════════');

  } catch (error) {
    console.error('[ROSE] Failed to initialize:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[ROSE] Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[ROSE] Shutting down gracefully...');
  process.exit(0);
});

main();
