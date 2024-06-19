const singletonify = (className) => {
    return new Proxy(className.prototype.constructor, {
      instance: null,
      construct: (target, argumentsList) => {
        if (!this.instance)
          this.instance = new target(...argumentsList);
        return this.instance;
      }
    });
  }

  class MyClass {
    constructor(msg) {
      this.msg = msg;
    }
  
    printMsg() {
      console.log(this.msg);
    }
  }
  
  MySingletonClass = singletonify(MyClass);
  
  const myObj = new MySingletonClass('first');
  myObj.printMsg();           // 'first'
  const myObj2 = new MySingletonClass('second');
  myObj2.printMsg();           // 'first'