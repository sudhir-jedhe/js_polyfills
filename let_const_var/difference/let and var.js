// | var                                                            | let
// | -----------------------------------------------------          | --------------------------- |
// | It has been available from the beginning of JavaScript         | Introduced as part of ES6   |
// | It has function scope                                          | It has block scope          |
// | Variable declaration will be hoisted                           | Hoisted but not initialized |
// | It is possible to re-declare the variable in the same scope    | It is not possible to re-declare the variable |

//     Let's take an example to see the difference,

function userDetails(username) {
  if (username) {
    console.log(salary); // undefined due to hoisting
    console.log(age); // ReferenceError: Cannot access 'age' before initialization
    let age = 30;
    var salary = 10000;
  }
  console.log(salary); //10000 (accessible due to function scope)
  console.log(age); //error: age is not defined(due to block scope)
}
userDetails("John");


// var	let	const
// The scope of a var variable is functional or global scope.	
// The scope of a let variable is block scope.	
// The scope of a const variable is block scope.

// It can be updated and re-declared in the same scope.	
// It can be updated but cannot be re-declared in the same scope.	
// It can neither be updated or re-declared in any scope.

// It can be declared without initialization.	
// It can be declared without initialization.	
// It cannot be declared without initialization.


// It can be accessed without initialization as its default value is “undefined”.	
// It cannot be accessed without initialization otherwise it will give ‘referenceError’.	
// It cannot be accessed without initialization, as it cannot be declared without initialization.

// These variables are hoisted.	
// These variables are hoisted but stay in the temporal dead zone untill the initialization.	
// These variables are hoisted but stays in the temporal dead zone until the initialization.
