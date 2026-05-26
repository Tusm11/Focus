// FocusSession class
class FocusSession{
    constructor(entertainmentDuration, focusDuration, questId=null){
        this.id=this.id;
        this.entertainmentDuration = entertainmentDuration; // in milliseconds
        this.focusDuration = focusDuration; // in milliseconds
        this.questId = questId; // optional quest linked to session
        this.phase = 'entertainment'; // entertainment or focus
        this.startTime = Date.now();
        this.paused = false;
        this.pausedTime = null;
        this.completed = false;
        this.completedAt = null;
    }
}
