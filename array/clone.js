const originalArray = [1, 2, 3];
const clonedArray = originalArray.slice();
console.log(clonedArray);

/*************************** */

const originalArray = [1, 2, 3];
const clonedArray = [...originalArray];
console.log(clonedArray);
/**************************** */
const clonedArray = Array.from(originalArray);
console.log(clonedArray);

const clonedArray = [].concat(originalArray);
console.log(clonedArray);
/************************************************* */

const clonedArray = [];
for (let i = 0; i < originalArray.length; i++) {
  clonedArray.push(originalArray[i]);
}
console.log(clonedArray);

/*********************************************** */
const clonedArray = originalArray.map((x) => x);
console.log(clonedArray);

const clonedArray = Array.from(originalArray, (x) => x);
console.log(clonedArray);

const clonedArray = Array.of(...originalArray);
console.log(clonedArray);

const clonedArray = JSON.parse(JSON.stringify(originalArray));
console.log(clonedArray);

const clonedArray = Object.assign([], originalArray);
console.log(clonedArray);

const originalArr = [1, 2, 3, 4, 5, 6];
const clonedArr = originalArr.slice();

console.log(clonedArr);

const arr = ["Geeksforgeeks", "geek", "GFG", "geeks"];
const newArray = structuredClone(arr);
console.log(newArray);
