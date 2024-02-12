// Observable defines how values are delivered to Observer. Observer is just a
// set of callbacks.

const observer = {
  next: (value) => {
    console.log("we got a value", value);
  },
  error: (error) => {
    console.log("we got an error", error);
  },
  complete: () => {
    console.log("ok, no more values");
  },
};

const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  setTimeout(() => {
    subscriber.next(3);
    subscriber.next(4);
    subscriber.complete();
  }, 100);
});

// The code plainly says when is a subscriber is attached,

// subscriber is fed with a value 1 subscriber is then fed with a value 2 wait
// 100 ms subscriber is fed with 3 subscriber is fed with 4 no more values for
// subscriber Now if we attach above observer to observable, next and complete
// of subscriber are called in order.(be aware that there is a delay between 2
// and 3)


const sub = observable.subscribe(subscriber)
// we got a value 1
// we got a value 2

// we got a value 3
// we got a value 4
// ok, no more values
Notice subscribe() return a Subscription which could be used to stop listening to the value delivery.

const sub = observable.subscribe(subscriber)
setTimeout(() => {
  // ok we only subscribe for 100ms
  sub.unsubscribe()
}, 100)
// So this is the basic idea of Observable and Observer. There will be a few more interesting follow-up problems.

// Now you are asked to implement a basic Observable class, which makes above
// possible.

// Some extra requirements are listed here.

// error and complete can only be delivered once, next/error/complete after
// error/complete should not work for a subscriber object, next/error/complete
// callback are all optional. if a function is passed as observer, it is treated
// as next. should support multiple subscription


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


  /********************************************** */

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


  /**************************************************************** */



  //best talk about creating own observable: https://www.youtube.com/watch?v=m40cF91F8_A
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