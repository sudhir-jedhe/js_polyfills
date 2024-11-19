Implement a mapLimit function that is similar to the Array.map() which returns a promise that resolves on the list of output by mapping each input through an asynchronous iteratee function or rejects it if any error occurs. It also accepts a limit to decide how many operations can occur at a time.

The asynchronous iteratee function will accept a input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.

This question is a polyfill of the mapLimit method from the async util

```javascript

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
/// first batch
2
4
6
/// second batch
8
10
/// final result
"success: [2, 4, 6, 8, 10]

```

To implement this function we will have to use the combination of both Async.parallel and Async.series.

First chop the input array into the subarrays of the given limit. This will return us an array of arrays like [[1, 2, 3], [4, 5]].
The parent array will run in series that is the next subarray will execute only after the current subarray is done.
All the elements of each sub-array will run in parallel.
Accumulate all the results of each sub-array element and resolve the promise with this.
If there is any error, reject.

```javascript
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
```javascript
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

```javascript

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