*** copy BigInt.md ***

**`BigInt`** is a built-in numeric primitive in JavaScript (ES2020) that allows you to safely store and perform operations on **integers of arbitrary precision**, breaking past the safe limit of the standard `Number` type.

---

### The Problem It Solves: The Safe Integer Limit

Standard JavaScript numbers are IEEE 754 double-precision 64-bit floats. Their maximum safe integer is:

$$\text{Number.MAX\_SAFE\_INTEGER} = 2^{53} - 1 = 9{,}007{,}199{,}254{,}740{,}991$$

Exceeding this value leads to silent precision loss:

```javascript
console.log(9007199254740991 + 1); // 9007199254740992
console.log(9007199254740991 + 2); // 9007199254740992 (Wrong! Precision loss)

// With BigInt:
console.log(9007199254740991n + 2n); // 9007199254740993n (Exact!)

```

---

### Syntax & Creation

You create a `BigInt` by appending an `n` to an integer literal, or by calling the `BigInt()` constructor:

```javascript
// 1. Appending 'n' to an integer literal
const big1 = 123456789012345678901234567890n;

// 2. BigInt() constructor with string (Preferred for large values)
const big2 = BigInt("9007199254740991999999999");

// 3. From hex, octal, or binary literals
const hexBig = 0x1fffffffffffffn;

```

> **Warning:** Avoid passing large numbers to `BigInt(number)` directly (e.g., `BigInt(9007199254740991999)`), because the number loses precision **before** reaching the constructor. Always pass a **string** or use the `n` suffix.

---

### Supported Operations

`BigInt` supports standard arithmetic, bitwise operators, and comparisons:

```javascript
const a = 20n;
const b = 6n;

console.log(a + b);   // 26n
console.log(a - b);   // 14n
console.log(a * b);   // 120n
console.log(a ** 2n); // 400n

// Integer Division: Rounds towards zero (truncates decimals)
console.log(a / b);   // 3n (not 3.333...)
console.log(a % b);   // 2n

// Bitwise operations
console.log(a & b);   // 4n
console.log(a << 1n); // 40n

```

---

### Key Rules & Constraints

**1. No Implicit Type Coercion with `Number**`
You cannot mix `BigInt` and standard `Number` in arithmetic operations—it throws a `TypeError`. You must explicitly cast one to the other:

```javascript
const num = 10;
const big = 20n;

// console.log(big + num); // ❌ TypeError: Cannot mix BigInt and other types

console.log(big + BigInt(num)); // 30n
console.log(Number(big) + num); // 30

```

**2. Comparisons Work Across Types**
Comparison operators (`<`, `>`, `<=`, `>=`) and loose equality (`==`) work seamlessly between `BigInt` and `Number`, but strict equality (`===`) checks the type:

```javascript
console.log(10n == 10);   // true
console.log(10n === 10);  // false (bigint vs number)
console.log(20n > 15);    // true

```

**3. Math Object Incompatibility**
Methods on the global `Math` object (e.g., `Math.max()`, `Math.sqrt()`, `Math.round()`) do not accept `BigInt`:

```javascript
// Math.max(10n, 20n); // ❌ TypeError: Cannot convert a BigInt value to a number

```

**4. JSON Serialization Failure**
`JSON.stringify()` throws a `TypeError` by default when encountering a `BigInt`:

```javascript
const data = { id: 100n };
// JSON.stringify(data); // ❌ TypeError: Do not know how to serialize a BigInt

// Fix: Custom serializer or monkey-patching toJSON:
BigInt.prototype.toJSON = function () {
  return this.toString();
};
console.log(JSON.stringify(data)); // '{"id":"100"}'

```

---

### Static Methods (`BigInt.asIntN` & `BigInt.asUintN`)

Used for low-level 64-bit / fixed-width integer wrapping (e.g., WebAssembly bindings or cryptography):

* **`BigInt.asIntN(bits, bigint)`:** Clamps a BigInt to a signed integer of $N$ bits.
* **`BigInt.asUintN(bits, bigint)`:** Clamps a BigInt to an unsigned integer of $N$ bits.

```javascript
const max64 = 2n ** 64n - 1n;

console.log(BigInt.asIntN(64, max64));  // -1n (signed 64-bit wrap)
console.log(BigInt.asUintN(64, max64)); // 18446744073709551615n (unsigned 64-bit wrap)

```

---

### Common Real-World Use Cases

* **Database 64-bit/128-bit Primary Keys:** Storing SQL `BIGINT`, Twitter/Snowflake IDs, or UUIDs without string conversion.
* **Cryptography & Hashing:** High-precision math required for RSA, elliptic curves, and blockchain smart contracts (e.g., Ethereum Wei calculations: $10^{18}$).
* **Nanosecond Timestamps:** Handling high-resolution hardware timers and profiling APIs.
