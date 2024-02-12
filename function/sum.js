function sum(...numbers) {
  // If no numbers are passed in, return 0.
  if (numbers.length === 0) {
    return 0;
  }

  // Otherwise, add up all the numbers and return the sum.
  let total = 0;
  for (const number of numbers) {
    total += number;
  }
  return total;
}

// Example usage:
const sumOfNumbers = sum(1, 2, 3, 4, 5);
console.log(sumOfNumbers); // 15

// The function can also be called repeatedly to add more numbers to the sum.
const sumOfMoreNumbers = sumOfNumbers + sum(6, 7, 8, 9, 10);
console.log(sumOfMoreNumbers); // 55

// Implement a js function that sums numbers by accepting a number and allows
// for repeated calling with more numbers until it is not called with any number

var n = 5678;
sum = n % 9 || 9;

console.log(sum);
function getOneDigit(nr) {
  let asStr = nr.toString();
  let sum = asStr.split("").reduce((a, c) => {
    a += parseInt(c);
    return a;
  }, 0);
  return sum >= 10 ? getOneDigit(sum) : sum;
}

[234235, 235346, 657234, 1, 2, 5423].forEach((nr) =>
  console.log(getOneDigit(nr))
);

/************************************* */

// const sum1 = sum(1)
// sum1(2) == 3 // true
// sum1(3) == 4 // true
// sum(1)(2)(3) == 6 // true
// sum(5)(-1)(2) == 6 // true

/**
 * @param {number} num
 */
function sum(num) {
  const func = function (num2) {
    // #4
    return num2 ? sum(num + num2) : num; // #3
  };

  func.valueOf = () => num; // #2
  return func; // #1
}

/*** ==== Explanation  ====

We know that `sum(1)(2)` can be done by returning a function from a function. Example:


function sum(num) {
  return function(num2) {
    return num+num2;
  }
}


but we can have `sum(1)(2)....(n)` up to `n`.

How do we solve such problems? We first see a pattern, the pattern is that we need to return function `n` times.
When we see a pattern then we can write concise code using recursion. <br />

So I solved this problem using recursion. But before that let's demystify these 8 lines of code. <br />

#1: Why do we need to use `func` variable, why can't we just directly return `function(num2)...` (#4)? <br />

Because we are comparing non-primitive (Object, functions are Objects in JS) value against a primitive value (Number). <br />
`sum(1)(2)(3) == 6`

When we do such comparisons then JS has to do "type coercion". How does JS do this?

It has `valueOf` and `toString` to do that. Essentially, one of them will be called. 
What we do here is that we override that method and tell the JS engine to return our custom value (which is `num`) in our case.
That's why we needed to store #4 in a variable so that we can override the `valueOf` method.

#2: Okay, I get it that you wanted to use the `valueOf` method, but why do you on this beautiful earth want to do that? 
Because if `sum(1)(2)` will return us another function and we can't compare below -

`function(num2) { return num2 ? sum(num+num2) : num }  == 3`

So what we do is we tell the JS engine to use our `valueOf` method to return value, which is 'num'.
So we can now compare `3 == 3`

#3: Okay, then why do we have ternary on #3?
Because in case you want to use call `sum` function normally and get value out of it.
`sum(1)(2)()` will return 3

***/

//check for undefined ? Otherwise this test case fails -> sum(1)(0)(3).
function sum(num) {
  const func = function (num2) {
    // #4
    return num2 !== undefined ? sum(num + num2) : num; // #3
  };

  func.valueOf = () => num; // #2
  return func; // #1
}

/*********************** */
/**
 * @param {number} num
 */
function sum(a) {
  const fn = (b) => sum(a + b);
  fn[Symbol.toPrimitive] = () => a;
  return fn;
}

function sum(num) {
  const res = (num2) => sum(num + num2);
  res[Symbol.toPrimitive] = (hint) =>
    hint === "string" ? num.toString() : num;
  return res;
}
