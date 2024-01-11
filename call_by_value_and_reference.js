// https://www.geeksforgeeks.org/call-by-value-vs-call-by-reference-in-javascript/

/*
Call by value

Call by reference

The original variable is not modified on changes in other variables.	
Actual and copied variables will be created in different memory locations.	
On passing variables in a function, any changes made in the passed variable will not affect the original one.	

The original variable gets modified on changes in other variables.
Actual and copied variables are created in the same memory location.
On passing variables in a function, any changes made in the passed parameter will update the original 
variable’s reference too.
*/

// By value (primitives)
let a = 5;
let b;
b = a;
a = 3;
console.log(a);
console.log(b);

// By reference (all objects (including functions))
let c = { greeting: "Welcome" };
let d;
d = c;

// Mutating the value of c
c.greeting = "Welcome to geeksforgeeks";
console.log(c);
console.log(d);
