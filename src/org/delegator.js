/**
 * R.O.S.E Delegation System
 * Handles spawning executive agents and recording patterns
 */

import Anthropic from '@anthropic-ai/sdk';

/**
 * Build spawn configuration for an executive
 */
export function buildSpawnConfig(executive, message, context = {}) {
  const systemPrompt = executive.systemPrompt + `

## Current Request
User: ${message}

## Context
Channel: ${context.channel || 'web'}
Conversation ID: ${context.conversationId || 'unknown'}
Timestamp: ${new Date().toISOString()}

## Instructions
- Analyze the request and provide a helpful response
- If the task is complex, delegate to your sub-agents
- Keep responses clear and actionable
- Report back to Rose with your findings`;

  return {
    executive: executive.key,
    name: executive.name,
    model: executive.model,
    agentType: executive.agentType,
    systemPrompt,
    message,
    context
  };
}

/**
 * Delegate a task to an executive agent
 * Returns the executive's response
 */
export async function delegateToExecutive(executive, message, context = {}) {
  const client = new Anthropic();
  const config = buildSpawnConfig(executive, message, context);

  const modelMap = {
    'opus': 'claude-sonnet-4-20250514', // Use Sonnet as fallback for Opus
    'sonnet': 'claude-sonnet-4-20250514',
    'haiku': 'claude-3-haiku-20240307'
  };

  try {
    const response = await client.messages.create({
      model: modelMap[config.model] || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: config.systemPrompt,
      messages: [{ role: 'user', content: message }]
    });

    const executiveResponse = response.content[0].text;

    return {
      success: true,
      executive: executive.key,
      executiveName: executive.name,
      response: executiveResponse,
      model: config.model,
      tokens: response.usage
    };

  } catch (error) {
    console.error(`[DELEGATOR] Error delegating to ${executive.name}:`, error.message);
    return {
      success: false,
      executive: executive.key,
      executiveName: executive.name,
      error: error.message
    };
  }
}

/**
 * Record a delegation pattern for learning
 * Stores in claude-flow memory if available
 */
export async function recordDelegation(delegation, outcome = {}) {
  const record = {
    timestamp: new Date().toISOString(),
    executive: delegation.executive,
    executiveName: delegation.executiveName,
    messagePreview: delegation.message?.substring(0, 100),
    routingMethod: delegation.routingMethod || 'keyword',
    confidence: delegation.confidence,
    success: outcome.success !== false,
    responseTime: outcome.responseTime,
    userSatisfaction: outcome.userSatisfaction
  };

  // Try to store in claude-flow memory (non-blocking)
  try {
    // This would use claude-flow MCP if available
    // For now, just log it
    console.log('[DELEGATOR] Recording delegation:', JSON.stringify(record));

    // Store locally for analytics
    return record;
  } catch (error) {
    console.error('[DELEGATOR] Failed to record delegation:', error.message);
    return record;
  }
}

/**
 * Format executive response with Rose framing
 */
export function frameExecutiveResponse(executiveResult, executive) {
  if (!executiveResult.success) {
    return `I apologize, Sir. I attempted to consult with ${executive.fullTitle}, but encountered an issue. Let me try to assist you directly instead.`;
  }

  // Add subtle framing that Rose consulted with the executive
  const intro = getExecutiveIntro(executive.key);
  return `${intro}\n\n${executiveResult.response}`;
}

/**
 * Get an introduction phrase for executive delegation
 */
function getExecutiveIntro(executiveKey) {
  const intros = {
    cto: "I've consulted with our Chief Technology Officer on this.",
    cfo: "Our Chief Financial Officer has reviewed this matter.",
    cmo: "I've coordinated with our Chief Marketing Officer.",
    coo: "Our Chief Operations Officer has provided guidance.",
    cko: "I've gathered insights from our Chief Knowledge Officer.",
    cpo: "Our Chief Product Officer has weighed in on this.",
    cso: "I've consulted with our Chief Security Officer."
  };

  return intros[executiveKey] || "I've consulted with the appropriate executive.";
}

export default {
  buildSpawnConfig,
  delegateToExecutive,
  recordDelegation,
  frameExecutiveResponse
};
