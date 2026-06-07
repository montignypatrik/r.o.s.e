/**
 * Mock Obsidian Graph Data
 *
 * This file contains mock data simulating the structure of the OpenClaw-Brain vault.
 * In the future, this will be replaced by:
 * 1. An ObsidianGraphAdapter that parses markdown files
 * 2. Real-time sync with the Obsidian vault
 * 3. RAG integration for semantic connections
 */

// Category definitions with colors
const CATEGORIES = {
  rose: { name: 'Rose', color: '#ff6b9d' },
  openclaw: { name: 'OpenClaw', color: '#00d4ff' },
  agents: { name: 'Agents', color: '#a855f7' },
  skills: { name: 'Skills', color: '#22c55e' },
  runpod: { name: 'RunPod', color: '#f97316' },
  models: { name: 'Models', color: '#3b82f6' },
  prompts: { name: 'Prompts', color: '#eab308' },
  decisions: { name: 'Decisions', color: '#ec4899' },
  runbooks: { name: 'Runbooks', color: '#14b8a6' },
  research: { name: 'Research', color: '#8b5cf6' }
};

// Node definitions - representing Obsidian notes
const NODES = [
  // Rose category
  { id: 'rose-overview', name: 'Rose Overview', category: 'rose', importance: 1.0 },
  { id: 'rose-personality', name: 'Rose Personality', category: 'rose', importance: 0.8 },
  { id: 'rose-memory', name: 'Rose Memory System', category: 'rose', importance: 0.9 },
  { id: 'rose-dashboard', name: 'Rose Dashboard', category: 'rose', importance: 0.7 },

  // OpenClaw category
  { id: 'openclaw-overview', name: 'OpenClaw Overview', category: 'openclaw', importance: 1.0 },
  { id: 'architecture', name: 'Architecture', category: 'openclaw', importance: 0.9 },
  { id: 'roadmap', name: 'Roadmap', category: 'openclaw', importance: 0.6 },

  // Agents category
  { id: 'router-agent', name: 'Router Agent', category: 'agents', importance: 0.9 },
  { id: 'claude-manager', name: 'Claude Manager Agent', category: 'agents', importance: 0.8 },
  { id: 'local-coding', name: 'Local Coding Agent', category: 'agents', importance: 0.7 },
  { id: 'research-agent', name: 'Research Agent', category: 'agents', importance: 0.6 },

  // Skills category
  { id: 'skills-registry', name: 'Skills Registry', category: 'skills', importance: 0.8 },
  { id: 'runpod-skill', name: 'RunPod Skill', category: 'skills', importance: 0.7 },
  { id: 'coding-skill', name: 'Coding Skill', category: 'skills', importance: 0.6 },

  // RunPod category
  { id: 'runpod-overview', name: 'RunPod Overview', category: 'runpod', importance: 0.8 },
  { id: 'start-runpod', name: 'Start RunPod Session', category: 'runpod', importance: 0.6 },
  { id: 'env-vars', name: 'Environment Variables', category: 'runpod', importance: 0.5 },
  { id: 'ssh-connection', name: 'SSH Connection', category: 'runpod', importance: 0.5 },

  // Models category
  { id: 'model-registry', name: 'Model Registry', category: 'models', importance: 0.8 },
  { id: 'qwen-coder', name: 'Qwen Coder', category: 'models', importance: 0.7 },
  { id: 'deepseek-coder', name: 'DeepSeek Coder', category: 'models', importance: 0.5 },
  { id: 'claude', name: 'Claude', category: 'models', importance: 0.9 },

  // Prompts category
  { id: 'prompt-library', name: 'Prompt Library', category: 'prompts', importance: 0.7 },
  { id: 'claude-prompts', name: 'Claude Code Prompts', category: 'prompts', importance: 0.6 },
  { id: 'debug-prompts', name: 'Debugging Prompts', category: 'prompts', importance: 0.5 },

  // Decisions category
  { id: 'decision-log', name: 'Decision Log', category: 'decisions', importance: 0.6 },
  { id: 'why-runpod', name: 'Why RunPod', category: 'decisions', importance: 0.4 },
  { id: 'why-obsidian', name: 'Why Obsidian', category: 'decisions', importance: 0.4 },

  // Runbooks category
  { id: 'start-openclaw', name: 'Start OpenClaw', category: 'runbooks', importance: 0.7 },
  { id: 'deploy-model', name: 'Deploy Coding Model', category: 'runbooks', importance: 0.6 },
  { id: 'troubleshooting', name: 'Troubleshooting', category: 'runbooks', importance: 0.5 },

  // Research category
  { id: 'rag-notes', name: 'RAG Notes', category: 'research', importance: 0.7 },
  { id: 'mcp-notes', name: 'MCP Notes', category: 'research', importance: 0.5 },
  { id: 'agent-architecture', name: 'Agent Architecture', category: 'research', importance: 0.6 },
  { id: 'obsidian-integration', name: 'Obsidian Graph Integration', category: 'research', importance: 0.8 }
];

// Edge definitions - representing wiki links between notes
const EDGES = [
  // Rose connections
  { source: 'rose-overview', target: 'rose-personality' },
  { source: 'rose-overview', target: 'rose-memory' },
  { source: 'rose-overview', target: 'rose-dashboard' },
  { source: 'rose-overview', target: 'openclaw-overview' },
  { source: 'rose-memory', target: 'rag-notes' },
  { source: 'rose-memory', target: 'obsidian-integration' },
  { source: 'rose-dashboard', target: 'architecture' },

  // OpenClaw connections
  { source: 'openclaw-overview', target: 'architecture' },
  { source: 'openclaw-overview', target: 'roadmap' },
  { source: 'openclaw-overview', target: 'router-agent' },
  { source: 'architecture', target: 'router-agent' },
  { source: 'architecture', target: 'skills-registry' },
  { source: 'architecture', target: 'model-registry' },

  // Agent connections
  { source: 'router-agent', target: 'claude-manager' },
  { source: 'router-agent', target: 'local-coding' },
  { source: 'router-agent', target: 'research-agent' },
  { source: 'claude-manager', target: 'claude' },
  { source: 'claude-manager', target: 'claude-prompts' },
  { source: 'local-coding', target: 'qwen-coder' },
  { source: 'local-coding', target: 'runpod-overview' },
  { source: 'local-coding', target: 'coding-skill' },

  // Skills connections
  { source: 'skills-registry', target: 'runpod-skill' },
  { source: 'skills-registry', target: 'coding-skill' },
  { source: 'runpod-skill', target: 'runpod-overview' },

  // RunPod connections
  { source: 'runpod-overview', target: 'start-runpod' },
  { source: 'runpod-overview', target: 'env-vars' },
  { source: 'start-runpod', target: 'ssh-connection' },
  { source: 'start-runpod', target: 'deploy-model' },
  { source: 'why-runpod', target: 'runpod-overview' },

  // Models connections
  { source: 'model-registry', target: 'qwen-coder' },
  { source: 'model-registry', target: 'deepseek-coder' },
  { source: 'model-registry', target: 'claude' },
  { source: 'qwen-coder', target: 'deploy-model' },

  // Prompts connections
  { source: 'prompt-library', target: 'claude-prompts' },
  { source: 'prompt-library', target: 'debug-prompts' },
  { source: 'claude-prompts', target: 'claude' },
  { source: 'debug-prompts', target: 'troubleshooting' },

  // Decisions connections
  { source: 'decision-log', target: 'why-runpod' },
  { source: 'decision-log', target: 'why-obsidian' },
  { source: 'why-obsidian', target: 'rose-memory' },

  // Runbooks connections
  { source: 'start-openclaw', target: 'architecture' },
  { source: 'start-openclaw', target: 'troubleshooting' },
  { source: 'deploy-model', target: 'qwen-coder' },
  { source: 'troubleshooting', target: 'ssh-connection' },

  // Research connections
  { source: 'rag-notes', target: 'obsidian-integration' },
  { source: 'agent-architecture', target: 'router-agent' },
  { source: 'obsidian-integration', target: 'rose-dashboard' }
];

/**
 * ObsidianGraphAdapter (Mock Implementation)
 *
 * In the future, this adapter will:
 * 1. Read markdown files from a directory
 * 2. Parse [[wiki links]] to build edges
 * 3. Extract frontmatter for metadata
 * 4. Watch for file changes
 */
class ObsidianGraphAdapter {
  constructor() {
    this.nodes = NODES;
    this.edges = EDGES;
    this.categories = CATEGORIES;
  }

  /**
   * Get all graph data
   * @returns {Object} { nodes, edges, categories }
   */
  getGraphData() {
    // Calculate link counts for each node
    const linkCounts = {};
    this.edges.forEach(edge => {
      linkCounts[edge.source] = (linkCounts[edge.source] || 0) + 1;
      linkCounts[edge.target] = (linkCounts[edge.target] || 0) + 1;
    });

    // Enhance nodes with link counts
    const enhancedNodes = this.nodes.map(node => ({
      ...node,
      linkCount: linkCounts[node.id] || 0,
      categoryColor: this.categories[node.category].color
    }));

    return {
      nodes: enhancedNodes,
      edges: this.edges,
      categories: this.categories
    };
  }

  /**
   * Get node by ID
   * @param {string} id
   * @returns {Object|null}
   */
  getNode(id) {
    return this.nodes.find(n => n.id === id) || null;
  }

  /**
   * Get edges connected to a node
   * @param {string} nodeId
   * @returns {Array}
   */
  getConnectedEdges(nodeId) {
    return this.edges.filter(e => e.source === nodeId || e.target === nodeId);
  }

  /**
   * Future: Load from real markdown files
   * @param {string} vaultPath
   */
  async loadFromVault(vaultPath) {
    // TODO: Implement real markdown parsing
    // 1. Recursively read .md files
    // 2. Parse content for [[links]]
    // 3. Extract frontmatter
    // 4. Build graph structure
    console.log('[ObsidianAdapter] Future: Load from vault:', vaultPath);
    return this.getGraphData();
  }
}

// Export for use in other modules
window.ObsidianGraphAdapter = ObsidianGraphAdapter;
window.BRAIN_CATEGORIES = CATEGORIES;
