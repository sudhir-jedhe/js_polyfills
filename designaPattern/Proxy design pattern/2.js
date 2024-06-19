// The JavaScript Proxy object can be a very powerful tool to extend the functionality of objects. In this collection, we will explore the basics of the Proxy object and how to use it in your code. We will also look at a handful of practical examples that show how you can think about using proxies in your code.


// The JavaScript Proxy object is a relatively new addition to the language, having been introduced in ES6. It's based on the software design pattern of the same name, which creates a wrapper for another object, intercepting and redefining fundamental operations for that object.

// A Proxy object is defined as follows:

const proxy = new Proxy(target, handler);
// The target is the object that the proxy wraps around, while the handler is an object that contains one or more "traps" - functions that intercept operations performed on the target object.

// There are a variety of available traps that can be used to customize the behavior of the target object. Here's a brief overview of all available traps and what each one does:

get(target, prop, receiver) - Intercepts calls to target[prop].
set(target, prop, value, receiver) - Intercepts calls to target[prop] = value.
has(target, prop) - Intercepts calls to prop in target.
apply(target, thisArg, argumentsList) - Intercepts calls to functions.
construct(target, argumentsList, newTarget) - Intercepts calls to the new operator.
defineProperty(target, prop, descriptor) - Intercepts calls to Object.defineProperty().
deleteProperty(target, prop) - Intercepts calls to delete target[prop].
getOwnPropertyDescriptor(target, prop) - Intercepts calls to Object.getOwnPropertyDescriptor().
ownKeys(target) - Intercepts calls to Object.getOwnPropertyNames() and Object.getOwnPropertySymbols().
getPrototypeOf(target) - Intercepts calls to Object.getPrototypeOf().
setPrototypeOf(target, prototype) - Intercepts calls to Object.setPrototypeOf().
isExtensible(target) - Intercepts calls to Object.isExtensible().
preventExtensions(target) - Intercepts calls to Object.preventExtensions().
// There are many common and novel use-cases for the Proxy object, utilizing one or more of these traps. Here's a simple example that intercepts a get call and returns null if the property doesn't exist in the target object:


const targetObj = { name: 'John', age: 30 };

const handler = {
  get(target, property) {
    return property in target ? target[property] : null;
  }
};

const proxyObj = new Proxy(targetObj, handler);

proxyObj.name; // 'John'
proxyObj.age; // 30
proxyObj.address; // null



const getHandler = {
    get: (target, prop) => {
      return value => {
        if (typeof value !== 'undefined') {
          target[prop] = value;
          return new Proxy(target, getHandler);
        }
        return target[prop];
      };
    }
  };
  
  const styles = {};
  const proxiedStyles = new Proxy(styles, getHandler);
  
  proxiedStyles.color('#101010').background('#fefefe').margin('4px 8px');
  
  proxiedStyles.color(); // #101010
  proxiedStyles.background(); // #fefefe
  proxiedStyles.margin(); // 4px 8px