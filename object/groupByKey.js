const people = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 35 },
  { name: "Charlie", age: 28 },
  { name: "David", age: 42 },
];

const result = groupBy(people, "age");
console.log(result);
// {
//   28: [
//     { name: 'Alice', age: 28 },
//     { name: 'Charlie', age: 28 }
//   ],
//   35: [
//     { name: 'Bob', age: 35 }
//   ],
//   42: [
//     { name: 'David'

export const groupBy = (array, key) => {
  return array.reduce(function (rv, obj) {
    (rv[obj[key]] = rv[obj[key]] || []).push(obj);
    return rv;
  }, {});
};
