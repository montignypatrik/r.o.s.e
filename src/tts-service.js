/**
 * R.O.S.E TTS Service
 * Text-to-Speech using Piper
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

const execAsync = promisify(exec);

const PIPER_PATH = '/home/ubuntu/rose/tts-env/bin/piper';
const VOICE_MODEL = '/home/ubuntu/rose/voices/en_US-amy-medium.onnx';
const OUTPUT_DIR = '/home/ubuntu/rose/audio-cache';

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generate speech from text
 * @param {string} text - Text to speak
 * @returns {Promise<string>} - Path to audio file
 */
export async function speak(text) {
  const outputFile = join(OUTPUT_DIR, `${randomUUID()}.wav`);

  // Escape text for shell
  const escapedText = text.replace(/'/g, "'\\''");

  const command = `echo '${escapedText}' | ${PIPER_PATH} --model ${VOICE_MODEL} --output_file ${outputFile}`;

  try {
    await execAsync(command, { timeout: 30000 });
    return outputFile;
  } catch (error) {
    console.error('[TTS] Error:', error.message);
    throw error;
  }
}

/**
 * Clean up old audio files
 */
export async function cleanupOldFiles() {
  try {
    // Delete files older than 1 hour
    await execAsync(`find ${OUTPUT_DIR} -name "*.wav" -mmin +60 -delete`);
  } catch (error) {
    console.error('[TTS] Cleanup error:', error.message);
  }
}

// Run cleanup every 30 minutes
setInterval(cleanupOldFiles, 30 * 60 * 1000);
