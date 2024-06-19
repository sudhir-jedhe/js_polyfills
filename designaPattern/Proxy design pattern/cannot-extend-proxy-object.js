// While the Proxy object seems like it can be extended by any other class in JavaScript, that's not the case. This is due to proxy objects having very atypical semantics and being considered exotic objects. Simply put, this means they do not have a prototype and are not extensible.

// So how do you extend a proxy object? You don't. You can, however, create a class that returns a proxy by returning it from the constructor. After all, this is probably the sort of behavior you're after.

class MyProxy {
  constructor(value) {
    Object.keys(value).forEach(key => (this[key] = value[key]));
    return new Proxy(this, {
      set(object, key, value) {
        console.log(`Called with ${key} = ${value}`);
        object[key] = value;
        return true;
      }
    });
  }
}

const myProxy = new MyProxy({ a: 1 });
myProxy.b = 2; // LOGS: 'Called with b = 2'