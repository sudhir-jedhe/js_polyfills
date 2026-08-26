*** copy Explain all well-known symbols in JavaScript like Symbol.iterator, Symbol.toPrimitive, and Symbol.species with examples..md ***

Explain all well-known symbols in JavaScript like Symbol.iterator, Symbol.toPrimitive, and Symbol.species with examples.

Well-known symbols are built-in `Symbol` constants exposed on the global `Symbol` constructor. JavaScript uses them as internal hooks/protocols to govern fundamental operations like iteration, type coercion, string manipulation, and inheritance.

---

### 1. Iteration Symbols

**`Symbol.iterator`**
Defines the default synchronous iterator for an object. Used by `for...of`, the spread operator `...`, and `Array.from()`.

```javascript
const countdown = {
  start: 3,
  [Symbol.iterator]() {
    let current = this.start;
    return {
      next() {
        return current > 0
          ? { value: current--, done: false }
          : { done: true };
      }
    };
  }
};

console.log([...countdown]); // [3, 2, 1]

```

**`Symbol.asyncIterator`**
Defines an asynchronous iterator for objects that produce values over time (e.g., streams, paginated APIs). Used by `for await...of`.

```javascript
const asyncStream = {
  [Symbol.asyncIterator]() {
    let count = 0;
    return {
      async next() {
        if (count < 2) {
          return { value: ++count, done: false };
        }
        return { done: true };
      }
    };
  }
};

(async () => {
  for await (const val of asyncStream) {
    console.log(val); // 1, then 2
  }
})();

```

---

### 2. Type Conversion & Object Inspection

**`Symbol.toPrimitive`**
Overrides how an object is converted into a primitive value when coerced. Replaces legacy `.valueOf()` and `.toString()`.

```javascript
const price = {
  amount: 40,
  currency: 'USD',
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    if (hint === 'string') return `${this.amount} ${this.currency}`;
    return this.amount; // default hint
  }
};

console.log(+price + 10);     // 50       (hint: 'number')
console.log(`${price}`);       // "40 USD" (hint: 'string')
console.log(price + ' total'); // "40 total" (hint: 'default')

```

**`Symbol.toStringTag`**
Customizes the string description returned by `Object.prototype.toString.call(obj)`.

```javascript
class Validator {
  get [Symbol.toStringTag]() {
    return 'CustomValidator';
  }
}

const v = new Validator();
console.log(Object.prototype.toString.call(v)); // "[object CustomValidator]"

```

---

### 3. Class Metaprogramming & Prototype Symbols

**`Symbol.hasInstance`**
Customizes the behavior of the `instanceof` operator for a constructor or class.

```javascript
class EvenNumber {
  static [Symbol.hasInstance](instance) {
    return typeof instance === 'number' && instance % 2 === 0;
  }
}

console.log(4 instanceof EvenNumber); // true
console.log(5 instanceof EvenNumber); // false

```

**`Symbol.species`**
Specifies the constructor function used to create derived objects in built-in collection methods like `Array.prototype.map()` or `filter()`.

```javascript
class CustomArray extends Array {
  // Directs methods like .map() to produce regular Arrays, not CustomArray instances
  static get [Symbol.species]() {
    return Array;
  }
}

const custom = new CustomArray(1, 2, 3);
const mapped = custom.map(x => x * 2);

console.log(mapped instanceof CustomArray); // false
console.log(mapped instanceof Array);       // true

```

**`Symbol.isConcatSpreadable`**
Controls whether an object or array should be flattened when passed to `Array.prototype.concat()`.

```javascript
const arr = [1, 2];
const spreadableObj = { 0: 'a', 1: 'b', length: 2, [Symbol.isConcatSpreadable]: true };

console.log(arr.concat(spreadableObj)); // [1, 2, 'a', 'b']

```

---

### 4. String & Regular Expression Symbols

These symbols allow custom objects to integrate directly with `String.prototype` methods (`match`, `replace`, `search`, `split`).

**`Symbol.match` & `Symbol.matchAll**`
Determines how `str.match(obj)` or `str.matchAll(obj)` executes against the object.

```javascript
const customMatcher = {
  [Symbol.match](targetString) {
    return targetString.includes('react') ? ['Matched React'] : null;
  }
};

console.log('learn react 19'.match(customMatcher)); // ['Matched React']

```

**`Symbol.replace`**
Customizes `str.replace(obj, replacement)`.

```javascript
const censor = {
  [Symbol.replace](str, replacement) {
    return str.replaceAll('badword', replacement);
  }
};

console.log('this is a badword test'.replace(censor, '****')); 
// "this is a **** test"

```

**`Symbol.search`**
Customizes `str.search(obj)`.

```javascript
const finder = {
  [Symbol.search](str) {
    return str.indexOf('target');
  }
};

console.log('find the target here'.search(finder)); // 9

```

**`Symbol.split`**
Customizes `str.split(obj)`.

```javascript
const customSplitter = {
  [Symbol.split](str) {
    return str.split('-').filter(Boolean);
  }
};

console.log('a-b--c-d'.split(customSplitter)); // ['a', 'b', 'c', 'd']

```

---

### 5. Memory & Garbage Collection Symbols

**`Symbol.dispose` & `Symbol.asyncDispose` (Explicit Resource Management)**
Used with the `using` and `await using` syntax to automatically release resources (file handles, database connections, sockets) when exiting a block scope.

```javascript
// Synchronous disposal with 'using'
const fileHandler = {
  [Symbol.dispose]() {
    console.log('File handle closed automatically.');
  }
};

{
  using file = fileHandler;
  console.log('Writing to file...');
} 
// Output: 
// "Writing to file..."
// "File handle closed automatically."

```

**`Symbol.unscopables`**
An object whose own property names are excluded from the `with` statement scope bindings (primarily used by ECMAScript for backwards compatibility with legacy `with` blocks).

---

### Reference Summary

| Symbol                                    | Intercepted Operator / Method     | Primary Use Case                 |
| ----------------------------------------- | --------------------------------- | -------------------------------- |
| `Symbol.iterator`                         | `for...of`, `[...spread]`         | Custom collection iteration      |
| `Symbol.asyncIterator`                    | `for await...of`                  | Async data streaming             |
| `Symbol.toPrimitive`                      | `+obj`, `${obj}`, `obj == ""`     | Type coercion customization      |
| `Symbol.toStringTag`                      | `Object.prototype.toString`       | Class labeling / type tagging    |
| `Symbol.hasInstance`                      | `instanceof`                      | Custom type validation logic     |
| `Symbol.species`                          | `.map()`, `.slice()`, `.filter()` | Derived instance constructors    |
| `Symbol.isConcatSpreadable`               | `Array.prototype.concat`          | Flattening objects in concat     |
| `Symbol.match / replace / search / split` | `String.prototype.*`              | Custom regex/string engines      |
| `Symbol.dispose / asyncDispose`           | `using`, `await using`            | Deterministic cleanup / teardown |
