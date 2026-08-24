In JavaScript, a **prototype** is an internal mechanism by which objects inherit features (properties and methods) from one another. Unlike class-based languages like Java or C++ where classes define blueprints, JavaScript is fundamentally a **prototype-based language**.

Every JavaScript object contains a hidden link to another object, known as its **prototype**.

---

### Core Concepts

**1. The `[[Prototype]]` Link**

* Every object has an internal slot called `[[Prototype]]`.
* You can inspect this hidden link using `Object.getPrototypeOf(obj)` or the legacy accessor `obj.__proto__`.

**2. The Prototype Chain**
When you request a property or method from an object (e.g., `user.toString()`):

1. JavaScript checks if the property exists directly on `user` (an **own property**).
2. If not found, it checks `user`'s prototype.
3. If still not found, it traverses upward to the next prototype in line.
4. The search ends at `Object.prototype` (the root prototype), whose prototype is `null`. If the property isn't found anywhere along the chain, JavaScript returns `undefined`.

```
user  --->  User.prototype  --->  Object.prototype  --->  null

```

---

### Key Difference: `.prototype` vs `__proto__`

A common source of confusion in interviews is the distinction between these two properties:

| Feature            | `Function.prototype`                                                                  | `__proto__` (or `[[Prototype]]`)                              |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Where it lives** | Constructor functions and classes only.                                               | Every object instance in JavaScript.                          |
| **What it is**     | A template object assigned to instances created via `new`.                            | A reference link pointing to the instance's parent prototype. |
| **Relationship**   | `const p = new Person();` $\rightarrow$ `p.__proto__ === Person.prototype` is `true`. |                                                               |

---

### How It Works in Practice

#### 1. Constructor Functions and Prototypes

Defining methods directly inside a constructor creates a new copy of that function in memory for every single instance. Attaching methods to `.prototype` shares a single copy among all instances.

```javascript
function User(name, role) {
  this.name = name;
  this.role = role;
}

// Shared across all instances
User.prototype.getDetails = function() {
  return `${this.name} is a ${this.role}`;
};

const user1 = new User("Kiara", "Engineer");
const user2 = new User("Alex", "Designer");

console.log(user1.getDetails()); // "Kiara is a Engineer"
console.log(user1.getDetails === user2.getDetails); // true (same memory reference)

```

#### 2. Prototypal Inheritance (`Object.create`)

`Object.create(proto)` creates a new empty object with its `[[Prototype]]` explicitly set to `proto`.

```javascript
const animal = {
  isAlive: true,
  speak() {
    return "Making noise...";
  }
};

// dog inherits directly from animal
const dog = Object.create(animal);
dog.breed = "Labrador";

console.log(dog.breed);   // "Labrador" (own property)
console.log(dog.speak());   // "Making noise..." (inherited via prototype chain)
console.log(dog.isAlive); // true (inherited via prototype chain)

```

#### 3. Modern ES6 Classes

The ES6 `class` syntax does not introduce a new object-oriented model; it is syntactic sugar over prototypes.

```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

// Under the hood:
// 1. Creates a constructor function Person.
// 2. Attaches greet() to Person.prototype.

```

---

### Prototype Shadowing

If you define a property on an object that shares the same name as a property on its prototype, the object's own property **shadows** (overrides) the prototype property without altering the prototype itself.

```javascript
const car = { wheels: 4 };
const customCar = Object.create(car);

customCar.wheels = 3; // Shadows 'wheels' on car

console.log(customCar.wheels); // 3 (own property)
console.log(car.wheels);       // 4 (prototype unchanged)

```
