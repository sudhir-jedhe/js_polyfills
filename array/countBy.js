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
