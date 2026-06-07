/**
 * R.O.S.E Intent Router
 * Classifies messages and routes to appropriate executives
 */

import { infer } from '../core/inference.js';
import { getExecutiveByKeyword, getAllExecutives } from './hierarchy.js';

// Patterns that indicate Rose should handle directly (no delegation)
const ROSE_DIRECT_PATTERNS = [
  /^(hi|hello|hey|good\s*(morning|afternoon|evening)|greetings)/i,
  /^(thanks?|thank\s*you|thx)/i,
  /^(bye|goodbye|see\s*you|later)/i,
  /^(how\s*are\s*you|what'?s\s*up)/i,
  /^(who\s*are\s*you|what\s*is\s*your\s*name)/i,
  /^(help|what\s*can\s*you\s*do)/i
];

/**
 * Fast keyword-based routing
 * Returns executive match with confidence score
 */
export function keywordRoute(message) {
  // Check if Rose should handle directly
  for (const pattern of ROSE_DIRECT_PATTERNS) {
    if (pattern.test(message.trim())) {
      return {
        executive: null,
        confidence: 1.0,
        shouldDelegate: false,
        reason: 'direct_interaction'
      };
    }
  }

  // Try keyword matching
  const match = getExecutiveByKeyword(message);

  if (!match) {
    return {
      executive: null,
      confidence: 0.5,
      shouldDelegate: false,
      reason: 'no_keyword_match'
    };
  }

  // Calculate confidence based on match score
  // Score of 3+ keywords = high confidence
  const confidence = Math.min(0.4 + (match.matchScore * 0.15), 0.95);

  return {
    executive: match,
    confidence,
    shouldDelegate: confidence >= 0.7,
    reason: 'keyword_match',
    matchScore: match.matchScore
  };
}

/**
 * LLM-based routing using Haiku for fast classification
 * Used as fallback when keyword routing is uncertain
 */
export async function llmRoute(message) {
  const executives = getAllExecutives();

  const executiveList = executives.map(e =>
    `- ${e.key.toUpperCase()}: ${e.fullTitle} - ${e.domain} (keywords: ${e.keywords.slice(0, 5).join(', ')})`
  ).join('\n');

  const prompt = `Classify this user request and determine which executive should handle it.

Available executives:
${executiveList}

User request: "${message}"

Respond with ONLY a JSON object (no markdown, no explanation):
{
  "executive": "cto|cfo|cmo|coo|cko|cpo|cso|none",
  "confidence": 0.0-1.0,
  "reason": "brief explanation"
}

Use "none" if the request is a greeting, simple question, or doesn't match any executive domain.`;

  try {
    const text = await infer(prompt, { model: 'haiku' });
    const result = JSON.parse(text.trim());

    if (result.executive === 'none' || !result.executive) {
      return {
        executive: null,
        confidence: result.confidence || 0.8,
        shouldDelegate: false,
        reason: result.reason || 'llm_no_match'
      };
    }

    // Get the full executive object
    const exec = executives.find(e => e.key === result.executive.toLowerCase());

    return {
      executive: exec || null,
      confidence: result.confidence || 0.7,
      shouldDelegate: result.confidence >= 0.7,
      reason: result.reason || 'llm_match'
    };

  } catch (error) {
    console.error('[ROUTER] LLM routing error:', error.message);
    // Fall back to keyword routing
    return keywordRoute(message);
  }
}

/**
 * Main routing function
 * Uses keyword routing first, falls back to LLM for uncertain cases
 */
export async function routeMessage(message, options = {}) {
  const { useLlmFallback = true, minConfidence = 0.7 } = options;

  // First try keyword routing (fast)
  const keywordResult = keywordRoute(message);

  // If confident enough, use keyword result
  if (keywordResult.confidence >= minConfidence || !useLlmFallback) {
    return keywordResult;
  }

  // For uncertain cases, use LLM routing
  if (keywordResult.confidence >= 0.4 && keywordResult.confidence < minConfidence) {
    const llmResult = await llmRoute(message);

    // LLM has higher confidence, use it
    if (llmResult.confidence > keywordResult.confidence) {
      return {
        ...llmResult,
        fallbackUsed: true
      };
    }
  }

  // Keyword result is best we have
  return keywordResult;
}

export default {
  keywordRoute,
  llmRoute,
  routeMessage
};
