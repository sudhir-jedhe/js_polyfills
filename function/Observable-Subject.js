// Plain Observables are unicast, meaning every subscription is independent. To create multicast, you need to use Subject.

// default behavior with plain Observable
const observable = from([1, 2, 3]);
observable.subscribe(console.log);
observable.subscribe(console.log);
// 1
// 2
// 3
// 1
// 2
// 3

const subject = new Subject();
subject.subscribe(console.log);
subject.subscribe(console.log);

const observable = from([1, 2, 3]);
observable.subscribe(subject);

// 1
// 1
// 2
// 2
// 3
// 3

// Observable is given for you, you can just use it.
// you can use new Observer({next,error,complete}) or new Observer(function) to create an observer.

// You can use Observer which is bundled to your code

// class Observer {
//   // subscriber could one next function or a handler object {next, error, complete}
//   constructor(subscriber) { }
//   next(value) { }
//   error(error) { }
//   complete() {}
// }

class Subject {
  constructor() {
    this.subscribers = [];
  }
  subscribe(subscriber) {
    const sub = new Observer(subscriber);
    this.subscribers.push(sub);
    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((s) => s !== sub);
      },
    };
  }
  next = (value) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.next(value);
    });
  };
  error = (err) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.error(err);
    });
  };
  complete = () => {
    this.subscribers.forEach((subscriber) => {
      subscriber.complete();
    });
  };
}

/****************************************************** */
// You can use Observer which is bundled to your code

// class Observer {
//   // subscriber could one next function or a handler object {next, error, complete}
//   constructor(subscriber) { }
//   next(value) { }
//   error(error) { }
//   complete() {}
// }

/*
1. keep this.subscribers array in constructor
2. subject will be collecting all those subscribers so they are multicast
3. subscribe method - 
   1. create a new observer
    2. push that observer to array
     3. return unsubscribe method so it's possible to filter out  that subscriber from subscribers array

4. next method - receives value; iterate with for each over subscribers array calling subscriber.next(value) on every one
5. error method - accepts err parameter; iterate over each stored subscriber and call on each and every its error method subscriber.error(err)
6. complete method - iterate over each subscriber from array and call its complete method
*/

class Subject {
  constructor() {
    this.subscribers = [];
  }

  subscribe(subscriber) {
    const sub = new Observer(subscriber);
    this.subscribers.push(sub);

    return {
      unsubscribe: () => {
        this.subscribers = this.subscribers.filter((s) => s !== sub);
      },
    };
  }

  next = (value) => {
    this.subscribers.forEach((subscriber) => {
      subscriber.next(value);
    });
  };

  error = (err) => {
    this.subscribers.forEach((subscriber) => subscriber.error(err));
  };

  complete = () => {
    this.subscribers.forEach((subscriber) => {
      subscriber.complete();
    });
  };
}

/************************************ */
class Subject {
  constructor() {
    this._subs = new Map();
  }

  subscribe(subscriber) {
    const key = Symbol();
    this._subs.set(key, new Observer(subscriber));
    return {
      unsubscribe: () => this._subs.delete(key),
    };
  }

  next = (val) => {
    this._subs.forEach((sub) => {
      this.secureRun(sub, "next", val);
    });
  };
  error = (err) => {
    this._subs.forEach((sub) => {
      this.secureRun(sub, "error", err);
    });
  };
  complete = () => {
    this._subs.forEach((sub) => {
      this.secureRun(sub, "complete");
    });
  };

  secureRun = (sub, func, val) => {
    try {
      sub[func](val);
    } catch (err) {
      sub.error(err);
    }
  };
}
