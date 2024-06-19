// Convert an object to an array of objects

const listify = (obj, mapFn) =>
    Object.entries(obj).map(([key, value]) => mapFn(key, value));
  
  const people = [
    { name: 'John', age: 42 },
    { name: 'Adam', age: 39 },
  ];
  
  listify(people, (key, value) => ({ name: key, ...value }));
  // [ { name: 'John', age: 42 }, { name: 'Adam', age: 39 } ]

  // Convert an array of objects to an object

  const delistify = (arr, mapFn) =>  Object.fromEntries(arr.map(mapFn));

const people = [
  { name: 'John', age: 42 },
  { name: 'Adam', age: 39 },
];

delistify(people, (obj) => {
  const { name, ...rest } = obj;
  return [name, rest];
});
// { John: { age: 42 }, Adam: { age: 39 } }