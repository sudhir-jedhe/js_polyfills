// The Observer pattern is a design pattern where an object (known as the subject) maintains a list of dependents (observers) that are notified of any changes in the object's state. With a little ingenuity, we can leverage the EventTarget interface and the Proxy object to implement the Observer pattern in JavaScript.

// At its heart the Observer pattern is a simple pub/sub (publish–subscribe) system. We can create a Observable class that extends the EventTarget interface and use a Proxy object to intercept property changes, via the set trap.

// When a property changes, a CustomEvent is created to notify any observers, carrying the name of the property as its type and the new value as its detail. Finally, the event will be dispatched via EventTarget.dispatchEvent(), notifying all registered listeners.


class Observable extends EventTarget {
    constructor() {
      super();
      return new Proxy(this, {
        set: (target, property, value) => {
          target[property] = value;
          this.dispatchEvent(new CustomEvent(property, { detail: value }));
          return true;
        },
      });
    }
  }
  
  const subject = new Observable();
  
  subject.addEventListener('name', event => {
    console.log(`Name changed to ${event.detail}`);
  });
  
  subject.name = 'Alice'; // Name changed to Alice