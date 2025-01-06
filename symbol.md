Let's walk through the given JavaScript code and understand the output step by step.

### Code:

```javascript
const symbol = Symbol("BFE");

const a = {
  [symbol]: "BFE",
  BFE: "BFE",
};

console.log(symbol in a); // Check if `symbol` exists in object `a`
console.log("BFE" in a);  // Check if `"BFE"` exists in object `a`
console.log(Object.keys(a).length);  // Get the number of own enumerable properties of object `a`
```

### Explanation:

#### 1. **`symbol in a`**

- `symbol` is a `Symbol`, which is a unique primitive value.
- `symbol` is used as a property key in the object `a`.
- `Symbols` are **not enumerable** in the same way as string keys. They are hidden from methods like `Object.keys()`, but they **do exist in the object**.

So, when checking if `symbol` is in `a` with the `in` operator:
- **The output will be `true`**, because the symbol key exists in `a`, even though it is not enumerable by default.

#### 2. **`"BFE" in a`**

- `"BFE"` is a regular string key, and it is explicitly added to `a`.
- This string key will be enumerable in `Object.keys()` and will also show up when you check with the `in` operator.
  
So, **the output will be `true`**, because `"BFE"` is a direct property of `a`.

#### 3. **`Object.keys(a).length`**

- `Object.keys()` returns **only the enumerable properties** of an object as an array of strings.
- The property `BFE` (the string key) is enumerable, but `symbol` (the Symbol key) is **not** enumerable by default.
  
Thus, `Object.keys(a)` will return an array with just the string `"BFE"`, not the symbol key.

- **The output will be `1`**, because there is only one enumerable key: `"BFE"`.

### Final Output:

```javascript
true  // symbol in a is true
true  // "BFE" in a is true
1     // Only "BFE" is enumerable, so Object.keys(a).length is 1
```

### Summary:
- The `in` operator checks both enumerable and non-enumerable properties, so both `"BFE"` and the `symbol` key exist in the object.
- `Object.keys()` only returns **enumerable string keys**, which is why it doesn't count the `symbol` property.
