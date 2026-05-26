// Content Script
class FocusScreenManager {
  constructor() {
    this.focusScreenElement = null;
    this.distractingWebsites = [
      'youtube.com',
      'netflix.com',
      'twitch.tv',
      'instagram.com',
      'facebook.com',
      'tiktok.com',
      'twitter.com',
      'reddit.com'
    ];
    this.init();
  }

  init() {
    // Listen for messages from background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'showFocusScreen') {
        this.showFocusScreen(request.session);
        sendResponse({ success: true });
      } else if (request.action === 'hideFocusScreen') {
        this.hideFocusScreen();
        sendResponse({ success: true });
      }
    });
  }

  isDistractionWebsite() {
    const hostname = window.location.hostname;
    return this.distractingWebsites.some(site => hostname.includes(site));
  }

  showFocusScreen(session) {
    if (this.focusScreenElement) return; // Already showing

    // Create overlay
    this.focusScreenElement = document.createElement('div');
    this.focusScreenElement.id = 'focus-screen-overlay';
    this.focusScreenElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      color: white;
      font-family: Arial, sans-serif;
    `;

    const timeRemaining = this.getTimeRemaining(session);
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);

    this.focusScreenElement.innerHTML = `
      <div style="text-align: center;">
        <h1 style="font-size: 48px; margin-bottom: 30px;">FOCUS MODE</h1>
        <div style="font-size: 72px; font-weight: bold; margin: 30px 0; font-family: monospace;">
          ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}
        </div>
        <p style="font-size: 18px; margin: 20px 0;">Stay focused and complete your session!</p>
        <button id="completeBtn" style="padding: 10px 20px; margin: 10px; background: white; color: #667eea; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Complete Session
        </button>
        <button id="abandonBtn" style="padding: 10px 20px; margin: 10px; background: rgba(255,255,255,0.2); color: white; border: 2px solid white; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Abandon Session
        </button>
      </div>
    `;

    document.body.appendChild(this.focusScreenElement);
    document.body.style.overflow = 'hidden';

    // Add button listeners
    document.getElementById('completeBtn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'completeSession' });
      this.hideFocusScreen();
    });

    document.getElementById('abandonBtn').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'abandonSession' });
      this.hideFocusScreen();
    });
  }

  hideFocusScreen() {
    if (this.focusScreenElement) {
      this.focusScreenElement.remove();
      this.focusScreenElement = null;
      document.body.style.overflow = '';
    }
  }

  getTimeRemaining(session) {
    const elapsed = Date.now() - session.startTime;
    const total = session.entertainmentDuration + session.focusDuration;
    return Math.max(0, total - elapsed);
  }
}

// Initialize
new FocusScreenManager();
