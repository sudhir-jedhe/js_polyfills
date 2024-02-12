let originalArray = [1, 2, 3];
let clonedArray = originalArray.slice();
console.log(clonedArray);

/*************************** */

clonedArray = [...originalArray];
console.log(clonedArray);
/**************************** */
clonedArray = Array.from(originalArray);
console.log(clonedArray);

/***************** */
clonedArray = [].concat(originalArray);
console.log(clonedArray);
/************************************************* */

clonedArray = [];
for (let i = 0; i < originalArray.length; i++) {
  clonedArray.push(originalArray[i]);
}
console.log(clonedArray);

/*********************************************** */
clonedArray = originalArray.map((x) => x);
console.log(clonedArray);

/******************************************************* */
clonedArray = Array.from(originalArray, (x) => x);
console.log(clonedArray);

/*************************************************************** */
clonedArray = Array.of(...originalArray);
console.log(clonedArray);
/*********************************************************** */

clonedArray = JSON.parse(JSON.stringify(originalArray));
console.log(clonedArray);
/*********************************************************** */

clonedArray = Object.assign([], originalArray);
console.log(clonedArray);
/***************************************************************** */
clonedArr = originalArr.slice();

console.log(clonedArr);
/************************************************************************** */
arr = ["Geeksforgeeks", "geek", "GFG", "geeks"];
newArray = structuredClone(arr);
console.log(clonedArr);
