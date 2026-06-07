/**
 * R.O.S.E Dashboard - Main Application
 */

class RoseDashboard {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.messageCount = 0;
    this.startTime = Date.now();
    this.currentAudio = null;

    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.connectSocket();
    this.loadSettings();
    this.startUptimeCounter();
  }

  cacheElements() {
    // Chat elements
    this.chatMessages = document.getElementById('chatMessages');
    this.chatInput = document.getElementById('chatInput');
    this.sendBtn = document.getElementById('sendBtn');
    this.clearChat = document.getElementById('clearChat');

    // Voice elements
    this.voiceBtn = document.getElementById('voiceBtn');
    this.voiceOverlay = document.getElementById('voiceOverlay');
    this.stopVoice = document.getElementById('stopVoice');
    this.speakerBtn = document.getElementById('speakerBtn');
    this.speakerIcon = document.getElementById('speakerIcon');

    // Status elements
    this.statusIndicator = document.getElementById('status');
    this.uptimeEl = document.getElementById('uptime');
    this.messageCountEl = document.getElementById('messageCount');
    this.discordStatusEl = document.getElementById('discordStatus');
    this.voiceStatusEl = document.getElementById('voiceStatus');

    // Activity elements
    this.activityList = document.getElementById('activityList');
    this.activityCount = document.getElementById('activityCount');

    // Settings elements
    this.settingsBtn = document.getElementById('settingsBtn');
    this.settingsModal = document.getElementById('settingsModal');
    this.themeSelect = document.getElementById('theme');
    this.voiceOutputSelect = document.getElementById('voiceOutput');

    // Quick actions
    this.actionBtns = document.querySelectorAll('.action-btn');
  }

  bindEvents() {
    // Send message
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    // Clear chat
    this.clearChat.addEventListener('click', () => this.clearMessages());

    // Voice input
    this.voiceBtn.addEventListener('click', () => this.toggleVoiceInput());
    this.stopVoice.addEventListener('click', () => this.stopVoiceInput());

    // Speaker toggle
    this.speakerBtn.addEventListener('click', () => this.toggleSpeaker());
    this.updateSpeakerIcon();

    // Unlock audio on first interaction
    const unlockAudio = () => {
      this.audioUnlocked = true;
      document.removeEventListener('click', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);

    // Settings
    this.settingsBtn.addEventListener('click', () => this.toggleSettings());
    this.settingsModal.querySelector('.modal-close').addEventListener('click', () => this.toggleSettings());
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.toggleSettings();
    });

    // Theme change
    this.themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));

    // Quick actions
    this.actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.handleQuickAction(action);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.chatInput.focus();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        this.settingsModal.classList.remove('active');
        this.voiceOverlay.classList.remove('active');
      }
    });
  }

  connectSocket() {
    const serverUrl = window.location.origin;
    this.socket = io(serverUrl);

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.updateStatus('online', 'Online');
      console.log('[ROSE] Connected to server');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      this.updateStatus('offline', 'Disconnected');
      console.log('[ROSE] Disconnected from server');
    });

    this.socket.on('welcome', (data) => {
      this.addMessage('assistant', data.message);
    });

    this.socket.on('response', (data) => {
      this.removeTypingIndicator();
      this.addMessage('assistant', data.content);

      // Play voice response if enabled and available
      if (data.voice && this.voiceOutputSelect.value === 'enabled') {
        this.playAudio(data.voice);
      }
    });

    this.socket.on('error', (data) => {
      this.removeTypingIndicator();
      this.addMessage('assistant', data.message, 'error');
    });

    this.socket.on('activity', (data) => {
      this.updateActivity(data);
    });

    // Handle delegation events
    this.socket.on('delegation', (data) => {
      this.showDelegationNotice(data);
    });

    // Handle org-wide activity
    this.socket.on('org-activity', (data) => {
      this.updateOrgActivity(data);
    });

    // Voice output - play audio when received
    this.socket.on('audio', (data) => {
      if (data.url && this.voiceOutputSelect.value === 'enabled') {
        this.playAudioUrl(data.url);
      }
    });
  }

  updateStatus(state, text) {
    this.statusIndicator.className = `status-indicator ${state}`;
    this.statusIndicator.querySelector('.status-text').textContent = text;
  }

  sendMessage() {
    const content = this.chatInput.value.trim();
    if (!content || !this.isConnected) return;

    // Add user message
    this.addMessage('user', content);
    this.chatInput.value = '';
    this.messageCount++;
    this.messageCountEl.textContent = this.messageCount;

    // Show typing indicator
    this.showTypingIndicator();

    // Send to server
    this.socket.emit('message', {
      content,
      tts: this.voiceOutputSelect.value === 'enabled'
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
    this.scrollToBottom();
  }

  formatMessage(content) {
    // Basic markdown-like formatting
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
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  clearMessages() {
    this.chatMessages.innerHTML = '';
    this.addMessage('assistant', 'Chat cleared. How may I assist you, Sir?');
  }

  // Voice Input
  async toggleVoiceInput() {
    if (this.isRecording) {
      this.stopVoiceInput();
    } else {
      await this.startVoiceInput();
    }
  }

  async startVoiceInput() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        this.audioChunks.push(e.data);
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.sendVoiceMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.voiceBtn.classList.add('recording');
      this.voiceOverlay.classList.add('active');
      this.voiceStatusEl.textContent = 'Recording...';

    } catch (error) {
      console.error('Failed to start voice recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }

  stopVoiceInput() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.voiceBtn.classList.remove('recording');
      this.voiceOverlay.classList.remove('active');
      this.voiceStatusEl.textContent = 'Processing...';
    }
  }

  async sendVoiceMessage(audioBlob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Audio = reader.result.split(',')[1];
      this.showTypingIndicator();
      this.socket.emit('voice', {
        audio: base64Audio
      });
      this.voiceStatusEl.textContent = 'Ready';
    };
    reader.readAsDataURL(audioBlob);
  }

  playAudio(base64Audio) {
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    audio.play().catch(err => console.error('Failed to play audio:', err));
  }

  playAudioUrl(url) {
    // Check if voice output is enabled
    if (this.voiceOutputSelect.value !== 'enabled') {
      return;
    }

    // Stop any currently playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    this.currentAudio = new Audio(url);
    this.voiceStatusEl.textContent = 'Speaking...';
    this.speakerBtn.classList.add('speaking');

    this.currentAudio.onended = () => {
      this.voiceStatusEl.textContent = 'Ready';
      this.speakerBtn.classList.remove('speaking');
      this.currentAudio = null;
    };

    this.currentAudio.onerror = (err) => {
      console.error('Failed to play audio:', err);
      this.voiceStatusEl.textContent = 'Ready';
      this.speakerBtn.classList.remove('speaking');
      this.currentAudio = null;
    };

    this.currentAudio.play().catch(err => {
      console.error('Failed to play audio:', err);
      this.voiceStatusEl.textContent = 'Click speaker to enable audio';
      this.speakerBtn.classList.remove('speaking');
    });
  }

  toggleSpeaker() {
    const current = this.voiceOutputSelect.value;
    this.voiceOutputSelect.value = current === 'enabled' ? 'disabled' : 'enabled';
    localStorage.setItem('rose-voice-output', this.voiceOutputSelect.value);
    this.updateSpeakerIcon();

    // Stop current audio if disabling
    if (this.voiceOutputSelect.value === 'disabled' && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
      this.voiceStatusEl.textContent = 'Ready';
      this.speakerBtn.classList.remove('speaking');
    }
  }

  updateSpeakerIcon() {
    const enabled = this.voiceOutputSelect.value === 'enabled';
    if (enabled) {
      this.speakerIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>';
      this.speakerBtn.classList.remove('muted');
    } else {
      this.speakerIcon.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
      this.speakerBtn.classList.add('muted');
    }
  }

  // Activity
  updateActivity(activities) {
    this.activityCount.textContent = activities.length;

    const html = activities.map(activity => {
      const icon = this.getActivityIcon(activity.action);
      const time = this.formatTimeAgo(new Date(activity.timestamp));

      return `
        <div class="activity-item">
          <div class="activity-icon">${icon}</div>
          <div class="activity-info">
            <div class="activity-action">${this.formatActivityAction(activity)}</div>
            <div class="activity-time">${time}</div>
          </div>
        </div>
      `;
    }).join('');

    this.activityList.innerHTML = html || '<p style="padding: 1rem; color: var(--text-muted);">No recent activity</p>';
  }

  getActivityIcon(action) {
    const icons = {
      'message_received': '💬',
      'response_sent': '✉️',
      'voice_input': '🎤',
      'error': '⚠️',
      'task_created': '📋',
      'reminder_set': '⏰',
      'delegation_started': '🔄',
      'delegation_complete': '✅'
    };
    return icons[action] || '📌';
  }

  // Delegation handling
  showDelegationNotice(data) {
    const executiveIcons = {
      cto: '💻',
      cfo: '💰',
      cmo: '📢',
      coo: '⚙️',
      cko: '📚',
      cpo: '📦',
      cso: '🔒'
    };

    const icon = executiveIcons[data.executive] || '👔';
    const confidence = Math.round(data.confidence * 100);

    // Add delegation badge to chat area temporarily
    const notice = document.createElement('div');
    notice.className = 'delegation-notice';
    notice.innerHTML = `
      <span class="delegation-icon">${icon}</span>
      <span class="delegation-text">Consulting ${data.executiveName} (${confidence}% match)</span>
    `;

    // Insert before typing indicator if present, or at end of chat
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
      this.chatMessages.insertBefore(notice, typingIndicator);
    } else {
      this.chatMessages.appendChild(notice);
    }

    this.scrollToBottom();

    // Remove after response arrives
    setTimeout(() => notice.remove(), 10000);
  }

  updateOrgActivity(data) {
    if (data.type === 'delegation') {
      // Update activity panel with delegation
      const activityItem = {
        action: 'delegation_complete',
        channel: 'org',
        timestamp: data.timestamp,
        details: {
          executive: data.executive,
          executiveName: data.executiveName,
          confidence: data.confidence
        }
      };

      // Prepend to activity list
      const activities = [activityItem, ...this.parseCurrentActivities()].slice(0, 20);
      this.updateActivity(activities);
    }
  }

  parseCurrentActivities() {
    const items = this.activityList.querySelectorAll('.activity-item');
    return Array.from(items).map(item => ({
      action: item.querySelector('.activity-action')?.textContent || '',
      timestamp: new Date().toISOString()
    }));
  }

  formatActivityAction(activity) {
    const actions = {
      'message_received': `Message from ${activity.channel}`,
      'response_sent': `Response sent (${activity.details?.duration || 0}ms)`,
      'voice_input': 'Voice input processed',
      'error': `Error: ${activity.details?.error || 'Unknown'}`,
      'delegation_started': `Routing to ${activity.details?.executive?.toUpperCase() || 'executive'}`,
      'delegation_complete': `${activity.details?.executiveName || 'Executive'} responded (${Math.round((activity.details?.confidence || 0) * 100)}%)`
    };
    return actions[activity.action] || activity.action;
  }

  formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString();
  }

  // Quick Actions
  handleQuickAction(action) {
    const prompts = {
      'status': 'Give me a brief status report.',
      'tasks': 'What are my current tasks and priorities?',
      'calendar': "What's on my schedule today?",
      'remind': 'Help me set a reminder.'
    };

    const prompt = prompts[action];
    if (prompt) {
      this.chatInput.value = prompt;
      this.sendMessage();
    }
  }

  // Settings
  toggleSettings() {
    this.settingsModal.classList.toggle('active');
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rose-theme', theme);
  }

  loadSettings() {
    // Load theme
    const savedTheme = localStorage.getItem('rose-theme') || 'dark';
    this.themeSelect.value = savedTheme;
    this.setTheme(savedTheme);

    // Load voice output setting
    const voiceOutput = localStorage.getItem('rose-voice-output') || 'enabled';
    this.voiceOutputSelect.value = voiceOutput;

    // Save on change
    this.voiceOutputSelect.addEventListener('change', (e) => {
      localStorage.setItem('rose-voice-output', e.target.value);
    });
  }

  // Uptime counter
  startUptimeCounter() {
    setInterval(() => {
      const seconds = Math.floor((Date.now() - this.startTime) / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      this.uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);

    // Fetch server status periodically
    this.fetchStatus();
    setInterval(() => this.fetchStatus(), 30000);
  }

  async fetchStatus() {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();

      this.discordStatusEl.textContent = data.channels?.discord ? 'Connected' : 'Offline';

      // Update uptime from server
      const uptime = data.uptime || 0;
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      const secs = Math.floor(uptime % 60);
      this.uptimeEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    } catch (error) {
      console.error('Failed to fetch status:', error);
    }
  }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
  window.roseDashboard = new RoseDashboard();
});
