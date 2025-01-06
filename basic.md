
**3. What is a closure in JavaScript? Provide an example.**
Answer:
```js
function outer() {
  const message = 'Hello';
  function inner() {
    console.log(message);
  }
  return inner;
}
 
const innerFunc = outer();
innerFunc();  // Output: 'Hello'

```
**4. What is event delegation in JavaScript?**
Answer: Event delegation is a technique where a single event listener is attached to a common ancestor, allowing events to be handled for multiple children.

**5. What is the difference between == and === in JavaScript?**
Answer: == checks for equality with type coercion, while === checks for strict equality without type coercion.

difference between ==(abstract equality) and ===(strict equality) is that the == compares by value after coercion and === compares by value and type without coercion.

Let's dig deeper on the ==. So first let's talk about coercion.

coercion is the process of converting a value to another type. As in this case, the == does implicit coercion. The == has some conditions to perform before comparing the two values.

Suppose we have to compare x == y values.

If x and y have same type. Then compare them with the === operator.
If x is null and y is undefined then return true.
If x is undefined and y is null then return true.
If x is type number and y is type string Then return x == toNumber(y).
If x is type string and y is type number Then return toNumber(x) == y.
If x is type boolean Then return toNumber(x) == y.
If y is type boolean Then return x == toNumber(y).
If x is either string,symbol or number and y is type object Then return x == toPrimitive(y).
If x is either object and x is either string,symbol Then return toPrimitive(x) == y.
Return false.

toPrimitive uses first the valueOf method then the toString method in objects to get the primitive value of that object.

Let's have examples.

x	y	x == y
5	5	true
1	'1'	true
null	undefined	true
0	false	true
'1,2'	[1,2]	true
'[object Object]'	{}	true
These examples all return true.

The first example goes to condition one because x and y have the same type and value.

The second example goes to condition four y is converted to a number before comparing.

The third example goes to condition two.

The fourth example goes to condition seven because y is boolean.

The fifth example goes to condition eight. The array is converted to a string using the toString() method which returns 1,2.

The last example goes to condition ten. The object is converted to a string using the toString() method which returns [object Object].

| x                | y                | x == y  |
|------------------|------------------|---------|
| 5                | 5                | true    |
| 1                | '1'              | true    |
| null             | undefined        | true    |
| 0                | false            | true    |
| '1,2'            | [1,2]            | true    |
| '[object Object]'| {}               | true    |

If we use the === operator all the comparisons except for the first example will return false because they don't have the same type while the first example will return true because the two have the same type and value.

**6. What is the purpose of the async and await keywords in JavaScript?**
Answer: async and await are features introduced in ES2017 (ES8) that make working with asynchronous code more readable and easier to manage. They are built on top of promises.

1. async:
async is used to declare that a function will work with promises and may use await within its body.
It allows a function to return a promise implicitly.
Functions marked with async always return a promise, even if you return a non-promise value.
```js
async function asyncFunction() {
  return 42; // Equivalent to returning Promise.resolve(42)
}
```

2. await:
await can only be used within an async function.
It is used to pause the execution of the function until a promise is resolved or rejected.
It "awaits" the result of a promise and returns the resolved value or throws an error for a rejected promise.

```js
async function fetchUserData() {
  try {
    const response = await fetch('https://api.example.com/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```
3. Difference from .then():
While both await and .then() handle asynchronous operations, the key difference lies in how they manage the flow of asynchronous code.
.then() is used with promises and is chaining-based, where each .then() function returns a promise and allows you to chain further operations.
await, on the other hand, allows for more synchronous-like code within async functions, making asynchronous code appear more linear and readable.
```js
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

```
In summary, async and await make asynchronous code look and behave more like synchronous code, enhancing readability and maintainability, especially when dealing with promises.

**7. Explain what the this keyword refers to in JavaScript.**
Answer: this refers to the object on which a method is being called.

Basically, this refers to the value of the object that is currently executing or invoking the function. I say currently due to the reason that the value of this changes depending on the context on which we use it and where we use it.

```js
   const carDetails = {
     name: "Ford Mustang",
     yearBought: 2005,
     getName(){
        return this.name;
     },
     isRegistered: true
   };

   console.log(carDetails.getName()); // logs Ford Mustang

   ```
This is what we would normally expect because in the getName method we return this.name, this in this context refers to the object which is the carDetails object that is currently the "owner" object of the function executing.

Ok, Let's some add some code to make it weird. Below the console.log statement add this three lines of code

```
   var name = "Ford Ranger";
   var getCarName = carDetails.getName;

   console.log(getCarName()); // logs Ford Ranger

   ```
The second console.log statement prints the word Ford Ranger which is weird because in our first console.log statement it printed Ford Mustang. The reason to this is that the getCarName method has a different "owner" object that is the window object. Declaring variables with the var keyword in the global scope attaches properties in the window object with the same name as the variables. Remember this in the global scope refers to the window object when "use strict" is not used.
```js
  console.log(getCarName === window.getCarName); //logs true
  console.log(getCarName === this.getCarName); // logs true

  ```
this and window in this example refer to the same object.

One way of solving this problem is by using the apply and call methods in functions.
```js
   console.log(getCarName.apply(carDetails)); //logs Ford Mustang
   console.log(getCarName.call(carDetails));  //logs Ford Mustang

   ```
The apply and call methods expects the first parameter to be an object which would be value of this inside that function.

IIFE or Immediately Invoked Function Expression, Functions that are declared in the global scope, Anonymous Functions and Inner functions in methods inside an object has a default of this which points to the window object.
```js
   (function (){
     console.log(this);
   })(); //logs the "window" object

   function iHateThis(){
      console.log(this);
   }

   iHateThis(); //logs the "window" object  

   const myFavoriteObj = {
     guessThis(){
        function getThis(){
          console.log(this);
        }
        getThis();
     },
     name: 'Marko Polo',
     thisIsAnnoying(callback){
       callback();
     }
   };


   myFavoriteObj.guessThis(); //logs the "window" object
   myFavoriteObj.thisIsAnnoying(function (){
     console.log(this); //logs the "window" object
   });

   ```
If we want to get the value of the name property which is Marko Polo in the myFavoriteObj object there are two ways to solve this.

First, we save the value of this in a variable.
```js
   const myFavoriteObj = {
     guessThis(){
         const self = this; //saves the this value to the "self" variable
         function getName(){
           console.log(self.name);
         }
         getName();
     },
     name: 'Marko Polo',
     thisIsAnnoying(callback){
       callback();
     }
   };

   ```
In this image we save the value of this which would be the myFavoriteObj object. So we can access it inside the getName inner function.

Second, we use ES6 Arrow Functions.

```js
   const myFavoriteObj = {
     guessThis(){
         const getName = () => { 
           //copies the value of "this" outside of this arrow function
           console.log(this.name);
         }
         getName();
     },
     name: 'Marko Polo',
     thisIsAnnoying(callback){
       callback();
     }
   };

   ```
Arrow Functions does not have its own this. It copies the value of this of the enclosing lexical scope or in this example the value of this outside the getName inner function which would be the myFavoriteObj object. We can also determine the value of this on how the function is invoked.

**8. What is a promise in JavaScript? Provide an example of creating and using a promise.**
Answer:

```js
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

```

**9. What is a callback function in JavaScript? Provide an example.**
Answer:

```js
function fetchData(callback) {
  setTimeout(() => {
    callback('Data fetched!');
  }, 2000);
}
 
fetchData((data) => {
  console.log(data);
});

```
**10. What is the difference between null and undefined in JavaScript?**

Answer: null is an assignment value representing no value or no object, while undefined is a primitive value automatically assigned to uninitialized variables.

**11. What is event bubbling in JavaScript?**
Answer: Event bubbling is the propagation of an event from the target element up to its parent and higher ancestors in the DOM tree.

**12. What is event.preventDefault()? Provide an example of its usage.**
Description: event.preventDefault() is used to prevent the default behavior of an event, such as form submission or link navigation.

Answer:
```js
const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', event => {
  event.preventDefault(); // Prevents form submission
  console.log('Form submission prevented.');
});

```

**13. What are arrow functions in JavaScript? Provide an example.**
Answer:
```js
const add = (a, b) => a + b;
console.log(add(2, 3));  // Output: 5

```

**14. What is the purpose of the localStorage and sessionStorage objects in JavaScript?**
Answer: They provide a way to store key-value pairs in a web browser, with localStorage persisting even after the browser is closed and reopened, and sessionStorage existing only for the duration of the page session.

**15. Explain event handling in JavaScript and provide an example of attaching an event listener.**
Answer:
```js
const button = document.getElementById('myButton');
 
button.addEventListener('click', () => {
  console.log('Button clicked!');
});
```

**16. What is the difference between map() and forEach() array methods in JavaScript?**
Answer: map() returns a new array with the results of a function applied to each element, while forEach() only iterates over the array and does not return a new array.

**17. What is a RESTful API and how do you make a GET request using JavaScript?**
Answer:

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
  ```

**18. What is the purpose of the use strict directive in JavaScript?**

The "use strict" directive in JavaScript is used to enable a stricter interpretation of the code, catching common mistakes and preventing the use of certain error-prone features. When this directive is applied, the JavaScript engine enforces stricter rules for writing code.

1. Purpose:
It helps in writing more reliable and maintainable code by identifying and disallowing potentially error-prone behavior.
It prevents the accidental creation of global variables by enforcing block scope rules with let and const.
It disallows the use of certain language features that are deprecated or considered bad practice.

2. Example:
```js
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
```
In the first example without "use strict," variable is mistakenly created as a global variable, which can lead to unexpected behavior and bugs in a larger codebase.

In the second example with "use strict," attempting to assign a value to variable without declaring it with var, let, or const will throw a ReferenceError, indicating that variable is not defined. This helps catch potential bugs and encourages better coding practices.

To enable "use strict" globally in a script, you can add it at the beginning of your JavaScript file or within a function. For modern JavaScript development, it's recommended to use "use strict" to enhance code quality and reduce the risk of errors.


Restrictions that Strict Mode gives us.

**Assigning or Accessing a variable that is not declared**.
```js
 function returnY(){
    "use strict";
    y = 123;
    return y;
 }
 ```

**Assigning a value to a read-only or non-writable global variable;**
```js
   "use strict";
   var NaN = NaN;
   var undefined = undefined;
   var Infinity = "and beyond";

   ```
**Deleting an undeletable property.**
```
   "use strict";
   const obj = {};

   Object.defineProperty(obj, 'x', {
      value : '1'
   });  

   delete obj.x;
   ```

**Duplicate parameter names.**
```js
   "use strict";

   function someFunc(a, b, b, c){

   }
   ```

**Creating variables with the use of the eval function.**
```js
 "use strict";

 eval("var x = 1;");

 console.log(x); //Throws a Reference Error x is not defined
```
**The default value of this will be undefined.**
```js
  "use strict";

  function showMeThis(){
    return this;
  }

  showMeThis(); //returns undefined
 ```
There are many more restrictions in Strict Mode than these.

**1.  Explain hoisting in JavaScript.**
Answer:

Hoisting is a JavaScript mechanism where variable and function declarations are moved to the top of their containing scope during the compile phase.
```js
console.log(x);  // Output: undefined
var x = 10;
console.log(x);  // Output: 10
```

**20. How do you handle errors in JavaScript? Provide an example of using a try...catch** block.
Answer:
```js
try {
  // Code that may throw an error
  const result = 10 / 0;
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
}
```

**15. Why does it return false when comparing two similar objects in JavaScript?**
↑ Suppose we have an example below.
```js
let a = { a: 1 };
let b = { a: 1 };
let c = a;

console.log(a === b); // logs false even though they have the same property
console.log(a === c); // logs true hmm
```
JavaScript compares objects and primitives differently. 

In primitives it compares them by value 

while in objects it compares them by reference or the address in memory where the variable is stored. 

That's why the first console.log statement returns false and the second console.log statement returns true. 

a and c have the same reference and a and b are not.