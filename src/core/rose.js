/**
 * R.O.S.E Core Intelligence
 * The central brain of the AI assistant
 */

import Anthropic from '@anthropic-ai/sdk';
import { loadSoul } from './soul.js';

export class RoseCore {
  constructor({ memory, voice, model }) {
    this.memory = memory;
    this.voice = voice;
    this.model = model;
    this.client = new Anthropic();
    this.soul = loadSoul();
    this.activityLog = [];
  }

  /**
   * Process an incoming message from any channel
   */
  async processMessage(message, channel) {
    const startTime = Date.now();

    this.logActivity('message_received', channel.type, {
      preview: message.content?.substring(0, 50)
    });

    try {
      // Get conversation context
      const context = await this.memory.getConversationContext(
        channel.conversationId,
        10 // last 10 messages
      );

      // Search for relevant memories
      const relevantMemories = await this.memory.searchRelevant(
        message.content,
        5
      );

      // Build system prompt with soul and memories
      const systemPrompt = this.buildSystemPrompt(relevantMemories);

      // Build messages array
      const messages = [
        ...context.map(m => ({
          role: m.role,
          content: m.content
        })),
        {
          role: 'user',
          content: message.content
        }
      ];

      // Call Claude
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages
      });

      const assistantMessage = response.content[0].text;

      // Store in memory
      await this.memory.storeMessage(channel.conversationId, 'user', message.content);
      await this.memory.storeMessage(channel.conversationId, 'assistant', assistantMessage);

      // Extract and store any new memories
      await this.extractAndStoreMemories(message.content, assistantMessage);

      const duration = Date.now() - startTime;
      this.logActivity('response_sent', channel.type, {
        duration,
        tokens: response.usage?.output_tokens
      });

      return {
        content: assistantMessage,
        voice: channel.voiceEnabled ? await this.voice.synthesize(assistantMessage) : null
      };

    } catch (error) {
      this.logActivity('error', channel.type, { error: error.message });
      throw error;
    }
  }

  /**
   * Build system prompt with soul and relevant memories
   */
  buildSystemPrompt(memories) {
    let prompt = this.soul.systemPrompt;

    if (memories.length > 0) {
      prompt += '\n\n## Relevant Context\n';
      for (const memory of memories) {
        prompt += `- ${memory.content}\n`;
      }
    }

    return prompt;
  }

  /**
   * Extract important information to remember
   */
  async extractAndStoreMemories(userMessage, assistantMessage) {
    // Simple extraction - can be enhanced with LLM-based extraction
    const patterns = {
      preference: /(?:I (?:like|prefer|want|love|hate|don't like))\s+(.+)/gi,
      name: /(?:my name is|call me|I'm called)\s+(\w+)/gi,
      reminder: /(?:remind me|remember that|don't forget)\s+(.+)/gi
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      const matches = userMessage.matchAll(pattern);
      for (const match of matches) {
        await this.memory.store({
          type,
          content: match[1],
          importance: 0.7
        });
      }
    }
  }

  /**
   * Log activity for dashboard
   */
  logActivity(action, channel, details = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      channel,
      details
    };
    this.activityLog.unshift(entry);

    // Keep only last 100 entries in memory
    if (this.activityLog.length > 100) {
      this.activityLog.pop();
    }
  }

  /**
   * Get recent activity for dashboard
   */
  getRecentActivity(limit = 20) {
    return this.activityLog.slice(0, limit);
  }

  /**
   * Process voice input
   */
  async processVoice(audioBuffer, channel) {
    // Transcribe audio to text
    const transcription = await this.voice.transcribe(audioBuffer);

    this.logActivity('voice_input', channel.type, {
      transcript: transcription.substring(0, 50)
    });

    // Process as regular message
    const response = await this.processMessage(
      { content: transcription },
      { ...channel, voiceEnabled: true }
    );

    return response;
  }
}
