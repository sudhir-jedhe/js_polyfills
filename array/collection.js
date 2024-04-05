4. Show insertion and removal of elements can happen in the array for given index
Values of the array can be removed from any position using splice method of array
Values of the array can also be inserted to any position using splice method of array
2nd argument is passed as 0 which inserts the elements without replacing
The values passed after 2nd argument are considered for insertion
const arr = [1, 2, 2, 3];
const position = 2;
const count = 1;
arr.splice(position, count); // [2]
console.log(arr); // [1, 2, 3]

const arr = [1, 2, 4, 5];
const position = 2;
arr.splice(position, 0, 3);
console.log(arr); // [1, 2, 3, 4, 5]

Notes

'count' indicates the number of elements to be removed from the index 'position'. Multiple values can be inserted or removed using splice

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
5. Show the different ways of emptying an array which has values
Array can be emptied by giving a new reference of an empty array
Setting the length of the array to 0 will automatically makes the array empty
pop and shift operation on array can also be used to empty the array where each elements get removed
arr = [];

arr = new Array();

arr.length = 0;

while (arr.length > 0) {
  arr.pop();
}

while (arr.length > 0) {
  arr.shift();
}

arr.splice(0, arr.length);

Notes

splice operation used here to empty the array is a trick by passing the length of the array as argument, where all the elements of the array get removed

References

https://www.javascripttutorial.net/array/4-ways-empty-javascript-array/
6. Check if given input is an array or not
Array.isArray is a method which checks if the given argument is an array or not
Alternatively the toString method present on Object prototype can be used to check if it is an array
Array.isArray(arr);

Object.prototype.toString.call(arr) === "[object Array]";

Notes

typeof operator cannot be used to check if a value is an array or not because array is an object and typeof arr returns us "object"



8. Create an array by removing all the holes of the array
Holes are undefined value present inside array
Holes do not get iterated in filter which will just fetch all the values except undefined
const uniqueArr = arr.filter((value) => true);

Notes

Holes can be formed when an array value by index is deleted. Example: delete arr[index]

9. Optimize the given statements having lot of logical checks to use a compact and cleaner logic
// Example1
browser === "chrome" ||
  browser === "firefox" ||
  browser === "IE" ||
  browser === "safari";
 
// Example2
browser !== "chrome" &&
  browser !== "firefox" &&
  browser !== "IE" &&
  browser !== "safari";

Examples can be modified to store the values of comparision in an array and check for the presence of value if it is present inside array
// Example1
// browser === "chrome" || browser === "firefox" || browser === "IE" || browser === "safari"
 
const browserList = ["chrome", "firefox", "IE", "safari"];
browserList.includes(browser);

// Example2
// browser !== "chrome" && browser !== "firefox" && browser !== "IE" && browser !== "safari"
 
const browserList = ["chrome", "firefox", "IE", "safari"];
!browserList.includes(browser);




11. Write a program to store values in to a set
Set lets us store unique values of any type
Set can be created empty & then added with values or can be initialized also
const set = new Set();
set.add(1);
set.add(true);
set.add("text");
set.add(1);
 
set; // 1, true, "text"

const set = new Set([1, 2, 3]);
 
set; // 1, 2, 3

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
12. Write a program to store values in to a map
Map holds key-value pairs and remembers the original insertion order of the keys
Map can be created empty & then added with values or can be initialized also with key-value pairs
const map = new Map();
map.set(1, 1000);
map.set(true, false);
map.set("text", "String");
 
map; // [1, 1000] [true, false] ["text", "String"]

const map = new Map([
  [1, "One"],
  [2, "two"],
  [3, "three"],
]);
map; // [1, "One"] [2, "two"] [3, "three"]

Notes

Unlike objects, Map can have any primitive or object as the key

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
13. Write a code to iterate over a set
set is an iterable object and can be iterated using for..of loop
set can also be iterated by simple forEach loop
for (let val of set) console.log(val);

set.forEach((value) => console.log(value));

14. Write a code to iterate over a map
map is an iterable object and can be iterated using for..of loop
map can also be iterated by simple forEach loop
for (let val of map) console.log(val[0], val[1]);

for (let key of map.keys()) console.log(key, map.get(key));

map.forEach((value, key) => console.log(key, value));

15. Show how map is different from object to store key value pairs with coding example
Map does not contain any keys by default unlike objects which has keys from its prototype
Map's keys can be any value (including functions, objects, or any primitive) unlike object where keys are only strings
The keys in Map are ordered in a simple, straightforward way
The number of items in a Map is easily retrieved from its size property
Map is an iterable object
map.set(1, "Mapped to a number"); // primitive number as key
map.set("1", "Mapped to a string"); // string value as key
map.set({}, "Mapped to a object"); // object as key
map.set([], "Mapped to an array"); // array as key
map.set(() => {}, "Mapped to a function"); // function as key

Notes

Maps perform better than objects in most of the scenarios involving addition and removal of keys
