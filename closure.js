var num = 10;

(() => {
  console.log(num); // undefined num hoisted in function scope
  var num = 20;
  console.log(num); // 20
})();

/*********************************************************************************** */

let count = 10;
(function printCount() {
  if (count === 0) {
    let count = 1;
    console.log(count); // 1 localScope
  }
  console.log(count); // 2 global scope
})();

/*************************************************************************************************************** */

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // loop run fast even before  first setTimeout execute
  // only one instance of i shared across all iteration
  setTimeout(() => {
    console.log(i); // three times  3
  }, i * 1000);
}

for (let index = 0; index < 3; index++) {
  // variable declare  with  let block scope
  // loop run fast even before  first setTimeout execute
  // create seperate variable instance of i shared across each iteration
  setTimeout(() => {
    console.log(i); // 0  1 2
  }, i * 1000);
}

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // loop run fast even before  first setTimeout execute
  // only one instance of i shared across all iteration
  // capture value of i for each iteration
  // create IIFE for create new scope of i for each iteration
  (function (index) {
    setTimeout(() => {
      console.log(index); // 0 1 2
    }, i * 1000);
  })(index);
}

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // closure  new memory space for i  create new scope of i for each iteration

  function print(i) {
    setTimeout(() => {
      console.log(i); // 0 1 2
    }, i * 1000);
  }
  print(index); //
}

/******************************************************************** */
let dev = "bfe";

function a() {
  let dev = "BFE";
  return function () {
    console.log(dev);
  };
}

dev = "bigfrontend";



// 1 week ago
// Interviewer: Explain Closures in JavaScript?


// Here's the answer to this explained in a simple way.

// JavaScript is renowned for its powerful features, and one of the most fundamental and essential concepts developers encounter is closures. Closures are pivotal in enabling more modular, maintainable, and efficient code.

// 𝗪𝗵𝗮𝘁 𝗶𝘀 𝗮 𝗖𝗹𝗼𝘀𝘂𝗿𝗲?

//  - A closure in JavaScript occurs when a function is defined within another function, allowing the inner function to access variables from the outer function's scope even after the outer function has finished executing.

//  - This means that the inner function retains access to the outer function's variables, effectively "remembering" the environment in which it was created.

// 𝗛𝗼𝘄 𝗖𝗹𝗼𝘀𝘂𝗿𝗲𝘀 𝗪𝗼𝗿𝗸:

//  - When JavaScript executes a function, it establishes a scope for that function, encompassing all the variables declared within it. A closure is formed when an inner function maintains access to this scope after the outer function has returned.

//  - Essentially, the inner function retains a reference to the outer function's variables, enabling continued interaction with them.

// 𝗕𝗲𝗻𝗲𝗳𝗶𝘁𝘀 𝗼𝗳 𝗖𝗹𝗼𝘀𝘂𝗿𝗲𝘀

// 1. Encapsulation
 
//  - Closures facilitate the encapsulation of logic and data within functions, creating private scopes. This encapsulation promotes cleaner code architecture by preventing global scope pollution and reducing the risk of variable name conflicts.

// 2. Persistent State

//  - Closures enable functions to have a persistent state by remembering the variables from their creation context. - This "memory" allows functions to maintain and manipulate state across multiple invocations, which is particularly useful in scenarios like counter functions or dynamic function generation.

// 3. Modularity and Reusability

//  - By leveraging closures, developers can create more modular and reusable code components.

//  - Functions that capture specific variables can be easily reused in different parts of an application without duplicating code or logic.

// 4. Enhanced Functional Programming
 
//  - Closures are a cornerstone of functional programming in JavaScript.

//  - They support higher-order functions, currying, and other functional paradigms that lead to more expressive and concise code.