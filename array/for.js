// The for-loop is a commonly used iteration syntax in javascript. It has both pros and cons

// #### Pros

// 1. Works on every environment
// 2. You can use break and continue flow control statements

// #### Cons

// 3. Too verbose
// 4. Imperative
// 5. You might face one-by-off errors

let words = ["pen", "pencil", "falcon", "rock", "sky", "earth"];

wordArrayloop: for (let i = 0; i < words.length; i++) {
  console.log(words[i]);
}

const words = ["pen", "pencil", "rock", "sky", "earth"];

words.forEach((e) => console.log(e));

for (let word of words) {
  console.log(word);
}

for (let idx in words) {
  console.log(words[idx]);
}

const len = words.length;

for (let i = 0; i < len; i++) {
  console.log(words[i]);
}

const i = 0;

while (i < len) {
  console.log(words[i]);
  i++;
}

/****************************** */
/***************************Find the Length of Longest Balanced Subsequence************************* */
// the maximum number of characters in a string sequence that can form a valid balanced expression
function balancedSubsequence(s, n) {
  let invalidOpenBraces = 0;
  let invalidCloseBraces = 0;

  for (let i = 0; i < n; i++) {
    if (s[i] == "(") {
      invalidOpenBraces++;
    } else {
      if (invalidOpenBraces == 0) {
        invalidCloseBraces++;
      } else {
        invalidOpenBraces--;
      }
    }
  }
  return n - (invalidOpenBraces + invalidCloseBraces);
}

let s = "()(((((()";
let n = s.length;
console.log(balancedSubsequence(s, n));

/***************************************************** */

// list-of-all-variables-in-google-chrome-console

function findAllVariables() {
  // let variables = Object.keys(window);
  for (let variable in window) {
    if (window.hasOwnProperty(variable)) {
      console.log(variable);
    }
  }
}

/********************************************************* */
const files = [ 'foo.txt ', '.bar', '   ', 'baz.foo' ];
let filePaths = [];

for (let file of files) {
  const fileName = file.trim();
  if(fileName) {
    const filePath = `~/cool_app/${fileName}`;
    filePaths.push(filePath);
  }
}

const files = [ 'foo.txt ', '.bar', '   ', 'baz.foo' ];
const filePaths = files.reduce((acc, file) => {
  const fileName = file.trim();
  if(fileName) {
    const filePath = `~/cool_app/${fileName}`;
    acc.push(filePath);
  }
  return acc;
}, []);

// filePaths = [ '~/cool_app/foo.txt', '~/cool_app/.bar', '~/cool_app/baz.foo']
// chaining
const files = [ 'foo.txt ', '.bar', '   ', 'baz.foo' ];
const filePaths = files
  .map(file => file.trim())
  .filter(Boolean)
  .map(fileName => `~/cool_app/${fileName}`);

// filePaths = [ '~/cool_app/foo.txt', '~/cool_app/.bar', '~/cool_app/baz.foo']