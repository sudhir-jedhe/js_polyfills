
3. What is a closure in JavaScript? Provide an example.
Answer:

function outer() {
  const message = 'Hello';
  function inner() {
    console.log(message);
  }
  return inner;
}
 
const innerFunc = outer();
innerFunc();  // Output: 'Hello'
4. What is event delegation in JavaScript?
Answer: Event delegation is a technique where a single event listener is attached to a common ancestor, allowing events to be handled for multiple children.

5. What is the difference between == and === in JavaScript?
Answer: == checks for equality with type coercion, while === checks for strict equality without type coercion.

6. What is the purpose of the async and await keywords in JavaScript?
Answer: async and await are features introduced in ES2017 (ES8) that make working with asynchronous code more readable and easier to manage. They are built on top of promises.

1. async:
async is used to declare that a function will work with promises and may use await within its body.
It allows a function to return a promise implicitly.
Functions marked with async always return a promise, even if you return a non-promise value.
async function asyncFunction() {
  return 42; // Equivalent to returning Promise.resolve(42)
}
2. await:
await can only be used within an async function.
It is used to pause the execution of the function until a promise is resolved or rejected.
It "awaits" the result of a promise and returns the resolved value or throws an error for a rejected promise.
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
3. Difference from .then():
While both await and .then() handle asynchronous operations, the key difference lies in how they manage the flow of asynchronous code.
.then() is used with promises and is chaining-based, where each .then() function returns a promise and allows you to chain further operations.
await, on the other hand, allows for more synchronous-like code within async functions, making asynchronous code appear more linear and readable.
// Using .then()
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
 
// Using await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
In summary, async and await make asynchronous code look and behave more like synchronous code, enhancing readability and maintainability, especially when dealing with promises.

7. Explain what the this keyword refers to in JavaScript.
Answer: this refers to the object on which a method is being called.

8. What is a promise in JavaScript? Provide an example of creating and using a promise.
Answer:

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('Promise resolved!');
  }, 2000);
});
 
myPromise.then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
9. What is a callback function in JavaScript? Provide an example.
Answer:

function fetchData(callback) {
  setTimeout(() => {
    callback('Data fetched!');
  }, 2000);
}
 
fetchData((data) => {
  console.log(data);
});
10. What is the difference between null and undefined in JavaScript?
Answer: null is an assignment value representing no value or no object, while undefined is a primitive value automatically assigned to uninitialized variables.

11. What is event bubbling in JavaScript?
Answer: Event bubbling is the propagation of an event from the target element up to its parent and higher ancestors in the DOM tree.

12. What is event.preventDefault()? Provide an example of its usage.
Description: event.preventDefault() is used to prevent the default behavior of an event, such as form submission or link navigation.

Answer:

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', event => {
  event.preventDefault(); // Prevents form submission
  console.log('Form submission prevented.');
});
13. What are arrow functions in JavaScript? Provide an example.
Answer:

const add = (a, b) => a + b;
console.log(add(2, 3));  // Output: 5
14. What is the purpose of the localStorage and sessionStorage objects in JavaScript?
Answer: They provide a way to store key-value pairs in a web browser, with localStorage persisting even after the browser is closed and reopened, and sessionStorage existing only for the duration of the page session.

15. Explain event handling in JavaScript and provide an example of attaching an event listener.
Answer:

const button = document.getElementById('myButton');
 
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
16. What is the difference between map() and forEach() array methods in JavaScript?
Answer: map() returns a new array with the results of a function applied to each element, while forEach() only iterates over the array and does not return a new array.

17. What is a RESTful API and how do you make a GET request using JavaScript?
Answer:

fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
18. What is the purpose of the use strict directive in JavaScript?
The "use strict" directive in JavaScript is used to enable a stricter interpretation of the code, catching common mistakes and preventing the use of certain error-prone features. When this directive is applied, the JavaScript engine enforces stricter rules for writing code.

1. Purpose:
It helps in writing more reliable and maintainable code by identifying and disallowing potentially error-prone behavior.
It prevents the accidental creation of global variables by enforcing block scope rules with let and const.
It disallows the use of certain language features that are deprecated or considered bad practice.
2. Example:
// Without "use strict"
function withoutStrict() {
  variable = 10;  // This will create a global variable accidentally
  console.log(variable);
}
 
withoutStrict();  // Output: 10
 
// With "use strict"
function withStrict() {
  'use strict';
  variable = 20;  // This will throw a ReferenceError
  console.log(variable);
}
 
withStrict();  // Error: variable is not defined
In the first example without "use strict," variable is mistakenly created as a global variable, which can lead to unexpected behavior and bugs in a larger codebase.

In the second example with "use strict," attempting to assign a value to variable without declaring it with var, let, or const will throw a ReferenceError, indicating that variable is not defined. This helps catch potential bugs and encourages better coding practices.

To enable "use strict" globally in a script, you can add it at the beginning of your JavaScript file or within a function. For modern JavaScript development, it's recommended to use "use strict" to enhance code quality and reduce the risk of errors.

19. Explain hoisting in JavaScript.
Answer:

Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compile phase.
console.log(x);  // Output: undefined
var x = 10;
console.log(x);  // Output: 10
20. How do you handle errors in JavaScript? Provide an example of using a try...catch block.
Answer:

try {
  // Code that may throw an error
  const result = 10 / 0;
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
}