printHello();

printMessage();

function printHello() {
  console.log("Hello");

  function printMessage() {
    console.log("Good day");
  }
}

// - 1: Hello, Good day
// - 2: Reference Error: printHello is not defined, Reference Error: printMessage is not defined
// - 3: Reference Error: printHello is not defined, Good day
// - 4: Hello, Reference Error: printMessage is not defined

// ##### Answer: 4

// The function `printHello` is hoisted to the top of the global scope and prints "Hello" to the console. Even `printMessage` function is hoisted, but it is lifted to the local scope(in "printHello") it was declared in. That is the reason you will endup with reference error for second function call.

// But if the second function is invoked in the first function itself, there won't be any reference error.

printHello();

function printHello() {
  printMessage();
  console.log("Hello");

  function printMessage() {
    console.log("Good day");
  }
}
