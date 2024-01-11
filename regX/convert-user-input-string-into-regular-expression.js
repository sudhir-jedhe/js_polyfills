const str = "Geeks for Geeks";
// Input from User
const regex = prompt("Enter RegExp");
// Conversion from string to RegExp
const reg = new RegExp(regex, "g");

// The match fn returns the array of strings
// That match to RegExp
const result = str.match(reg);

if (result) console.log(result);
else console.log("Not Found");
// Input : '^Ge'
// Output: ["Ge"]
//         0: "Ge"
// Input : '[A-z]+'
// Output: (3) ["Geeks", "For", "Geeks"]
//         0: "Geeks"
//         1: "For"
//         2: "Geeks"
/******************************************************* */
const str = "Geeks for Geeks";
// Input from User
const regex = prompt("Enter RegExp");
// Conversion from string to RegExp
const reg = new RegExp(regex, "g");

// The match fn returns the array of strings
// That match to RegExp
const result = str.match(reg);

if (result) console.log(result);
else console.log("Not Found");

/***************************************************** */
const userInput = prompt("Enter a regular expression pattern:");
const regex = new RegExp(userInput);
console.log(regex);
