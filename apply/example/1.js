// 1. Explain the concepts of call, apply, and bind in JavaScript. Provide examples.
// Description: call, apply, and bind are methods used to change the this value in functions.

const person = { name: "Alice" };

function greet(greeting) {
  console.log(`${greeting}, ${this.name}!`);
}

greet.apply(person, ["Hi"]); // Output: Hi, Alice!
