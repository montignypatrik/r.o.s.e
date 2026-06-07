/**
 * Rose Brain Graph Visualization
 *
 * Renders an animated neural sphere with:
 * - Glowing golden core
 * - Orbiting nodes representing knowledge
 * - Energy connections between nodes
 * - Particle effects
 */

class RoseBrainGraph {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.nodes = [];
    this.edges = [];
    this.particles = [];
    this.categories = {};

    // Animation state
    this.time = 0;
    this.hoveredNode = null;
    this.selectedNode = null;
    this.animationId = null;

    // Configuration
    this.config = {
      coreRadius: 80,
      orbitRadiusMin: 150,
      orbitRadiusMax: 300,
      nodeBaseSize: 6,
      particleCount: 50,
      rotationSpeed: 0.0003,
      pulseSpeed: 0.002,
      connectionOpacity: 0.3
    };

    // Colors
    this.colors = {
      coreBright: '#ffd700',
      coreWarm: '#ff9500',
      coreGlow: 'rgba(255, 180, 0, 0.3)',
      connection: 'rgba(255, 200, 50, 0.2)',
      particle: 'rgba(255, 220, 100, 0.8)'
    };

    // Mouse tracking
    this.mouse = { x: 0, y: 0 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;

    // Recalculate node positions
    this.layoutNodes();
  }

  /**
   * Load graph data from adapter
   * @param {Object} data - { nodes, edges, categories }
   */
  loadData(data) {
    this.categories = data.categories;
    this.edges = data.edges;

    // Create node objects with positions
    this.nodes = data.nodes.map((node, index) => {
      const categoryIndex = Object.keys(this.categories).indexOf(node.category);
      const categoryCount = Object.keys(this.categories).length;
      const nodesInCategory = data.nodes.filter(n => n.category === node.category);
      const indexInCategory = nodesInCategory.indexOf(node);

      return {
        ...node,
        // Position will be calculated in layoutNodes
        x: 0,
        y: 0,
        z: 0,
        // Visual properties
        size: this.config.nodeBaseSize * (0.5 + node.importance * 0.5),
        angle: 0,
        orbitRadius: 0,
        verticalAngle: 0,
        // Animation
        pulsePhase: Math.random() * Math.PI * 2,
        orbitSpeed: 0.0002 + Math.random() * 0.0003
      };
    });

    this.layoutNodes();
    this.createParticles();
  }

  /**
   * Position nodes in a 3D orbital layout
   */
  layoutNodes() {
    if (this.nodes.length === 0) return;

    const categoryKeys = Object.keys(this.categories);

    this.nodes.forEach((node, index) => {
      const categoryIndex = categoryKeys.indexOf(node.category);
      const nodesInCategory = this.nodes.filter(n => n.category === node.category);
      const indexInCategory = nodesInCategory.indexOf(node);

      // Distribute categories around the sphere
      const categoryAngle = (categoryIndex / categoryKeys.length) * Math.PI * 2;

      // Spread nodes within category
      const spreadAngle = (indexInCategory / nodesInCategory.length) * Math.PI * 0.5 - Math.PI * 0.25;

      // Calculate orbit radius based on importance (more important = closer to center)
      const radiusRange = this.config.orbitRadiusMax - this.config.orbitRadiusMin;
      node.orbitRadius = this.config.orbitRadiusMin + radiusRange * (1 - node.importance * 0.5);

      // Initial angles
      node.angle = categoryAngle + spreadAngle;
      node.verticalAngle = (Math.random() - 0.5) * Math.PI * 0.4;
    });
  }

  /**
   * Create floating particles
   */
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.config.particleCount; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: this.config.coreRadius + Math.random() * (this.config.orbitRadiusMax - this.config.coreRadius),
        verticalAngle: (Math.random() - 0.5) * Math.PI,
        speed: 0.001 + Math.random() * 0.002,
        size: 1 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
  }

  /**
   * Main animation loop
   */
  animate() {
    this.time += 16; // ~60fps
    this.update();
    this.render();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.animationId) {
      this.animate();
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Update positions
   */
  update() {
    // Update node positions
    this.nodes.forEach(node => {
      node.angle += node.orbitSpeed;

      // Calculate 3D position
      const cosV = Math.cos(node.verticalAngle);
      node.x = this.centerX + Math.cos(node.angle) * node.orbitRadius * cosV;
      node.y = this.centerY + Math.sin(node.angle) * node.orbitRadius * 0.4 + Math.sin(node.verticalAngle) * node.orbitRadius * 0.3;
      node.z = Math.sin(node.angle) * cosV; // For depth sorting
    });

    // Update particles
    this.particles.forEach(p => {
      p.angle += p.speed;
    });
  }

  /**
   * Render the visualization
   */
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sort nodes by z for proper layering
    const sortedNodes = [...this.nodes].sort((a, b) => a.z - b.z);

    // Draw background glow
    this.drawBackgroundGlow();

    // Draw connections (behind core)
    this.drawConnections(sortedNodes.filter(n => n.z < 0));

    // Draw core sphere
    this.drawCore();

    // Draw connections (in front of core)
    this.drawConnections(sortedNodes.filter(n => n.z >= 0));

    // Draw particles
    this.drawParticles();

    // Draw nodes
    sortedNodes.forEach(node => this.drawNode(node));
  }

  /**
   * Draw ambient background glow
   */
  drawBackgroundGlow() {
    const ctx = this.ctx;

    // Outer ambient glow
    const gradient = ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.config.orbitRadiusMax * 1.2
    );
    gradient.addColorStop(0, 'rgba(255, 180, 0, 0.08)');
    gradient.addColorStop(0.3, 'rgba(255, 150, 0, 0.04)');
    gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.02)');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the central core sphere
   */
  drawCore() {
    const ctx = this.ctx;
    const pulse = Math.sin(this.time * this.config.pulseSpeed) * 0.1 + 1;
    const radius = this.config.coreRadius * pulse;

    // Outer glow
    const glowGradient = ctx.createRadialGradient(
      this.centerX, this.centerY, radius * 0.5,
      this.centerX, this.centerY, radius * 2.5
    );
    glowGradient.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
    glowGradient.addColorStop(0.4, 'rgba(255, 150, 0, 0.15)');
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, radius * 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Core sphere gradient
    const coreGradient = ctx.createRadialGradient(
      this.centerX - radius * 0.3, this.centerY - radius * 0.3, 0,
      this.centerX, this.centerY, radius
    );
    coreGradient.addColorStop(0, '#fff8e0');
    coreGradient.addColorStop(0.2, this.colors.coreBright);
    coreGradient.addColorStop(0.6, this.colors.coreWarm);
    coreGradient.addColorStop(1, '#cc6600');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Inner energy rings
    ctx.strokeStyle = 'rgba(255, 255, 200, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const ringRadius = radius * (0.3 + i * 0.25);
      const offset = (this.time * 0.001 + i) % (Math.PI * 2);
      ctx.beginPath();
      ctx.arc(this.centerX, this.centerY, ringRadius, offset, offset + Math.PI * 1.5);
      ctx.stroke();
    }
  }

  /**
   * Draw connections between nodes
   */
  drawConnections(visibleNodes) {
    const ctx = this.ctx;
    const nodeIds = new Set(visibleNodes.map(n => n.id));

    this.edges.forEach(edge => {
      const sourceNode = this.nodes.find(n => n.id === edge.source);
      const targetNode = this.nodes.find(n => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      // Only draw if at least one node is in the visible set
      if (!nodeIds.has(sourceNode.id) && !nodeIds.has(targetNode.id)) return;

      // Calculate opacity based on depth
      const avgZ = (sourceNode.z + targetNode.z) / 2;
      const depthOpacity = 0.3 + (avgZ + 1) * 0.35;

      // Draw connection line
      const gradient = ctx.createLinearGradient(
        sourceNode.x, sourceNode.y,
        targetNode.x, targetNode.y
      );
      gradient.addColorStop(0, sourceNode.categoryColor + '40');
      gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.15)');
      gradient.addColorStop(1, targetNode.categoryColor + '40');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.globalAlpha = depthOpacity * this.config.connectionOpacity;

      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);

      // Curved connection through center area
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      const pullToCenter = 0.3;
      const ctrlX = midX + (this.centerX - midX) * pullToCenter;
      const ctrlY = midY + (this.centerY - midY) * pullToCenter;

      ctx.quadraticCurveTo(ctrlX, ctrlY, targetNode.x, targetNode.y);
      ctx.stroke();

      ctx.globalAlpha = 1;
    });
  }

  /**
   * Draw floating particles
   */
  drawParticles() {
    const ctx = this.ctx;

    this.particles.forEach(p => {
      const x = this.centerX + Math.cos(p.angle) * p.radius * Math.cos(p.verticalAngle);
      const y = this.centerY + Math.sin(p.angle) * p.radius * 0.4 + Math.sin(p.verticalAngle) * p.radius * 0.3;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2);
      gradient.addColorStop(0, `rgba(255, 220, 100, ${p.brightness})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Draw a single node
   */
  drawNode(node) {
    const ctx = this.ctx;
    const isHovered = this.hoveredNode === node;
    const isSelected = this.selectedNode === node;

    // Calculate visual properties based on depth
    const depthScale = 0.6 + (node.z + 1) * 0.4;
    const size = node.size * depthScale * (isHovered ? 1.5 : 1);
    const opacity = 0.5 + (node.z + 1) * 0.5;

    // Pulse effect
    const pulse = Math.sin(this.time * 0.003 + node.pulsePhase) * 0.2 + 1;

    // Node glow
    const glowRadius = size * 3 * pulse;
    const glowGradient = ctx.createRadialGradient(
      node.x, node.y, 0,
      node.x, node.y, glowRadius
    );
    glowGradient.addColorStop(0, node.categoryColor + (isHovered ? 'cc' : '80'));
    glowGradient.addColorStop(0.5, node.categoryColor + '40');
    glowGradient.addColorStop(1, 'transparent');

    ctx.globalAlpha = opacity;
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Node core
    const coreGradient = ctx.createRadialGradient(
      node.x - size * 0.3, node.y - size * 0.3, 0,
      node.x, node.y, size
    );
    coreGradient.addColorStop(0, '#ffffff');
    coreGradient.addColorStop(0.3, node.categoryColor);
    coreGradient.addColorStop(1, node.categoryColor + 'aa');

    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Selected ring
    if (isSelected) {
      ctx.strokeStyle = node.categoryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 5, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  /**
   * Handle mouse move for hover effects
   */
  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;

    // Find hovered node
    let newHovered = null;
    let minDist = 30; // Hover radius

    this.nodes.forEach(node => {
      const dist = Math.hypot(node.x - this.mouse.x, node.y - this.mouse.y);
      if (dist < minDist) {
        minDist = dist;
        newHovered = node;
      }
    });

    if (newHovered !== this.hoveredNode) {
      this.hoveredNode = newHovered;
      this.canvas.style.cursor = newHovered ? 'pointer' : 'default';

      // Update tooltip
      if (this.onNodeHover) {
        this.onNodeHover(newHovered, this.mouse.x, this.mouse.y);
      }
    }
  }

  /**
   * Handle click on node
   */
  handleClick(e) {
    if (this.hoveredNode) {
      this.selectedNode = this.hoveredNode;
      if (this.onNodeClick) {
        this.onNodeClick(this.hoveredNode);
      }
    } else {
      this.selectedNode = null;
    }
  }

  /**
   * Get graph statistics
   */
  getStats() {
    return {
      nodeCount: this.nodes.length,
      connectionCount: this.edges.length,
      categoryCount: Object.keys(this.categories).length
    };
  }
}

// Export
window.RoseBrainGraph = RoseBrainGraph;
