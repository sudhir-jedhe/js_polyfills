getFibonacciNth(1); // Output: 0
getFibonacciNth(2); // Output: 1
getFibonacciNth(5); // Output: 3
getFibonacciNth(10); // Output: 34

export const getFibonacciNth = (n) => {
  if (n === 1) {
    return 0;
  } else if (n === 2) {
    return 1;
  } else {
    const result = [0, 1];
    for (let i = 2; i < n; i++) {
      const nextNumber = result[i - 1] + result[i - 2];
      result.push(nextNumber);
    }
    return result[result.length - 1];
  }
};

let fibonacci = (num) => {
  //initalize
  let a = 0;
  let b = 1;

  //to store the sum
  let c = 0;

  //iterate till the given num
  for (let i = 2; i <= num; i++) {
    //sum of last two numbers
    c = a + b;

    //assign the last value to first
    a = b;

    //assign the sum to the last
    b = c;
  }

  //if the num is 0 then return a else return b;
  return num ? b : a;
};

let fibonacci = (num) => {
  if (num < 2) {
    return num;
  }

  return fibonacci(num - 1) + fibonacci(num - 2);
};

let fibonacci = (num) => {
  return num < 2 ? num : fibonacci(num - 1) + fibonacci(num - 2);
};


/***************************************** */

// TIME: O(2^n)
const nthFibonacci = (n) => {
  if (n === 1) {
    return 0;
  }
  if (n === 2) {
    return 1;
  }
  return nthFibonacci(n - 1) + nthFibonacci(n - 2);
};

console.log(nthFibonacci(10));


/****************************** */
// TIME: O(n)
const nthFibonacci = (n) => {
  let first = 0;
  let second = 1;

  let sum = first + second;
  for (let i = 2; i < n; i++) {
    sum = first + second;
    first = second;
    second = sum;
  }
  return sum;
};

console.log(nthFibonacci(10));
