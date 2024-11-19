Implement async reject function in JavaScript
Posted on April 2, 2024 | by Prashant Yadav

Posted in Interview, Javascript | Tagged async

Implement a function that takes an array of input and an async iteratee function and returns a promise that resolves with the list of inputs that has failed the test through iteratee function in JavaScript. This function is exactly the opposite of the Async Filter.

The inputs will run in parallel, but the output will be in the same order as the original.

The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result.


```javascript

Input:
let numPromise = reject([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 7){
      callback(true);
    }else{
      callback(null, num !== 4);
    }
    
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
2
4
6
8
10
"success:2"

```

We can use the exact same implementation of the Async filter, only changing the logic to add the value to the output array only when it fails the test.

```javascript
const reject = (arr, fn) => {
  // return a new promise
  return new Promise((resolve, reject) => {
    const output = [];
    let track = 0;
    
    arr.forEach((e, i) => {
      fn(e, (error, result) => {
        // reject on error
        if(error){
          reject(error);
        }
        
        // track the no of inputs processed
        track++;
        
        // if input fails the test
        // add it to the current index
        if(!result){
          output[i] = e;
        }
        
        // if the last element of the input array
        if(track >= arr.length){
          // filter the final output with truthy values
          // to return the value in order
          resolve(output.filter(Boolean));
        }
      });
    });
    
  });
};

```

```javascript
let numPromise = reject([1, 2, 3, 4, 5], function (num, callback) {
  setTimeout(function () {
    num = num * 2;
    console.log(num);
    
    // throw error
    if(num === 7){
      callback(true);
    }else{
      callback(null, num !== 4);
    }
    
  }, 2000);
});

numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
2
4
6
8
10
"success:2"
```