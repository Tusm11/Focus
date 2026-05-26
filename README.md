# Focus - Productivity RPG Browser Extension

A browser extension that transforms focus and productivity into an RPG experience.

## Overview

Instead of blocking distractions completely, Focus introduces a reward-based productivity loop:

1. **Entertainment Session** - Set a timer and browse entertainment sites
2. **Focus Mode** - When timer ends, distracting websites are blocked
3. **Complete Focus Session** - Earn XP, gold, and rewards
4. **Progress Character** - Level up, unlock skills, evolve pets
5. **Repeat** - Unlock more entertainment time through productivity

## Features

- 🎮 **RPG Progression** - XP, levels, ranks, skill trees
- 🎯 **Focus Sessions** - Entertainment timer + focus timer
- 📜 **Quests** - Create custom productivity goals
- 🐉 **Pet Companion** - Evolves through focus sessions
- ⚔️ **Boss Battles** - Defeat procrastination bosses
- 🏆 **Achievements** - Unlock badges and milestones
- 💰 **Gold Economy** - Earn currency for cosmetics
- 🔥 **Streak System** - Track consecutive productive days
- 🎓 **Character Classes** - Scholar, Monk, Warrior, Alchemist

## Project Structure

```
focus-extension/
├── manifest.json              # Extension configuration
├── src/
│   ├── popup/
│   │   ├── popup.html        # Main UI
│   │   ├── popup.css         # Styling
│   │   └── popup.js          # UI logic
│   ├── content/
│   │   └── contentScript.js  # Focus screen overlay
│   ├── background/
│   │   └── background.js     # Session management
│   ├── classes/
│   │   ├── Player.js         # Character progression
│   │   ├── Quest.js          # Quest system
│   │   ├── Boss.js           # Boss battles
│   │   ├── Pet.js            # Pet companion
│   │   ├── Achievement.js    # Achievement system
│   │   ├── SkillTree.js      # Skill progression
│   │   ├── FocusSession.js   # Session management
│   │   ├── RewardManager.js  # Reward calculation
│   │   ├── TimerManager.js   # Timer management
│   │   └── StorageManager.js # Data persistence
│   └── assets/               # Images and icons
├── .gitignore
└── README.md
```

## Installation

### For Development

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/focus-extension.git
   cd focus-extension
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable "Developer mode" (top right)

4. Click "Load unpacked"

5. Select the project directory

6. The Focus extension should now appear in your extensions list

## How It Works

### Session Flow

1. **Start Entertainment Session**
   - Set entertainment time (e.g., 30 minutes)
   - Set focus duration (e.g., 25 minutes)
   - Click "Start"

2. **Entertainment Phase**
   - Browse freely for set duration
   - Timer counts down in popup

3. **Focus Phase**
   - When entertainment time expires, focus mode activates
   - Distracting websites are blocked
   - Focus screen appears with timer
   - User must complete focus session

4. **Rewards**
   - Complete session → Earn XP + Gold
   - XP → Level up → Unlock skill points
   - Gold → Buy cosmetics
   - Pet happiness increases

### Reward System

| Focus Time | XP Reward |
|------------|-----------|
| 10 min | 50 XP |
| 25 min | 150 XP |
| 45 min | 300 XP |
| 60 min | 500 XP |

### Class Bonuses

- **Scholar**: +20% XP
- **Monk**: Focus sessions last longer
- **Warrior**: More boss damage
- **Alchemist**: +50% Gold

## Architecture

### Classes

- **Player** - Character with XP, levels, gold, class, skills, pet
- **Quest** - Productivity goals with rewards
- **Boss** - Boss battles with HP and difficulty
- **Pet** - Companion that evolves through focus
- **Achievement** - Badges and milestones
- **SkillTree** - Unlockable abilities
- **FocusSession** - Session management
- **RewardManager** - XP and gold calculations
- **TimerManager** - Countdown timers
- **StorageManager** - Chrome storage wrapper

### Message Flow

```
Popup UI
  ↓ (chrome.runtime.sendMessage)
Background Service Worker
  ↓ (chrome.tabs.sendMessage)
Content Script (on web pages)
  ↓ (shows focus screen)
Web Page
```

## Development

### Adding a Feature

1. Update relevant class in `src/classes/`
2. Update UI in `src/popup/popup.html`
3. Add styling in `src/popup/popup.css`
4. Add logic in `src/popup/popup.js`
5. Test in Chrome

### Testing

1. Load extension in Chrome developer mode
2. Open popup and test UI
3. Create a session with short times (1 min entertainment, 1 min focus)
4. Verify focus screen appears
5. Complete session and check rewards

### Debugging

- **Popup**: Right-click popup → Inspect
- **Background**: chrome://extensions/ → Inspect views
- **Content**: Right-click page → Inspect
- **Storage**: DevTools → Application → Local Storage

## Browser Support

- Chrome 90+
- Edge 90+
- Brave (Chromium-based)

## Data Storage

All data is stored locally using Chrome's storage API:
- Player stats
- Quests
- Achievements
- Session data

No data is sent to external servers.

## Roadmap

### Version 1 (Current)
- ✅ Core UI
- ✅ Game logic classes
- ✅ Session management
- ✅ Focus screen

### Version 2
- [ ] Boss battles UI
- [ ] Pet evolution UI
- [ ] Daily challenges
- [ ] Achievements system

### Version 3
- [ ] Leaderboards
- [ ] Social features
- [ ] AI-generated quests
- [ ] Analytics

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Transform focus into an adventure!** 🎮✨
