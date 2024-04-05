// class A {}
// class B extends A {}

// const b = new B()
// myInstanceOf(b, B) // true
// myInstanceOf(b, A) // true
// myInstanceOf(b, Object) // true

// function C() {}
// myInstanceOf(b, C) // false
// C.prototype = B.prototype
// myInstanceOf(b, C) // true
// C.prototype = {}
// myInstanceOf(b, C) // false



/**
 * @param {object} obj
 * @param {object} target
 * @return {boolean}
 */
function myInstanceOf(obj, target) {
    // If the object does not exist or we've reached the base Object constructor, return false
    if(!obj || typeof obj !== 'object') return false
  
    ​// Check if the target is a valid object
    ​if(!target.prototype) throw Error
  
    ​// If the object's prototype matches our target's prototype, return true
    ​// Otherwise, recurse down the prototypal chain
    ​if(Object.getPrototypeOf(obj) === target.prototype) {
      ​return true
    ​} else {
      ​return myInstanceOf(Object.getPrototypeOf(obj), target)
    ​}
  }



  /*************************** */

  function myInstanceOf(obj, target) {
    if (obj == null || typeof obj !== 'object') return false; // (1)
    const proto = Object.getPrototypeOf(obj); // (2)
    return proto === target.prototype ? true : myInstanceOf(proto, target); // (3)
  }
  
  /*
  
  (1) - If obj is null (i.e. top of the prototype chain), it isn't an instance
        of target. Return false
      - An instance has to be an object. If obj is not an object, it cannot
        be an instance of anything. Return false
  
  (2) - Get the prototype of obj
  
  (3) - If obj's [[prototype]] (i.e. proto) is the targets prototype property
        (i.e. target.prototype), then obj is an instance of target
      - Otherwise, check check the next prototype in the chain
  
  
  */


      const instanceOf = (obj, target) => {
  
        // if provided input is not object type, return false
        if(obj === null || typeof obj !== 'object') return false;
        
        // keep checking in the prototype chain
        while(obj){
          if(obj.__proto__ === target.prototype) return true;
          obj = obj.__proto__;
        }
        
        return false;
      }

      Input:
class P {}
class Q extends P {}

const q = new Q()
console.log(instanceOf(q, Q)) // true
console.log(instanceOf(q, P)) // true
console.log(instanceOf(q, Object)) // true

function R() {}
console.log(instanceOf(q, R)) // false
R.prototype = Q.prototype
console.log(instanceOf(q, R)) // true
R.prototype = {}
console.log(instanceOf(q, R)) // false



const instanceOf = (obj, target) => {
  // if provided input is not object type, return false
  if (obj == null || typeof obj !== 'object') return false;
  
  // get the prototype 
  const proto = Object.getPrototypeOf(obj);
  
  // recursively test if prototype matches to the target's prototype
  return proto === target.prototype ? true : instanceOf(proto, target);
}

Input:
class P {}
class Q extends P {}

const q = new Q()
console.log(instanceOf(q, Q)) // true
console.log(instanceOf(q, P)) // true
console.log(instanceOf(q, Object)) // true

function R() {}
console.log(instanceOf(q, R)) // false
R.prototype = Q.prototype
console.log(instanceOf(q, R)) // true
R.prototype = {}
console.log(instanceOf(q, R)) // false