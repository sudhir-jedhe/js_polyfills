// Implement a class that can subscribe to and emit events that trigger attached
// callback functions. Subscription objects are returned and can unsubscribe
// itself

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);

    return {
      unsubscribe: () => {
        this.events[event] = this.events[event].filter((fn) => fn !== callback);
      },
    };
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }
}

const emitter = new EventEmitter();

emitter.on("eventOne", (arg1, arg2) => {
  console.log(`Event one emitted with args: ${arg1}, ${arg2}`);
});

emitter.on("eventTwo", () => {
  console.log("Event two emitted");
});

emitter.emit("eventOne", 1, 2); // Logs 'Event one emitted with args: 1, 2'
emitter.emit("eventTwo"); // Logs 'Event two emitted'
