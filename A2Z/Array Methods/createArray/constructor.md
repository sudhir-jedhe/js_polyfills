```js
const arr = new Array();

const arr = new Array(1, true, "string"); 

const arrayEmpty = new Array(2);
console.log(arrayEmpty.length); // 2
console.log(arrayEmpty[0]); // undefined; actually, it is an empty slot
console.log(0 in arrayEmpty); // false
console.log(1 in arrayEmpty); // false

const arrayOfOne = new Array("2"); // Not the number 2 but the string "2"
console.log(arrayOfOne.length); // 1
console.log(arrayOfOne[0]); // "2"

const fruits = new Array("Apple", "Banana");
console.log(fruits.length); // 2
console.log(fruits[0]); // "Apple"


```