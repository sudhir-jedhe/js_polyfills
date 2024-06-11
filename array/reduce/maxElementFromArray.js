// Getting the maximum element of an array


const arr = [1, 2, 3];
const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);


function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  