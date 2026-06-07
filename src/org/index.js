/**
 * R.O.S.E Organization Module
 * Entry point for organizational hierarchy, routing, and delegation
 */

export { ORG_HIERARCHY, getExecutiveByKeyword, getExecutiveForDomain, getAllExecutives, getExecutiveByKey } from './hierarchy.js';
export { keywordRoute, llmRoute, routeMessage } from './router.js';
export { delegateToExecutive, recordDelegation, frameExecutiveResponse, buildSpawnConfig } from './delegator.js';

/**
 * Initialize organization module
 * Stores hierarchy in claude-flow memory if available
 */
export async function initializeOrg() {
  console.log('[ORG] Initializing organizational hierarchy...');

  // Log the hierarchy structure
  const { ORG_HIERARCHY } = await import('./hierarchy.js');
  const executives = Object.keys(ORG_HIERARCHY.executives);

  console.log(`[ORG] ✓ Loaded ${executives.length} executives:`, executives.join(', '));

  // Try to store in claude-flow memory (optional)
  try {
    // This would integrate with claude-flow MCP if available
    // For now, just confirm initialization
    console.log('[ORG] ✓ Organization hierarchy initialized');

    return {
      success: true,
      executives: executives.length,
      domains: executives.map(k => ORG_HIERARCHY.executives[k].domain)
    };
  } catch (error) {
    console.warn('[ORG] Could not store hierarchy in memory:', error.message);
    return {
      success: true,
      executives: executives.length,
      memoryStored: false
    };
  }
}

/**
 * Get organization summary for display
 */
export function getOrgSummary() {
  const { ORG_HIERARCHY } = require('./hierarchy.js');

  const executives = Object.entries(ORG_HIERARCHY.executives).map(([key, exec]) => ({
    key,
    name: exec.name,
    title: exec.fullTitle,
    domain: exec.domain,
    model: exec.model,
    subAgents: exec.subAgents.length
  }));

  return {
    ceo: ORG_HIERARCHY.ceo,
    chiefOfStaff: ORG_HIERARCHY.chiefOfStaff,
    executives,
    totalExecutives: executives.length,
    totalSubAgents: executives.reduce((sum, e) => sum + e.subAgents, 0)
  };
}

export default {
  initializeOrg,
  getOrgSummary
};
