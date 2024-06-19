// All keys in the object are present in the specified array.
const keysAreValid = (obj, keys) =>
    Object.keys(obj).every(key => keys.includes(key));
  
  // All keys in the specified array are present in the object.
  const allKeysArePresent = (obj, keys) => {
    const objKeys = Object.keys(obj);
    return keys.every(key => objKeys.includes(key));
  };
  
  // Check if the keys of an object match the specified array.
  const keysMatch = (obj, keys) =>
    keysAreValid(obj, keys) && allKeysArePresent(obj, keys);
  
  const obj = { id: 1, name: 'apple', price: 1.2 };
  const keys = ['id', 'name', 'price'];
  
  keysAreValid(obj, keys); // true
  keysAreValid(obj, [...keys, 'quantity']); // true
  
  allKeysArePresent(obj, keys); // true
  allKeysArePresent(obj, [...keys, 'quantity']); // false
  
  keysMatch(obj, keys); // true
  keysMatch(obj, [...keys, 'quantity']); // false



  /***************************************** */


  const keysAreValid = (obj, keys) =>
    Object.keys(obj).every(key => keys.includes(key));
  
  const allKeysArePresent = (obj, keys) => {
    const objKeys = Object.keys(obj);
    return keys.every(key => objKeys.includes(key));
  };
  
  const keysMatch = (obj, keys) =>
    keysAreValid(obj, keys) && allKeysArePresent(obj, keys);
  
  // All keys in the target object are present in the source object.
  const objectKeysAreValid = (obj, source) =>
    keysAreValid(obj, Object.keys(source));
  
  // All keys in the source object are present in the target object.
  const objectKeysArePresent = (obj, source) =>
    allKeysArePresent(obj, Object.keys(source));
  
  // Check if the keys of the target object match the source object.
  const objectKeysMatch = (obj, source) =>
    keysMatch(obj, Object.keys(source));
  
  const target = { id: 1, name: 'apple', price: 1.2 };
  const source = { id: 1, name: 'apple', price: 1.2 };
  
  objectKeysAreValid(target, source); // true
  objectKeysAreValid(target, { ...source, quantity: 10 }); // true
  
  objectKeysArePresent(target, source); // true
  objectKeysArePresent(target, { ...source, quantity: 10 }); // false
  
  objectKeysMatch(target, source); // true
  objectKeysMatch(target, { ...source, quantity: 10 }); // false