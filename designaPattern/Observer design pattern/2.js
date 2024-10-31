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


  /*************************** */
  class Observable {
  
    constructor(setup) {
      this._setup = setup
    }
   
    subscribe(subscriber) {  // equivalent to fire
      // a wrapper function/ object 
      // is used to share the closure of outer function and modify the logics
      const subscriberWrapper = {
        unsubscribed: false,
        next(value) {
          if (this.unsubscribed) return
          // we are relying on the scope of subscriber
          if (subscriber instanceof Function) return subscriber(value);
          return subscriber.next ? subscriber.next(value) : null
        },
        error(value) {
          if (this.unsubscribed) return
          this.unsubscribe();
          return subscriber.error ? subscriber.error(value) : null;
        }, 
        complete() {
          if (this.unsubscribed) return;
          this.unsubscribe();  
          return subscriber.complete ? subscriber.complete() : null
        },
        unsubscribe() {
          this.unsubscribed = true;
        }
      }
      this._setup(subscriberWrapper);
      return subscriberWrapper
    }
  }
  /*************** */

  class Subscriber {
    constructor(subscriber) {
      if (typeof subscriber === 'function') {
        this.subscriber = { next: subscriber};
      } else {
        this.subscriber = subscriber;
      }
      this.isUnsubscribed = false;
    }
    next(value) {
      if (this.isUnsubscribed) return;
      if (this.subscriber.next) {
        try {
          this.subscriber.next(value);
        } catch (err) {
          this.error(err);
        }
      }
    }
    error(err) {
      if (this.isUnsubscribed) return;
      if (this.subscriber.error) {
        this.subscriber.error(err);
      }
      this.unsubscribe();
    }
    complete() {
      if (this.isUnsubscribed) return;
      if (this.subscriber.complete) {
        this.subscriber.complete();
      }
      this.unsubscribe();
    }
    unsubscribe() {
      this.isUnsubscribed = true;
    }
  }
  class Observable {
    constructor(setup) {
      this.setup = setup;
    }
   
    subscribe(subscriber) {
      const sub = new Subscriber(subscriber);
      this.setup(sub);
      return {
        unsubscribe() {
          sub.unsubscribe();
        }
      }
    }
  }
  /***************************** */


  /best talk about creating own observable: https://www.youtube.com/watch?v=m40cF91F8_A
// if you don't have much time: https://www.youtube.com/watch?v=Tux1nhBPl_w
class Observable {
  
  constructor(setup) {
    this._setup = setup
  }
 
  subscribe(subscriber) {
    // a wrapper function/ object 
    // is used to share the closure of outer function and modify the logics
    const subscriberWrapper = {
      unsubscribed: false,
      next(value) {
        if (this.unsubscribed) return
        //function as Observer should be treated as next
        if (subscriber instanceof Function) return subscriber(value);
        return subscriber.next ? subscriber.next(value) : null
      },
      error(value) {
        if (this.unsubscribed) return
        this.unsubscribe();
        return subscriber.error ? subscriber.error(value) : null;
      }, 
      complete() {
        if (this.unsubscribed) return;
        this.unsubscribe();  
        return subscriber.complete ? subscriber.complete() : null
      },
      unsubscribe() {
        this.unsubscribed = true;
      }
    }
    this._setup(subscriberWrapper);
    return subscriberWrapper
  }
}
/*
const observable = new Observable((subscriber)=> {
  subscriber.next(1)
})
const values = []
observable.subscribe((value) => values.push(value))
console.log(values) //toEqual([1])
*/
/*
const observable = new Observable((subscriber)=> {
  subscriber.next(1)
})
const values = []
observable.subscribe((value) => values.push(value))
console.log(values) //.toEqual([1])
*/
//sync values could be delivered
const observable = new Observable((subscriber)=> {
  subscriber.next(1)
  subscriber.next(2)
  subscriber.next(3)
})
const values = []
const observer = {
  next: (value) => {
     values.push(value)
  }
}
observable.subscribe(observer)
console.log(values)
/*
//async values could be delivered
const observable = new Observable((subscriber)=> {
  subscriber.next(1)
  subscriber.next(2)
  subscriber.next(3)
  
  setTimeout(() => {
    subscriber.next(4)
    subscriber.next(5)
  }, 100)
})
const values = []
const observer = {
  next: (value) => {
     values.push(value)
  }
}
observable.subscribe(observer)
setTimeout(() => {
  console.log(values) //.toEqual([1,2,3,4,5])
  done()
}, 150)
 */
/*
//error notification should work
const observable = new Observable((subscriber) => {
  subscriber.next(1)
  subscriber.error(2)
})
const values = []
const errors = []
const observer = {
  next: (value) => {
     values.push(value)
  },
  error: (error) => {
    errors.push(error)
  }
}
observable.subscribe(observer)
console.log(values) //.toEqual([1])
console.log(errors) //.toEqual([2])
*/
/*
could unsubscribe 
const observable = new Observable((subscriber) => {
  subscriber.next(1)
  subscriber.next(2)
  setTimeout(() => {
    subscriber.next(3)
    subscriber.complete()
  }, 100)
})
const values = []
const complete = jasmine.createSpy()
const observer = {
  next: (value) => values.push(value),
  complete
}
const sub = observable.subscribe(observer)
setTimeout(() => {
  sub.unsubscribe()
}, 50)
setTimeout(() => {
  expect(values).toEqual([1,2])
  expect(complete).not.toHaveBeenCalled()
  done()
}, 200)
*/
/*
// support multiple subscription
const observable = new Observable((subscriber) => {
  subscriber.next(1)
  subscriber.next(2)
  setTimeout(() => {
    subscriber.next(3)
    subscriber.complete()
  }, 100)
})
const values1 = []
const complete1 = jasmine.createSpy()
const observer1 = {
  next: (value) => values1.push(value),
  complete: complete1
}
const values2 = []
const complete2 = jasmine.createSpy()
const observer2 = {
  next: (value) => values2.push(value),
  complete: complete2
}
const sub1 = observable.subscribe(observer1)
const sub2 = observable.subscribe(observer2)
setTimeout(() => {
  sub1.unsubscribe()
}, 50)
setTimeout(() => {
  expect(values1).toEqual([1,2])
  expect(complete1).not.toHaveBeenCalled()
  expect(values2).toEqual([1,2,3])
  expect(complete2).toHaveBeenCalled()
  done()
}, 200)
*/


  class Subject {
    constructor() {
      this.subscribers = []
    }
    next = (val) => {
      for (let s of this.subscribers)
        s.next(val)
    }
    error = (e) => {
      for (let s of this.subscribers)
        s.error(e)
    }
    complete = () => {
      for (let s of this.subscribers)
        s.complete()
    }
    subscribe = (subscriber) => {
      this.subscribers.push({
        next: typeof subscriber === 'function' ? subscriber : subscriber.next,
        error: subscriber.error ? subscriber.error : () => null,
        complete: subscriber.complete ? subscriber.complete : () => null
      })
      return {
        unsubscribe: () => {
          this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
        }
      }
    }
  }
  


// implement-Observable-interval
  function interval(period) {
    return new Observable((sub) => {
      let i = 0;
      setInterval(() => {
        sub.next(i++);
      }, period);
    });
  }


  function interval(period) {
    return new Observable((subscribe) => {
      setInterval(subscribe.next, period);
    })
  }


  /******************* */
// Observable fromEvent
  function fromEvent(element, eventName, capture = false) {
    return new Observable(subscriber => {
      const handler = (e) => subscriber.next(e);
      element.addEventListener(eventName, handler, capture);
      this.unsubscribe = () => {
         element.removeEventListener(eventName, handler, capture);
      };
    });
  }
  

  
/**
 * @param {HTMLElement} element
 * @param {string} eventName
 * @param {boolean} capture
 * @return {Observable}
 */
// Meaning of the capture flag : 
// By default events bubble UP in DOM tree, so normally
// when we would click on div in document
// "div" would be logged first and then "document".
// Since we specified optional `capture` option, document
// will catch event when it goes DOWN DOM tree, so console
// will log "document" and then "div".
// For more : https://rxjs.dev/api/index/function/fromEvent
function fromEvent(element, eventName, capture = false) {
  return new Observable((subscriber)=>{
    element.addEventListener(eventName,(event)=>{
      subscriber.next(event)
    },capture) //addEventListener takes a capture flag to do exactly what we want to do so passing capture
  })
}
