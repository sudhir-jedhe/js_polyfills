// createHelloWorld.js
export function createHelloWorld() {
  return function () {
    return "Hello World";
  };
}

const helloWorldFunction = createHelloWorld();
console.log(helloWorldFunction()); // Output: Hello World
