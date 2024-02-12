// Each event has an ID. So listeners know which event to subscribe to. If that event fires, the listener is called.

// Can you implement a class to enable this? It should:

// Emit events other code can subscribe to
// Subscribe to events, getting their outputs

class EventEmitter {
  subscriptions = new Map();

  subscribe(eventName, callback) {
    if (!this.subscriptions.has(eventName)) {
      this.subscriptions.set(eventName, new Set());
    }
    const subscriptions = this.subscriptions.get(eventName);
    const callbackObj = { callback };
    subscriptions.add(callbackObj);

    return {
      release: () => {
        subscriptions.delete(callbackObj);
        if (subscriptions.size === 0) {
          delete this.subscriptions.eventName;
        }
      },
    };
  }

  emit(eventName, ...args) {
    const subscriptions = this.subscriptions.get(eventName);
    if (subscriptions) {
      subscriptions.forEach((cbObj) => {
        cbObj.callback.apply(this, args);
      });
    }
  }
}
