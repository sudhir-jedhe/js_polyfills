const arr = [1, 2, 3, 1, 2, 1, 4, 5, 6, 5];
const counter = frequencyCounter(arr);
console.log(counter);
// Output: { '1': 3, '2': 2, '3': 1, '4': 1, '5': 2, '6': 1 }

export const frequencyCounter = (arr) => {
  const counter = {};

  for (const element of arr) {
    if (!counter[element]) {
      counter[element] = 1;
    } else {
      counter[element]++;
    }
  }

  return counter;
};

export const frequencyCounter = (arr) => {
  return arr.reduce((counter, element) => {
    if (!counter[element]) {
      counter[element] = 1;
    } else {
      counter[element]++;
    }
    return counter;
  }, {});
};

function arrayToCountObject(arr) {
  let countObject = {};

  arr.forEach((element) => {
    // If the key doesn't exist in the countObject, initialize it to 1, else increment its value by 1
    countObject[element] = (countObject[element] || 0) + 1;
  });

  return countObject;
}

// Example usage:
let numbers = [1, 2, 3, 2, 1, 3, 4, 5, 4, 4];
let countObject = arrayToCountObject(numbers);
console.log(countObject);
// Output: { '1': 2, '2': 2, '3': 2, '4': 3, '5': 1 }
