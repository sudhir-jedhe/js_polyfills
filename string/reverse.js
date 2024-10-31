function reverseString(str) {
  const reversedString = str.split("").reduce((acc, char) => char + acc, "");
  console.log(reversedString);
}
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = str.split("").reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/***************************** */
// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reverse().join("");
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*********************************** */

// Function to reverse string
function reverseString(str) {
  const strRev = [...str].reduce((x, y) => y.concat(x));
  console.log(strRev);
}

// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************** */
// Function to reverse string
function reverseString(str) {
  let strRev = "";
  for (let i = str.length - 1; i >= 0; i--) {
    strRev += str[i];
  }
  console.log(strRev);
}

  

function reverseString(str) {
  // Base case: if the string is empty or has only one character, return the string
  if (str.length <= 1) {
    return str;
  }
  // Recursive case: return the last character + reverseString of all characters except the last
  return str.charAt(str.length - 1) + reverseString(str.substring(0, str.length - 1));
}
// Function call
reverseString("GeeksforGeeks");
reverseString("JavaScript");
reverseString("TypeScript");

/*************************************** */
function strReverse(str) {
  if (str === "") {
    return "";
  } else {
    return strReverse(str.substr(1)) + str.charAt(0);
  }
}
console.log(strReverse("GeeksforGeeks"));
console.log(strReverse("JavaScript"));
console.log(strReverse("TypeScript"));

/************************************* */
function reverseString(str) {
  return [...str].reduceRight((accumulator, current) => accumulator + current);
}
