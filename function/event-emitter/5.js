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

const emitter = new Emitter();
const sub1 = emitter.subscribe("event1", callback1);
const sub2 = emitter.subscribe("event2", callback2);

// same callback could subscribe
// on same event multiple times
const sub3 = emitter.subscribe("event1", callback1);

emitter.emit("event1", 1, 2);
// callback1 will be called twice

// Subscription returned by subscribe() has a release() method that could be used to unsubscribe
sub1.release();
sub3.release();
// now even if we emit 'event1' again,
// callback1 is not called anymore
