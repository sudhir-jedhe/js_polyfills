// Creating multilevel array
const numbers = [
  ["1", "2"],
  ["3", "4", ["5", ["6"], "7"]],
];

const flatNumbers = numbers.flat(Infinity);
console.log(flatNumbers);
/*
[
    '1', '2', '3',
    '4', '5', '6',
    '7'
  ]

  arr.flat([depth])
  */

function flat(array, depthLevel = 1) {
  let result = [];
  array.forEach((item) => {
    // if the item of the main array is an array itself, call the method recursively
    // to check the elements inside
    if (Array.isArray(item) && depthLevel > 0) {
      result.push(...flat(item, depthLevel - 1));
    } else result.push(item); // else, push the object into the result
  });
  return result;
}
