// RewardManager class 
class RewardManager {
  constructor() {
    this.xpTable = {
      10: 50,    // 10 min = 50 XP
      25: 150,   // 25 min = 150 XP
      45: 300,   // 45 min = 300 XP
      60: 500    // 60 min = 500 XP
    };
  }

  calculateXP(focusMinutes, playerClass = null) {
    // Calculate base XP based on focus time
    let xp = 0;
    if (focusMinutes <= 10) xp = 50;
    else if (focusMinutes <= 25) xp = 150;
    else if (focusMinutes <= 45) xp = 300;
    else xp = 500;

    // Apply class bonus
    if (playerClass === 'scholar') xp *= 1.2; // +20% for scholar
    
    return Math.floor(xp);
  }

  calculateGold(focusMinutes, playerClass = null) {
    let gold = 50; // base gold
    if (playerClass === 'alchemist') gold *= 1.5; // +50% for alchemist
    return Math.floor(gold);
  }
}
