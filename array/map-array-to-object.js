Map an array of primitives to an object
An array of primitives may be transformed to an object by mapping each element to a key and value. The key is the element itself and the value is the result of applying a mapping function to the element.

To accomplish this, we can use Array.prototype.map() and a mapping function, which is passed the element, index and array and returns the mapped value. The result of the mapping function is then passed to Object.fromEntries(), which creates an object from an array of key-value pairs.

const mapObject = (arr, fn) =>
  Object.fromEntries(arr.map((el, i, arr) => [el, fn(el, i, arr)]));

mapObject([1, 2, 3], a => a * a);
// { 1: 1, 2: 4, 3: 9 }
Map an array of objects to an object
Subsequently, we can extend this snippet to map an array of objects to an object. This is done by mapping each object to a key and value, via a pair of mapping functions. The first mapping function is used to map the key and the second is used to map the value.

const mapObject = (arr, mapKey, mapValue = i => i) =>
  Object.fromEntries(
    arr.map((el, i, arr) => [mapKey(el, i, arr), mapValue(el, i, arr)])
  );

const people = [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ];

mapObject(people, p => p.name.toLowerCase());
// { john: { name: 'John', age: 42 }, adam: { name: 'Adam', age: 39 } }

mapObject(
  people,
  p => p.name.toLowerCase(),
  p => p.age
);
// { john: 42, adam: 39 }