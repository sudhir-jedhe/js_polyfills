const leastFrequent = (arr) => {
  //Store the number counts in object
  const count = arr.reduce((a, b) => {
    if (!a[b]) {
      a[b] = 1;
    } else {
      a[b]++;
    }

    return a;
  }, {});

  let minCount = Number.MAX_SAFE_INTEGER;
  let numberWithLeastCount = 0;

  //Find the number with least count
  for (const [key, value] of Object.entries(count)) {
    if (value < minCount) {
      minCount = value;
      numberWithLeastCount = key;
    }
  }

  return numberWithLeastCount;
};

Input: console.log(leastFrequent([1, 1, 1, 2, 2, 2, 3, 3, 4]));
console.log(leastFrequent([2, 2, 2, 3, 3, 3, 4, 4, 4, 2, 5, 5, 5, 6, 6]));

Output: 4;
6;
