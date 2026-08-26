*** copy {} == '{}' is true then why,  howto make it true.md ***

`{} == '{}'` evaluates to **`false`**, not `true`.

---

**1. Why it is `false**`

When JavaScript compares an object `{}` to a string `"{}"` using loose equality (`==`), it follows the [Abstract Equality Comparison Algorithm](https://www.google.com/search?q=https://tc39.es/ecma262/%23sec-abstract-equality-comparison):

1. **Type Coercion:** Because one operand is an Object and the other is a String, JavaScript converts the object to a primitive by calling its `valueOf()` and then `toString()` method.
2. **String Conversion:**

```javascript
({}).toString(); // Returns "[object Object]"

```

1. **Final Comparison:**

```javascript
"[object Object]" == "{}" // false

```

Since `"[object Object]"` does not equal `"{}"`, the comparison evaluates to `false`.

---

**2. How to make it evaluate to `true**`

Depending on what you are trying to achieve, here are the common ways to get `true`:

* **Compare against the object's actual string representation:**

```javascript
{} == "[object Object]" // true (wrap in parentheses in console: ({}) == "[object Object]")

```

* **Serialize the object using JSON:**

```javascript
JSON.stringify({}) == "{}" // true

```

* **Override `toString()` or `Symbol.toPrimitive` on the object:**

```javascript
const customObj = {
  toString() {
    return '{}';
  }
};

customObj == '{}' // true

```
