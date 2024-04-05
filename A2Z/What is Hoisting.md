1. ### What is Hoisting

   Hoisting is a JavaScript mechanism where variables, function declarations are moved to the top of their scope before code execution. Remember that JavaScript only hoists declarations, not initialization.
   Let's take a simple example of variable hoisting,

   ```javascript
   console.log(message); //output : undefined
   var message = "The variable Has been hoisted";
   ```

   The above code looks like as below to the interpreter,

   ```javascript
   var message;
   console.log(message);
   message = "The variable Has been hoisted";
   ```

   In the same fashion, function declarations are hoisted too

   ```javascript
   message("Good morning"); //Good morning

   function message(name) {
     console.log(name);
   }
   ```

   This hoisting makes functions to be safely used in code before they are declared.

   Hoisting is a term used to explain the behavior of variable declarations in your code. Variables declared or initialized with the var keyword will have their declaration "moved" up to the top of their module/function-level scope, which we refer to as hoisting. However, only the declaration is hoisted, the assignment (if there is one), will stay where it is.

   Note that the declaration is not actually moved - the JavaScript engine parses the declarations during compilation and becomes aware of declarations and their scopes. It is just easier to understand this behavior by visualizing the declarations as being hoisted to the top of their scope. Let's explain with a few examples.

   ```javascript
   console.log(foo); // undefined
   var foo = 1;
   console.log(foo); // 1
   ```

   Function declarations have the body hoisted while the function expressions (written in the form of variable declarations) only has the variable declaration hoisted.

   ```javascript
   // Function Declaration
   console.log(foo); // [Function: foo]
   foo(); // 'FOOOOO'
   function foo() {
     console.log("FOOOOO");
   }
   console.log(foo); // [Function: foo]

   // Function Expression
   console.log(bar); // undefined
   bar(); // Uncaught TypeError: bar is not a function
   var bar = function () {
     console.log("BARRRR");
   };
   console.log(bar); // [Function: bar]
   ```

   Variables declared via let and const are hoisted as well. However, unlike var and function, they are not initialized and accessing them before the declaration will result in a ReferenceError exception. The variable is in a "temporal dead zone" from the start of the block until the declaration is processed.

   ```javascript
   x; // undefined
   y; // Reference error: y is not defined

   var x = "local";
   let y = "local";
   ```

   The Execution Context is the "environment of code" that is currently executing. The Execution Context has two phases compilation and execution.

   [Compilation](#) - in this phase it gets all the function declarations and hoists them up to the top of their scope so we can reference them later and gets all variables declaration (declare with the var keyword) and also hoists them up and give them a default value of undefined.

   [Execution](#) - in this phase it assigns values to the variables hoisted earlier and it executes or invokes functions (methods in objects).

   Note: only function declarations and variables declared with the var keyword are hoisted not function expressions or arrow functions, let and const keywords.

   The main difference between function declarations and class declarations is hoisting. The function declarations are hoisted but not class declarations.

   ```javascript
   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));

   function greet(name) {
     return "Hello " + name + "!";
   }

   var y;
   ```

   ```javascript
   undefined,1, Hello Mark!
   ```

   [compilation](#compilation)

   ```javascript
   function greet(name) {
     return "Hello " + name + "!";
   }

   var y; //implicit "undefined" assignment

   //waiting for "compilation" phase to finish

   //then start "execution" phase
   /*
   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));
   */
   ```

   [execution](#execution)

   ```javascript
   function greet(name) {
     return "Hello " + name + "!";
   }

   var y;

   //start "execution" phase

   console.log(y);
   y = 1;
   console.log(y);
   console.log(greet("Mark"));
   ```

   [classes](#classes)

   ```javascript
   const user = new User(); // ReferenceError
   class User {}
   ```

   [Constructor Function](#ConstructorFunction)

   ```javascript
   const user = new User(); // No error

   function User() {}
   ```
