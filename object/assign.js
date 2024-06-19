// creating an object constructor and assigning values to it
const obj1 = { a: 1 };

// creating a target object and copying values and properties to it using
// object.assign() method Here, obj1 is the source object
const new_obj = Object.assign({}, obj1);

// Displaying the target object
console.log(new_obj);

// creating 3 object constructors and assigning values to it
let obj1 = { a: 10 };
let obj2 = { b: 20 };
let obj3 = { c: 30 };

// Creating a target object and copying values and properties to it using
// object.assign() method
let new_obj = Object.assign({}, obj1, obj2, obj3);

// Displaying the target object
console.log(new_obj);

//The Object.assign() method copies all enumerable own properties from one or
//more source objects to a target object. It returns the target object

/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
  if (target === null || target === undefined) {
    throw new Error("Not an object");
  }

  if (typeof target !== `object`) {
    target = new target.__proto__.constructor(target);
  }

  for (const source of sources) {
    if (source === null || source === undefined) {
      continue;
    }

    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));

    for (const symbol of Object.getOwnPropertySymbols(source)) {
      target[symbol] = source[symbol];
    }
  }
  return target;
}

/******************************* */
/**
 * @param {any} target
 * @param {any[]} sources
 * @return {object}
 */
function objectAssign(target, ...sources) {
  if (target === null || target === undefined)
    throw new Error("invalid target");

  let result = target;
  if (["number", "string", "boolean"].includes(typeof target)) {
    result = Object(target);
  }

  for (const source of sources) {
    if (source === null || source === undefined) continue;
    const keys = [
      ...Object.keys(source),
      ...Object.getOwnPropertySymbols(source).filter(
        (item) => Object.getOwnPropertyDescriptor(source, item).enumerable
      ),
    ];
    for (const key of keys) {
      if (!Reflect.set(result, key, source[key])) {
        throw new Error("cannot assign to read-only properties");
      }
    }
  }
  return result;
}

const target = Object.defineProperty({}, "foo", {
  value: 1,
  writable: false,
});




/**************************************** */
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
      value: function(target, ...sources) {
          if (target == null) {
              throw new TypeError('Cannot convert undefined or null to object');
          }

          const to = Object(target);

          for (let source of sources) {
              if (source != null) {
                  for (let key in source) {
                      if (Object.prototype.hasOwnProperty.call(source, key)) {
                          to[key] = source[key];
                      }
                  }
              }
          }

          return to;
      },
      writable: true,
      configurable: true
  });
}
