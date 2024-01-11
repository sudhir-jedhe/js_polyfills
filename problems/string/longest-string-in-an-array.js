// Input array of strings
let arr = ["A_Copmuter_Science_Portal", "GeeksforGeeks", "GFG", "geeks"];

// It compares the length of an element with
// every other element and after sorting
// them in decreasing order it returns the
// first element.
function gfg_Run() {
  return arr.sort(function (a, b) {
    return b.length - a.length;
  })[0];
}

// Display output
console.log(gfg_Run());

/******************************************** */

// Input array of strings
let arr = ["A_Copmuter_Science_Portal", "GeeksforGeeks", "GFG", "geeks"];

// It compares the length of a element with
// every other element and return it if its
// greater than every other element.
function gfg_Run() {
  return arr.reduce(function (a, b) {
    return a.length > b.length ? a : b;
  });
}

// Display output
console.log(gfg_Run());

/**************************************************************** */
// Input array of strings
let arr = ["A_Copmuter_Science_Portal", "GeeksforGeeks", "GFG", "geeks"];

// It compares the length of a string with
// every other string and return it if its
// greater than every other string.
function gfg_Run() {
  let longestString = "";
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] === "string" && arr[i].length > longestString.length) {
      longestString = arr[i];
    }
  }
  return longestString;
}

// Display output
console.log(gfg_Run());
