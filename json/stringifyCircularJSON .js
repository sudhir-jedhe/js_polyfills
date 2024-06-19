const stringifyCircularJSON = obj => {
    const seen = new WeakSet();
    return JSON.stringify(obj, (k, v) => {
      if (v !== null && typeof v === 'object') {
        if (seen.has(v)) return;
        seen.add(v);
      }
      return v;
    });
  };
  
  const obj = { n: 42 };
  obj.obj = obj;
  stringifyCircularJSON(obj); // '{"n": 42}'

//   A JSON object is said to have a circular reference when it contains a reference to itself. This can happen when an object is nested within itself, or when two or more objects reference each other. When you try to serialize a JSON object with circular references using JSON.stringify(), you'll get a TypeError because the method can't handle circular references.

// In order to handle this, you can traverse the object and use a WeakSet to store and check seen values, and a custom replacer function to omit values already in the WeakSet. This will allow you to serialize the JSON object without running into a TypeError.