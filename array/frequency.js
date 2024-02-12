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
