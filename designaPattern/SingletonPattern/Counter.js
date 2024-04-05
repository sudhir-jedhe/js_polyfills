let instance;
class Counter {
  constructor(count) {
    if (instance) {
      throw new Error("You can only create only one instance");
    }
    this.counter = counter;
    instance = this;
  }

  get getCount() {
    return this.counter;
  }

  incrementCount() {
    return ++this.counter;
  }

  decrementCount() {
    return --this.counter;
  }
}

const singletonCounter = Object.freeze(new Counter());
export default singletonCounter;
