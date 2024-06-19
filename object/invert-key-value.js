// 
// Invert unique key-value pairs

const invertKeyValues = obj =>
    Object.fromEntries(
      Object.entries(obj).map(entry => entry.reverse())
    );
  
  invertKeyValues({ a: 1, b: 2, c: 3 });
  // { 1: 'a', 2: 'b', 3: 'c' }
  invertKeyValues({ a: 1, b: 2, c: 1 });
  // { 1: 'c', 2: 'b' }

  // Invert key-value pairs with duplicates

  const invertKeyValues = obj =>
    Object.entries(obj).reduce((acc, [key, val]) => {
      acc[val] = acc[val] || [];
      acc[val].push(key);
      return acc;
    }, {});
  
  invertKeyValues({ a: 1, b: 2, c: 1 });
  // { 1: [ 'a', 'c' ], 2: [ 'b' ] }
  invertKeyValues({ a: 1, b: 2, c: 1, d: 2 });
  // { 1: [ 'a', 'c' ], 2: [ 'b', 'd' ] }