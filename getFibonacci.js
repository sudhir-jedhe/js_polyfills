export const getFibonacci = (n) => {
  if (n === 1) {
    return [0];
  } else if (n === 2) {
    return [0, 1];
  } else {
    const result = [0, 1];
    for (let i = 2; i < n; i++) {
      const nextNumber = result[i - 1] + result[i - 2];
      result.push(nextNumber);
    }
    return result;
  }
};

getFibonacci(1); // Output: [0]
getFibonacci(2); // Output: [0, 1]
getFibonacci(5); // Output: [0, 1, 1, 2, 3]
getFibonacci(10); // Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
