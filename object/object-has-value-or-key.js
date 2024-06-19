Check if an object has a given value
In order to check if an object has a given value, you can use Object.values() to get all the values of the object. Then, use Array.prototype.includes() to check if the target value is included in the values array.

const hasValue = (obj, value) => Object.values(obj).includes(value);

const obj = { a: 100, b: 200 };
hasValue(obj, 100); // true
hasValue(obj, 999); // false
Check if an object has a given key
Checking if an object has a given key is equally as easy, using Object.keys() instead of Object.values(). Then, you can use Array.prototype.includes() to check if the target key is included in the keys array.

const hasKey = (obj, key) => Object.keys(obj).includes(key);

const obj = { a: 100, b: 200 };
hasKey(obj, 'a'); // true
hasKey(obj, 'c'); // false
Accounting for nested keys
Checking for nested keys is a bit more complex, but can be done with a little ingenuity.

Given an array of keys, you can use Array.prototype.every() to sequentially check the keys to the internal depth of the object. Using Object.prototype.hasOwnProperty(), you can then check if the object does not have the current key or is not an object, stop propagation and return false. Otherwise, assign the key's value to the object to use on the next iteration.

const hasKeyDeep = (obj, keys) => {
  return (
    keys.length > 0 &&
    keys.every(key => {
      if (typeof obj !== 'object' || !obj.hasOwnProperty(key)) return false;
      obj = obj[key];
      return true;
    })
  );
};

let obj = {
  a: 1,
  b: { c: 4 },
  'b.d': 5
};
hasKeyDeep(obj, ['a']); // true
hasKeyDeep(obj, ['b']); // true
hasKeyDeep(obj, ['b', 'c']); // true
hasKeyDeep(obj, ['b.d']); // true
hasKeyDeep(obj, ['d']); // false
hasKeyDeep(obj, ['c']); // false
hasKeyDeep(obj, ['b', 'f']); // false
