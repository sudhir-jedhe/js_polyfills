// creating an object constructor
// and assigning values to it
const obj1 = { a: 1 };

// creating a target object and copying values and
// properties to it using object.assign() method
// Here, obj1 is the source object
const new_obj = Object.assign({}, obj1);

// Displaying the target object
console.log(new_obj);

// creating 3 object constructors and assigning values to it
let obj1 = { a: 10 };
let obj2 = { b: 20 };
let obj3 = { c: 30 };

// Creating a target object and copying values
// and properties to it using object.assign() method
let new_obj = Object.assign({}, obj1, obj2, obj3);

// Displaying the target object
console.log(new_obj);
