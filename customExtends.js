/**
 * A function in javascript has 3 roles;
 * 1. Constructor to create instance
 * How to trigger?
 * When use new keyword (new MyFunc())
 * 
 * 2. Pure function
 * How to trigger?
 * Call directly (MyFunc())
 * 
 * 3. Object
 * How to trigger?
 * Use property on the Function (MyFunc.prop1)
 */
const myExtends = (SuperType, SubType) => {
    function ExtendType(...args){
      /**
       * About this:
       * When call a function, there will be a this pointer in the function
       * If call with new, js will create a new object, and let 'this' point to that object
       * If call without new, this point to whoever called this function
       */
      // use SuperType and SubType constructor to init this.
      SuperType.call(this, ...args);
      SubType.call(this,...args);
      // build the prototype chain connection, let current this's constructor's prototype point to SubType.prototype
      Object.setPrototypeOf(this, SubType.prototype);
      // this.__proto__ = SubType.prototype;
    }
    // link SubType's prototype chain to SuperType's prototype
    Object.setPrototypeOf(SubType.prototype, SuperType.prototype);
    // SubType.prototype.__proto__ = SuperType.prototype;
    // link ExtendType's prototype chain to SubType's prototype
    Object.setPrototypeOf(ExtendType.prototype, SubType.prototype);
    // ExtendType.prototype.__proto__ = SubType.prototype;
    // link ExtendType's prototype chain to SubType
    // In this case, when we trying to find the static function on ExtendType, we can also find SuperType
    Object.setPrototypeOf(ExtendType, SuperType);
    // ExtendType.__proto__ = SuperType
    return ExtendType;
  }

  
  /******************** */



  const myExtends = (SuperType, SubType) => {
    function ExtendedType(...args){
      SuperType.apply(this, args);
      SubType.apply(this, args);
      
      // instance __proto__
      this.__proto__ = SubType.prototype;
      //ES5: Object.setPrototypeOf(this, SubType.prototype)
    }
    // constructor __proto__
    SubType.prototype.__proto__ = SuperType.prototype;
    //ES5: Object.setPrototypeOf(SubType.prototype, SuperType.prototype);
    
    ExtendedType.prototype.__proto__= SubType.prototype
    //ES5: Object.setPrototypeOf(ExtendedType.prototype, SubType.prototype);
    
    // static methods;
    ExtendedType.__proto__ = SuperType;
    //ES5: Object.setPrototypeOf(ExtendedType, SuperType);
    return ExtendedType;
  }


  /****************************** */



  const myExtends = (SuperType, SubType) => {
    const extendedType = Object.assign(SubType, { prototype: new SuperType(), SuperType });
    extendedType.__proto__ = SuperType;
    return extendedType
  }


  /************************ */


  const myExtends = (SuperType, SubType) => {
    function ExtendType(...args) {
      // When constructor funciton is called with new, `this` will be created as a new object automatically - new MyFunc()
      // When called without new, `this` points to whichever object that called this function - MyFunc,call(a), `this` points to `a`
      SuperType.call(this, ...args);
      SubType.call(this, ...args);
      // Either do this line below, or do ExtendType.prototype = SubType.prototype;
      // Object.setPrototypeOf(this, SubType.prototype); // or this.__proto__ = SubType.prototype;
    }
    // This line below assigns SubType.prototype to all instances of objects created with new ExtendType()
    ExtendType.prototype = SubType.prototype; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
    // Setup link between SubType.prototype and SuperType.prototype
    Object.setPrototypeOf(SubType.prototype, SuperType.prototype); // SubType.prototype.__proto__ = SuperType.prototype;
    // Set up link between SuperType and SubType, so SuperType inherits SubType's static members
    Object.setPrototypeOf(SuperType, SubType); // SuperType.__proto__ = SubType;
    // Set up link betwen ExtendType and SuperType, so ExtendType inherits SuperType's static members
    Object.setPrototypeOf(ExtendType, SuperType); // ExtendType.__proto__ = SuperType;
    return ExtendType;
  };
  // Example
  function SuperType(name) {
    this.name = name;
    this.forSuper = [1, 2];
    this.from = "super";
  }
  SuperType.prototype.superMethod = function () {};
  SuperType.prototype.method = function () {};
  SuperType.staticSuper = "staticSuper";
  function SubType(name) {
    this.name = name;
    this.forSub = [3, 4];
    this.from = "sub";
  }
  SubType.prototype.subMethod = function () {};
  SubType.prototype.method = function () {};
  SubType.staticSub = "staticSub";
  const ExtendType = myExtends(SuperType, SubType);
  const instance = new ExtendType("test");
  console.log(instance);
  