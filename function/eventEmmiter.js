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
      this.events[eventName].forEach((listener) => listener(...args));
    }
  }

  off(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (registeredListener) => registeredListener !== listener
      );
    }
  }
}

// Example usage:
const emitter = new EventEmitter();

// Subscribe to an event
const listener1 = (data) => console.log(`Listener 1: ${data}`);
emitter.on("myEvent", listener1);

// Emit an event
emitter.emit("myEvent", "Hello World!"); // Output: Listener 1: Hello World!

// Subscribe to the same event with another listener
const listener2 = (data) => console.log(`Listener 2: ${data}`);
emitter.on("myEvent", listener2);

// Emit the event again
emitter.emit("myEvent", "Another message");
// Output:
// Listener 1: Another message
// Listener 2: Another message

// Unsubscribe a listener
emitter.off("myEvent", listener1);

// Emit the event once more
emitter.emit("myEvent", "Final message");
// Output: Listener 2: Final message

/*********************************************** */
//   Event Emitter

// In the observer pattern (also commonly known as the publish-subscribe model), we can observe/subscribe to events emitted by publishers and execute code whenever an event happens.

// Implement an EventEmitter class similar to the one in Node.js that follows such an observer pattern.

// Example usage of the EventEmitter class:

const emitter = new EventEmitter();

function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}
emitter.on("foo", addTwoNumbers);
emitter.emit("foo", 2, 5);
// > "The sum is 7"

emitter.on("foo", (a, b) => console.log(`The product is ${a * b}`));
emitter.emit("foo", 4, 5);
// > "The sum is 9"
// > "The product is 20"

emitter.off("foo", addTwoNumbers);
emitter.emit("foo", -3, 9);
// > "The product is -27"
// Implement the following APIs:

// new EventEmitter()
// Creates an instance of the EventEmitter class. Events and listeners are isolated within the EventEmitter instances they're added to, aka listeners shouldn't react to events emitted by other EventEmitter instances.

// emitter.on(eventName, listener)
// Adds a callback function (listener) that will be invoked when an event with the name eventName is emitted.

// Parameter	Type	Description
// eventName	string	The name of the event.
// listener	Function	The callback function to be invoked when the event occurs.
// Returns the EventEmitter instance so that calls can be chained.

// emitter.off(eventName, listener)
// Removes the specified listener from the list of listeners for the event with the name eventName.

// Parameter	Type	Description
// eventName	string	The name of the event.
// listener	Function	Callback function to be removed from the list of listeners for the event.
// Returns the EventEmitter instance so that calls can be chained.

// emitter.emit(eventName[, ...args])
// Invokes each of the listeners listening to eventName with the supplied arguments in order.

// Parameter	Type	Description
// eventName	string	The name of the event.
// ...args	any	Arguments to invoke the list of listener functions with.
// Returns true if the event had listeners, false otherwise.
