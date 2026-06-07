#!/usr/bin/env python3
"""
R.O.S.E TTS Server - Edge TTS (Microsoft)
Fast, natural-sounding voices
"""

import os
import json
import uuid
import asyncio
import edge_tts
from http.server import HTTPServer, BaseHTTPRequestHandler

PORT = 5050
VOICE = 'en-US-AriaNeural'  # Confident, professional female voice
OUTPUT_DIR = '/home/ubuntu/rose/audio-cache'
os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f'[TTS] Edge TTS Server starting with voice: {VOICE}')

async def generate_speech(text, output_path):
    communicate = edge_tts.Communicate(text, VOICE)
    await communicate.save(output_path)

class TTSHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/synthesize':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            text = data.get('text', '')
            if not text:
                self.send_error(400, 'No text provided')
                return
            
            filename = f'{uuid.uuid4()}.mp3'
            output_path = os.path.join(OUTPUT_DIR, filename)
            
            try:
                asyncio.run(generate_speech(text, output_path))
                
                if os.path.exists(output_path):
                    print(f'[TTS] Generated: {text[:40]}...')
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({
                        'success': True,
                        'filename': filename,
                        'url': f'/audio/{filename}'
                    }).encode())
                else:
                    raise Exception('Failed to generate audio')
                    
            except Exception as e:
                print(f'[TTS] Error: {e}')
                self.send_error(500, str(e))
        else:
            self.send_error(404, 'Not found')
    
    def do_GET(self):
        if self.path.startswith('/audio/'):
            filename = self.path[7:]
            filepath = os.path.join(OUTPUT_DIR, filename)
            if os.path.exists(filepath):
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                with open(filepath, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, 'Audio not found')
        elif self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'ok', 'voice': VOICE}).encode())
        else:
            self.send_error(404, 'Not found')
    
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), TTSHandler)
    print(f'[TTS] Server running on port {PORT}')
    server.serve_forever()
