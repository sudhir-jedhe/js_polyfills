/**
 * @param {Function} constructor
 * @param {any[]} args - argument passed to the constructor
 * `myNew(constructor, ...args)` should return the same as `new constructor(...args)`
 */
// amazing explaination here: https://www.youtube.com/watch?v=Om9TZ1wc2bw
const myNew = (constructorFunc, ...args) => {
    // 1. Create new object
    // 2. That new object will need prototype of constructor so we can use setPrototypeOf for that
    // 3. Call constructor function with specified arguments and with 'this' bound to newsly created object to set up 'this' in constructor
    // 4. It's unusual but sometimes function constructor may return another object, so we check if it returns an object and if it is
    // then we want to return it, null is an object so we check for that
    const obj = {}
    Object.setPrototypeOf(obj, constructorFunc.prototype)
    const returned = constructorFunc.call(obj, ...args)
    if(returned && typeof returned === 'object') {
      return returned
    }
    return obj
  }


  /****************** */


  const myNew = (constructor, ...args) => {
    // 1. A new object is created, inheriting from constructor's prototype.
    var that = Object.create(constructor.prototype);
    // 2. The constructor function is called with the specified arguments,
    //    and with this bound to the newly created object.
    var obj =  constructor.apply(that, args);
    
    // 3. The object (not null, false, 3.1415 or other primitive types) returned by the constructor function becomes the result of the whole new expression.
    //    If the constructor function doesn't explicitly return an object, 
    //    the object created in step 1 is used instead (normally constructors don't return a value, but they can choose to do so if they want to override the normal object creation process).
    if(obj && typeof obj === 'object')
    {
      return obj;
    }
    else
    {
      return that;
    }
  }


  /********************* */


  /**
 * @param {Function} constructor
 * @param {any[]} args - argument passed to the constructor
 * `myNew(constructor, ...args)` should return the same as `new constructor(...args)`
 */
const myNew = (constructor, ...args) => {
    const thisObj = Object.create(constructor.prototype);
    const result = constructor.apply(thisObj, args);
    return result || thisObj;
  }
  

//   You are asked to implement myNew(), which should return an object just as what new does but without using new.