/**
 * Singleton class to measure elapsed time
 */
export default class RunTimer {
  private static instance: RunTimer;
  private startTime: number | null = null;
  private elapsedTimeMs = 0;

  // Private constructor to prevent direct instantiation

  // Prettier disagrees with my autoformatter here so just disabling everything
  // eslint-disable-next-line
  private constructor() { }

  // Method to access the singleton instance
  public static getInstance(): RunTimer {
    if (!RunTimer.instance) {
      RunTimer.instance = new RunTimer();
    }
    return RunTimer.instance;
  }

  // Start the RunTimer
  public start(): void {
    if (this.startTime === null) {
      // Prevent restarting if already started
      this.startTime = Date.now();
    }
  }

  // Stop the RunTimer and calculate elapsed time
  public stop(): void {
    if (this.startTime !== null) {
      this.elapsedTimeMs += Date.now() - this.startTime;
      this.startTime = null; // Reset startTime to allow restart
    }
  }

  // Get the elapsed time in seconds
  public timeElapsed(): number {
    if (this.startTime !== null) {
      // If RunTimer is running, calculate elapsed time up to current moment
      return (this.elapsedTimeMs + (Date.now() - this.startTime)) / 1000;
    }
    return (this.elapsedTimeMs / 1000) % 1;
  }
}
// Usage:
// const RunTimer = RunTimer.getInstance();
// RunTimer.start();
// // After some time...
// RunTimer.stop();
// console.log(`Time Elapsed: ${RunTimer.timeElapsed()} ms`);
