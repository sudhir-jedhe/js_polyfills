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
      comparator = function(a, b) {
        if (a < b) {
          return -1;
        }
  
        if (a > b) {
          return 1;
        }
  
        return 0;
      }
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
  { name: 'John', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 }
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
let words = ['sky', 'blue', 'nord', 'cup', 'lemon', 'new'];

vals.sort();
console.log(vals.join(' '));

words.sort();
console.log(words.join(' '));

/****************************descending *************************************************** */
let vals = [-3, 3, 0, 1, 5, -1, -2, 8, 7, 6];
let words = ['sky', 'blue', 'nord', 'cup', 'lemon', 'new'];

vals.sort((a, b) => b - a);
console.log(vals.join(' '));

words.sort((a, b) => {

    if (a === b) {
        return 0;
    }

    return b < a ? -1 : 1;
});

console.log(words.join(' '));

/******************************case insensitive*************************** */

let words = ["world", "War", "abbot", "Caesar", "castle", "sky", "den",
    "forest", "ocean", "water", "falcon", "owl", "rain", "Earth"];

function icase(e1, e2) {

    if (e1.toLowerCase() === e2.toLowerCase()) return 0;

    return e1.toLowerCase() < e2.toLowerCase() ? -1 : 1;
}

words.sort(icase);
console.log(words.join(' '));
/****************************string length***************************** */
let words = ['brown', 'war', 'a', 'falcon', 'tradition',
    'no', 'boot', 'ellipse', 'strength'];

let bylen = (e1, e2) => e1.length - e2.length;
let bylendesc = (e1, e2) => e2.length - e1.length;

words.sort(bylen);
console.log(words.join('\n'));

words.sort(bylendesc);
console.log(words.join('\n'));


/**************************sort names by surname*************************************** */
let users = ['John Doe', 'Lucy Smith', 'Benjamin Young', 'Robert Brown', 
    'Thomas Moore', 'Linda Black', 'Adam Smith', 'Jane Smith'];

function bysur(n1, n2) {

    let sname1 = n1.split(' ')[1];
    let sname2 = n2.split(' ')[1];

    if (sname1 > sname2) return 1;
    if (sname1 < sname2) return -1;
    return 0;
}

users.sort(bysur);
console.log(users);
/***********************sort array of objects*************************** */
let users = [
  { fname: 'John', lname: 'Doe', salary: 1230 },
  { fname: 'Roger', lname: 'Roe', salary: 3130 },
  { fname: 'Lucy', lname: 'Novak', salary: 670 },
  { fname: 'Ben', lname: 'Walter', salary: 2050 },
  { fname: 'Robin', lname: 'Brown', salary: 2300 },
  { fname: 'Joe', lname: 'Draker', salary: 1190 },
  { fname: 'Janet', lname: 'Doe', salary: 980 }
];

users.sort((e1, e2) => e1.salary - e2.salary)
console.log(users);

console.log('---------------------');

users.sort((e1, e2) => e2.salary - e1.salary)
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
  { fname: "Albert", lname: "Novak", salary: 1930 }
];

users.sort((e1, e2) => {
  return e1.lname.localeCompare(e2.lname) || e2.salary - e1.salary
});

console.log(users);

/*********************sort by accented strings************************ */
const words = ['čaj', 'auto', 'drevo', 'cibuľa', 'čučoriedka', 'banán', 
    'čerešňa', 'ďateľ', 'červený', 'čierny', 'cesnak'];

words.sort(new Intl.Collator('sk').compare);
console.log(words.join(' '));