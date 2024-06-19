
// Check if an object has a given value
const hasValue = (obj, value) => Object.values(obj).includes(value);

const obj = { a: 100, b: 200 };
hasValue(obj, 100); // true
hasValue(obj, 999); // false

// Check if an object has a given key

const hasKey = (obj, key) => Object.keys(obj).includes(key);

const obj = { a: 100, b: 200 };
hasKey(obj, 'a'); // true
hasKey(obj, 'c'); // false

// Accounting for nested keys