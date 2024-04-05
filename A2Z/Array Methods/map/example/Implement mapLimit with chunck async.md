```js
async function mapWithChunksAsync(array, mapper, chunkSize) {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const mappedChunk = await Promise.all(chunk.map(mapper));
    results.push(...mappedChunk);
  }
  return results;
}

// Example async mapping function
async function asyncMapper(value) {
  return value * 2; // Perform some async operation
}

// Example usage of mapWithChunksAsync
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const chunkSize = 2;
mapWithChunksAsync(array, asyncMapper, chunkSize)
  .then((mappedArray) => {
    console.log(mappedArray); // Output: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
  })
  .catch((error) => {
    console.error(error);
  });

```

```js
// helper function to chop array in chunks of given size
Array.prototype.chop = function (size) {
  //temp array
  const temp = [...this];

  //if the size is not defined
  if (!size) {
    return temp;
  }

  //output
  const output = [];
  let i = 0;

  //iterate the array
  while (i < temp.length) {
    //slice the sub-array of a given size
    //and push them in output array
    output.push(temp.slice(i, i + size));
    i = i + size;
  }

  return output;
};

const mapLimit = (arr, limit, fn) => {
  // return a new promise
  return new Promise((resolve, reject) => {
    // chop the input array into the subarray of limit
    // [[1, 2, 3], [1, 2, 3]]
    let chopped = arr.chop(limit);
    
    // for all the subarrays of chopped
    // run it in series
    // that is one after another
    // initially it will take an empty array to resolve
    // merge the output of the subarray and pass it on to the next
    const final = chopped.reduce((a, b) => {
      return a.then((val) => {
        // run the sub-array values in parallel
        // pass each input to the iteratee function
        // and store their outputs
        // after all the tasks are executed
        // merge the output with the previous one and resolve
        return new Promise((resolve, reject) => {

          const results = [];
          let tasksCompleted = 0;
          b.forEach((e) => {
            fn(e, (error, value) => {
              if(error){
                reject(error);
              }else{
                results.push(value);
                tasksCompleted++;
                if (tasksCompleted >= b.length) {
                  resolve([...val, ...results]);
                }
              }
            });
          });
        });

      });
    }, Promise.resolve([]));

    // based on final promise state 
    // invoke the final promise.
    final
      .then((result) => {
        resolve(result);
      })
      .catch((e) => {
        reject(e);
      });
  });
};
```
Test Case 1: All the inputs resolve.

```js
Input:
let numPromise = mapLimit([1, 2, 3, 4, 5], 3, function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    callback(null, num);
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
// first batch
2
4
6
// second batch
8
10
"success:2,4,6,8,10"
```

Test Case 2: Rejects.

```js
Input:
let numPromise = mapLimit([1, 2, 3, 4, 5], 3, function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 6){
      callback(true);
    }else{
      callback(null, num);
    }
    
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
// first batch
2
4
6
"no success"
```