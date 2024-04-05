### What is var let const

var are function scoped, which means they are still accessible outside the block scope even though we have declared them inside it.
```javascript
//for loop is block scoped
for (var i = 0; i < 10; i++) {
var iAmInside = "I am available outside of the loop";
}

console.log(iAmInside);
// I am available outside of the loop

//block scope
if (true) {
var inside = "Inside";
}
console.log(inside);
// Inside

//Function scoped
function myFunc() {
var functionScoped = "I am available inside this function";
console.log(functionScoped);
}
myFunc();
// I am available inside this function
console.log(functionScoped);
// ReferenceError: functionScoped is not defined
```

The above code looks like as below to the interpreter,

```javascript
var inside; // hoisted on the top of the function. As there is no function so it is present in the global scope.
//block scope
if (true) {
var inside = "Inside";
}
console.log(inside);
//Inside

//Function scoped In this case value is hoisted inside the function
function getValue(condition) {
if (condition) {
var value = "blue";
return value;
} else {
// value exists here with a value of undefined
return value;
}

// value exists here with a value of undefined
}

console.log(getValue(true)); // blue
console.log(getValue(false)); // undefined

//While execution it is hoisted like this internally
function getValue(condition) {
var value; //value is hoisted as there is no value attached, so it is undefined.
if (condition) {
var value = "blue";
return value;
} else {
// value exists here with a value of undefined
return value;
}

// value exists here with a value of undefined
}
console.log(getValue(true)); // blue
console.log(getValue(false)); // undefined
```

In the same fashion, function declarations are hoisted too

```javascript
message("Good morning"); //Good morning

function message(name) {
console.log(name);
}
```
Scope in JavaScript is the area where we have valid access to variables or functions. JavaScript has three types of Scopes. Global Scope, Function Scope, and Block Scope(ES6).

Global Scope - variables or functions declared in the global namespace are in the global scope and therefore is accessible everywhere in our code.

```javascript
//global namespace
var g = "global";

function globalFunc() {
function innerFunc() {
console.log(g); // can access "g" because "g" is a global variable
}
innerFunc();
}
```

Function Scope - variables,functions and parameters declared within a function are accessible inside that function but not outside of it.

```javascript
function myFavoriteFunc(a) {
if (true) {
var b = "Hello " + a;
}
return b;
}
myFavoriteFunc("World");

console.log(a); // Throws a ReferenceError "a" is not defined
console.log(b); // does not continue here
```

Block Scope - variables (let,const) declared within a block {} can only be access within it.

```javascript
function testBlock() {
if (true) {
let z = 5;
}
return z;
}

testBlock(); // Throws a ReferenceError "z" is not defined
```

const in javascript
Like let const is also block scoped. But it differs from the fact that their variable cannot be redeclared or change by re-assigning the value. The value remains Constant.

```javascript
const abc = "XYZ";
let abc; //SyntaxError: Identifier 'abc' has already been declared
abc = "pqr"; //TypeError: Assignment to constant variable.
```

```javascript
//Should be initialised while declaring
const XYZ; //SyntaxError: Missing initializer in a const declaration
```

just like let, const is also blocked scoped.

```javascript
if (true) {
const a = "I am inside";
console.log(a); // I am inside
}
console.log(a); //ReferenceError: a is not defined
```

However, the value a constant holds may be modified if it is an object.

```javascript
const person = {
name: "Prashant",
age: 25,
};

person.age = 26;
console.log(person.age); // 26
```

```javascript
const person = {
name: "Prashant",
age: 25,
};
person = 26;
console.log(person); //  TypeError: Assignment to constant variable.
```

var
Used for function-scoped variables that can be hoisted. var declarations can be globally scoped or function-scoped. var variables can be updated and redeclared within their scope.

let
Used for block-scoped variables that can be reassigned. let variables can be updated but not redeclared.

const
Used for block-scoped variables that are constant and cannot be reassigned. const variables cannot be updated or redeclared. const declares variables that remain constant throughout the program. 

