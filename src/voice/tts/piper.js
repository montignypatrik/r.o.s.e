/**
 * Piper TTS - Local Text-to-Speech
 * https://github.com/rhasspy/piper
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

export class PiperTTS {
  constructor(options = {}) {
    this.modelPath = options.modelPath;
    this.speaker = options.speaker || 0;
    this.initialized = false;
  }

  async initialize() {
    // Check if model exists
    if (!existsSync(this.modelPath)) {
      console.warn(`[PIPER] Model not found at ${this.modelPath}`);
      console.warn('[PIPER] Run: npm run setup:voice to download models');
      this.initialized = false;
      return;
    }

    this.initialized = true;
  }

  /**
   * Synthesize text to audio buffer
   * @param {string} text - Text to synthesize
   * @returns {Promise<Buffer>} - WAV audio buffer
   */
  async synthesize(text) {
    if (!this.initialized) {
      throw new Error('Piper TTS not initialized');
    }

    return new Promise((resolve, reject) => {
      const chunks = [];

      // Use piper CLI or piper-tts npm package
      const piper = spawn('piper', [
        '--model', this.modelPath,
        '--speaker', this.speaker.toString(),
        '--output-raw'
      ]);

      piper.stdout.on('data', (chunk) => {
        chunks.push(chunk);
      });

      piper.stderr.on('data', (data) => {
        // Piper outputs progress to stderr, ignore non-error messages
        const msg = data.toString();
        if (msg.includes('error') || msg.includes('Error')) {
          console.error('[PIPER]', msg);
        }
      });

      piper.on('close', (code) => {
        if (code === 0) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`Piper exited with code ${code}`));
        }
      });

      piper.on('error', (error) => {
        reject(error);
      });

      // Send text to piper
      piper.stdin.write(text);
      piper.stdin.end();
    });
  }

  /**
   * Synthesize with streaming (for real-time playback)
   */
  async *synthesizeStream(text) {
    if (!this.initialized) {
      throw new Error('Piper TTS not initialized');
    }

    const piper = spawn('piper', [
      '--model', this.modelPath,
      '--speaker', this.speaker.toString(),
      '--output-raw'
    ]);

    piper.stdin.write(text);
    piper.stdin.end();

    for await (const chunk of piper.stdout) {
      yield chunk;
    }
  }
}
