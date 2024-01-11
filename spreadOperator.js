/*
In JavaScript, there are multiple ways in which we can assign the value of one object to another.
 Sometimes we do not know the exact number of arguments that are to be assigned. 
 In this case, the triple dots are used. 

The triple dots are known as the spread operator, which takes an iterable(array, string, or object) 
and expands the iterable to individual values. The spread operator is useful as it
 reduces the amount of code to be written and increases its readability. 
*/

let baseArr = [1, 2, 3];
let baseArr2 = [4, 5, 6];

// Inbuilt concat method
baseArr = baseArr.concat(baseArr2);
console.log(baseArr);

let spreadArr = ["a", "b", "c"];
let spreadArr2 = ["d", "e", "f"];

// Concatenating using three dots
spreadArr = [...spreadArr, ...spreadArr2];
console.log(spreadArr);

/************************************ */
let baseArr = [1, 2, 3];
let baseArr2 = baseArr;
baseArr2.push(4);
console.log(baseArr2);
console.log(baseArr);

let spreadArr = ["a", "b", "c"];
let spreadArr2 = [...spreadArr];
spreadArr2.push("d");
console.log(spreadArr);
console.log(spreadArr2);

/***************************** */
let baseArr = [5, 2, 7, 8, 4, 9];
console.log(Math.min(baseArr));
console.log(Math.min(...baseArr));

/**************************** */
const spreadObj = {
  name: "Ram",
  country: "India",
};

// Cloning previous object
const newObj = { ...spreadObj };
console.log(newObj);

/******************************** */
function add(...objects) {
  let ans = 0;
  for (let i = 0; i < objects.length; i++) {
    ans += objects[i];
  }
  console.log(ans);
}
add(1, 2);
add(23, 45, 67, 56);

/********************************** */

const plainObj = { name: "Ram" }; // Spreading non iterable object
const baseArr = [...plainobj];
