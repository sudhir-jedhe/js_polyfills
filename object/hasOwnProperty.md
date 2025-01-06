You're correct in using the `for...in` loop to iterate over an object's properties in JavaScript. The `for...in` loop iterates over all enumerable properties of an object, including those inherited through the prototype chain, which is why you should use the `hasOwnProperty` method to ensure you're only dealing with the object's own properties and not inherited ones.

Here's a detailed explanation of your example:

### Example Code:

```javascript
var object = {
  k1: "value1",
  k2: "value2",
  k3: "value3",
};

for (var key in object) {
  // Check if the property belongs to the object itself and not its prototype chain
  if (object.hasOwnProperty(key)) {
    console.log(key + " -> " + object[key]);
    // Output: 
    // k1 -> value1
    // k2 -> value2
    // k3 -> value3
  }
}
```

### Breakdown:
1. **`for...in` loop**: This loop goes through all enumerable properties of an object (including inherited properties, which is why we need the check with `hasOwnProperty`).
2. **`object.hasOwnProperty(key)`**: This ensures that the `key` being processed is an actual property of the `object` and not one inherited from the object's prototype chain. This is important to prevent enumerating properties that come from the prototype, which could be irrelevant or unwanted.
3. **`object[key]`**: This accesses the value associated with the current property `key`.

### Example Output:
```
k1 -> value1
k2 -> value2
k3 -> value3
```

### Alternative Methods to Enumerate Object Properties:

#### 1. **Using `Object.keys()`** (ES5+)
If you only want the keys (property names) of the object, you can use `Object.keys()`, which returns an array of the object's own enumerable properties.

```javascript
const object = { k1: "value1", k2: "value2", k3: "value3" };

Object.keys(object).forEach(key => {
  console.log(key + " -> " + object[key]);
  // Output: 
  // k1 -> value1
  // k2 -> value2
  // k3 -> value3
});
```

#### 2. **Using `Object.values()`** (ES8+)
If you want to iterate over the values of the object rather than the keys, you can use `Object.values()`:

```javascript
const object = { k1: "value1", k2: "value2", k3: "value3" };

Object.values(object).forEach(value => {
  console.log(value);
  // Output:
  // value1
  // value2
  // value3
});
```

#### 3. **Using `Object.entries()`** (ES8+)
`Object.entries()` gives you an array of `[key, value]` pairs, which you can use to loop through both the key and value at the same time:

```javascript
const object = { k1: "value1", k2: "value2", k3: "value3" };

Object.entries(object).forEach(([key, value]) => {
  console.log(key + " -> " + value);
  // Output:
  // k1 -> value1
  // k2 -> value2
  // k3 -> value3
});
```

#### 4. **Using `for...of` with `Object.entries()`** (ES6+)
You can also use `for...of` with `Object.entries()` to loop through key-value pairs:

```javascript
const object = { k1: "value1", k2: "value2", k3: "value3" };

for (const [key, value] of Object.entries(object)) {
  console.log(key + " -> " + value);
  // Output:
  // k1 -> value1
  // k2 -> value2
  // k3 -> value3
}
```

### Summary:
- **`for...in` loop**: Loops through all enumerable properties, including inherited ones, so it is important to check `hasOwnProperty`.
- **`Object.keys()`**: Returns an array of an object's own enumerable property names (keys).
- **`Object.values()`**: Returns an array of an object's own enumerable property values.
- **`Object.entries()`**: Returns an array of key-value pairs (arrays), which is useful if you want both keys and values together.

The `for...in` loop remains a useful, traditional way to iterate through object properties, but `Object.keys()`, `Object.values()`, and `Object.entries()` offer cleaner and more modern alternatives, especially when working with the keys or values directly.