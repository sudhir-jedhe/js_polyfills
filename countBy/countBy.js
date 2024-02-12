// Implement a function countBy(array, iteratee) that creates an object composed of keys generated from the results of running each element of array thru iteratee. The corresponding value of each key is the number of times the key was returned by iteratee. iteratees can either be:

// Functions: iteratee functions is invoked with one argument: (value).
// Strings: The property of an object. E.g. 'length' can be used to return the number of elements of arrays.
// countBy(array, iteratee);
// Arguments
// array (Array): The array to iterate over.
// iteratee (Function): The iteratee function to transform elements. The function is invoked with one argument: (value).
// Returns
// (Object): Returns the composed aggregate object.

// Examples
// countBy([6.1, 4.2, 6.3], Math.floor);
// // => { '4': 1, '6': 2 }

// countBy(['one', 'two', 'three'], 'length');
// // => { '3': 2, '5': 1 }

/**
 * @param {Array} array The array to iterate over.
 * @param {Function|string} iteratee The function invoked per iteration.
 * @returns {Object} Returns the composed aggregate object.
 */
export default function countBy(array, iteratee) {
  const result = {};
  const iterateeFunc =
    typeof iteratee === "function" ? iteratee : (value) => value[iteratee];

  for (const element of array) {
    const key = iterateeFunc(element);
    if (!Object.prototype.hasOwnProperty.call(result, key)) {
      result[key] = 0;
    }

    result[key]++;
  }

  return result;
}



// /******************************************** */
// An alternative way to increment the result counter is to 
// use the nullish coalescing assignment operator to set the value to 0 
// if key doesn't exist within result. Note that using nullish coalescing 
// assignment operator means you might be accessing inherited properties, 
// which is not desired, but since the object is created via Object.create(null), 
 // there will not be inherited properties and is safe to use.

/**
 * @param {Array} array The array to iterate over.
 * @param {Function|string} iteratee The function invoked per iteration.
 * @returns {Object} Returns the composed aggregate object.
 */
export default function countBy(array, iteratee) {
  const result = Object.create(null);

  for (const element of array) {
    const key =
      typeof iteratee === 'function' ? iteratee(element) : element[iteratee];
    result[key] ??= 0;
    result[key]++;
  }

  return result;
}
