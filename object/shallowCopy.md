``` js
const employee = {
  id: 1,
  name: "Sudhir",
  ...(includeSalary && { salary: 5000 }),
};

const newEmployee = {
  ...employee,
};
```

In JavaScript, **shallow copy** and **deep copy** are two types of copying mechanisms used to create copies of objects or arrays. The difference between them lies in how they handle nested objects or arrays inside the original data structure.

### 1. **Shallow Copy**

A **shallow copy** of an object or array is a copy where only the top-level properties (or elements) are copied. If there are nested objects or arrays within the original object, the shallow copy will only copy references to these nested objects rather than duplicating them. This means that changes made to nested objects in the shallow copy will also affect the original object, and vice versa.

#### How Shallow Copy Works

- For **primitive types** (e.g., numbers, strings, booleans), the values are copied directly.
- For **objects** or **arrays**, only the reference (memory address) is copied. This means if you modify a nested object or array in the copy, the change will also be reflected in the original.

#### Example of Shallow Copy

```javascript
let original = {
  name: 'John',
  address: { city: 'New York', zip: '10001' }
};

let shallowCopy = { ...original }; // or Object.assign({}, original)

shallowCopy.name = 'Jane';
shallowCopy.address.city = 'Los Angeles';

console.log(original.name); // 'John' (primitive type - unaffected)
console.log(original.address.city); // 'Los Angeles' (reference to the same object)
```

In this example:
- The `name` property is a primitive value, so changing it in the shallow copy does not affect the original object.
- The `address` is an object, and since the shallow copy only copies the reference to the original `address` object, modifying it in the shallow copy also modifies it in the original object.

#### Methods for Shallow Copy
- **Spread operator (`...`)**: Useful for arrays and objects.
- **`Object.assign()`**: Copies properties of one or more objects into a target object.
  
```javascript
// Shallow copy using spread operator
let shallowCopy = { ...original };

// Shallow copy using Object.assign()
let shallowCopy2 = Object.assign({}, original);
```

### 2. **Deep Copy**

A **deep copy** creates a completely new object or array, and it recursively copies all the nested objects or arrays as well. This means that the deep copy will not share references with the original object. Any changes made to the nested objects in the deep copy will not affect the original object, and vice versa.

#### How Deep Copy Works

- **Primitive types** (numbers, strings, booleans) are copied directly.
- **Objects and arrays** are fully duplicated, including all their nested structures.

#### Example of Deep Copy

```javascript
let original = {
  name: 'John',
  address: { city: 'New York', zip: '10001' }
};

let deepCopy = JSON.parse(JSON.stringify(original));

deepCopy.name = 'Jane';
deepCopy.address.city = 'Los Angeles';

console.log(original.name); // 'John' (unchanged)
console.log(original.address.city); // 'New York' (unchanged)
```

In this example, the `deepCopy` is a completely new object, and its nested `address` object is also a new copy. Changes to the deep copy do not affect the original object, and vice versa.

#### Methods for Deep Copy
1. **Using `JSON.parse()` and `JSON.stringify()`**:
   This method works well for objects that only contain JSON-serializable data (i.e., no functions, `undefined`, or circular references).
   
   ```javascript
   let deepCopy = JSON.parse(JSON.stringify(original));
   ```

2. **Manual Recursive Copying**:
   For more complex objects that may include non-serializable data (e.g., functions or `Date` objects), you may need to manually implement a deep copying function.

   Example of a recursive deep copy function:
   
   ```javascript
   function deepCopy(obj) {
     if (obj === null || typeof obj !== 'object') {
       return obj;
     }
     let copy = Array.isArray(obj) ? [] : {};
     for (let key in obj) {
       if (obj.hasOwnProperty(key)) {
         copy[key] = deepCopy(obj[key]); // Recursively copy
       }
     }
     return copy;
   }

   let deepCopyObj = deepCopy(original);
   ```

### Key Differences

| Feature                | Shallow Copy                                        | Deep Copy                                    |
|------------------------|-----------------------------------------------------|----------------------------------------------|
| **Handling of Nested Objects/Arrays** | Copies references to nested objects or arrays | Creates new copies of nested objects/arrays |
| **Changes in Nested Structures** | Affects the original object if the nested object is modified | Does not affect the original object, changes are isolated |
| **Performance**         | Generally faster, since it only copies references to nested structures | Slower, due to deep recursion or serialization/deserialization |
| **Method for Objects**  | `Object.assign()`, Spread operator (`...`)          | `JSON.parse(JSON.stringify())`, Recursive methods |
| **Complexity**          | Simple for flat objects                            | More complex, especially with non-JSON-serializable data |

### Summary

- **Shallow copy** only copies the top-level properties and shares references for nested objects or arrays. Changes to nested structures in the copy will affect the original object.
- **Deep copy** creates a completely new copy of all properties, including nested objects and arrays, ensuring changes to the copy do not affect the original object.

Choosing between shallow and deep copy depends on whether you need independent copies of the nested structures or if the references to those structures are sufficient.
