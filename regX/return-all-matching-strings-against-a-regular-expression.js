// Taking input a string
const str = "GeeksforGeeks is for computer science geeks";

// Taking a regular expression
const regexp1 = /cie/;
const regexp2 = /c/;
const regexp3 = /z/;

// Expected Output: 31
console.log(str.search(regexp1));

// Expected Output: 21
console.log(str.search(regexp2));

// Expected Output: -1
console.log(str.search(regexp3));

/**************************** */

// Taking an array of str
const str = [
  "GeeksforGeeks is computer science portal",
  "I am a Geek",
  "I am coder",
  "I am a student",
  "I am a computer science Geek",
];

// Taking a regular expression
const regexp = /Gee/;
let arr = [];

for (let i = 0; i < str.length; i++) {
  if (str[i].search(regexp) != -1) {
    arr.push(str[i]);
  }
}
console.log(arr);
/******************************************* */
