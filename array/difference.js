/****************************** Array difference ****************  */
function arrayDifference(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error("Invalid input. Please provide valid arrays.");
  }

  // Use Set to efficiently check for unique values
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Use filter to find values in set1 that are not in set2
  const differenceArray = arr1.filter((value) => !set2.has(value));

  return differenceArray;
}

// Example usage:

const array1 = [1, 2, 3, 4, 5];
const array2 = [3, 4, 5, 6, 7];

const difference = arrayDifference(array1, array2);

console.log(difference);
// Output: [1, 2]

function valuesNotIncluded(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    throw new Error("Both parameters must be arrays.");
  }

  return arr1.filter((value) => !arr2.includes(value));
}

// Example usage:

const array3 = [1, 2, 3, 4, 5];
const array4 = [3, 4, 5, 6, 7];

const resultArray = valuesNotIncluded(array3, array4);

console.log(resultArray);
// Output: [1, 2]

/************************* */
const array1 = [1, 2, 3, 4, 5];
const array2 = [3, 4, 5, 6, 7];

const difference = array1.filter((element) => !array2.includes(element));

console.log(difference);

/************************************** */
function arrayDifference(arr1, arr2) {
  const difference = [];

  for (let i = 0; i < arr1.length; i++) {
    if (arr2.indexOf(arr1[i]) === -1) {
      difference.push(arr1[i]);
    }
  }

  return difference;
}

const array1 = [1, 2, 3, 4, 5, 0];
const array2 = [3, 4, 5, 6, 7, 9];
const difference = arrayDifference(array1, array2);
console.log(difference);

/********************************* */

function difference(array, values) {
  // write your code below

  const isValidArray = Array.isArray(array) && array.length;
  const isValuesArrayValid = Array.isArray(values) && values.length;

  // early escape conditions
  if (!isValidArray) {
    return [];
  } else if (isValidArray && !isValuesArrayValid) {
    return array;
  } else if (!isValuesArrayValid && !isValuesArrayValid) {
    return [];
  }

  const allUniqueValues = new Set(array);
  const toExclude = new Set(values);
  const excludedValues = [];

  allUniqueValues.forEach((value) => {
    if (!toExclude.has(value)) {
      excludedValues.push(value);
    }
  });

  return excludedValues;
}

/************************* */

function difference(array, values) {
  // write your code below
  const result = [];

  if (!values || !Array.isArray(values)) {
    return Array.isArray(array) ? array : result;
  }

  if (!array || !Array.isArray(array)) {
    return result;
  }

  let set = new Set();
  for (let val of values) {
    set.add(val);
  }

  for (let arr of array) {
    if (!set.has(arr)) {
      result.push(arr);
    }
  }

  return result;
}

difference([{ 1: "p" }, 2, "ooo", [1]], [{ 1: "p" }, 2, "ooo", [1]]); // empty array

difference([{ 1: "p" }, 2, "ooo", [1]], []); // full array
