// https://www.geeksforgeeks.org/call-by-value-vs-call-by-reference-in-javascript/


**Call by value & Call by reference**

The original variable is not modified on changes in other variables.	
Actual and copied variables will be created in different memory locations.	
On passing variables in a function, any changes made in the passed variable will not affect the original one.	

The original variable gets modified on changes in other variables.
Actual and copied variables are created in the same memory location.
On passing variables in a function, any changes made in the passed parameter will update the original 
variable’s reference too.

```js
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
```

In programming, **Call by Value** and **Call by Reference** refer to two different ways of passing arguments to functions. These concepts are crucial because they determine how changes to the function parameters affect the original data passed to the function.

### **1. Call by Value**

In **Call by Value**, the actual value of the argument is passed to the function. This means that the function works with a copy of the original data, and any changes made to the parameter inside the function do not affect the original value outside the function.

#### Key Points:
- A **copy** of the actual data is passed to the function.
- Changes made to the parameter inside the function do not affect the original value outside.
- It is used for **primitive** data types (e.g., numbers, strings, booleans).

#### Example in JavaScript:
```javascript
function addTen(x) {
  x = x + 10;  // Modifies the copy, not the original variable
  console.log("Inside function:", x);  // 20
}

let num = 10;
addTen(num);

console.log("Outside function:", num);  // 10 (original num is not changed)
```

**Explanation**:
- The value of `num` is passed to the function `addTen`, and within the function, a copy of `num` is used.
- The change made inside the function (`x = x + 10`) does not affect the original `num` outside the function.

### **2. Call by Reference**

In **Call by Reference**, instead of passing a copy of the actual value, the reference (or address) of the variable is passed to the function. This means the function works with the **original data** directly, and any changes made inside the function will affect the original value outside the function.

#### Key Points:
- A **reference** (or memory address) to the original data is passed.
- Changes made to the parameter inside the function **will modify the original variable** outside the function.
- It is typically used for **objects** and **arrays** in JavaScript.

#### Example in JavaScript:
```javascript
function modifyObject(obj) {
  obj.name = "John";  // Modifies the original object directly
  console.log("Inside function:", obj);
}

let person = { name: "Jane" };
modifyObject(person);

console.log("Outside function:", person);  // { name: "John" }
```

**Explanation**:
- The reference to the `person` object is passed to the function `modifyObject`.
- The function modifies the `name` property of the `person` object, which affects the original `person` object outside the function.

### **Call by Value vs. Call by Reference Summary**

| Feature                     | **Call by Value**                             | **Call by Reference**                        |
|-----------------------------|-----------------------------------------------|---------------------------------------------|
| **What is passed?**          | A copy of the actual value (primitive data)   | A reference (or memory address) to the original data (objects/arrays) |
| **Impact on original data?** | No change to the original data                | Modifies the original data                  |
| **Used for?**                | Primitive types (numbers, strings, booleans)  | Objects, arrays                            |
| **Examples**                 | `let a = 5;`, `let str = "hello";`            | `let obj = { name: "Alice" };`              |

### **JavaScript Specifics**

In JavaScript:
- **Primitive types** (e.g., `number`, `string`, `boolean`, `undefined`, `null`, `symbol`, `bigint`) are passed **by value**.
- **Objects** (including arrays and functions) are passed **by reference**.

#### Example with Arrays (Call by Reference):
```javascript
function modifyArray(arr) {
  arr.push(4);  // Modifies the original array
}

let numbers = [1, 2, 3];
modifyArray(numbers);

console.log(numbers);  // [1, 2, 3, 4]
```

In the case of the array, the reference to the original array `numbers` is passed to the function, and the array is modified inside the function.

### **Differences Between Call by Value and Call by Reference**

| Aspect               | **Call by Value**                                    | **Call by Reference**                                |
|----------------------|------------------------------------------------------|-----------------------------------------------------|
| **What is passed?**   | A copy of the value of the variable.                 | A reference to the original variable (memory address).|
| **Effect on Original Data** | No effect on the original variable.             | Changes the original data directly.                |
| **Used with**         | Primitive data types (numbers, strings, etc.).       | Objects, arrays, and functions.                     |
| **Memory Usage**      | Requires additional memory for the copied value.    | No additional memory required for copies, only references.|
| **Mutability**        | Immutable inside the function.                       | Mutable inside the function.                        |

---

### **Conclusion**

- **Call by Value**: Works with copies of data. Changes made inside the function do not affect the original data.
- **Call by Reference**: Works with the actual reference (memory address) of the data. Changes made inside the function affect the original data.

In JavaScript, the distinction is clear between primitive data types (passed by value) and objects (passed by reference), and understanding this concept is crucial when working with functions and data manipulation.


Passing by value and by reference

# Passing by value and by reference

What is the output?

<!-- prettier-ignore-start -->
```javascript
var myObject = {
  price: 20.99,
  get_price: function() {
    return this.price;
  }
};
var customObject = Object.create(myObject);
customObject.price = 19.99;
delete customObject.price;
console.log(customObject.get_price());
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
(function(a) {
  arguments[0] = 10;
  return a;
})(5);
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
function Car(color) {
  this.color = color;
}
var lada = new Car("Black");
Car.prototype.currentGear = 1;
console.log(++lada.currentGear);
console.log(Car.prototype.currentGear);
```
<!-- prettier-ignore-end -->
---
What is the output?
<!-- prettier-ignore-start -->
```javascript
var User = function() {};

User.prototype.attributes = {
  isAdmin: false
};

var admin = new User("Sam"),
  guest = new User("Bob");

admin.attributes.isAdmin = true;

alert(admin.attributes.isAdmin);
alert(guest.attributes.isAdmin);
```
<!-- prettier-ignore-end -->
---

What is the output?
<!-- prettier-ignore-start -->
```javascript
var obj = {
  a: 1
};
(function(obj) {
  obj = {
    a: 2
  };
})(obj);
console.log(obj.a);
```
<!-- prettier-ignore-end -->
---
What is the value of foo.x?
<!-- prettier-ignore-start -->
```javascript
var foo = { n: 1 };
var bar = foo;
foo.x = foo = { n: 2 };
```
<!-- prettier-ignore-end -->
---
how to return result for async operation in sync style?
like `.getData()` - should return data synchroniously, but data get in async by ajax. let's discuss workarounds

---
About prototype inheritance / passing by reference - What is the output?
<!-- prettier-ignore-start -->
```javascript
function Person(name) {
  if (name) this.options.name = name;
}

Person.prototype.options = {
  name: "Default name"
};

var foo = new Person("foo");
var bar = new Person("bar");

console.log(foo.options.name);
console.log(bar.options.name);
```
<!-- prettier-ignore-end -->

---

what would be the output ?

<!-- prettier-ignore-start -->
```javascript
var a = {};

(function b ( a ) {
    a.a = 10;
    a = null;
})( a );

console.log(a);
```
<!-- prettier-ignore-end -->