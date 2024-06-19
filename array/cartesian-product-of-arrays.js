Cartesian product of two JavaScript arrays

The Cartesian product or cross product of two arrays is a new array that contains every possible pair of elements from the two arrays. This can be useful in many mathematical and programming scenarios.

In order to calculate the Cartesian product of two arrays, you can use Array.prototype.reduce() on the first array and Array.prototype.map() on the second array to create each possible pair. Then, you can use the spread operator (...) to concatenate the pairs into a single array.

const crossProduct = (a, b) =>
  a.reduce((acc, x) => [...acc, ...b.map(y => [x, y])], []);

crossProduct([1, 2], ['a', 'b']);
// [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]