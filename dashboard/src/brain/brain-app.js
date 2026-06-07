/**
 * Rose Brain Dashboard Application
 *
 * Main application controller that orchestrates:
 * - Brain visualization
 * - Chat panel
 * - Socket.io communication
 * - Settings
 */

class RoseBrainApp {
  constructor() {
    this.socket = null;
    this.brainGraph = null;
    this.adapter = null;
    this.isConnected = false;
    this.isChatCollapsed = false;
    this.currentAudio = null;

    this.init();
  }

  init() {
    this.cacheElements();
    this.initBrainGraph();
    this.initSocket();
    this.bindEvents();
    this.loadSettings();
    this.startClock();
  }

  cacheElements() {
    // Status elements
    this.connectionStatus = document.getElementById('connectionStatus');
    this.systemTime = document.getElementById('systemTime');

    // Brain elements
    this.brainCanvas = document.getElementById('brainCanvas');
    this.brainInfo = document.getElementById('brainInfo');
    this.nodeCount = document.getElementById('nodeCount');
    this.connectionCount = document.getElementById('connectionCount');
    this.categoryCount = document.getElementById('categoryCount');
    this.nodeTooltip = document.getElementById('nodeTooltip');
    this.tooltipTitle = document.getElementById('tooltipTitle');
    this.tooltipCategory = document.getElementById('tooltipCategory');
    this.tooltipLinks = document.getElementById('tooltipLinks');
    this.categoryLegend = document.getElementById('categoryLegend');

    // Chat elements
    this.chatPanel = document.getElementById('chatPanel');
    this.chatToggle = document.getElementById('chatToggle');
    this.chatHandle = document.getElementById('chatHandle');
    this.chatContent = document.getElementById('chatContent');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.voiceBtn = document.getElementById('voiceBtn');
    this.speakerBtn = document.getElementById('speakerBtn');
    this.speakerIcon = document.getElementById('speakerIcon');

    // Settings elements
    this.settingsBtn = document.getElementById('settingsBtn');
    this.settingsModal = document.getElementById('settingsModal');
    this.closeSettings = document.getElementById('closeSettings');
    this.voiceOutput = document.getElementById('voiceOutput');
    this.brainAnimation = document.getElementById('brainAnimation');
  }

  initBrainGraph() {
    // Create graph visualization
    this.brainGraph = new RoseBrainGraph(this.brainCanvas);

    // Set up event handlers
    this.brainGraph.onNodeHover = (node, x, y) => this.handleNodeHover(node, x, y);
    this.brainGraph.onNodeClick = (node) => this.handleNodeClick(node);

    // Load data from adapter
    this.adapter = new ObsidianGraphAdapter();
    const data = this.adapter.getGraphData();
    this.brainGraph.loadData(data);

    // Update stats
    const stats = this.brainGraph.getStats();
    this.nodeCount.textContent = stats.nodeCount;
    this.connectionCount.textContent = stats.connectionCount;
    this.categoryCount.textContent = stats.categoryCount;

    // Build category legend
    this.buildCategoryLegend(data.categories);

    // Start animation
    this.brainGraph.start();
  }

  buildCategoryLegend(categories) {
    this.categoryLegend.innerHTML = Object.entries(categories).map(([key, cat]) => `
      <div class="legend-item" data-category="${key}">
        <span class="legend-dot" style="background: ${cat.color}"></span>
        <span>${cat.name}</span>
      </div>
    `).join('');
  }

  initSocket() {
    const serverUrl = window.location.origin;
    this.socket = io(serverUrl);

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.updateConnectionStatus(true);
      console.log('[ROSE] Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.updateConnectionStatus(false);
      console.log('[ROSE] Disconnected from server');
    });

    this.socket.on('welcome', (data) => {
      this.addMessage('assistant', data.message);
    });

    this.socket.on('response', (data) => {
      this.removeTypingIndicator();
      this.addMessage('assistant', data.content);
    });

    this.socket.on('audio', (data) => {
      if (data.url && this.voiceOutput.value === 'enabled') {
        this.playAudio(data.url);
      }
    });

    this.socket.on('error', (data) => {
      this.removeTypingIndicator();
      this.addMessage('assistant', data.message, 'error');
    });
  }

  updateConnectionStatus(connected) {
    const statusText = this.connectionStatus.querySelector('.status-text');
    if (connected) {
      this.connectionStatus.classList.add('online');
      statusText.textContent = 'ONLINE';
    } else {
      this.connectionStatus.classList.remove('online');
      statusText.textContent = 'OFFLINE';
    }
  }

  bindEvents() {
    // Chat toggle
    this.chatHandle.addEventListener('click', () => this.toggleChat());
    this.chatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleChat();
    });

    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Voice controls
    this.speakerBtn.addEventListener('click', () => this.toggleSpeaker());

    // Settings
    this.settingsBtn.addEventListener('click', () => this.toggleSettings());
    this.closeSettings.addEventListener('click', () => this.toggleSettings());
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.toggleSettings();
    });

    // Settings changes
    this.voiceOutput.addEventListener('change', () => {
      localStorage.setItem('rose-voice-output', this.voiceOutput.value);
      this.updateSpeakerIcon();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.settingsModal.classList.remove('active');
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.chatInput.focus();
        if (this.isChatCollapsed) this.toggleChat();
      }
    });
  }

  toggleChat() {
    this.isChatCollapsed = !this.isChatCollapsed;
    this.chatPanel.classList.toggle('collapsed', this.isChatCollapsed);
  }

  sendMessage() {
    const content = this.chatInput.value.trim();
    if (!content || !this.isConnected) return;

    this.addMessage('user', content);
    this.chatInput.value = '';
    this.showTypingIndicator();

    this.socket.emit('message', {
      content,
      tts: this.voiceOutput.value === 'enabled'
    });
  }

  addMessage(role, content, type = '') {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${role} ${type}`;

    const avatar = role === 'assistant' ? '🌹' : '👤';
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    messageEl.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-bubble">
        <div class="message-content">${this.formatMessage(content)}</div>
        <div class="message-time">${time}</div>
      </div>
    `;

    this.chatMessages.appendChild(messageEl);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message assistant typing';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = `
      <div class="message-avatar">🌹</div>
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    this.chatMessages.appendChild(indicator);
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  playAudio(url) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    this.currentAudio = new Audio(url);
    this.speakerBtn.classList.add('speaking');

    this.currentAudio.onended = () => {
      this.speakerBtn.classList.remove('speaking');
      this.currentAudio = null;
    };

    this.currentAudio.onerror = () => {
      this.speakerBtn.classList.remove('speaking');
      this.currentAudio = null;
    };

    this.currentAudio.play().catch(() => {
      this.speakerBtn.classList.remove('speaking');
    });
  }

  toggleSpeaker() {
    const current = this.voiceOutput.value;
    this.voiceOutput.value = current === 'enabled' ? 'disabled' : 'enabled';
    localStorage.setItem('rose-voice-output', this.voiceOutput.value);
    this.updateSpeakerIcon();

    if (this.voiceOutput.value === 'disabled' && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.speakerBtn.classList.remove('speaking');
    }
  }

  updateSpeakerIcon() {
    const enabled = this.voiceOutput.value === 'enabled';
    if (enabled) {
      this.speakerIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      this.speakerBtn.classList.remove('muted');
    } else {
      this.speakerIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      this.speakerBtn.classList.add('muted');
    }
  }

  toggleSettings() {
    this.settingsModal.classList.toggle('active');
  }

  loadSettings() {
    // Voice output
    const voiceSetting = localStorage.getItem('rose-voice-output') || 'enabled';
    this.voiceOutput.value = voiceSetting;
    this.updateSpeakerIcon();
  }

  startClock() {
    const updateTime = () => {
      const now = new Date();
      this.systemTime.textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  handleNodeHover(node, x, y) {
    if (node) {
      this.tooltipTitle.textContent = node.name;
      this.tooltipCategory.textContent = this.adapter.categories[node.category].name;
      this.tooltipLinks.textContent = `${node.linkCount} connections`;

      // Position tooltip
      this.nodeTooltip.style.left = `${x + 15}px`;
      this.nodeTooltip.style.top = `${y - 10}px`;
      this.nodeTooltip.classList.add('visible');
    } else {
      this.nodeTooltip.classList.remove('visible');
    }
  }

  handleNodeClick(node) {
    // Future: Open note preview or navigate to note
    console.log('[ROSE] Node clicked:', node.name);

    // For now, send a message asking about this topic
    const message = `Tell me about ${node.name}`;
    this.chatInput.value = message;
    if (this.isChatCollapsed) this.toggleChat();
    this.chatInput.focus();
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  window.roseBrainApp = new RoseBrainApp();
});
