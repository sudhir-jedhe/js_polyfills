// remove specific elements from the left of a given array
var arr = [2, 4, 5, 3, 6];

// Find index of specified element which is n
var ind = arr.indexOf(n);

// And remove n from array
arr.splice(ind, 1);

/****************************************** */
// Define the array
let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log("Original Array:", arr);

// Define the number of elements to remove
let elemsToDelete = 3;

// Using the splice() method to remove from
// the last nth index for n elements
arr.splice(arr.length - elemsToDelete, elemsToDelete);

console.log("Modified Array:", arr);

/*********************************************** */
// Removing an adding element at a particular location
// in an array
// Declaring and initializing arrays
let number_arr = [20, 30, 40, 50, 60];
let string_arr = ["amit", "sumit", "anil", "prateek"];

// splice()
// deletes 3 elements starting from 1
// number array contains [20, 60]
number_arr.splice(1, 3);

// doesn't delete but inserts 3, 4, 5
// at starting location 1
number_arr.splice(1, 0, 3, 4, 5);

// deletes two elements starting from index 1
// and add three elements.
// It contains ["amit", "xyz", "geek 1", "geek 2", "prateek"];
string_arr.splice(1, 2, "xyz", "geek 1", "geek 2");

// Printing both the array after performing splice operation
console.log("After splice op ");
console.log(number_arr);
console.log("After splice op ");
console.log(string_arr);
