class Task {
  name: string;
  description: string;
  isActive = false;
  isComplete = false;
  startTime: number | null = null;
  completionTime = 0;

  constructor(name, description, taskPromise) {
    this.name = name;
    this.description = description;
    taskPromise.then(() => {
      this.isComplete = true;
      this.stopTimer();
    });
  }

  startTimer(): void {
    if (this.startTime === null) {
      // Prevent restarting if already started
      this.startTime = Date.now();
    }
  }

  stopTimer(): void {
    this.completionTime = this.timeElapsed();
    this.startTime = null;
  }

  timeElapsed(): number {
    if (this.startTime !== null) {
      return Math.round((Date.now() - this.startTime) / 1000);
    }
    return this.completionTime;
  }

  timeElapsedString(): string {
    return `${this.timeElapsed()}s`;
  }
}

export default class TaskTracker {
  tasks: Task[];

  constructor(initialTasks = []) {
    this.tasks = initialTasks;
  }

  startTask(name, description, promise) {
    const newTask = new Task(name, description, promise);
    newTask.startTimer();
    this.tasks.push(newTask);
    return newTask;
  }
}
