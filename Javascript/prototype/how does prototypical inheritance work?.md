Prototypical inheritance is JavaScript's built-in mechanism where objects directly link to and inherit properties and methods from other objects through a chain of references called the **prototype chain**.

Unlike classical inheritance (where classes act as static blueprints to instantiate separate objects), prototypical inheritance is dynamic—objects delegate property access to their prototype object at runtime.

---

### The Lookup Mechanism

When you access a property or method on an object (`obj.property`), the JavaScript engine executes the following lookup process:

1. **Own Properties:** Checks if the property exists directly on the object itself. If found, it returns the value.
2. **Prototype Lookup:** If not found, it checks the object referenced by its internal `[[Prototype]]` link (accessible via `Object.getPrototypeOf(obj)` or `__proto__`).
3. **Chain Traversal:** It continues traversing up the chain from prototype to prototype.
4. **End of Chain:** The traversal ends at `Object.prototype`, whose `[[Prototype]]` is `null`. If the property is still not found anywhere along the chain, it returns `undefined`.

---

---

### The 3 Core Ways Prototypical Inheritance is Implemented

#### 1. Constructor Functions & `.prototype`

Functions in JavaScript automatically get a `.prototype` property. When called with the `new` operator, the created instance's `[[Prototype]]` is linked to that constructor's `.prototype`.

```javascript
function Person(name) {
  this.name = name; // Own property
}

// Attached to the prototype (shared across all instances)
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

const user = new Person("Kiara");
console.log(user.greet()); // "Hello, I'm Kiara"
console.log(user.__proto__ === Person.prototype); // true

```

#### 2. Direct Object Linkage (`Object.create`)

`Object.create()` creates a new empty object and sets its `[[Prototype]]` directly to the passed object, avoiding constructor functions entirely.

```javascript
const human = {
  isAlive: true,
  breathe() {
    return "Breathing...";
  }
};

// developer inherits directly from human
const developer = Object.create(human);
developer.language = "JavaScript";

console.log(developer.language); // "JavaScript" (own property)
console.log(developer.breathe());  // "Breathing..." (inherited from human)

```

#### 3. ES6 Classes (Syntactic Sugar)

ES6 `class` and `extends` syntax provide a cleaner classical-like syntax, but underneath the engine still constructs prototype chains.

```javascript
class Parent {
  sayHi() { return "Hi!"; }
}

class Child extends Parent {}

const kid = new Child();
console.log(kid.sayHi()); // "Hi!"
// Prototype Chain: kid -> Child.prototype -> Parent.prototype -> Object.prototype -> null

```

---

### Property Shadowing vs Prototype Mutation

* **Shadowing:** Assigning a value to an inherited property name on an instance (e.g., `developer.isAlive = false`) creates an **own property** on `developer`. It does not overwrite the property on `human`.
* **Dynamic Resolution:** If you add a new method to `Person.prototype` after instances are already created, existing instances immediately have access to the new method because lookup happens live at runtime.

*Explain prototype chain performance impacts
Compare prototype delegation vs composition. indetail*

### Prototype Chain Performance Impacts

JavaScript engines like V8 optimize property access using **Hidden Classes (Shapes/Maps)** and **Inline Caching (IC)**. Understanding how these optimizations interact with the prototype chain explains why deep or mutating prototype setups degrade performance.

#### 1. Engine Optimizations: Shapes & Inline Caches

* **Inline Caches (IC):** When code repeatedly accesses `obj.prop`, the engine caches the memory offset where `prop` is located.
* **Prototype Invalidation:** For an inherited property, the engine records a prototype chain validity cell. If you access `child.greet()`, V8 caches: *"Check if child's shape matches Shape A, check that neither child nor intermediary prototypes have added a local `greet`, then jump directly to `Parent.prototype.greet`."*

#### 2. Performance Bottlenecks

* **Deep Chain Traversal (Cache Misses):**
When an Inline Cache misses (e.g., accessing an absent property on an object with a 6-level chain), the engine must perform a slow, step-by-step linear traversal:

$$\text{Instance} \longrightarrow \text{Proto}_1 \longrightarrow \text{Proto}_2 \longrightarrow \dots \longrightarrow \text{Object.prototype} \longrightarrow \text{null}$$

Checking for missing properties on deep chains is disproportionately slow compared to shallow checks.

* **Deoptimization via Mutation (`Object.setPrototypeOf` & `__proto__`):**
Mutating an object's prototype after creation using `Object.setPrototypeOf(obj, newProto)` or `obj.__proto__ = ...` completely invalidates the engine's hidden classes and inline caches for that object and all objects downstream. The engine drops out of TurboFan/JIT optimized code back to the slow interpreter.
* **Megamorphic Property Access:**
If a function receives objects with many different prototype shapes (more than 4 in V8), the Inline Cache becomes **megamorphic**. The engine gives up on inline caching and falls back to a generic, slow hash-table lookup on every access.

```javascript
// BAD: Mutating prototypes breaks JIT optimizations
const a = { x: 1 };
const b = { y: 2 };
Object.setPrototypeOf(a, b); // Deoptimizes hidden classes across the execution path

// GOOD: Set prototype once at creation time
const c = Object.create(b);
c.x = 1;

```

---

### Prototype Delegation vs. Composition

Both paradigms solve code reuse, but they structure relationships and memory allocations differently.

```
Prototype Delegation ("Is-A" / Delegates-To)
[ Instance ] ----[[Prototype]]----> [ Prototype Object ]
  (state)                             (shared methods)

Composition ("Has-A" / Assembled-From)
[ Composite Object ]
  ├── methodA (from Feature A)
  ├── methodB (from Feature B)
  └── local state

```

#### Comparison Matrix

| Feature                      | Prototype Delegation                                                                     | Object Composition                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Core Philosophy**          | **Delegation:** Objects link to shared prototypes; unresolved calls bubble up.           | **Assembly:** Objects are composed of discrete, swappable units of functionality.                      |
| **Relationship Type**        | "Is-a" or "Delegates-to" relationship.                                                   | "Has-a" or "Can-do" relationship.                                                                      |
| **Memory Footprint**         | **Minimal:** Methods exist only once in memory on the prototype object.                  | **Higher (if using closures):** Functions are recreated per instance unless copying shared references. |
| **Flexibility**              | **Rigid:** Single-inheritance chain (an object has only one direct prototype).           | **Highly Flexible:** Multiple mixins/traits can be merged dynamically without hierarchy constraints.   |
| **Coupling**                 | **Tight:** Changes to parent prototypes immediately propagate to all descendants.        | **Loose:** Components are decoupled; changes to one module do not break unrelated behaviors.           |
| **Fragile Base Class Issue** | **Vulnerable:** Modifying a base prototype method can inadvertently break child objects. | **Immune:** Features exist as independent plug-in functions.                                           |

---

### Code Architecture Comparison

#### 1. Prototype Delegation (Hierarchical)

Inheritance locks code into rigid parent-child chains:

```javascript
function Human(name) {
  this.name = name;
}
Human.prototype.breathe = function() {
  return `${this.name} breathes`;
};

function Developer(name, role) {
  Human.call(this, name);
  this.role = role;
}
Developer.prototype = Object.create(Human.prototype);
Developer.prototype.constructor = Developer;

Developer.prototype.code = function() {
  return `${this.name} writes code`;
};

const dev = new Developer("Alex", "Fullstack");
console.log(dev.breathe()); // Delegated up the chain to Human.prototype
console.log(dev.code());    // Found on Developer.prototype

```

* **Limitation:** If you later introduce a `RobotDeveloper` that codes but doesn't breathe, the hierarchy breaks down (the "Gorilla-Banana" problem).

#### 2. Composition (Behavioral Modules / Mixins)

Instead of forcing what an object *is*, composition designs around what an object *does*:

```javascript
// Discrete behavioral factories / mixins
const canBreathe = (state) => ({
  breathe: () => `${state.name} breathes`
});

const canCode = (state) => ({
  code: () => `${state.name} writes ${state.language || "code"}`
});

const canDrive = (state) => ({
  drive: () => `${state.name} drives a car`
});

// Composing custom objects cleanly without deep chains
function createDeveloper(name, language) {
  const state = { name, language };
  return Object.assign(
    {},
    state,
    canBreathe(state),
    canCode(state)
  );
}

function createRoboDeveloper(name, language) {
  const state = { name, language };
  return Object.assign(
    {},
    state,
    canCode(state) // Codes without needing the breathe module
  );
}

const humanDev = createDeveloper("Kiara", "JavaScript");
const robotDev = createRoboDeveloper("Unit-7", "Rust");

console.log(humanDev.breathe()); // "Kiara breathes"
console.log(robotDev.code());    // "Unit-7 writes Rust"
// robotDev.breathe is undefined - no unwanted inherited baggage

```

---

### When to Use Which?

* **Use Prototype Delegation when:**
* Performance and memory footprint are critical (e.g., instantiating hundreds of thousands of identical entity instances like game particles, data models, or DOM-like trees).
* You are building library primitives or using ES6 `class` structures for clear, single-axis hierarchies.

* **Use Composition when:**
* Building complex, evolving domain applications (e.g., UI components, business services, React hooks/custom utilities).
* You need multiple independent behaviors (e.g., an entity that is both `Loggable`, `Serializable`, and `EventEmmiter`) without creating nested inheritance pyramids.
