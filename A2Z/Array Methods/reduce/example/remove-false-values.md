```js

let arr = [23, 0, "gfg", false, true, NaN, 12, "hi", undefined, [], ""];

function removeFalse(arr) {
  return arr.reduce((acc, curr) => {
    // Check if the truthy then return concatenated value acc with curr.
    // else return only acc.
    if (curr) {
      return [...acc, curr];
    } else {
      return acc;
    }
  }, []); // Initialize with an empty array
}

console.log(removeFalse(arr));
```