/**
 * R.O.S.E Organizational Hierarchy
 * Defines the C-Suite structure and sub-agent teams
 */

export const ORG_HIERARCHY = {
  ceo: {
    name: 'Patrik',
    role: 'CEO',
    description: 'Chief Executive Officer - Ultimate decision maker'
  },

  chiefOfStaff: {
    name: 'Rose',
    role: 'Chief of Staff / Executive Assistant',
    description: 'Orchestrates all operations, routes requests to executives'
  },

  executives: {
    cto: {
      name: 'CTO',
      fullTitle: 'Chief Technology Officer',
      domain: 'technology',
      model: 'opus',
      agentType: 'system-architect',
      keywords: [
        'code', 'build', 'deploy', 'bug', 'feature', 'api', 'database',
        'server', 'infrastructure', 'devops', 'test', 'debug', 'refactor',
        'architecture', 'backend', 'frontend', 'mobile', 'docker', 'kubernetes',
        'ci/cd', 'pipeline', 'git', 'merge', 'branch', 'release', 'version',
        'performance', 'optimization', 'security vulnerability', 'technical debt'
      ],
      subAgents: [
        { name: 'Software Engineer', type: 'coder', model: 'sonnet' },
        { name: 'AI Engineer', type: 'coder', model: 'opus' },
        { name: 'Infrastructure Engineer', type: 'backend-dev', model: 'sonnet' },
        { name: 'QA Engineer', type: 'tester', model: 'sonnet' }
      ],
      systemPrompt: `You are the Chief Technology Officer (CTO) reporting to Rose.
Your responsibilities:
- Technical architecture and engineering decisions
- Code quality, security, and performance
- DevOps, CI/CD, and infrastructure
- Technical team coordination

Delegate complex tasks to your sub-agents:
- Software Engineer: General coding tasks
- AI Engineer: ML/AI implementations
- Infrastructure Engineer: DevOps and server management
- QA Engineer: Testing and quality assurance

Always provide clear, actionable technical guidance.`
    },

    cfo: {
      name: 'CFO',
      fullTitle: 'Chief Financial Officer',
      domain: 'finance',
      model: 'sonnet',
      agentType: 'planner',
      keywords: [
        'budget', 'cost', 'invoice', 'payment', 'expense', 'revenue',
        'profit', 'loss', 'financial', 'accounting', 'tax', 'billing',
        'subscription', 'pricing', 'roi', 'investment', 'funding',
        'forecast', 'cash flow', 'spending', 'savings', 'money'
      ],
      subAgents: [
        { name: 'Budget Analyst', type: 'planner', model: 'haiku' },
        { name: 'Investment Analyst', type: 'researcher', model: 'sonnet' },
        { name: 'Billing Agent', type: 'planner', model: 'haiku' }
      ],
      systemPrompt: `You are the Chief Financial Officer (CFO) reporting to Rose.
Your responsibilities:
- Budget management and financial planning
- Cost analysis and optimization
- Investment decisions and ROI tracking
- Billing and expense management

Delegate tasks to your sub-agents:
- Budget Analyst: Day-to-day budget tracking
- Investment Analyst: Research investment opportunities
- Billing Agent: Invoice and payment processing

Provide clear financial insights and recommendations.`
    },

    cmo: {
      name: 'CMO',
      fullTitle: 'Chief Marketing Officer',
      domain: 'marketing',
      model: 'sonnet',
      agentType: 'researcher',
      keywords: [
        'marketing', 'content', 'social', 'media', 'brand', 'campaign',
        'seo', 'analytics', 'audience', 'engagement', 'viral', 'influencer',
        'advertising', 'ad', 'promotion', 'twitter', 'linkedin', 'instagram',
        'blog', 'newsletter', 'email marketing', 'growth', 'reach'
      ],
      subAgents: [
        { name: 'Content Strategist', type: 'researcher', model: 'sonnet' },
        { name: 'SEO Specialist', type: 'researcher', model: 'haiku' },
        { name: 'Social Media Manager', type: 'researcher', model: 'haiku' }
      ],
      systemPrompt: `You are the Chief Marketing Officer (CMO) reporting to Rose.
Your responsibilities:
- Marketing strategy and brand management
- Content creation and distribution
- Social media and community engagement
- SEO and growth optimization

Delegate tasks to your sub-agents:
- Content Strategist: Content planning and creation
- SEO Specialist: Search optimization
- Social Media Manager: Platform-specific engagement

Create compelling marketing strategies and content.`
    },

    coo: {
      name: 'COO',
      fullTitle: 'Chief Operations Officer',
      domain: 'operations',
      model: 'sonnet',
      agentType: 'planner',
      keywords: [
        'process', 'workflow', 'schedule', 'meeting', 'calendar',
        'operations', 'efficiency', 'automation', 'task', 'project',
        'deadline', 'milestone', 'sprint', 'agile', 'kanban', 'roadmap',
        'resource', 'allocation', 'coordination', 'logistics', 'planning'
      ],
      subAgents: [
        { name: 'Project Manager', type: 'planner', model: 'sonnet' },
        { name: 'Process Designer', type: 'planner', model: 'haiku' },
        { name: 'Automation Coordinator', type: 'coder', model: 'haiku' }
      ],
      systemPrompt: `You are the Chief Operations Officer (COO) reporting to Rose.
Your responsibilities:
- Process optimization and workflow design
- Project management and resource allocation
- Scheduling and calendar management
- Automation and efficiency improvements

Delegate tasks to your sub-agents:
- Project Manager: Project tracking and coordination
- Process Designer: Workflow optimization
- Automation Coordinator: Task automation

Ensure smooth operations and efficient processes.`
    },

    cko: {
      name: 'CKO',
      fullTitle: 'Chief Knowledge Officer',
      domain: 'knowledge',
      model: 'sonnet',
      agentType: 'researcher',
      keywords: [
        'research', 'document', 'knowledge', 'learn', 'study', 'wiki',
        'documentation', 'reference', 'archive', 'library', 'notes',
        'summarize', 'explain', 'teach', 'tutorial', 'guide', 'howto',
        'information', 'data', 'insight', 'analysis', 'report'
      ],
      subAgents: [
        { name: 'Documentation Agent', type: 'researcher', model: 'haiku' },
        { name: 'Research Agent', type: 'researcher', model: 'sonnet' },
        { name: 'Knowledge Curator', type: 'researcher', model: 'haiku' }
      ],
      systemPrompt: `You are the Chief Knowledge Officer (CKO) reporting to Rose.
Your responsibilities:
- Knowledge management and documentation
- Research and information synthesis
- Learning resources and tutorials
- Organizational memory and archives

Delegate tasks to your sub-agents:
- Documentation Agent: Create and maintain docs
- Research Agent: Deep research and analysis
- Knowledge Curator: Organize and categorize knowledge

Provide comprehensive, well-researched information.`
    },

    cpo: {
      name: 'CPO',
      fullTitle: 'Chief Product Officer',
      domain: 'product',
      model: 'sonnet',
      agentType: 'planner',
      keywords: [
        'product', 'feature', 'roadmap', 'user', 'ux', 'ui', 'design',
        'requirement', 'spec', 'story', 'epic', 'backlog', 'priority',
        'mvp', 'prototype', 'feedback', 'iteration', 'launch', 'beta',
        'customer', 'usability', 'experience', 'journey', 'persona'
      ],
      subAgents: [
        { name: 'Product Manager', type: 'planner', model: 'sonnet' },
        { name: 'UX Reviewer', type: 'reviewer', model: 'haiku' },
        { name: 'Requirements Analyst', type: 'planner', model: 'haiku' }
      ],
      systemPrompt: `You are the Chief Product Officer (CPO) reporting to Rose.
Your responsibilities:
- Product strategy and roadmap
- Feature prioritization and planning
- User experience and design review
- Requirements gathering and analysis

Delegate tasks to your sub-agents:
- Product Manager: Feature planning and tracking
- UX Reviewer: Design and usability feedback
- Requirements Analyst: Spec documentation

Drive product excellence and user satisfaction.`
    },

    cso: {
      name: 'CSO',
      fullTitle: 'Chief Security Officer',
      domain: 'security',
      model: 'opus',
      agentType: 'security-architect',
      keywords: [
        'security', 'compliance', 'risk', 'audit', 'threat', 'vulnerability',
        'encryption', 'authentication', 'authorization', 'access', 'policy',
        'gdpr', 'privacy', 'breach', 'incident', 'pentest', 'penetration',
        'firewall', 'ssl', 'certificate', 'credentials', 'password', 'secret'
      ],
      subAgents: [
        { name: 'Strategy Analyst', type: 'security-architect', model: 'sonnet' },
        { name: 'Market Researcher', type: 'researcher', model: 'haiku' },
        { name: 'Risk Analyst', type: 'security-auditor', model: 'sonnet' }
      ],
      systemPrompt: `You are the Chief Security Officer (CSO) reporting to Rose.
Your responsibilities:
- Security architecture and best practices
- Risk assessment and mitigation
- Compliance and policy enforcement
- Incident response and threat analysis

Delegate tasks to your sub-agents:
- Strategy Analyst: Security strategy development
- Market Researcher: Threat intelligence
- Risk Analyst: Risk assessment and auditing

Ensure robust security across all systems.`
    }
  }
};

/**
 * Get executive by domain name
 */
export function getExecutiveForDomain(domain) {
  const normalized = domain.toLowerCase();
  for (const [key, exec] of Object.entries(ORG_HIERARCHY.executives)) {
    if (exec.domain === normalized || key === normalized) {
      return { key, ...exec };
    }
  }
  return null;
}

/**
 * Get executive by matching keywords in a message
 * Returns the executive with the most keyword matches
 */
export function getExecutiveByKeyword(message) {
  const lowerMessage = message.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const [key, exec] of Object.entries(ORG_HIERARCHY.executives)) {
    let score = 0;
    for (const keyword of exec.keywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        // Longer keywords get higher scores (more specific)
        score += keyword.split(' ').length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = { key, ...exec, matchScore: score };
    }
  }

  return bestMatch;
}

/**
 * Get all executives as a flat list
 */
export function getAllExecutives() {
  return Object.entries(ORG_HIERARCHY.executives).map(([key, exec]) => ({
    key,
    ...exec
  }));
}

/**
 * Get executive by key (e.g., 'cto', 'cfo')
 */
export function getExecutiveByKey(key) {
  const exec = ORG_HIERARCHY.executives[key.toLowerCase()];
  return exec ? { key: key.toLowerCase(), ...exec } : null;
}
