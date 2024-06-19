const unwind = (key, obj) => {
    const { [key]: _, ...rest } = obj;
    return obj[key].map(val => ({ ...rest, [key]: val }));
  };
  
  unwind('b', { a: true, b: [1, 2] });
  // [{ a: true, b: 1 }, { a: true, b: 2 }]

  // Given an object with an array-valued property, you might want to unwind it into an array of objects. This is a common operation when working with data that has been aggregated or grouped.