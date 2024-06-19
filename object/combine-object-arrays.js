Supposing you know the key that uniquely identifies each object, you can use Object.values() and the spread operator (...) to get all the objects in both arrays. Then, you can use Array.prototype.reduce() to combine them based on the specified key.

For each value in the arrays, you can check if the object has the specified key. If it does, you can add it to the accumulator object, combining it with any existing object that has the same key. This will result in a single object for each unique value of the key property.

const combine = (a, b, prop) =>
  Object.values(
    [...a, ...b].reduce((acc, v) => {
      if (v[prop])
        acc[v[prop]] = acc[v[prop]]
          ? { ...acc[v[prop]], ...v }
          : { ...v };
      return acc;
    }, {})
  );

const x = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Maria' }
];
const y = [
  { id: 1, age: 28 },
  { id: 3, age: 26 },
  { age: 3}
];
combine(x, y, 'id');
// [
//  { id: 1, name: 'John', age: 28 },
//  { id: 2, name: 'Maria' },
//  { id: 3, age: 26 }
// ]