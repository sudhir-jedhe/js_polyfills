export const range = (start, end, step = 1) => {
  if (step <= 0 || start >= end) {
    return [];
  }

  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }

  return result;
};

const range1 = range(1, 5);
console.log(range1); // [1, 2, 3, 4]

const range2 = range(0, 10, 2);
console.log(range3); // [0, 2, 4, 6, 8]

const range3 = range(10, 0, -2);
console.log(range4); // [10, 8, 6, 4, 2]
