rotateArray([1, 2, 3, 4, 5], 2); // returns [3, 4, 5, 1, 2]
rotateArray(["apple", "banana", "cherry", "date"], 3); // ["date", "apple", "banana", "cherry"]
rotateArray([1, 2, 3, 4, 5, 6], 4); // [5, 6, 1, 2, 3, 4]
rotateArray([1, 2, 3, 4, 5], 7); // returns [4, 5, 1, 2, 3]

export const rotateArray = (arr, n) => {
  const len = arr.length;
  const steps = n % len;

  return [...arr.slice(steps), ...arr.slice(0, steps)];
};
