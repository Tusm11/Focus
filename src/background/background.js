// Background Service Worker 
class BackgroundManager {
  constructor() {
    this.timerManager = new TimerManager();
    this.rewardManager = new RewardManager();
    this.currentSession = null;
    this.currentPlayer = null;
    this.init();
  }

  init() {
    // Listen for messages from popup and content scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'startSession') {
        this.startSession(request.data);
        sendResponse({ success: true });
      } else if (request.action === 'completeSession') {
        this.completeSession();
        sendResponse({ success: true });
      } else if (request.action === 'abandonSession') {
        this.abandonSession();
        sendResponse({ success: true });
      }
    });
  }

  async startSession(data) {
    // Create new focus session
    this.currentSession = new FocusSession(
      data.entertainmentDuration,
      data.focusDuration,
      data.questId
    );

    // Save session
    await StorageManager.saveSession(this.currentSession);

    // Start entertainment timer
    this.timerManager.startTimer(
      this.currentSession.id,
      this.currentSession.entertainmentDuration,
      () => this.switchToFocusPhase()
    );
  }

  switchToFocusPhase() {
    // Switch from entertainment to focus
    this.currentSession.phase = 'focus';
    StorageManager.saveSession(this.currentSession);

    // Notify all tabs to show focus screen
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'showFocusScreen',
          session: this.currentSession
        }).catch(() => {});
      });
    });

    // Start focus timer
    this.timerManager.startTimer(
      this.currentSession.id,
      this.currentSession.focusDuration,
      () => this.completeSession()
    );
  }

  async completeSession() {
    // Load player
    this.currentPlayer = await StorageManager.loadPlayer();

    // Calculate rewards
    const focusMinutes = this.currentSession.focusDuration / (60 * 1000);
    const xpReward = this.rewardManager.calculateXP(focusMinutes, this.currentPlayer.class);
    const goldReward = this.rewardManager.calculateGold(focusMinutes, this.currentPlayer.class);

    // Update player
    this.currentPlayer.xp += xpReward;
    this.currentPlayer.gold += goldReward;
    this.currentPlayer.totalFocusTime += this.currentSession.focusDuration;
    this.currentPlayer.streak += 1;

    // Check level up
    if (this.currentPlayer.xp >= this.currentPlayer.xpToNextLevel) {
      this.levelUp();
    }

    // Save player
    await StorageManager.savePlayer(this.currentPlayer);

    // Clear session
    this.currentSession = null;
    await StorageManager.saveSession(null);

    // Notify popup of completion
    chrome.runtime.sendMessage({
      action: 'sessionCompleted',
      rewards: { xp: xpReward, gold: goldReward }
    }).catch(() => {});
  }

  levelUp() {
    this.currentPlayer.level += 1;
    this.currentPlayer.xp = 0;
    this.currentPlayer.xpToNextLevel = Math.floor(this.currentPlayer.xpToNextLevel * 1.1);
    this.currentPlayer.skillPoints += 1;
  }

  async abandonSession() {
    // Apply penalty
    this.currentPlayer = await StorageManager.loadPlayer();
    this.currentPlayer.xp = Math.max(0, this.currentPlayer.xp - 50);
    this.currentPlayer.streak = 0;

    await StorageManager.savePlayer(this.currentPlayer);

    // Clear session
    this.currentSession = null;
    await StorageManager.saveSession(null);
  }
}

// Initialize background manager
new BackgroundManager();
