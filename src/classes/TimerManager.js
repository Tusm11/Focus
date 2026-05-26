// TimerManager class

class TimerManager {
  constructor() {
    this.timers = {}; // store active timers
  }

  startTimer(sessionId, duration, callback) {
    // Start a timer that calls callback when done
    // duration in milliseconds
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      
      if (remaining === 0) {
        clearInterval(interval);
        delete this.timers[sessionId];
        callback(sessionId); // call callback when timer ends
      }
    }, 1000); // update every second
    
    this.timers[sessionId] = interval;
  }

  stopTimer(sessionId) {
    if (this.timers[sessionId]) {
      clearInterval(this.timers[sessionId]);
      delete this.timers[sessionId];
    }
  }

  getTimeRemaining(sessionId, startTime, duration) {
    const elapsed = Date.now() - startTime;
    return Math.max(0, duration - elapsed);
  }
}
