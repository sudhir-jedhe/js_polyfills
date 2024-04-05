implement a custom mapLimit function that takes 4 arguments

inputs: An array of inputs

limit: The maximum number of operations at any given time.

iterateeFn: The async function that should be called with each input to generate the corresponding output. It will have two arguments:

input: The input being processed

callback: A function that will be called when the input is finished processing. It will be provided with one argument, the processed output.

callback: A function that should be called with the array of outputs once all inputs have been processed.

At any given point, your program can make max 2 calls i.e. at any given point your program can process 1, 2 or 2, 3 or so on user ids.

Implement a mapLimit function that is similar to the Array.map() which returns a promise that resolves on the list of output by mapping each input through an asynchronous iteratee function or rejects it if any error occurs. It also accepts a limit to decide how many operations can occur at a time.

The asynchronous iteratee function will accept a input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.

```js
function getUserById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) + 200;
 
  setTimeout(() => {
    callback("User" + id)
  }, randomRequestTime);
}

function mapLimit(inputs, limit, iterateeFn, callback) {
    executeMap(inputs, limit, iterateeFn).then(results => callback(results));
  }


  async function executeMap(inputs, limit, iterateeFn) {
    let results = [];
    let i = 0;
    while (i < inputs.length) {
      let currentCall = [];
      while (currentCall.length < limit) {
        if (i < inputs.length) {
          currentCall.push(inputs[i++]);
        } else {
          break;
        }
      }
      const currentResults = await Promise.all(currentCall.map(val => executeRequest(val, iterateeFn)));
      currentResults.forEach(result => results.push(result));
    }
    return results;
  }
  
  function executeRequest(input, iterateeFn) {
    return new Promise(resolve => {
      iterateeFn(input, val => {
        resolve(val);
      });
    });
  }
  
  mapLimit([1,2,3,4,5], 2, getUserById, (allResults) => {
    console.log('output:', allResults) // ["User1", "User2", "User3", "User4", "User5"]
  })
```



```js
function getUserById(id, callback) {
  // simulating async request
  const randomRequestTime = Math.floor(Math.random() * 100) + 200;

  setTimeout(() => {
    callback("User" + id);
  }, randomRequestTime);
}

const chop = (arr, size) => {
  const temp = [...arr];
  if (!size) {
    return temp;
  }
  const output = [];
  let i = 0;
  while (i < temp.length) {
    output.push(temp.slice(i, i + size));
    i = i + size;
  }
  return output;
};

function mapLimit(inputs, limit, iterateeFn, callback) {
  // write your solution here
  let choppedArr = chop(inputs, limit);
  const reduceResult = choppedArr.reduce((acc, curr) => {
    return new Promise((resolve) => {
      let arr = [];
      curr.forEach((x) => {
        iterateeFn(x, (callbackVal) => {
          arr.push(callbackVal);
          if (curr.length === arr.length) {
            acc.then((accRes) => {
              resolve([...accRes, ...arr]);
            });
          }
        });
      });
    });
  }, Promise.resolve([]));
  reduceResult.then((results) => {
    console.log("results", results);
    callback(results);
  });
}

mapLimit([1, 2, 3, 4, 5], 2, getUserById, (allResults) => {
  console.print("output:", allResults); // ["User1", "User2", "User3", "User4", "User5"]
});
```

```js
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

```