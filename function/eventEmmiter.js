/*********************How to implement Event Emitter in JavaScript?*************************** */

class EventEmitter {
    constructor() {
        this.events = {};
    }
  
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }
  
    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(...args));
        }
    }
  
    off(eventName, listener) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(
                registeredListener => registeredListener !== listener
            );
        }
    }
  }
  
  // Example usage:
  const emitter = new EventEmitter();
  
  // Subscribe to an event
  const listener1 = data => console.log(`Listener 1: ${data}`);
  emitter.on('myEvent', listener1);
  
  // Emit an event
  emitter.emit('myEvent', 'Hello World!'); // Output: Listener 1: Hello World!
  
  // Subscribe to the same event with another listener
  const listener2 = data => console.log(`Listener 2: ${data}`);
  emitter.on('myEvent', listener2);
  
  // Emit the event again
  emitter.emit('myEvent', 'Another message');
  // Output:
  // Listener 1: Another message
  // Listener 2: Another message
  
  // Unsubscribe a listener
  emitter.off('myEvent', listener1);
  
  // Emit the event once more
  emitter.emit('myEvent', 'Final message');
  // Output: Listener 2: Final message