/*************************** Array For Sort method ***************************/
Array.prototype.customSort = function (compareFunction) {
  const arrayLength = this.length;
  if (arrayLength <= 1) {
    return this;
  }

  // Use a default comparison function if none is provided
  const compare =
    compareFunction ||
    function (a, b) {
      return String(a) - String(b);
    };

  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < arrayLength - 1; i++) {
      if (compare(this[i], this[i + 1]) > 0) {
        // Swap elements if they are in the wrong order
        // const temp = this[i];
        // this[i] = this[i + 1];
        // this[i + 1] = temp;
        [this[i], this[i + 1]] = [this[i + 1], this[i]];
        swapped = true;
      }
    }
  } while (swapped);
  return this;
};

// Example usage:
const numbers = [4, 2, 7, 1, 9, 5];
numbers.customSort();
console.log(numbers); // Output: [1, 2, 4, 5, 7, 9]

/**
 *
  sort() method returns a sorted array from it's calling array.

  sort() takes at most 1 parameter:

  - comparator, compreing function which specifies how to compare elements. If
    not provided, a default comparator which compares 2 elements by their
    values in ascending order.

  The comparator function takes 2 parameters, value for comparing 2 elements.
  
  Test Example 1:
  let numberArray = [4, 8, 9, 1, 2, 3, 5, 5];
  console.log(numberArray.sort());
  Return:
  [ 1, 2, 3, 4, 5, 5, 8, 9 ]

  Test Example 2:
  let stringArray = ['a', 'b', 'h', 'y', 'q', 'j', 't', 'h'];
  console.log(stringArray.sort());
  Return:
  [ 'a', 'b', 'h', 'h', 'j', 'q', 't', 'y' ]

  Test Example 3:
  let numberElements = [{ a:5 }, { a:2 }, { a:9 }, { a:7 }, { a:4 }, { a:8 }];
  console.log(numberElements.sort((a, b) => { return a.a - b.a; } ))
  Return:
  [ { a: 2 }, { a: 4 }, { a: 5 }, { a: 7 }, { a: 8 }, { a: 9 } ]

  Test Example 4:
  let stringElements = [{ a:'5' }, { a:'2' }, { a:'9' }, { a:'7' }, { a:'4' }, { a:'8' }];
  console.log(stringElements.sort((a, b) => { return a.a - b.a; } ))
  Return:
  [ { a: '2' }, { a: '4' }, { a: '5' }, { a: '7' }, { a: '8' }, { a: '9' } ]
*/

Array.prototype.sort = function sort(comparator) {
  if (comparator == null) {
    comparator = function (a, b) {
      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    };
  }

  let sortedArray = [...this];

  function recursiveSort(start, end) {
    if (end - start < 1) {
      return;
    }

    const pivot = sortedArray[end];
    let split = start;

    for (let i = start; i < end; i++) {
      const compareVaule = comparator(sortedArray[i], pivot);

      if (compareVaule < 0) {
        if (split != i) {
          const temp = sortedArray[split];
          sortedArray[split] = sortedArray[i];
          sortedArray[i] = temp;
        }

        split++;
      }
    }

    sortedArray[end] = sortedArray[split];
    sortedArray[split] = pivot;

    recursiveSort(start, split - 1);
    recursiveSort(split + 1, end);
  }

  recursiveSort(0, this.length - 1);

  return sortedArray;
};

/**************************How to Sort an Array of Objects by Property Values************************ */
const arrayOfObjects = [
  { name: "John", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
];

// Sort by the 'age' property in ascending order
arrayOfObjects.sort((a, b) => a.age - b.age);

console.log(arrayOfObjects);
// Output: [
//   { name: 'Alice', age: 25 },
//   { name: 'John', age: 30 },
//   { name: 'Bob', age: 35 }
// ]
/***************************default ****************************************************** */
let vals = [-3, 3, 0, 1, 5, -1, -2, 8, 7, 6];
let words = ["sky", "blue", "nord", "cup", "lemon", "new"];

vals.sort();
console.log(vals.join(" "));

words.sort();
console.log(words.join(" "));

/****************************descending *************************************************** */
let vals = [-3, 3, 0, 1, 5, -1, -2, 8, 7, 6];
let words = ["sky", "blue", "nord", "cup", "lemon", "new"];

vals.sort((a, b) => b - a);
console.log(vals.join(" "));

words.sort((a, b) => {
  if (a === b) {
    return 0;
  }

  return b < a ? -1 : 1;
});

console.log(words.join(" "));

/******************************case insensitive*************************** */

let words = [
  "world",
  "War",
  "abbot",
  "Caesar",
  "castle",
  "sky",
  "den",
  "forest",
  "ocean",
  "water",
  "falcon",
  "owl",
  "rain",
  "Earth",
];

function icase(e1, e2) {
  if (e1.toLowerCase() === e2.toLowerCase()) return 0;

  return e1.toLowerCase() < e2.toLowerCase() ? -1 : 1;
}

words.sort(icase);
console.log(words.join(" "));
/****************************string length***************************** */
let words = [
  "brown",
  "war",
  "a",
  "falcon",
  "tradition",
  "no",
  "boot",
  "ellipse",
  "strength",
];

let bylen = (e1, e2) => e1.length - e2.length;
let bylendesc = (e1, e2) => e2.length - e1.length;

words.sort(bylen);
console.log(words.join("\n"));

words.sort(bylendesc);
console.log(words.join("\n"));

/**************************sort names by surname*************************************** */
let users = [
  "John Doe",
  "Lucy Smith",
  "Benjamin Young",
  "Robert Brown",
  "Thomas Moore",
  "Linda Black",
  "Adam Smith",
  "Jane Smith",
];

function bysur(n1, n2) {
  let sname1 = n1.split(" ")[1];
  let sname2 = n2.split(" ")[1];

  if (sname1 > sname2) return 1;
  if (sname1 < sname2) return -1;
  return 0;
}

users.sort(bysur);
console.log(users);
/***********************sort array of objects*************************** */
let users = [
  { fname: "John", lname: "Doe", salary: 1230 },
  { fname: "Roger", lname: "Roe", salary: 3130 },
  { fname: "Lucy", lname: "Novak", salary: 670 },
  { fname: "Ben", lname: "Walter", salary: 2050 },
  { fname: "Robin", lname: "Brown", salary: 2300 },
  { fname: "Joe", lname: "Draker", salary: 1190 },
  { fname: "Janet", lname: "Doe", salary: 980 },
];

users.sort((e1, e2) => e1.salary - e2.salary);
console.log(users);

console.log("---------------------");

users.sort((e1, e2) => e2.salary - e1.salary);
console.log(users);

/********************** sort by multiple fields********************** */
let users = [
  { fname: "John", lname: "Doe", salary: 1230 },
  { fname: "Lucy", lname: "Novak", salary: 670 },
  { fname: "Ben", lname: "Walter", salary: 2050 },
  { fname: "Robin", lname: "Brown", salary: 2300 },
  { fname: "Amy", lname: "Doe", salary: 1250 },
  { fname: "Joe", lname: "Draker", salary: 1190 },
  { fname: "Janet", lname: "Doe", salary: 980 },
  { fname: "Albert", lname: "Novak", salary: 1930 },
];

users.sort((e1, e2) => {
  return e1.lname.localeCompare(e2.lname) || e2.salary - e1.salary;
});

console.log(users);

/*********************sort by accented strings************************ */
const words = [
  "čaj",
  "auto",
  "drevo",
  "cibuľa",
  "čučoriedka",
  "banán",
  "čerešňa",
  "ďateľ",
  "červený",
  "čierny",
  "cesnak",
];

words.sort(new Intl.Collator("sk").compare);
console.log(words.join(" "));

/*********************************************** */
interface Student {
  name: string;
  id: number;
}

const students: Student[] = [
  { name: "Ram", id: 102 },
  { name: "Shyam", id: 105 },
  { name: "Aman", id: 103 },
  { name: "Shri", id: 101 },
];

// Sort by name in ascending order
const studentsByNameAscending = students
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name));

// Sort by name in descending order
const studentsByNameDescending = students
  .slice()
  .sort((a, b) => b.name.localeCompare(a.name));

// Sort by ID in ascending order
const studentsByIdAscending = students.slice().sort((a, b) => a.id - b.id);

// Sort by ID in descending order
const studentsByIdDescending = students.slice().sort((a, b) => b.id - a.id);

console.log("Students sorted by name (ascending):", studentsByNameAscending);
console.log("Students sorted by name (descending):", studentsByNameDescending);
console.log("Students sorted by ID (ascending):", studentsByIdAscending);
console.log("Students sorted by ID (descending):", studentsByIdDescending);

/************************************************** */
// This is a JavaScript Quiz from BFE.dev

const a = [999, 1111, 111, 2, 0];
const b = a.sort();

console.log(a);
console.log(b);

/************************* */

function customSort(compareFn) {
  // DO NOT REMOVE
  "use strict";
  if (!Array.prototype.sort) {
    Array.prototype.sort = function (compareFunction) {
      for (let i = 0; i < this.length - 1; i++) {
        for (let j = 0; j < this.length - i - 1; j++) {
          if (
            compareFunction
              ? compareFunction(this[j], this[j + 1]) > 0
              : this[j] > this[j + 1]
          ) {
            const temp = this[j];
            this[j] = this[j + 1];
            this[j + 1] = temp;
          }
        }
      }
      return this;
    };
  }

  // write your code below
}

Array.prototype.customSort = customSort;

/*********************************** */

function customSort(compareFn) {
  // DO NOT REMOVE
  "use strict";

  let len = this.length;
  // bubble sort // swap the elements if not in correct order - will take atmost len swaps;

  while (len--) {
    let i = 0;
    let j = 1;
    for (; j <= len; i++, j++) {
      if (compareFn && compareFn(this[i], this[j]) > 0) {
        [this[i], this[j]] = [this[j], this[i]];
      } else if (String(this[i]) > String(this[j])) {
        [this[i], this[j]] = [this[j], this[i]];
      }
    }
  }

  return this;
}

Array.prototype.customSort = customSort;

/*************************************************** */
Sort an array of objects in JavaScript

Ever wanted to sort an array of objects, but felt like it was too complex? After all, Array.prototype.sort() can be customized to your needs, but comparing multiple properties and orders can be a bit of a hassle. Let's tackle this problem and create a robust, reusable solution.

Sort an array of objects alphabetically based on a property
The simplest use-case is to sort an array of objects alphabetically based on a given property. This is a common requirement, and it's a good starting point for our solution.

Using Array.prototype.sort(), we can sort the array based on the given property. We use String.prototype.localeCompare() to compare the values for the given property. The order parameter is optional and defaults to 'asc'.

const alphabetical = (arr, getter, order = 'asc') =>
  arr.sort(
    order === 'desc'
      ? (a, b) => getter(b).localeCompare(getter(a))
      : (a, b) => getter(a).localeCompare(getter(b))
  );

const people = [ { name: 'John' }, { name: 'Adam' }, { name: 'Mary' } ];
alphabetical(people, g => g.name);
// [ { name: 'Adam' }, { name: 'John' }, { name: 'Mary' } ]
alphabetical(people, g => g.name, 'desc');
// [ { name: 'Mary' }, { name: 'John' }, { name: 'Adam' } ]
Sort an array of objects, ordered by properties and orders
Another classic scenario hints back at SQL queries, where you can order by multiple columns and specify the order for each column. This requirement defines the function signature for us.

The function should accept an array of objects, an array of properties and an array of orders. The latter two should match in length and order of elements. The orders array should be an optional array of integers (positive for ascending order, negative for descending order). If no orders array is supplied, the default order should be ascending.

Having decided on the function signature, we can start implementing the function. The first step is to create a copy of the array using the spread operator (...). This avoids mutating the original array.

After that, we use Array.prototype.sort() to sort the array, which is where we do the heavy lifting. Using Array.prototype.reduce(). we iterate over the properties array and compare the values of the current property.

The default value of the accumulator is 0, which means that the current property is equal for both objects. If the accumulator is 0, we compare the values of the current property. If the accumulator is not equal to 0, we return it, meaning we can skip the rest of the properties as the objects are already sorted.

const orderBy = (arr, props, orders) =>
  [...arr].sort((a, b) =>
    props.reduce((acc, prop, i) => {
      if (acc === 0) {
        const [p1, p2] =
          orders && orders[i] <= 0
            ? [b[prop], a[prop]]
            : [a[prop], b[prop]];
        acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0;
      }
      return acc;
    }, 0)
  );

const users = [
  { name: 'fred', age: 48 },
  { name: 'barney', age: 36 },
  { name: 'fred', age: 40 },
];

orderBy(users, ['name', 'age'], [1, -1]);
/*
[
  { name: 'barney', age: 36 },
  { name: 'fred', age: 48 },
  { name: 'fred', age: 40 },
];
*/

orderBy(users, ['name', 'age']);
/*
[
  { name: 'barney', age: 36 },
  { name: 'fred', age: 40 },
  { name: 'fred', age: 48 },
];
*/
💬  Note
A minor caveat is that the orders array check treats 0 as ascending order. Regardless, you shouldn't be passing 0 as an order anyway.

Sort an array of objects, ordered by a property order
Another use-case for an object sorting algorithm is to sort an array of objects based on a property order. This could be a priority order, where a value is not lexically or numerically greater, but has a higher priority.

Unlike the previous snippet, the function should expect an array of objects, the name of the property as a string and an array of values, in order. If the latter doesn't contain all possible values, then they will be treated as having the lowest priority.

Before starting to sort the array, we create an object from the order array, where the values are the keys and the indices are the values. This allows us to quickly check the order of a value. After that, we use Array.prototype.sort() and compare the values of the property based on our order object.

const orderWith = (arr, prop, order) => {
  const orderValues = order.reduce((acc, v, i) => {
    acc[v] = i;
    return acc;
  }, {});
  return [...arr].sort((a, b) => {
    if (orderValues[a[prop]] === undefined) return 1;
    if (orderValues[b[prop]] === undefined) return -1;
    return orderValues[a[prop]] - orderValues[b[prop]];
  });
};

const users = [
  { name: 'fred', language: 'Javascript' },
  { name: 'barney', language: 'TypeScript' },
  { name: 'frannie', language: 'Javascript' },
  { name: 'anna', language: 'Java' },
  { name: 'jimmy' },
  { name: 'nicky', language: 'Python' },
];

orderWith(users, 'language', ['Javascript', 'TypeScript', 'Java']);
/*
[
  { name: 'fred', language: 'Javascript' },
  { name: 'frannie', language: 'Javascript' },
  { name: 'barney', language: 'TypeScript' },
  { name: 'anna', language: 'Java' },
  { name: 'jimmy' },
  { name: 'nicky', language: 'Python' }
]
*/


When sorting an array of primitive values (e.g. strings or numbers), you'll often see a lot of code that looks like this:

const arr = [8, 2, 1, 4, 5, 0];
// Sort in ascending order
arr.sort((a, b) => {
  if (a > b) return 1;
  if (b > a) return -1
  return 0;
}); // [0, 1, 2, 4, 5, 8]
While this piece of code does the job, there is also a one-line alternative for it. The trick hinges on Array.prototype.sort() expecting either a positive or a negative value to perform a swap between two elements, thus allowing for more flexible values than 1 and -1. Subtracting the numeric values in an array is sufficient and can also be used to sort the array the other way around:

const arr = [8, 2, 1, 4, 5, 0];
// Sort in ascending order
arr.sort((a, b) => a - b); // [0, 1, 2, 4, 5, 8]
// Sort in descending order
arr.sort((a, b) => b - a); // [8, 5, 4, 2, 1, 0]
If you are working with string arrays, you should instead use String.prototype.localeCompare(), as it provides far greater flexibility, by accounting for specific locales and their unique needs:

const s = ['Hi', 'Hola', 'Hello'];
// Sort in ascending order
arr.sort((a, b) => a.localeCompare(b)); // ['Hello', 'Hi', 'Hola']
// Sort in descending order
arr.sort((a, b) => b.localeCompare(a)); // ['Hola', 'Hi', 'Hello']