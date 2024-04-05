// A regular expression is a sequence of characters that forms a search pattern. You can use this search pattern for searching data in a text. These can be used to perform all types of text search and text replace operations. Let's see the syntax format now,


/pattern/modifiers;


// For example, the regular expression or search pattern with case-insensitive username would be,


 /John/i;


// Regular Expressions has two string methods: search() and replace().
// The search() method uses an expression to search for a match, and returns the position of the match.


var msg = "Hello John";
var n = msg.search(/John/i); // 6


// The replace() method is used to return a modified string where the pattern is replaced.


var msg = "Hello John";
var n = msg.replace(/John/i, "Buttler"); // Hello Buttler


// Modifiers can be used to perform case-insensitive and global searches. Let's list down some of the modifiers,

// | Modifier | Description                                             |
// | -------- | ------------------------------------------------------- |
// | i        | Perform case-insensitive matching                       |
// | g        | Perform a global match rather than stops at first match |
// | m        | Perform multiline matching                              |




var text = "Learn JS one by one";
var pattern = /one/g;
var result = text.match(pattern); // one,one

// regular expression patterns

// Regular Expressions provide a group of patterns in order to match characters. Basically they are categorized into 3 types,

// 1. **Brackets:** These are used to find a range of characters.
// For example, below are some use cases,
// 1. [abc]: Used to find any of the characters between the brackets(a,b,c)
// 2. [0-9]: Used to find any of the digits between the brackets
// 3. (a|b): Used to find any of the alternatives separated with |
// 2. **Metacharacters:** These are characters with a special meaning
// For example, below are some use cases,
// 1. \\d: Used to find a digit
// 2. \\s: Used to find a whitespace character
// 3. \\b: Used to find a match at the beginning or ending of a word
// 3. **Quantifiers:** These are useful to define quantities
// For example, below are some use cases,
// 1. n+: Used to find matches for any string that contains at least one n
// 2. n\*: Used to find matches for any string that contains zero or more occurrences of n
// 3. n?: Used to find matches for any string that contains zero or one occurrences of n


// What is a RegExp object

// RegExp object is a regular expression object with predefined properties and methods. Let's see the simple usage of RegExp object,

var regexp = new RegExp("\\w+");
console.log(regexp);
// expected output: /\w+/

// How do you search a string for a pattern

// You can use the test() method of regular expression in order to search a string for a pattern, and return true or false depending on the result.


var pattern = /you/;
console.log(pattern.test("How are you?")); //true


// What is the purpose of exec method

// The purpose of exec method is similar to test method but it executes a search for a match in a specified string and returns a result array, or null instead of returning true/false.

var pattern = /you/;
console.log(pattern.exec("How are you?")); //["you", index: 8, input: "How are you?", groups: undefined]