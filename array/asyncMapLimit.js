async function asyncMapWithLimit(array, mappingFunction, limit) {
  const queue = [];
  const results = [];

  for (const item of array) {
    queue.push(mappingFunction(item));
  }

  while (queue.length > 0) {
    const promises = queue.splice(0, limit);
    const resolvedPromises = await Promise.all(promises);
    results.push(...resolvedPromises);
  }

  return results;
}

// Implement a js function that maps an array of items with an asynchronous
// mapping function while not exceeding the concurrency limit

// array: The array of items to map. mappingFunction: The asynchronous mapping
// function. limit: The maximum number of concurrent asynchronous operations.
// The function works by first creating a queue of all the asynchronous
// operations to be performed. Then, it iterates over the queue, starting a new
// asynchronous operation for each item in the queue, up to the concurrency
// limit. Once all of the asynchronous operations have been started, the
// function waits for all of them to finish before returning the results. Here
// is an example of how to use the asyncMapWithLimit fu

const array = [1, 2, 3, 4, 5];

const mappingFunction = async (item) => {
  // Perform some asynchronous operation on the item.
  return item * 2;
};

const results = await asyncMapWithLimit(array, mappingFunction, 2);

console.log(results); // [2, 4, 6, 8, 10]
// In this example, the asyncMapWithLimit function is used to map an array of
// numbers to an array of numbers that are twice as large, while not exceeding a
// concurrency limit of 2. The function returns an array of the results, which
// is then logged to the console.
