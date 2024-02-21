// 2. Explain the difference between let, const, and var in JavaScript.
// In JavaScript, let, const, and var are used to declare variables. Each has different scoping rules and reassignment capabilities, making them suitable for different use cases.

// 1. var:
// var was traditionally used to declare variables in JavaScript.
// Variables declared with var are function-scoped, meaning they are only accessible within the function they are declared in.
// Variables declared with var can be redeclared and updated.
function exampleVar() {
  var x = 10;
  if (true) {
    var x = 20; // This reassigns the existing variable 'x'
    console.log(x); // Output: 20
  }
  console.log(x); // Output: 20 (not 10)
}
// 2. let:
// Introduced in ES6, let allows block-scoping of variables, making them accessible only within the block they are defined in (e.g., if, for, while blocks).
// Variables declared with let can be reassigned but cannot be redeclared in the same scope.
function exampleLet() {
  let y = 30;
  if (true) {
    let y = 40; // This creates a new block-scoped variable 'y'
    console.log(y); // Output: 40
  }
  console.log(y); // Output: 30 (not affected by the inner 'y')
}
// 3. const:
// Also introduced in ES6, const is used to declare constants whose values cannot be reassigned.
// Variables declared with const are block-scoped like let.
// A const variable must be assigned a value during declaration and cannot be left uninitialized.
function exampleConst() {
  const z = 50;
  // z = 60;  // Error: Assignment to a constant variable
  console.log(z); // Output: 50
}
// In summary:

// Use var for traditional function-scoped variables (but it's recommended to use let and const in modern JavaScript).
// Use let when you need to reassign a variable's value within the same block.
// Use const when you want to define a constant value that should not be reassigned.
// It's good practice to use let and const over var for better scoping and to avoid potential issues related to hoisting and unintended variable reassignment.
