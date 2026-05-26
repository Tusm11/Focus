// Popup Script - Main UI Logic

class PopupManager {
  constructor() {
    this.currentTab = 'dashboard';
    this.playerData = null;
    this.sessionActive = false;
    this.init();
  }

  async init() {
    await this.loadPlayerData();
    this.setupEventListeners();
    this.renderDashboard();
  }

  async loadPlayerData() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['player', 'session', 'quests', 'achievements'], (data) => {
        this.playerData = data.player || this.getDefaultPlayer();
        this.sessionData = data.session || null;
        this.quests = data.quests || [];
        this.achievements = data.achievements || [];
        resolve();
      });
    });
  }

  getDefaultPlayer() {
    return {
      name: 'Player',
      level: 1,
      rank: 'Novice',
      xp: 0,
      xpToNextLevel: 1000,
      gold: 0,
      streak: 0,
      totalFocusTime: 0,
      class: null,
      skillPoints: 0,
      skills: {},
      pet: {
        name: 'Companion',
        type: 'dragon',
        stage: 'baby',
        happiness: 50,
        xp: 0
      }
    };
  }

  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });

    // Focus tab
    document.getElementById('startFocusBtn').addEventListener('click', () => this.startSession());
    document.getElementById('pauseSessionBtn').addEventListener('click', () => this.pauseSession());
    document.getElementById('cancelSessionBtn').addEventListener('click', () => this.cancelSession());

    // Quests
    document.getElementById('createQuestBtn').addEventListener('click', () => this.openQuestModal());
    document.getElementById('closeQuestModal').addEventListener('click', () => this.closeQuestModal());
    document.getElementById('createQuestForm').addEventListener('submit', (e) => this.createQuest(e));

    // Character
    document.querySelectorAll('.class-card').forEach(card => {
      card.addEventListener('click', (e) => this.selectClass(e.target.closest('.class-card').dataset.class));
    });

    // Settings
    document.getElementById('settingsBtn').addEventListener('click', () => this.openSettings());

    // Focus screen
    document.getElementById('focusCompleteBtn').addEventListener('click', () => this.completeFocusSession());
    document.getElementById('focusAbandonBtn').addEventListener('click', () => this.abandonFocusSession());
  }

  switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    this.currentTab = tabName;

    // Render tab content
    if (tabName === 'dashboard') this.renderDashboard();
    if (tabName === 'quests') this.renderQuests();
    if (tabName === 'character') this.renderCharacter();
  }

  renderDashboard() {
    // Update player info
    document.getElementById('playerName').textContent = this.playerData.name;
    document.getElementById('playerLevel').textContent = `Level ${this.playerData.level}`;
    document.getElementById('playerRank').textContent = this.playerData.rank;

    // Update XP bar
    const xpPercent = (this.playerData.xp / this.playerData.xpToNextLevel) * 100;
    document.getElementById('xpFill').style.width = xpPercent + '%';
    document.getElementById('xpText').textContent = `${this.playerData.xp} / ${this.playerData.xpToNextLevel} XP`;

    // Update stats
    document.getElementById('goldAmount').textContent = this.playerData.gold;
    document.getElementById('streakDays').textContent = this.playerData.streak;
    document.getElementById('focusTime').textContent = this.formatTime(this.playerData.totalFocusTime);

    // Update pet
    document.getElementById('petName').textContent = this.playerData.pet.name;
    document.getElementById('petStage').textContent = `Stage: ${this.capitalizeFirst(this.playerData.pet.stage)}`;
    document.getElementById('happinessFill').style.width = this.playerData.pet.happiness + '%';
    document.getElementById('happinessText').textContent = this.playerData.pet.happiness + '%';

    // Render daily challenges
    this.renderDailyChallenges();

    // Update status
    if (this.sessionActive) {
      this.showActiveSession();
    } else {
      this.showIdleStatus();
    }
  }

  renderDailyChallenges() {
    const container = document.getElementById('dailyChallenges');
    container.innerHTML = '';

    const challenges = [
      { text: 'Complete 3 Focus Sessions', reward: '+100 XP' },
      { text: 'Avoid Social Media for 4 Hours', reward: '+50 XP' },
      { text: 'Finish 1 Quest', reward: '+75 XP' }
    ];

    challenges.forEach(challenge => {
      const el = document.createElement('div');
      el.className = 'challenge-item';
      el.innerHTML = `
        <span class="challenge-text">${challenge.text}</span>
        <span class="challenge-reward">${challenge.reward}</span>
      `;
      container.appendChild(el);
    });
  }

  renderQuests() {
    const container = document.getElementById('questsList');
    container.innerHTML = '';

    if (this.quests.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 20px;">No quests yet. Create one to get started!</p>';
      return;
    }

    this.quests.forEach(quest => {
      const el = document.createElement('div');
      el.className = 'quest-card';
      el.innerHTML = `
        <div class="quest-title">${quest.title}</div>
        <div class="quest-description">${quest.description}</div>
        <div class="quest-footer">
          <span class="quest-reward">+${quest.reward} XP</span>
          <span class="quest-difficulty ${quest.difficulty}">${this.capitalizeFirst(quest.difficulty)}</span>
        </div>
      `;
      container.appendChild(el);
    });
  }

  renderCharacter() {
    document.getElementById('characterName').textContent = this.playerData.name;
    document.getElementById('characterClass').textContent = `Class: ${this.playerData.class ? this.capitalizeFirst(this.playerData.class) : 'Not Selected'}`;
    document.getElementById('characterLevel').textContent = `Level ${this.playerData.level}`;

    // Show class selection if not chosen
    if (!this.playerData.class) {
      document.getElementById('classSelection').classList.remove('hidden');
    } else {
      document.getElementById('classSelection').classList.add('hidden');
    }

    // Render skills
    this.renderSkillTree();

    // Render achievements
    this.renderAchievements();
  }

  renderSkillTree() {
    const container = document.getElementById('skillsGrid');
    container.innerHTML = '';

    const skills = [
      { name: 'Deep Work', description: '+10% XP', cost: 1 },
      { name: 'Focus Mastery', description: 'Longer streak protection', cost: 2 },
      { name: 'Time Efficiency', description: 'Reduced focus requirements', cost: 1 },
      { name: 'Discipline', description: 'Reduced distraction penalties', cost: 2 }
    ];

    document.getElementById('skillPoints').textContent = this.playerData.skillPoints;

    skills.forEach(skill => {
      const el = document.createElement('div');
      const unlocked = this.playerData.skills[skill.name] || false;
      el.className = `skill-card ${unlocked ? 'unlocked' : ''}`;
      el.innerHTML = `
        <h4>${skill.name}</h4>
        <p>${skill.description}</p>
        <span class="skill-cost">${unlocked ? '✓ Unlocked' : `${skill.cost} Point${skill.cost > 1 ? 's' : ''}`}</span>
      `;
      el.addEventListener('click', () => {
        if (!unlocked && this.playerData.skillPoints >= skill.cost) {
          this.unlockSkill(skill.name, skill.cost);
        }
      });
      container.appendChild(el);
    });
  }

  renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    container.innerHTML = '';

    const achievements = [
      { name: 'First Focus', icon: '🎯' },
      { name: 'Level 10', icon: '⭐' },
      { name: '1000 XP', icon: '💫' },
      { name: '30-Day Streak', icon: '🔥' },
      { name: 'Boss Defeated', icon: '⚔️' },
      { name: 'Pet Evolved', icon: '🐉' }
    ];

    achievements.forEach(achievement => {
      const el = document.createElement('div');
      const unlocked = this.achievements.includes(achievement.name);
      el.className = `achievement-badge ${unlocked ? 'unlocked' : ''}`;
      el.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
      `;
      container.appendChild(el);
    });
  }

  openQuestModal() {
    document.getElementById('createQuestModal').classList.remove('hidden');
  }

  closeQuestModal() {
    document.getElementById('createQuestModal').classList.add('hidden');
    document.getElementById('createQuestForm').reset();
  }

  createQuest(e) {
    e.preventDefault();

    const quest = {
      id: Date.now(),
      title: document.getElementById('questTitle').value,
      description: document.getElementById('questDescription').value,
      reward: parseInt(document.getElementById('questReward').value),
      difficulty: document.getElementById('questDifficulty').value,
      completed: false
    };

    this.quests.push(quest);
    chrome.storage.local.set({ quests: this.quests });

    this.closeQuestModal();
    this.renderQuests();
  }

  selectClass(className) {
    this.playerData.class = className;
    chrome.storage.local.set({ player: this.playerData });
    this.renderCharacter();
  }

  unlockSkill(skillName, cost) {
    this.playerData.skills[skillName] = true;
    this.playerData.skillPoints -= cost;
    chrome.storage.local.set({ player: this.playerData });
    this.renderSkillTree();
  }

  startSession() {
    const entertainmentTime = parseInt(document.getElementById('entertainmentTime').value);
    const focusTime = parseInt(document.getElementById('focusSessionTime').value);
    const questId = document.getElementById('questSelect').value;

    // Send message to background service worker
    chrome.runtime.sendMessage({
      action: 'startSession',
      data: {
        entertainmentDuration: entertainmentTime * 60 * 1000,
        focusDuration: focusTime * 60 * 1000,
        questId: questId || null
      }
    }, (response) => {
      if (response && response.success) {
        this.sessionActive = true;
        this.showActiveSession();
        this.startTimer();
      }
    });
  }

  pauseSession() {
    // Implementation for pause
    console.log('Session paused');
  }

  cancelSession() {
    chrome.runtime.sendMessage({ action: 'abandonSession' }, () => {
      this.sessionActive = false;
      this.renderDashboard();
    });
  }

  completeFocusSession() {
    // Award XP and rewards
    const xpReward = 200;
    this.playerData.xp += xpReward;
    this.playerData.gold += 50;

    // Check level up
    if (this.playerData.xp >= this.playerData.xpToNextLevel) {
      this.levelUp();
    }

    chrome.storage.local.set({ player: this.playerData });
    chrome.storage.local.remove('session');

    this.sessionActive = false;
    this.renderDashboard();
  }

  abandonFocusSession() {
    // Penalty
    this.playerData.xp = Math.max(0, this.playerData.xp - 50);
    chrome.storage.local.set({ player: this.playerData });
    chrome.storage.local.remove('session');

    this.sessionActive = false;
    this.renderDashboard();
  }

  levelUp() {
    this.playerData.level += 1;
    this.playerData.xp = 0;
    this.playerData.xpToNextLevel = Math.floor(this.playerData.xpToNextLevel * 1.1);
    this.playerData.skillPoints += 1;

    // Update rank
    const ranks = ['Novice', 'Apprentice', 'Warrior', 'Elite', 'Master', 'Legend'];
    const rankIndex = Math.min(Math.floor(this.playerData.level / 5), ranks.length - 1);
    this.playerData.rank = ranks[rankIndex];
  }

  showActiveSession() {
    document.getElementById('activeSession').classList.remove('hidden');
    document.getElementById('statusContent').innerHTML = '';
  }

  showIdleStatus() {
    document.getElementById('activeSession').classList.add('hidden');
    document.getElementById('statusContent').innerHTML = `
      <div class="status-idle">
        <p>Ready to focus?</p>
        <button class="btn btn-primary" id="startEntertainmentBtn">Start Entertainment Session</button>
      </div>
    `;
  }

  startTimer() {
    // Timer logic would go here
    // This would update the display every second
  }

  openSettings() {
    console.log('Settings opened');
  }

  formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    return hours + 'h';
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
