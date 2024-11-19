 Implement async filter function in JavaScript
Posted on April 2, 2024 | by Prashant Yadav

Posted in Interview, Javascript | Tagged async

Implement a function that takes an array of input and an async iteratee function and returns a promise that resolves with the list of inputs that has passed the test through iteratee function in JavaScript.

The inputs will run in parallel, but the output will be in the same order as the original.

The asynchronous iteratee function will accept an input and a callback. The callback function will be called when the input is finished processing, the first argument of the callback will be the error flag and the second will be the result. 

```javascript
Input:
let numPromise = filter([1, 2, 3, 4, 5], function (num, callback) {
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
//
numPromise
  .then((result) => console.log("success:" + result))
  .catch(() => console.log("no success"));

Output:
2
4
6
8
10
"success:1,3,4,5"

```


 This function is a simple extension of Array.filter() to handle the async operations.

To implement this we will create a new promise and return it, inside this promise, run all the input values in parallel using the Array.forEach() and inside the forEach pass each value to the iteratee function.


Inside the iteratee function’s callback if the result is true which means the input has passed the test, then add that input to the result at the current index.

In the end, if we are the last element of the input array, resolve the promise with the result.

Filter the final output to remove the gaps as we have to maintain the order for the passed values. There will no value at the indexes of unpassed values in the output array. 


```javascript

const filter = (arr, fn) => {
  // return a new promise
  return new Promise((resolve, reject) => {
    const output = [];
    let track = 0;
    
    arr.forEach((e, i) => {
      fn(e, (error, result) => {
        // track the no of inputs processed
        track++;
        
        // if the input passes the test
        // add it to the current index
        if(result){
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

Input:
let numPromise = filter([1, 2, 3, 4, 5], function (num, callback) {
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
"success:1,3,4,5"

```