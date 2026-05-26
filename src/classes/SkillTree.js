class SkillTree {
  constructor() {
    this.skills = {
      deepWork: {
        name: 'Deep Work',
        description: '+10% XP',
        cost: 1,
        unlocked: false
      },
      focusMastery: {
        name: 'Focus Mastery',
        description: 'Longer streak protection',
        cost: 1,
        unlocked: false
      },
      timeEfficiency: {
        name: 'Time Efficiency',
        description: 'Reduced focus requirements',
        cost: 2,
        unlocked: false
      },
      discipline: {
        name: 'Discipline',
        description: 'Reduced distraction penalties',
        cost: 1,
        unlocked: false
      }
    };
  }
}