// Object.assign() assigns the enumerable properties, so getters are not copied,
// non-enumerable properties are ignored.

// Suppose we have following source object.

const source = Object.create(
  {
    a: 3, // prototype
  },
  {
    b: {
      value: 4,
      enumerable: true, // enumerable data descriptor
    },
    c: {
      value: 5, // non-enumerable data descriptor
    },
    d: {
      // non-enumerable accessor descriptor
      get: function () {
        return this._d;
      },
      set: function (value) {
        this._d = value;
      },
    },
    e: {
      // enumerable accessor descriptor
      get: function () {
        return this._e;
      },
      set: function (value) {
        this._e = value;
      },
      enumerable: true,
    },
  }
);
// If we call Object.assign() with source of above, we get:

Object.assign({}, source);

// {b: 4, e: undefined} e is undefined because `this._e` is undefined Rather
// than above result, could you implement a completeAssign() which have the same
// parameters as Object.assign() but fully copies the data descriptors and
// accessor descriptors?

function completeAssign(target, ...sources) {
  if (target == null) throw Error("target cannot be null or undefined");
  target = Object(target);

  for (let source of sources) {
    if (source == null) continue;

    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));

    for (const symb of Object.getOwnPropertySymbols(source)) {
      target[symb] = source[symb];
    }
  }
  return target;
}

/************************************* */
function completeAssign(target, ...sources) {
  if (target === null || target === undefined) {
    throw new Error("Can't convert null or undefined to an object");
  }

  if (typeof target !== "object") {
    target = Object(target);
  }

  return sources.reduce((result, source) => {
    if (source === null || source === undefined) {
      return result;
    }

    // adding all property descriptors from the source object to the result object
    Object.defineProperties(result, Object.getOwnPropertyDescriptors(source));

    return result;
  }, target);
}

/*********************************** */

function completeAssign(target, ...sources) {
  if (target === null || target === undefined) {
    throw new Error("target is Not an object!");
  }
  target = new Object(target);
  for (const source of sources) {
    if (!source) {
      continue;
    }
    Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
  }
  return target;
}
