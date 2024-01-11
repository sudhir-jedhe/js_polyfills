let words = ["pen", "pencil", "falcon", "rock", "sky", "earth"];

for (let word of words) {
  console.log(word);
}

let stones = new Map([
  [1, "garnet"],
  [2, "topaz"],
  [3, "opal"],
  [4, "amethyst"],
]);

for (let e of stones) {
  console.log(e);
}

console.log("------------------------");

for (let [k, v] of stones) {
  console.log(`${k}: ${v}`);
}

/*************Remove Consecutive Duplicate Characters From a String*************** */
const eleminateSameConsecutiveCharacters = (inputData) => {
  let output = "";
  let lastChar = "";

  for (const letter of inputData) {
    if (letter !== lastChar) {
      output += letter;
      lastChar = letter;
    }
  }

  return output;
};

const testString = "Geeks For Geeks";
console.log(eleminateSameConsecutiveCharacters(testString));

//regX

const eleminateSameConsecutiveCharacters = (inputData) => {
  return inputData.replace(/(.)\1+/g, "$1");
};

const testString = "Geeks For Geeks";
console.log(eleminateSameConsecutiveCharacters(testString));

/***************************Find the Length of Longest Balanced Subsequence************************* */
// the maximum number of characters in a string sequence that can form a valid balanced expression
function balancedSubsequence(s) {
  const stack = [];
  let maxmimum = 0;
  let currentIndex = -1;

  for (const char of s) {
    currentIndex++;

    char === "("
      ? stack.push(currentIndex)
      : char === ")" && stack.length > 0
      ? (stack.pop(),
        (maxmimum = Math.max(
          maxmimum,
          currentIndex - (stack.length > 0 ? stack[stack.length - 1] : -1)
        )))
      : null;
  }

  return maxmimum;
}

const input = "(()())";
console.log(balancedSubsequence(input));

/********************************************* */
const array = [9, 4, 3, 11, 10];
let isFound = false;

for (const element of array) {
  if (element === 3) {
    isFound = true;
    break; // short-circuits the loop
  }
}

console.log("Output: ", isFound); // true
