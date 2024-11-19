// Remove elements from a JavaScript array without mutating it

// As mentioned in a previous article, Array.prototype.splice() is often used to remove elements from an array. It's also capable of inserting items into an array, but it always mutates the original array. Oftentimes, this isn't what you really want, so let's take a look at how we can implement a non-mutating version of Array.prototype.splice().

// At its core, Array.prototype.splice() behaves as follows:

// Items between the start of the array and the given index are kept intact.
// Starting at the given index, the specified number of items are removed.
// The given items, if any, are inserted after the given index.
// The rest of the items are kept intact.
// Having broken down this behavior, we can easily see that we can implement it using Array.prototype.slice() and Array.prototype.concat().

const shank = (arr, index = 0, delCount = 0, ...elements) =>
  arr
    .slice(0, index)
    .concat(elements)
    .concat(arr.slice(index + delCount));

const names = ['alpha', 'bravo', 'charlie'];
const namesAndDelta = shank(names, 1, 0, 'delta');
// [ 'alpha', 'delta', 'bravo', 'charlie' ]
const namesNoBravo = shank(names, 1, 1); // [ 'alpha', 'charlie' ]
console.log(names); // ['alpha', 'bravo', 'charlie']


// slice

let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let index = 2;
let newArr = arr.slice(0, index).concat(arr.slice(index + 1, arr.length))
//OR
//ES6
let newArr = [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)];

console.log(newArr);
//["prashant", "sachin", "panam", "pranav"]

let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];

let removeItems = (arr, index) => {
  return [...arr.slice(0, index), ...arr.slice(index+1, arr.length)];
}

arr = removeItems(arr, 2);
console.log(arr);
//["prashant", "sachin", "panam", "pranav"]

arr = removeItems(arr, 3);
console.log(arr);
//["prashant", "sachin", "panam"]


//Filter

let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let exclude = 'prashant';
let updated = arr.filter(e => e !== exclude);
console.log(updated);
//["sachin", "yogesh", "panam", "pranav"]

let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let exclude = ['prashant', 'yogesh'];

let updated = arr.filter(e => exclude.indexOf(e) === -1);
console.log(updated);
//["sachin", "panam", "pranav"]

//Splice

let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
let index = 2;
arr.splice(index, 1);

console.log(arr);
//["prashant", "sachin", "panam", "pranav"]

// pop
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.pop();

console.log(arr);
//[prashant', 'sachin', 'yogesh', 'panam']

//shift 
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.shift();

console.log(arr);
//['sachin', 'yogesh', 'panam', 'pranav']

// array length 
let arr = ['prashant', 'sachin', 'yogesh', 'panam', 'pranav'];
arr.length = 4;

console.log(arr);
//['prashant', 'sachin', 'yogesh', 'panam']