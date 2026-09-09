***  print all keys of a nested object without using Object.keys().md ***

To print all keys of a nested object without using `Object.keys()`, you can use a **`for...in` loop** combined with **recursion**.

The `for...in` loop iterates over all enumerable properties of an object, and `hasOwnProperty` ensures that only the object's own properties are accessed, ignoring properties inherited from the prototype chain.

---

### Implementation (Recursion + `for...in`)

```javascript
function getAllKeys(obj) {
  for (let key in obj) {
    // Check if the property belongs directly to the object (not inherited)
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      console.log(key);

      // If the value is a nested object (and not null), recurse deeper
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        getAllKeys(obj[key]);
      }
    }
  }
}

```

---

### Example & Output

```javascript
const user = {
  name: "Sudhir",
  age: 35,
  address: {
    city: "Pune",
    pincode: 411033,
    geo: {
      lat: 18.5204,
      lng: 73.8567
    }
  },
  skills: ["JavaScript", "React"]
};

getAllKeys(user);

```

**Console Output:**

```text
name
age
address
city
pincode
geo
lat
lng
skills
0
1

```

*(Note: In JavaScript, Arrays are also objects, so their numeric indices `0`, `1` are treated and printed as keys.)*

---

### Variant: Skip Array Indices (Objects Only)

If you only want keys from plain objects and want to exclude array indices:

```javascript
function getObjectOnlyKeys(obj) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      console.log(key);

      // Recurse only into non-array objects
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        getObjectOnlyKeys(obj[key]);
      }
    }
  }
}

```

---

### Alternative Method: `Reflect.ownKeys()`

If you want to avoid `for...in` as well (while still avoiding `Object.keys()`):

```javascript
function getAllKeysUsingReflect(obj) {
  if (typeof obj !== 'object' || obj === null) return;

  const keys = Reflect.ownKeys(obj);
  for (const key of keys) {
    console.log(String(key));
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      getAllKeysUsingReflect(obj[key]);
    }
  }
}

```
