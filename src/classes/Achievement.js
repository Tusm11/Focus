// Achievement class
class Achievement{
    constructor(name, description, icon, rarity){
        this.id = Date.now();
        this.name = name;
        this.description = description;
        this.icon = icon; // emoji or image
        this.rarity = rarity; // common, rare, epic, legendary
        this.unlocked = false;
        this.unlockedAt = null;
        this.reward = 100; // XP reward
    }
}