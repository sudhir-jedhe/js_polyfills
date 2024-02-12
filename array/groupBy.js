/***********************GroupBy******************** */
function groupBy(collection, iteratee) {
  return collection.reduce((result, item) => {
    const key =
      typeof iteratee === "function" ? iteratee(item) : item[iteratee];

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(item);

    return result;
  }, {});
}

// Example usage:

const data = [
  { id: 1, name: "Alice", category: "A" },
  { id: 2, name: "Bob", category: "B" },
  { id: 3, name: "Charlie", category: "A" },
  { id: 4, name: "David", category: "C" },
  { id: 5, name: "Eva", category: "B" },
];

const groupedData = groupBy(data, "category");

console.log(groupedData);
/*
  Output:
  {
    A: [ { id: 1, name: 'Alice', category: 'A' }, { id: 3, name: 'Charlie', category: 'A' } ],
    B: [ { id: 2, name: 'Bob', category: 'B' }, { id: 5, name: 'Eva', category: 'B' } ],
    C: [ { id: 4, name: 'David', category: 'C' } ]
  }
  */

/*************************** */
// Implement a function that groups values in an array based on a function or property name/

function groupBy(array, callback) {
  const groups = {};

  array.forEach((element) => {
    const key = callback(element);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(element);
  });

  return groups;
}

const array = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Carol", age: 27 },
];

const groups = groupBy(array, (element) => element.age);

console.log(groups);
// {
//   '25': [{ name: 'Alice', age: 25 }],
//   '30': [{ name: 'Bob', age: 30 }],
//   '27': [{ name: 'Carol', age: 27 }],
// }
