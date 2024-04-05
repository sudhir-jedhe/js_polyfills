```js
export function customReduce(nums, fn, init) {
  let result = init;

  for (let num of nums) {
    result = fn(result, num);
  }

  return result;
}

const nums = [1, 2, 3, 4, 5];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const initialValue = 0;

console.log(customReduce(nums, reducer, initialValue)); // Output: 15
```


Write a program to polyfill reduce functionality of the Array
reduce iterates over the all values of array and passes value, 
index and array (itself) as the arguments
reduce accepts an optional initial value which  when not provided can be skipped Function returns a single value after all the iteration
```js

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, init) {
    let startPosition = 0;
    let accumulator = init ?? this[startPosition++];
 
    for (let index = startPosition; index < this.length; index++) {
      accumulator = callback(accumulator, this[index], index, this);
    }
    return accumulator;
  };
}
```