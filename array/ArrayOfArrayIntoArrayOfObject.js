// Example array of arrays
const arrayOfArrays = [
  ["name", "Alice"],
  ["age", 30],
  ["city", "New York"],
];

// Convert array of arrays to array of objects
const arrayOfObjects = arrayOfArrays.map(([key, value]) => ({ [key]: value }));

console.log(arrayOfObjects);

const users = [
  ["David", "USA", 30],
  ["Billy", "Japan", 35],
  ["Mike", "Singapore", 50],
];

const output = users.map(([name, country, age]) => {
  return { name, country, age };
});

const output = users.map((user) => {
  const [name, country, age] = user;
  return { name, country, age };
});

// [
//     {
//     "name": "David",
//     "country": "USA",
//     "age": 30
//     },
//     {
//     "name": "Billy",
//     "country": "Japan",
//     "age": 35
//     },
//     {
//     "name": "Mike",
//     "country": "Singapore",
//     "age": 50
//     }
// ]
