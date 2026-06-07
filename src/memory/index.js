/**
 * R.O.S.E Memory System
 * Persistent memory and context management
 */

import pg from 'pg';

const { Pool } = pg;

let pool = null;

export async function initializeMemory() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn('[MEMORY] No DATABASE_URL set, using in-memory fallback');
    return new InMemoryStore();
  }

  try {
    pool = new Pool({ connectionString });

    // Test connection
    await pool.query('SELECT 1');
    console.log('[MEMORY] ✓ Connected to PostgreSQL');

    return new PostgresMemory(pool);
  } catch (error) {
    console.warn('[MEMORY] Failed to connect to PostgreSQL:', error.message);
    console.warn('[MEMORY] Using in-memory fallback');
    return new InMemoryStore();
  }
}

/**
 * PostgreSQL Memory Store
 */
class PostgresMemory {
  constructor(pool) {
    this.pool = pool;
  }

  async getConversationContext(conversationId, limit = 10) {
    const result = await this.pool.query(
      `SELECT role, content FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [conversationId, limit]
    );
    return result.rows.reverse();
  }

  async storeMessage(conversationId, role, content) {
    // Ensure conversation exists
    await this.pool.query(
      `INSERT INTO conversations (id, channel, last_message_at)
       VALUES ($1, 'web', NOW())
       ON CONFLICT (id) DO UPDATE SET last_message_at = NOW()`,
      [conversationId]
    );

    // Store message
    await this.pool.query(
      `INSERT INTO messages (conversation_id, role, content)
       VALUES ($1, $2, $3)`,
      [conversationId, role, content]
    );
  }

  async searchRelevant(query, limit = 5) {
    // Simple text search (can be enhanced with vector search)
    const result = await this.pool.query(
      `SELECT content, type, importance FROM memories
       WHERE content ILIKE $1
       ORDER BY importance DESC, accessed_at DESC
       LIMIT $2`,
      [`%${query}%`, limit]
    );
    return result.rows;
  }

  async store(memory) {
    await this.pool.query(
      `INSERT INTO memories (type, content, importance, metadata)
       VALUES ($1, $2, $3, $4)`,
      [memory.type, memory.content, memory.importance || 0.5, memory.metadata || {}]
    );
  }

  async logActivity(action, channel, details) {
    await this.pool.query(
      `INSERT INTO activity_log (action, channel, details)
       VALUES ($1, $2, $3)`,
      [action, channel, details]
    );
  }
}

/**
 * In-Memory Store (fallback)
 */
class InMemoryStore {
  constructor() {
    this.conversations = new Map();
    this.memories = [];
    this.activity = [];
  }

  async getConversationContext(conversationId, limit = 10) {
    const conv = this.conversations.get(conversationId) || [];
    return conv.slice(-limit);
  }

  async storeMessage(conversationId, role, content) {
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }
    this.conversations.get(conversationId).push({ role, content });
  }

  async searchRelevant(query, limit = 5) {
    const queryLower = query.toLowerCase();
    return this.memories
      .filter(m => m.content.toLowerCase().includes(queryLower))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  async store(memory) {
    this.memories.push({
      ...memory,
      createdAt: new Date()
    });
  }

  async logActivity(action, channel, details) {
    this.activity.unshift({
      action,
      channel,
      details,
      timestamp: new Date()
    });
    if (this.activity.length > 100) {
      this.activity.pop();
    }
  }
}
