/**
 * R.O.S.E Core Intelligence
 * The central brain of the AI assistant
 */

import { chat } from './inference.js';
import { loadSoul } from './soul.js';
import { routeMessage, delegateToExecutive, recordDelegation, frameExecutiveResponse } from '../org/index.js';

export class RoseCore {
  constructor({ memory, voice, model }) {
    this.memory = memory;
    this.voice = voice;
    this.model = model;
    this.soul = loadSoul();
    this.activityLog = [];
    this.delegationEnabled = process.env.DELEGATION_ENABLED !== 'false';
    this.delegationLog = [];
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
      // Check if delegation is enabled and route the message
      let delegationResult = null;
      if (this.delegationEnabled) {
        delegationResult = await this.tryDelegation(message.content, channel);
        if (delegationResult) {
          const duration = Date.now() - startTime;
          this.logActivity('delegation_complete', channel.type, {
            duration,
            executive: delegationResult.executive,
            confidence: delegationResult.confidence
          });

          // Store in memory
          await this.memory.storeMessage(channel.conversationId, 'user', message.content);
          await this.memory.storeMessage(channel.conversationId, 'assistant', delegationResult.content);

          return {
            content: delegationResult.content,
            voice: channel.voiceEnabled ? await this.voice.synthesize(delegationResult.content) : null,
            delegation: {
              executive: delegationResult.executive,
              executiveName: delegationResult.executiveName,
              confidence: delegationResult.confidence
            }
          };
        }
      }

      // No delegation - Rose handles directly
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

      // Call Claude via OpenClaw
      const assistantMessage = await chat(systemPrompt, messages, { model: this.model });

      // Store in memory
      await this.memory.storeMessage(channel.conversationId, 'user', message.content);
      await this.memory.storeMessage(channel.conversationId, 'assistant', assistantMessage);

      // Extract and store any new memories
      await this.extractAndStoreMemories(message.content, assistantMessage);

      const duration = Date.now() - startTime;
      this.logActivity('response_sent', channel.type, {
        duration
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
   * Try to delegate message to an executive
   * Returns null if Rose should handle directly
   */
  async tryDelegation(messageContent, channel) {
    try {
      // Route the message to find appropriate executive
      const routeResult = await routeMessage(messageContent, {
        useLlmFallback: true,
        minConfidence: 0.7
      });

      // No delegation needed
      if (!routeResult.shouldDelegate || !routeResult.executive) {
        return null;
      }

      const executive = routeResult.executive;
      this.logActivity('delegation_started', channel.type, {
        executive: executive.key,
        confidence: routeResult.confidence
      });

      // Delegate to the executive
      const delegationStart = Date.now();
      const result = await delegateToExecutive(executive, messageContent, {
        channel: channel.type,
        conversationId: channel.conversationId
      });

      // Record the delegation for learning
      await recordDelegation({
        executive: executive.key,
        executiveName: executive.name,
        message: messageContent,
        routingMethod: routeResult.fallbackUsed ? 'llm' : 'keyword',
        confidence: routeResult.confidence
      }, {
        success: result.success,
        responseTime: Date.now() - delegationStart
      });

      // Store in delegation log
      this.delegationLog.unshift({
        timestamp: new Date().toISOString(),
        executive: executive.key,
        executiveName: executive.name,
        confidence: routeResult.confidence,
        success: result.success
      });
      if (this.delegationLog.length > 50) {
        this.delegationLog.pop();
      }

      if (!result.success) {
        return null; // Fall back to Rose
      }

      // Frame the executive's response with Rose's voice
      const framedResponse = frameExecutiveResponse(result, executive);

      return {
        content: framedResponse,
        executive: executive.key,
        executiveName: executive.name,
        confidence: routeResult.confidence
      };

    } catch (error) {
      console.error('[ROSE] Delegation error:', error.message);
      return null; // Fall back to Rose handling directly
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
   * Get recent delegations for dashboard
   */
  getRecentDelegations(limit = 10) {
    return this.delegationLog.slice(0, limit);
  }

  /**
   * Get delegation statistics
   */
  getDelegationStats() {
    const total = this.delegationLog.length;
    const successful = this.delegationLog.filter(d => d.success).length;
    const byExecutive = {};

    for (const d of this.delegationLog) {
      byExecutive[d.executive] = (byExecutive[d.executive] || 0) + 1;
    }

    return {
      total,
      successful,
      successRate: total > 0 ? (successful / total * 100).toFixed(1) : 0,
      byExecutive
    };
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
