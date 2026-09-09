***  nfinite currying for addition.md ***

In JavaScript, infinite currying for addition is typically implemented in one of two ways depending on how the execution terminates: **empty call invocation `()**` or **value extraction via coercion (`valueOf`/`toString`)**.

---

### Pattern 1: Terminated by an Empty Call `()` (Most Common)

The function keeps returning itself until it is called with no arguments:

```javascript
function sum(a) {
  return function (b) {
    if (b !== undefined) {
      return sum(a + b);
    }
    return a;
  };
}

console.log(sum(1)(2)(3)());         // 6
console.log(sum(5)(10)(15)(20)());   // 50

```

#### ES6 One-Liner Syntax

```javascript
const sum = (a) => (b) => b !== undefined ? sum(a + b) : a;

console.log(sum(1)(2)(3)(4)()); // 10

```

---

### Pattern 2: Terminated by Type Coercion (`valueOf` / `toString`)

The function returns another callable function indefinitely. When used in an arithmetic or string context, JavaScript invokes `.valueOf()`:

```javascript
function sum(a) {
  const inner = (b) => sum(a + b);
  inner.valueOf = () => a;
  inner.toString = () => a;
  return inner;
}

console.log(+sum(1)(2)(3));        // 6
console.log(sum(1)(2)(3)(4) + 10); // 20
console.log(Number(sum(5)(5)(5))); // 15

```

---

### Pattern 3: Accepting Multiple Arguments per Call + Empty Call `()`

```javascript
function sum(...args) {
  const currentTotal = args.reduce((acc, n) => acc + n, 0);

  return function (...nextArgs) {
    if (nextArgs.length === 0) return currentTotal;
    return sum(currentTotal, ...nextArgs);
  };
}

console.log(sum(1, 2)(3)(4, 5)()); // 15

```
