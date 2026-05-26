// StorageManager class
class StorageManager {
  // Save player data
  static savePlayer(player) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ player: player }, resolve);
    });
  }

  // Load player data
  static loadPlayer() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['player'], (data) => {
        resolve(data.player || null);
      });
    });
  }

  // Save quests
  static saveQuests(quests) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ quests: quests }, resolve);
    });
  }

  // Load quests
  static loadQuests() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['quests'], (data) => {
        resolve(data.quests || []);
      });
    });
  }

  // Save session
  static saveSession(session) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ session: session }, resolve);
    });
  }

  // Load session
  static loadSession() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['session'], (data) => {
        resolve(data.session || null);
      });
    });
  }

  // Clear all data
  static clearAll() {
    return new Promise((resolve) => {
      chrome.storage.local.clear(resolve);
    });
  }
}
