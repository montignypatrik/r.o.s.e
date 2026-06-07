/**
 * R.O.S.E - Production Server
 * Uses RoseCore with full delegation support
 */

import 'dotenv/config';
import { initializeWebDashboard } from './channels/web/index.js';
import { initializeVoice } from './voice/index.js';
import { initializeMemory } from './memory/index.js';
import { RoseCore } from './core/rose.js';
import { initializeOrg } from './org/index.js';

async function main() {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   🌹 R.O.S.E - AI Executive Assistant                     ║
  ║   Reasoning • Orchestration • Support • Engine            ║
  ║   With C-Suite Delegation                                 ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
  `);

  try {
    console.log('[ROSE] Initializing core systems...');

    // Memory system
    const memory = await initializeMemory();
    console.log('[ROSE] ✓ Memory system online');

    // Voice system (STT + TTS)
    const voice = await initializeVoice();
    console.log('[ROSE] ✓ Voice system online');

    // Initialize organizational hierarchy
    const orgResult = await initializeOrg();
    console.log(`[ROSE] ✓ Organization online (${orgResult.executives} executives)`);

    // Initialize Rose's core intelligence with delegation
    const rose = new RoseCore({
      memory,
      voice,
      model: process.env.LLM_MODEL || 'claude-sonnet-4-20250514'
    });
    console.log('[ROSE] ✓ Core intelligence online');
    console.log(`[ROSE] ✓ Delegation: ${rose.delegationEnabled ? 'ENABLED' : 'disabled'}`);

    // Initialize web dashboard (pass null for claw - not needed)
    await initializeWebDashboard(rose, null);

    console.log('[ROSE] ═══════════════════════════════════════');
    console.log('[ROSE] Rose is ready to assist.');
    console.log(`[ROSE] Dashboard: http://0.0.0.0:${process.env.WEB_PORT || 3000}`);
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
