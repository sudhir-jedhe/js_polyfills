*** copy what do you mean by primitive data type.md ***

A **primitive data type** (or simply a "primitive") is a fundamental, built-in data type provided by a programming language that represents a single, raw value. It is not an object and has no methods or properties of its own.

---

### Core Characteristics

* **Atomic (Indivisible):** A primitive holds a single value directly (e.g., the number `42` or the boolean `true`), unlike composite data types (like objects, arrays, or structs) that bundle multiple values together.
* **Stored by Value:** When you assign or pass a primitive, you work directly with a copy of its value in memory. Modifying the copy never affects the original.
* **Stack Memory Allocation:** In most low-level and compiled environments, primitives have fixed memory sizes and are allocated directly on the stack rather than the heap.
* **Immutable:** The value itself cannot be mutated. While you can reassign a variable to point to a new primitive value, you cannot alter the existing primitive in memory.

---

### Primitive vs. Non-Primitive (Reference) Types

| Feature               | Primitive Data Type                                | Non-Primitive (Reference / Composite) Type    |
| --------------------- | -------------------------------------------------- | --------------------------------------------- |
| **Examples**          | `number`, `string`, `boolean`, `null`, `undefined` | `Object`, `Array`, `Map`, `Class instances`   |
| **Data Structure**    | Single, atomic value                               | Collection of properties/elements             |
| **Storage Mechanism** | Passed and assigned **by value**                   | Passed and assigned **by reference**          |
| **Memory Location**   | Typically fast Stack memory (fixed size)           | Heap memory (dynamic size, garbage collected) |
| **Mutability**        | **Immutable**                                      | **Mutable**                                   |

---

### Code Comparison: By Value vs. By Reference

#### 1. Primitives (Copied by Value)

```javascript
let a = 10;
let b = a; // A new, independent copy of the value 10 is created

b = 20;

console.log(a); // 10 (original is unchanged)
console.log(b); // 20

```

#### 2. Non-Primitives (Copied by Reference)

```javascript
let userA = { name: "Kiara" };
let userB = userA; // Both variables point to the SAME memory address in the heap

userB.name = "Alex";

console.log(userA.name); // "Alex" (mutated via userB)
console.log(userB.name); // "Alex"

```

---

### Common Primitives Across Languages

#### JavaScript (7 Primitives)

1. **`number`:** 64-bit IEEE 754 float (e.g., `42`, `3.14`).
2. **`string`:** Sequence of characters (e.g., `"hello"`).
3. **`boolean`:** `true` or `false`.
4. **`undefined`:** Variable declared but not assigned a value.
5. **`null`:** Intentional absence of any object value.
6. **`symbol`:** Unique, immutable identifier (ES6).
7. **`bigint`:** Arbitrary-precision integer (ES2020).

#### Java / C / C++

* **Integers:** `byte`, `short`, `int`, `long`
* **Floating-Point:** `float`, `double`
* **Characters:** `char` (single 16-bit or 8-bit character)
* **Boolean:** `boolean` / `bool`

*(Note: In Java/C++, `String` is a reference object/class, not a primitive).*

---

### Common Interview Nuance: Auto-Boxing in JavaScript

If primitives have no methods, why does `"hello".toUpperCase()` work?

JavaScript uses **Auto-Boxing**: when you call a method on a primitive string, number, or boolean, the engine temporarily wraps the primitive in an internal object (e.g., `new String("hello")`), executes the method, and immediately discards the wrapper object.
