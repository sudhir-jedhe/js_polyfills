To reconstruct a deeply nested object from a flattened, dot-notation key-value map, split each path by `.` (or bracket indices) and recursively traverse or instantiate the nested containers (objects or arrays).

---

### Implementation

```javascript
function unflattenObject(flatObj) {
  const result = {};

  for (const path in flatObj) {
    if (!Object.prototype.hasOwnProperty.call(flatObj, path)) continue;

    // Split keys by dot notation or array bracket notation: 'a.b[0].c' -> ['a', 'b', '0', 'c']
    const keys = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let current = result;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const isLast = i === keys.length - 1;

      if (isLast) {
        current[key] = flatObj[path];
      } else {
        const nextKey = keys[i + 1];
        // If next segment is numeric, prepare an array; otherwise an object
        const isNextKeyIndex = !isNaN(Number(nextKey));

        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          current[key] = isNextKeyIndex ? [] : {};
        }

        current = current[key];
      }
    }
  }

  return result;
}

```

---

### Example & Output

```javascript
const flatUser = {
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
};

const nestedUser = unflattenObject(flatUser);
console.log(JSON.stringify(nestedUser, null, 2));

```

**Console Output:**

```json
{
  "name": "Sudhir",
  "age": 35,
  "address": {
    "city": "Pune",
    "pincode": 411033,
    "geo": {
      "lat": 18.5204,
      "lng": 73.8567
    }
  },
  "skills": [
    "JavaScript",
    "React"
  ],
  "meta": {
    "isActive": true,
    "tags": []
  }
}

```

---

### Key Mechanics

* **Regex Path Normalization (`replace(/\[(\w+)\]/g, '.$1')`):** Handles both `skills.0` and `skills[0]` uniformly by converting brackets into standard dot segments.
* **Array vs Object Detection (`!isNaN(Number(nextKey))`):** Checks the upcoming token; if it represents a valid numeric index, it initializes `[]` instead of `{}`.
* **Pointer Navigation (`current = current[key]`):** Walks down the tree by updating the reference pointer until the leaf property is set.
