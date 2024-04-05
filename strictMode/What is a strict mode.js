// 1.  ### What is a strict mode in javascript

//     Strict Mode is a new feature in ECMAScript 5 that allows you to place a program, or a function, in a “strict” operating context. This way it prevents certain actions from being taken and throws more exceptions. The literal expression `"use strict";` instructs the browser to use the javascript code in the Strict mode.

// 2.  ### Why do you need strict mode

//     Strict mode is useful to write "secure" JavaScript by notifying "bad syntax" into real errors. For example, it eliminates accidentally creating a global variable by throwing an error and also throws an error for assignment to a non-writable property, a getter-only property, a non-existing property, a non-existing variable, or a non-existing object.

// 3.  ### How do you declare strict mode

//     The strict mode is declared by adding "use strict"; to the beginning of a script or a function.
//     If declared at the beginning of a script, it has global scope.

"use strict";
x = 3.14; // This will cause an error because x is not declared

//    and if you declare inside a function, it has local scope

x = 3.14; // This will not cause an error.
myFunction();

function myFunction() {
  "use strict";
  y = 3.14; // This will cause an error
}
