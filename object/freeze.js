// The **freeze()** method is used to freeze an object. Freezing an object does not allow adding new properties to an object,prevents from removing and prevents changing the enumerability, configurability, or writability of existing properties. i.e, It returns the passed object and does not create a frozen copy.

// Objects in JavaScript are mutable, regardless if you define them as const variables or not. In fact, using const when defining an object only prevents the variable from being reassigned. However, you can reassign the properties of a const object or array.

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


  /************************** */
  const myObj = { a: 10, b: 20, c: 30 };
myObj.a = 12;     // { a: 12, b: 20, c: 30 };

const myArr = [15, 25, 35];
myArr[1] = 28;    // [15, 28, 35];

const frozen = Object.freeze({ username: 'johnsmith' });
const sealed = Object.seal({ username: 'johnsmith' });

frozen.name = 'John Smith';  // frozen = { username: 'johnsmith' }
sealed.name = 'John Smith';  // sealed = { username: 'johnsmith' }

delete frozen.username;      // frozen = { username: 'johnsmith' }
delete sealed.username;      // sealed = { username: 'johnsmith' }

frozen.username = 'jsmith';  // frozen = { username: 'johnsmith' }
sealed.username = 'jsmith';  // sealed = { username: 'jsmith' }

                  Create	Read	Update	Delete
Object.freeze()	  No	    Yes	  No	    No
Object.seal()	    No	    Yes	  Yes	    No

// Both of these methods prevent new properties from being added and existing properties from being removed. Additionally, Object.freeze() also prevents existing properties from being altered. The reason for that is that Object.seal() only marks existing properties as non-configurable, meaning their values can be changed as long as they are writable.

const myObj = {
  a: 1,
  b: 'hello',
  c: [0, 1, 2],
  d: { e: 1, f: 2 }
};
Object.freeze(myObj);

myObj.a = 10;
myObj.b = 'hi';
myObj.c[1] = 4;
myObj.d.e = 0;
/*
myObj = {
  a: 1,
  b: 'hello',
  c: [0, 4, 2],
  d: { e: 0, f: 2 }
}
*/




onst deepFreeze = obj => {
  Object.keys(obj).forEach(prop => {
    if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) deepFreeze(obj[prop]);
  });
  return Object.freeze(obj);
};

const myObj = {
  a: 1,
  b: 'hello',
  c: [0, 1, 2],
  d: { e: 1, f: 2 }
};
deepFreeze(myObj);

myObj.a = 10;
myObj.b = 'hi';
myObj.c[1] = 4;
myObj.d.e = 0;
/*
myObj = {
  a: 1,
  b: 'hello',
  c: [0, 1, 2],
  d: { e: 1, f: 2 }
}
*/


Frozen objects in strict mode
As a side note, if your code is running in strict mode, frozen objects will throw an error when trying to modify them. This makes it easier to catch bugs, as you will be notified immediately if you try to change a frozen object.

'use strict';

const val = deepFreeze([1, [2, 3]]);

val[0] = 3; // not allowed
val[1][0] = 4; // not allowed as well
Checking if an object is deep frozen
Checking if an object is frozen is simple, using Object.isFrozen(). However, to check if an object is deeply frozen, you will have to perform a recursive check on all its properties. This is very similar to how you would go about deep freezing the object in the first place, but instead of Array.prototype.forEach(), you can use Array.prototype.every() to check if all properties are deeply frozen.

const isDeepFrozen = obj =>
  Object.isFrozen(obj) &&
  Object.keys(obj).every(
    prop => typeof obj[prop] !== 'object' || isDeepFrozen(obj[prop])
  );

const x = Object.freeze({ a: 1 });
const y = Object.freeze({ b: { c: 2 } });
isDeepFrozen(x); // true
isDeepFrozen(y); // false


const frozenSet = iterable => {
  const s = new Set(iterable);
  s.add = undefined;
  s.delete = undefined;
  s.clear = undefined;
  return Object.freeze(s);
};

frozenSet([1, 2, 3, 1, 2]);
/* Set {
  1, 2, 3,
  add: undefined, delete: undefined, clear: undefined
} */

  const frozenMap = iterable => {
    const m = new Map(iterable);
    m.set = undefined;
    m.delete = undefined;
    m.clear = undefined;
    return Object.freeze(m);
  };
  
  frozenMap([['a', 1], ['b', 2]]);
  /* Map {
    'a' => 1, 'b' => 2,
    set: undefined, delete: undefined, clear: undefined
  } */