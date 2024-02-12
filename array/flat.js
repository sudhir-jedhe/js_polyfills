// Creating multilevel array
const numbers = [
  ["1", "2"],
  ["3", "4", ["5", ["6"], "7"]],
];

const flatNumbers = numbers.flat(Infinity);
console.log(flatNumbers);

export const flatten = (arr) => {
  return arr.flat(Infinity);
};

export const flatten = (arr) => {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
};
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

/********************************* */

/**
 * @param { Array } arr
 * @param { number } depth
 */
function flat(arr, depth = 1) {
  return depth
    ? arr.reduce((acc, curr) => {
        return [
          ...acc,
          ...(Array.isArray(curr) ? flat(curr, depth - 1) : [curr]),
        ];
      }, [])
    : arr;
}

/*********************************************** */

function flat(arr, depth = 1) {
  const stack = arr.map((item) => [item, depth]);
  const res = [];

  while (stack.length > 0) {
    const [item, itemDepth] = stack.pop();
    if (Array.isArray(item) && itemDepth > 0) {
      stack.push(...item.map((i) => [i, itemDepth - 1]));
    } else {
      res.push(item);
    }
  }

  return res.reverse();
}
