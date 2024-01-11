1. Show the usage of typeof operator on different types of values
The typeof operator returns a string indicating the type of the operand
typeof 50; //   "number"
typeof "text"; //   "string"
typeof true; //   "boolean"
typeof undefined; //   "undefined"
typeof function () {}; //   "function"
typeof 10n; //   "bigint"
typeof Symbol(); //   "symbol"
typeof [1, 2]; //   "object"
typeof {}; //   "object"
 
typeof NaN; //   "number"        (NaN is Not a Number)
typeof undeclaredVar; //   "undefined"     (undeclaredVariable is never declared)
typeof Infinity; //   "number"        (Infinity, -Infinity, -0 are all valid numbers in JavaScript)
typeof null; //   "object"        (This stands since the beginning of JavaScript)
typeof /regex/; //   "object"        (regular expressions start and end with '/' in literal form)

Notes

Arrays and functions are sub type of objects

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
2. Show the different ways of concatenating numbers and strings
Concatenation of strings and numbers is a common practical use case
// numbers and strings
1 + "2"; // 12
1 + 2 + "3"; // 33
1 + 2 + "3" + "4"; // 334
1 + "One"; // 1One
 
// strings and numbers
"1" + 2; // 12
"1" + "2" + 3; // 123
"1" + "2" + 3 + 4; // 1234
"1" + "2" + (3 + 4); // 127
"One" + 1; // One1
 
// mix of string and numbers
1 + 2 + "3" + "4" + 5 + 6; // 33456
1 + 2 + "3" + "4" + (5 + 6); // 33411
"1" + "2" + (3 + 4) + 5 + "6"; // 12756

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
3. Show the conversion from number to string and vice versa
Conversion between numbers and strings is a common practical use case
// number to string conversion
const num = 12;
 
String(num); // "12"
num.toString(); // "12"
num + ""; // "12"

// string to number conversion
const str = "12";
 
Number(str); // 12
+str; // 12
parseInt(str); // 12

Notes

If the number is floating, parseFloat can be used. parseInt and parseFloat are the methods present on the Number object also

References

https://javascript.info/type-conversions
4. Write a code to operate on integer numbers outside the range of numbers in JavaScript
BigInt is a datatype in JavaScript which facilitates the mathematical opertions on huge value of integer number
It is represented by a suffix 'n' for number value
// assignment of big integers
const bigNum1 = 1526688934595n,
  bigNum2 = 256489246848n,
  num3 = 1562365;
 
const bigSum = bigNum1 + bigNum2;
const bigDiff = bigNum1 - bigNum2;
const total = bigNum1 + bigNum2 + BigInt(num3);

Notes

The big integers cannot be operated directly with normal number datatype. 10n + 20 is not allowed

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt
5. Show the usage of ||, &&, ?? and !! with code examples
The logical OR (||) operator for a set of operands is true if and only if one or more of its operands is true
The logical AND (&&) operator for a set of operands is true if and only if all of its operands are true
The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined, and otherwise returns its left-hand side operand
The double NOT (!!) operator used to explicitly force the conversion of any value to the corresponding boolean primitive
const num1 = 10,
  num2 = 20;
 
true || false; // true
false || false; // false
false || num1; // 10
0 || num2; // 20
"text" || true; // "text"
num1 > 0 || num2 < 0; // true

const num1 = 10,
  num2 = 20;
 
true && true; // true
true && false; // false
true && num1; // 10
num1 && num2; // 20
"text" && num1 + num2; // 30
num1 > 0 && num2 < 0; // false

undefined ?? 10; // 10
null ?? 20; // 20
false ?? num1; // false
0 ?? num2; // 0

!!10; // true
!!{}; // true
!!""; // false
!!0; // false

Notes

It is not possible to combine both the AND (&&) and OR operators (||) directly with ??

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
https://developer.cdn.mozilla.net/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT
6. Show the frequently and commonly used methods available on Number object with coding examples
isInteger is used to check if the given number is integer or not
parseInt is used to convert a given value in to integer
parseFloat is used to convert a given value in to floating number
isNaN is used to check if the given value is NaN or no
toFixed is used to limit the number of digits after the decimal place
toPrecision is used to limit the total number of digits to represent the number
Number.isInteger(1.5); // false
Number.isInteger(-15); // true
 
Number.parseInt("5.8"); // 5
Number.parseInt("123x"); // 123
 
Number.parseFloat("5.86"); // 5.86
Number.parseFloat("-12.69x"); // -12.69
 
Number.isNaN(NaN); // true
Number.isNaN("text" - 10); // true
Number.isNaN("text"); // false

(56.369).toFixed(2); // 56.37
(59).toFixed(3); // 59.000
 
(32.458).toPrecision("3"); // 32.5
(98.1).toPrecision(1); // 1e+2

Notes

NaN is special type of number and this value is results by the invalid mathematical operations such as substraction of number and text

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
7. Write the polyfill for Number.isNaN
A polyfill is a piece of code used to provide modern functionality on older browsers that do not natively support it
NaN is the only value which is not equal to itself and hence comparision operator cannot be used directly to check if a value is NaN
Number.isNaN =
  Number.isNaN ||
  function isNaN(input) {
    return typeof input === "number" && input !== input;
  };

Notes

Even though the name says Not a Number, it is of type "number"

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
8. Show the frequently and commonly used methods available on Math object with coding examples
abs is used to get the absolute value of the given number
floor is used to get the greatest integer smaller than or equal to the given number
ceil is used to get the smallest integer greater than or equal to the given number
round is used to round the given number to the nearest integer.
max is used to get the largest of zero or more numbers
min is used to get the smallest of zero or more numbers
sqrt is used to calculate the square root of the given number
pow is used to calculate the power base on inputs
trunc is used to limit the total number of digits to represent the number (method is present on prototype of Number)
Math.abs(-5));                      // 5
Math.floor(1.6));                   // 1
Math.ceil(2.4));                    // 3
Math.round(3.8));                   // 4
Math.max(-4, 5, 6));                // 6
Math.min(-7, -2, 3));               // -7
Math.sqrt(64));                     // 8
Math.pow(5, 3));                    // 125
Math.trunc(-6.3));                  // -6

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
9. How can we solve the problem of comparision of 0.1 + 0.2 with 0.3 where === operator fails
The addition of 0.1 and 0.2 will result in to 0.30000000000000004 and the comparision with 0.3 fails
Number.epsilon is 2-52, which can be used to verify if this decimal values are matching
0.1 + 0.2 - 0.3 < Number.EPSILON; // true

References

https://www.programiz.com/javascript/library/number/epsilon
10. Write a code to iterate over a string
String can be traversed using its string index or value as string can act like an iterable
for (let i = 0; i < str.length; i++) {
  console.log(str.charAt(i));
}

for (let index in str) {
  console.log(str[index]);
}

for (let value of str) {
  console.log(value);
}

[...str].forEach((value) => console.log(value));

References

https://medium.com/better-programming/how-to-iterate-through-strings-in-javascript-65c51bb3ace5
11. Show the usage of template literals with expression interpolation and tagged templates
Template literals are string literals allowing embedded expressions and support multi lines
Template literals are enclosed by the backtick 
Tagged templates allow to parse template literals with a function which gets array of strings and expressions as arguments
// Template literals with expression interpolation
const num1 = 10,
  num2 = 20;
`The sum of ${num1} and ${num2} is ${num1 + num2}`; // The sum of 10 and 20 is 30

// Tagged templates
let person = "John";
let membership = [1, 3];
 
function myTag(strings, person, membership) {
  let communities = ["Java", "JavaScript", "TypeScript", "HTML", "CSS"];
 
  let str0 = strings[0]; // "Note:"
  let str1 = strings[1]; // "is a member of following communities:"
 
  let personCommunities = membership.map((index) => communities[index]);
  return `${str0}${person}${str1}${personCommunities}`;
}
 
myTag`Note: ${person} is a member of following communities: ${membership}`; // Note: John is a member of following communities: JavaScript,HTML

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
12. Write a code to show the working of try...catch...finally
The try statement consists of a try-block, which contains one or more statements. At least one catch-block, or a finally-block, must be present
The exceptions and errors from try block are caught in catch block
try {
  // Below statement will throw an Error
  callAPI();
} catch (error) {
  // Create a new error and throw
  throw new Error(error); // ReferenceError: callAPI is not defined
} finally {
  console.log("I will execute no matter what happened in try or catch");
}

Notes

try can be chained with catch block or finally block
try..catch only works synchronously and for runtime errors
References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch
13. Show the creation and usage of symbol with code
A "symbol" represents a unique identifier
Symbol.for method searches for existing symbols in a runtime-wide symbol registry returns the same. If not found, creates a new Symbol
Symbol.keyFor method retrieves the name of the symbol
// new symbol
let symId = Symbol("id");
 
// global symbol
let symUsername = Symbol.for("username");
 
// get name by symbol
Symbol.keyFor(symUsername); // username

Notes

Symbols are skipped by for…in

References

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol
https://javascript.info/symbol


// 1. Swap two integers present in variables num1 and num2 without using temporary variable
// The swapping of 2 variables is possible with simple Destructuring assignment using array
// Traditional approach of swapping by using the given variables is also achievable
let num1 = 10, num2 = 20;
[num1, num2] = [num2, num1];

let num1 = 10, num2 = 20;
num1 = num1 + num2;
num2 = num1 - num2;
num1 = num1 - num2;

// Notes

// 2nd solution can fail due to overflow of number range if the numbers are very big

// 2. Write a function which returns true if given value of number is an integer without using any inbuilt functions
// Example
isInt(4.0); // true
isInt(12.2); // false
isInt(0.3); // false

// Modulo operator can be used to check if there is a remainder left when divided by 1
function isInt(value) {
  return value % 1 === 0;
}

// 3. Create a function which returns a random number in the given range of values both inclusive
// Math.random function returns a floating-point, pseudo-random number between 0 (inclusive) and 1 (exclusive)
function randomNumberGeneratorInRange(rangeStart, rangeEnd) {
  return rangeStart + Math.round(Math.random() * (rangeEnd - rangeStart));
}
 
randomNumberGeneratorInRange(10, 50); // 12

// Notes

// Usage of Math.round depends on the logic used to accomplish the requirement

// References

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// 4. Write a program to reverse a string
// String can be reversed by iterating it and storing it in reverse order
// String can also be reversed by converting it to array, then joining it after reversing
const str = "JavaScript is awesome";
let reversedString = "";
for (let i = 0; i < str.length; i++) {
  reversedString = str.charAt(i) + reversedString;
}
 
reversedString; // "emosewa si tpircSavaJ"

const str = "JavaScript is awesome";
str.split("").reverse().join(""); // "emosewa si tpircSavaJ"

// Notes

// The string can be tested if it is palindrome, by comparing the actual string with the reversed string

// References

// https://www.freecodecamp.org/news/how-to-reverse-a-string-in-javascript-in-3-different-ways-75e4763c68cb/
// 5. Write a program to reverse a string by words. Also show the reverse of each words in place
// The string can be reversed by words, by splitting the string with spaces and joining them back after reverse
// If the the letters in each word have to be reversed, the string reversal procedure has to be followed after breaking the string with spaces
const str = "JavaScript is awesome";
str.split(" ").reverse().join(" "); // "awesome is JavaScript"

const str = "JavaScript is awesome";
str
  .split(" ")
  .map((val) => val.split("").reverse().join(""))
  .join(" "); // "tpircSavaJ si emosewa"

// 6. Write a program to reverse a given integer number
// The remainder of the number can be fetched and the number can be divided by 10 to remvoe the the digit in loop till number becomes 0
// A simple approach to reverse a number could also be to convert it in to a string and then reverse it
let num = 3849;
 
let reversedNum = 0;
while (num !== 0) {
  reversedNum = reversedNum * 10 + (num % 10);
  num = Math.floor(num / 10);
}
 
reversedNum; // 9483

let num = 3849;
 
let numStr = String(num);
+numStr.split("").reverse().join(""); // 9483

// 7. Write a code to replace all the spaces of the string with underscores
// The string can be split using the space character and can be joined back with underscore to replace all the spaces with strings
// replaceAll is the inbuilt String function on prototype which can be used to replace a string with another string
str.split(" ").join("_");

str.replaceAll(" ", "_");

// Notes

// replace is also an inbuilt String function on prototype which can be used to replace the 1st occurence of the string with another string

// References

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll
// 8. Write a function which can convert the time input given in 12 hours format to 24 hours format
// Example
convertTo24HrsFormat("12:10AM"); // 00:10
convertTo24HrsFormat("5:00AM"); // 05:00
convertTo24HrsFormat("12:33PM"); // 12:33
convertTo24HrsFormat("01:59PM"); // 13:59
convertTo24HrsFormat("11:8PM"); // 23:08
convertTo24HrsFormat("10:02PM"); // 22:02

// The check for 'AM' and 'PM' can be verified using endsWith String method
// An extra 0 would be needed if the hours have single digit
function convertTo24HrsFormat(timeText) {
  var timeTextLower = timeText.toLowerCase();
  let [hours, mins] = timeTextLower.split(":");
 
  // 12 o clock is the special case to be handled both for AM and PM
  if (timeTextLower.endsWith("am")) hours = hours == 12 ? "0" : hours;
  else if (timeTextLower.endsWith("pm"))
    hours = hours == 12 ? hours : String(+hours + 12);
 
  return hours.padStart(2, 0) + ":" + mins.slice(0, -2).padStart(2, 0);
}

// Notes

// Conversion of string to lowerCase helps in case insensitive comparision

// References

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
// 9. Write a function which accepts a string argument and returns the count of characters between the first and last character 'X'
// Example
getTheGapX("XeroX"); // 4
getTheGapX("Xamarin"); // -1       (If there is only single character 'X')
getTheGapX("JavaScript"); // -1       (If there is no character 'X')
getTheGapX("F(X) !== G(X) !== F(X)"); // 18

// indexOf and lastIndexOf are the methods on String which returns the position of the given string in the input string from start and end respectively
// If the match is not found, these methods return -1
function getTheGapX(str) {
  if (!str.includes("X")) {
    return -1;
  }
 
  const firstIndex = str.indexOf("X");
  const lastIndex = str.lastIndexOf("X");
  return firstIndex === lastIndex ? -1 : lastIndex - firstIndex;
}

// 10. Write a function to truncate a string to a certain number of letters
// Example
truncateString("JavaScript", 7); // "Java..."
truncateString("JS is fun", 10); // "JS is fun"
truncateString("JS is funny", 10); // "JS is f..."

// Text can be truncated by fetching the substring from start till the count of characters
// substr methods of String can be used to fetch the part of the string
function truncateString(str, charCount) {
  if (str.length > charCount) {
    return str.substr(0, charCount - 3) + "...";
  } else {
    return str;
  }
}

// 11. Write a code to truncate a string to a certain number of words
// The string can be broken in to words array and then slice method of array can be used to get the number of words which will then be joined back
const str = "JavaScript is simple but not easy to master";
const wordLimit = 3;
 
str.split(" ").slice(0, wordLimit).join(" "); // "JavaScript is simple"

// 12. Create a regular expression to validate if the given input is valid Indian mobile number or not
// Example
validateMobile("+919876543210"); // true
validateMobile("+91 9876543210"); // true
validateMobile("09876543210"); // true
validateMobile("9876543210"); // true
validateMobile("99876543210"); // false

// Regular expression check has to have an optional +91 or 0 in the beginning, then an optional space and 10 digits
// test method of regular expression can be used to validate if the mobile number pattern matches or not
function validateMobile(str) {
  const regexMobile = /^(\+91|0)?\s?\d{10}$/;
  return regexMobile.test(str);
}

function validateMobile(str) {
  const regexMobile = /^(\+91|0)?\s?\d{10}$/;
  return str.match(regexMobile) !== null;
}

// Notes

// String has method match which returns array of matches or null

// 13. Write a function which returns a list of elements which contains at least one character as digit
// Example
numInStr(['1a', 'a', '2b', 'b']));              // ['1a', '2b']
numInStr(['abc', 'abc10']));                    // ['abc10']
numInStr(['abc', 'ab10c', 'a10bc', 'bcd']));    // ['ab10c', 'a10bc']
numInStr(['this is a test', 'test1']));         // ['test1']

// A test for digit after looping through the array would give the list of values having at least one digit string
function numInStr(mixArray) {
  return mixArray.filter((value) => {
    return /[0-9]/.test(value);
  });
}

// 14. Write a function which checks if a given search text is present either in the beginning of the first name or the second name
// Example
validateName("Nedson PETER", "pet"); // true
validateName("Peter Parker", "pet"); // true
validateName("Speter parker", "pet"); // false
validateName("John Doe Peter", "pet"); // false

// The function can be designed to accept the name and the search text
// Regular expression can be designed to validate if the name has search text the beginning of first or second name
function validateName(str, searchText) {
  const regex = new RegExp("^(\\w*\\s)?" + searchText + "\\w*?", "i");
  return regex.test(str);
}

// Notes

// Case insensitive match is happening for the search text in the string represented by the argument "i" for the regular expression

// 15. Write a function to chop a string into chunks of a given length and return it as array
// Example
stringChop("JavaScript"); // ["JavaScript"]
stringChop("JavaScript", 2); // ["Ja", "va", "Sc", "ri", "pt"]
stringChop("JavaScript", 3); // ["Jav", "aSc", "rip", "t"]

// String can be chopped using slice method of String
// Regular expression can also be used effectively to this operation
function stringChop(str, size = str.length) {
  const arr = [];
  let i = 0;
  while (i < str.length) {
    arr.push(str.slice(i, i + size));
    i = i + size;
  }
  return arr;
}

function stringChop(str, size = str.length) {
  return str.match(new RegExp(".{1," + size + "}", "g"));
}

// References

// https://www.tutorialspoint.com/how-to-split-large-string-in-to-n-size-chunks-in-javascript
// 16. Write a code to remove all the vowels from a given string
// replace method on String accepts a string or regex as the argument
const str = "I love JavaScript";
str.replace(/[aeiou]/gi, ""); // _lv_JvScrpt

// References

// https://medium.com/better-programming/how-to-remove-vowels-from-a-string-in-javascript-fbed6e3a438e
// 17. Create a function which returns random hex color code
// The color code is popularly represented in hexadecimal format for RGB colors
// The minimum value for the color is '#000000' and maximum is '#FFFFFF'
function getGetHEXColorCode() {
  const rValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  const gValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  const bValue = Math.round(0xff * Math.random())
    .toString(16)
    .padStart(2, "0");
  return "#" + rValue + gValue + bValue;
}

// Notes

// toString method on String takes optional parameter which converts converts to the specified base before converting to string

// References

// https://css-tricks.com/snippets/javascript/random-hex-color/
// 18. Write a function which accepts two valid dates and returns the difference between them as number of days
// The difference between 2 dates in JavaScript will give the time difference in milliseconds
// Time difference can be converted in to days by dividing the 24Hrs time in milliseconds
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
 
function getDaysBetweenDates(dateText1, dateText2) {
  const date1 = new Date(dateText1);
  const date2 = new Date(dateText2);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / DAY_IN_MILLISECONDS);
  return diffDays;
}
 
getDaysBetweenDates("10/15/2020", "12/1/2020"); // 47

// References

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date