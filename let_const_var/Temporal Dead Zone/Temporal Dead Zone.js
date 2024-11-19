// The Temporal Dead Zone(TDZ) is a specific period or area of a block where a variable is inaccessible until it has been intialized with a value. This behavior in JavaScript that occurs when declaring a variable with the let and const keywords, but not with var. In ECMAScript 6, accessing a `let` or `const` variable before its declaration (within its scope) causes a ReferenceError.

function somemethod() {
  console.log(counter1); // undefined
  console.log(counter2); // ReferenceError
  var counter1 = 1;
  let counter2 = 2;
}


// The Temporal Dead Zone (TDZ) for let vs var in javascript
// According to MDN:

// In ECMAScript 2015, let bindings are not subject to Variable Hoisting, which means that let declarations do not move to the top of the current execution context. Referencing the variable in the block before the initialization results in a ReferenceError (contrary to a variable declared with var, which will just have the undefined value). The variable is in a “temporal dead zone” from the start of the block until the initialization is processed.


function do_something() {
  console.log(bar); // undefined
  console.log(foo); // ReferenceError: foo is not defined
  var bar = 1;
  let foo = 2;
}
do_something();

// Temporal Dead Zone with lexical or block scoping variable declaration
function test(){
  var foo = 33;
  if (true) {
     let foo = (foo + 55); // ReferenceError: foo is not defined
  }
}
test();


// Due to lexical or block scoping let foo = (foo + 55) access the foo of the current block that is inside the if condition. It does not access the var foo = 33; as let is blocked scope. let foo is declared but it is not initialized that is why it is still in temporal dead zone.