Here's a complete implementation of the `EventEmitter` class in JavaScript based on the requirements and features outlined above.

### Implementation

```javascript
class EventEmitter {
  constructor() {
    // Store events and their associated listeners
    this.events = {};
  }

  /**
   * Adds a listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to be invoked when the event is emitted.
   * @returns {EventEmitter} The EventEmitter instance (for chaining).
   */
  on(eventName, listener) {
    if (typeof eventName !== "string" || typeof listener !== "function") {
      throw new Error("Invalid event name or listener.");
    }

    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    return this;
  }

  /**
   * Removes a specific listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} listener - The callback function to be removed.
   * @returns {EventEmitter} The EventEmitter instance (for chaining).
   */
  off(eventName, listener) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (registeredListener) => registeredListener !== listener
      );
    }
    return this;
  }

  /**
   * Emits the specified event, invoking all its listeners with the provided arguments.
   * @param {string} eventName - The name of the event.
   * @param {...any} args - Arguments to pass to the listeners.
   * @returns {boolean} True if the event had listeners, false otherwise.
   */
  emit(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((listener) => listener(...args));
      return true;
    }
    return false;
  }
}

// Example Usage

const emitter = new EventEmitter();

// Define a listener for addition
function addTwoNumbers(a, b) {
  console.log(`The sum is ${a + b}`);
}

// Subscribe to "foo" event
emitter.on("foo", addTwoNumbers);
emitter.emit("foo", 2, 5);
// Output: The sum is 7

// Add another listener for multiplication
emitter.on("foo", (a, b) => console.log(`The product is ${a * b}`));
emitter.emit("foo", 4, 5);
// Output:
// The sum is 9
// The product is 20

// Remove the addition listener
emitter.off("foo", addTwoNumbers);
emitter.emit("foo", -3, 9);
// Output: The product is -27

// Chained calls
emitter
  .on("bar", (msg) => console.log(`Listener 1: ${msg}`))
  .on("bar", (msg) => console.log(`Listener 2: ${msg}`));
emitter.emit("bar", "Chaining works!");
// Output:
// Listener 1: Chaining works!
// Listener 2: Chaining works!
```

### Features Implemented
1. **Isolation**: Each `EventEmitter` instance has isolated event storage.
2. **Chaining**: `on` and `off` methods return the instance for method chaining.
3. **Validation**: Input validation for `eventName` and `listener`.
4. **Emit Confirmation**: The `emit` method returns `true` if listeners exist, otherwise `false`.
5. **Event Removal**: Specific listeners can be removed using the `off` method.

This implementation adheres to common patterns used in event-driven programming and mimics the behavior of the Node.js `EventEmitter` class.