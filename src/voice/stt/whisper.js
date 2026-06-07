/**
 * Whisper STT - Local Speech-to-Text
 * Uses whisper.cpp for efficient local transcription
 */

import { spawn } from 'child_process';
import { existsSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

export class WhisperSTT {
  constructor(options = {}) {
    this.modelPath = options.modelPath;
    this.language = options.language || 'en';
    this.initialized = false;
  }

  async initialize() {
    // Check if model exists
    if (!existsSync(this.modelPath)) {
      console.warn(`[WHISPER] Model not found at ${this.modelPath}`);
      console.warn('[WHISPER] Run: npm run setup:voice to download models');
      this.initialized = false;
      return;
    }

    this.initialized = true;
  }

  /**
   * Transcribe audio buffer to text
   * @param {Buffer} audioBuffer - WAV audio buffer
   * @returns {Promise<string>} - Transcribed text
   */
  async transcribe(audioBuffer) {
    if (!this.initialized) {
      throw new Error('Whisper STT not initialized');
    }

    // Write audio to temp file
    const tempPath = join(tmpdir(), `rose-audio-${randomUUID()}.wav`);

    try {
      writeFileSync(tempPath, audioBuffer);

      return new Promise((resolve, reject) => {
        let output = '';

        // Use whisper.cpp CLI
        const whisper = spawn('whisper', [
          '-m', this.modelPath,
          '-l', this.language,
          '-f', tempPath,
          '-nt',  // no timestamps
          '-np'   // no progress
        ]);

        whisper.stdout.on('data', (data) => {
          output += data.toString();
        });

        whisper.stderr.on('data', (data) => {
          const msg = data.toString();
          if (msg.includes('error') || msg.includes('Error')) {
            console.error('[WHISPER]', msg);
          }
        });

        whisper.on('close', (code) => {
          // Clean up temp file
          try {
            unlinkSync(tempPath);
          } catch (e) {
            // Ignore cleanup errors
          }

          if (code === 0) {
            resolve(output.trim());
          } else {
            reject(new Error(`Whisper exited with code ${code}`));
          }
        });

        whisper.on('error', (error) => {
          try {
            unlinkSync(tempPath);
          } catch (e) {
            // Ignore cleanup errors
          }
          reject(error);
        });
      });

    } catch (error) {
      try {
        unlinkSync(tempPath);
      } catch (e) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  /**
   * Transcribe with word-level timestamps
   */
  async transcribeWithTimestamps(audioBuffer) {
    if (!this.initialized) {
      throw new Error('Whisper STT not initialized');
    }

    const tempPath = join(tmpdir(), `rose-audio-${randomUUID()}.wav`);

    try {
      writeFileSync(tempPath, audioBuffer);

      return new Promise((resolve, reject) => {
        let output = '';

        const whisper = spawn('whisper', [
          '-m', this.modelPath,
          '-l', this.language,
          '-f', tempPath,
          '-ml', '1',  // max segment length
          '-wt'        // word timestamps
        ]);

        whisper.stdout.on('data', (data) => {
          output += data.toString();
        });

        whisper.on('close', (code) => {
          try {
            unlinkSync(tempPath);
          } catch (e) {}

          if (code === 0) {
            resolve(this.parseTimestampOutput(output));
          } else {
            reject(new Error(`Whisper exited with code ${code}`));
          }
        });

        whisper.on('error', (error) => {
          try {
            unlinkSync(tempPath);
          } catch (e) {}
          reject(error);
        });
      });

    } catch (error) {
      try {
        unlinkSync(tempPath);
      } catch (e) {}
      throw error;
    }
  }

  parseTimestampOutput(output) {
    const lines = output.trim().split('\n');
    const segments = [];

    for (const line of lines) {
      const match = line.match(/\[(\d+:\d+\.\d+) --> (\d+:\d+\.\d+)\]\s*(.*)/);
      if (match) {
        segments.push({
          start: match[1],
          end: match[2],
          text: match[3].trim()
        });
      }
    }

    return {
      text: segments.map(s => s.text).join(' '),
      segments
    };
  }
}
