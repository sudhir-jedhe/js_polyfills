// 5. **Function constructor with prototype:**

Thi; // s is similar to function constructor but it uses prototype for their properties and methods,

function Person() {}
Person.prototype.name = "Sudheer";
var object = new Person();

// This is equivalent to creating an instance with Object.create method with a function prototype and then calling that function with an instance and parameters as arguments.

function func() {}

new func(x, y, z);

//    **(OR)**

// Create a new instance using function prototype.
var newInstance = Object.create(func.prototype);

// Call the function
var result = func.call(newInstance, x, y, z);

// If the result is a non-null object then use it otherwise just use the new instance.
console.log(result && typeof result === "object" ? result : newInstance);
