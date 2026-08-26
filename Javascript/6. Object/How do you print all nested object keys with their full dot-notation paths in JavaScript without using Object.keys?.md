*** copy How do you print all nested object keys with their full dot-notation paths in JavaScript without using Object.keys?.md ***

To print nested object keys with their full dot-notation paths (e.g., `address.geo.lat`) without using `Object.keys()`, use a recursive function with a `for...in` loop and accumulate the prefix path at each level.

---

### Implementation

```javascript
function printNestedKeyPaths(obj, prefix = '') {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Build full path: if prefix exists, append with dot; otherwise, start with key
      const currentPath = prefix ? `${prefix}.${key}` : key;
      
      console.log(currentPath);

      // Recurse if value is a non-null nested object/array
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        printNestedKeyPaths(obj[key], currentPath);
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

printNestedKeyPaths(user);

```

**Console Output:**

```text
name
age
address
address.city
address.pincode
address.geo
address.geo.lat
address.geo.lng
skills
skills.0
skills.1

```

---

### Variant: Leaf-Only Paths (Values Only)

If you only want to print paths that terminate in actual values (excluding intermediate parent object paths):

```javascript
function printLeafPathsOnly(obj, prefix = '') {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'object' && value !== null) {
        printLeafPathsOnly(value, currentPath);
      } else {
        console.log(currentPath);
      }
    }
  }
}

// Output for user object:
// name
// age
// address.city
// address.pincode
// address.geo.lat
// address.geo.lng
// skills.0
// skills.1

```

---

### Handling Array Bracket Notation (e.g., `skills[0]`)

To format array indices as bracket notation instead of dot notation:

```javascript
function printFormattedPaths(obj, prefix = '') {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const isArrayItem = Array.isArray(obj);
      const currentPath = prefix
        ? (isArrayItem ? `${prefix}[${key}]` : `${prefix}.${key}`)
        : key;

      console.log(currentPath);

      if (typeof obj[key] === 'object' && obj[key] !== null) {
        printFormattedPaths(obj[key], currentPath);
      }
    }
  }
}

// Output:
// ...
// skills
// skills[0]
// skills[1]

```
