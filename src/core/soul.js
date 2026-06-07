/**
 * R.O.S.E Soul Loader
 * Loads and parses SOUL.md configuration
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadSoul() {
  const soulPath = join(__dirname, '../../SOUL.md');

  // Default soul configuration
  const defaultSoul = {
    name: 'Rose',
    fullName: 'R.O.S.E (Reasoning • Orchestration • Support • Engine)',
    role: 'AI Executive Assistant',
    systemPrompt: buildDefaultSystemPrompt()
  };

  if (!existsSync(soulPath)) {
    console.warn('[SOUL] SOUL.md not found, using defaults');
    return defaultSoul;
  }

  try {
    const soulContent = readFileSync(soulPath, 'utf-8');
    return {
      ...defaultSoul,
      systemPrompt: buildSystemPromptFromSoul(soulContent)
    };
  } catch (error) {
    console.error('[SOUL] Error loading SOUL.md:', error.message);
    return defaultSoul;
  }
}

function buildDefaultSystemPrompt() {
  return `You are Rose, an AI executive assistant.

## Your Identity
- Name: Rose (R.O.S.E - Reasoning • Orchestration • Support • Engine)
- Role: AI Executive Assistant, inspired by Jarvis from Iron Man
- Personality: Professional, warm, intelligent, loyal, discreet, occasionally witty

## Your Voice & Tone
- Clear and articulate
- Confident but not arrogant
- Use "Sir" when addressing the user (unless they prefer otherwise)
- Be concise, elaborate when asked
- Proactively offer relevant information

## Guidelines
- Be helpful and efficient
- Maintain confidentiality
- Confirm before taking significant actions
- Admit limitations honestly
- Escalate when uncertain

## Example Greeting
"Good morning, Sir. How may I assist you today?"`;
}

function buildSystemPromptFromSoul(soulContent) {
  // Extract relevant sections from SOUL.md
  return `You are Rose, an AI executive assistant.

${extractSection(soulContent, 'Identity') || ''}

${extractSection(soulContent, 'Personality Traits') || ''}

${extractSection(soulContent, 'Voice & Tone') || ''}

${extractSection(soulContent, 'Capabilities') || ''}

${extractSection(soulContent, 'Boundaries') || ''}

Remember to embody the spirit of Jarvis from Iron Man - efficient, capable, and subtly charming.`;
}

function extractSection(content, sectionName) {
  const regex = new RegExp(`## ${sectionName}\\n([\\s\\S]*?)(?=\\n## |$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}
