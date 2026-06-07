/**
 * R.O.S.E Voice System
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS)
 */

import { PiperTTS } from './tts/piper.js';
import { WhisperSTT } from './stt/whisper.js';

let tts = null;
let stt = null;

export async function initializeVoice() {
  console.log('[VOICE] Initializing voice system...');

  // Initialize TTS (Piper)
  tts = new PiperTTS({
    modelPath: process.env.PIPER_MODEL_PATH || './models/piper/en_US-amy-medium.onnx',
    speaker: parseInt(process.env.PIPER_SPEAKER) || 0
  });
  await tts.initialize();
  console.log('[VOICE] ✓ TTS (Piper) initialized');

  // Initialize STT (Whisper)
  stt = new WhisperSTT({
    modelPath: process.env.WHISPER_MODEL_PATH || './models/whisper/ggml-base.en.bin',
    language: process.env.WHISPER_LANGUAGE || 'en'
  });
  await stt.initialize();
  console.log('[VOICE] ✓ STT (Whisper) initialized');

  return {
    synthesize: (text) => tts.synthesize(text),
    transcribe: (audio) => stt.transcribe(audio)
  };
}

export { tts, stt };
