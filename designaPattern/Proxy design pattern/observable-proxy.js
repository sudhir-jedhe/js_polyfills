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