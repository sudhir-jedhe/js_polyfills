async function asyncMap(array, asyncMappingFunction) {
  const promises = array.map(asyncMappingFunction);
  const results = await Promise.all(promises);
  return results;
}

// Implement a js function that maps an array of items with an asynchronous
// mapping function

// This function takes an array of items and an asynchronous mapping function as
// input. The mapping function is called on each item in the array, and the
// results are collected into an array of promises. The asyncMap function then
// waits for all of the promises to resolve before returning the results.

const array = [1, 2, 3];
const asyncMappingFunction = async (item) => {
  // Do something asynchronous with the item
  return item * 2;
};

const results = await asyncMap(array, asyncMappingFunction);

console.log(results); // [2, 4, 6]

// In this example, the asyncMap function is used to map the array of numbers to
// an array of doubled numbers. The asyncMappingFunction function simply
// multiplies the item by 2. The asyncMap function then waits for all of the
// promises to resolve before returning the results. The asyncMap function can
// be used to map any array of items to an array of results, even if the mapping
// function is asynchronous. This can be useful for tasks such as fetching data
// from a remote server or performing other asynchronous operations.
