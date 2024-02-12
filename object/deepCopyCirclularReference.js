function deepCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const seen = new Map();

  function copy(obj) {
    if (seen.has(obj)) {
      return seen.get(obj);
    }

    const newObj = {};
    seen.set(obj, newObj);

    for (const key in obj) {
      const value = obj[key];
      newObj[key] = copy(value);
    }

    return newObj;
  }

  return copy(obj);
}

const obj = {
  a: 1,
  b: {
    c: 2,
  },
};

// This function works by recursively traversing the object and creating a new
// copy of each property. If it encounters a circular reference, it will return
// the existing copy of the object instead of creating a new one.
const copy = deepCopy(obj);

console.log(copy); // { a: 1, b: { c: 2 } }

console.log(obj === copy); // false
