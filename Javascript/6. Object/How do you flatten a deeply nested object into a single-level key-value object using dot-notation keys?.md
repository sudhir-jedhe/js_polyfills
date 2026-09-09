***  How do you flatten a deeply nested object into a single-level key-value object using dot-notation keys?.md ***

To flatten a deeply nested object into a single-level object using dot-notation keys, use recursion to traverse the structure while carrying forward the cumulative key path.

---

### Implementation

```javascript
function flattenObject(obj, prefix = '', result = {}) {
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const currentPath = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];

      // Check if value is a non-null object or array with keys
      if (typeof value === 'object' && value !== null && Object.keys(value).length > 0) {
        flattenObject(value, currentPath, result);
      } else {
        // Assign leaf value or empty object/array to the flattened result
        result[currentPath] = value;
      }
    }
  }

  return result;
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
  skills: ["JavaScript", "React"],
  meta: {
    isActive: true,
    tags: [] // Empty array handling
  }
};

const flattened = flattenObject(user);
console.log(flattened);

```

**Console Output:**

```javascript
{
  "name": "Sudhir",
  "age": 35,
  "address.city": "Pune",
  "address.pincode": 411033,
  "address.geo.lat": 18.5204,
  "address.geo.lng": 73.8567,
  "skills.0": "JavaScript",
  "skills.1": "React",
  "meta.isActive": true,
  "meta.tags": []
}

```

---

### Edge Cases Handled

* **Empty Objects/Arrays (`{}` or `[]`):** Preserved as leaf values (`meta.tags: []`) rather than vanishing.
* **`null` & `undefined`:** Handled cleanly as primitive leaf values without causing recursion errors.
* **Special Objects (Dates, RegExps):** If your objects include `Date` or `RegExp` instances, guard against traversing them:

```javascript
function isPlainObjectOrArray(val) {
  return (
    typeof val === 'object' &&
    val !== null &&
    !(val instanceof Date) &&
    !(val instanceof RegExp)
  );
}

```
