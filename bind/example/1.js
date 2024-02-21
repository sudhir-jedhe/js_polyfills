// 1. Explain the concepts of call, apply, and bind in JavaScript. Provide examples.
// Description: call, apply, and bind are methods used to change the this value in functions.

const person = { name: "Alice" };

function greet(greeting) {
  console.log(`${greeting}, ${this.name}!`);
}

greet.call(person, "Hello"); // Output: Hello, Alice!
greet.apply(person, ["Hi"]); // Output: Hi, Alice!

const greetBound = greet.bind(person);
greetBound("Hey"); // Output: Hey, Alice!
