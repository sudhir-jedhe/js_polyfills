// The **freeze()** method is used to freeze an object. Freezing an object does not allow adding new properties to an object,prevents from removing and prevents changing the enumerability, configurability, or writability of existing properties. i.e, It returns the passed object and does not create a frozen copy.



// Remember freezing is only applied to the top-level properties in objects but not for nested objects.
// For example, let's try to freeze user object which has employment details as nested object and observe that details have been changed.


const user = {
  name: "John",
  employment: {
    department: "IT",
  },
};

Object.freeze(user);
user.employment.department = "HR";


// **Note:** It causes a TypeError if the argument passed is not an object.


// What is the purpose of freeze method

// Below are the main benefits of using freeze method,

// 1. It is used for freezing objects and arrays.
// 2. It is used to make an object immutable.

// Why do I need to use freeze method

// In the Object-oriented paradigm, an existing API contains certain elements that are not intended to be extended, modified, or re-used outside of their current context. Hence it works as the `final` keyword which is used in various languages.

const obj = {
  prop: 100,
};

Object.freeze(obj);
obj.prop = 200; // Throws an error in strict mode

console.log(obj.prop); //100

const obj = {
  prop: 42,
};

Object.freeze(obj);

obj.prop = 33;
// Throws an error in strict mode

console.log(obj.prop);
// 42
It does not even allow changing of object properties.

const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  Object.freeze(obj);
  
  obj.nested.a = 33;
  // Updates the value
  
  console.log(obj.nested.a);
  // 33

  But this also only shallow freezes the object properties.


  function deepFreeze(object) {
    // Retrieve the property names defined on object
    var propNames = Object.getOwnPropertyNames(object);
  
    // Freeze properties before freezing self
    for (let name of propNames) {
      let value = object[name];
  
      object[name] = value && typeof value === "object" ? 
        deepFreeze(value) : value;
    }
  
    return Object.freeze(object);
  }


  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  deepFreeze(obj);
  
  obj.nested.a = 33;
  // Updates the value
  
  console.log(obj.nested.a);
  // 1

  const obj = {
    prop: 42,
    nested: {
      a: 1,
      b: 2
    }
  };
  
  //Seal the object
  deepFreeze(obj);
  
  console.log(Object.isFrozen(obj));
  //true