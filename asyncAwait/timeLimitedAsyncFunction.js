// timeLimitedAsyncFunction.js
export async function timeLimitedAsyncFunction(asyncFunc, timeLimit) {
  return new Promise((resolve, reject) => {
    // Set a timeout to reject the promise if it takes more time than the specified time limit
    const timeoutId = setTimeout(() => {
      reject("Time Limit Exceeded");
    }, timeLimit);

    // Execute the async function
    asyncFunc()
      .then((result) => {
        // Clear the timeout and resolve with the result
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        // Clear the timeout and reject with the error
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Example usage
import { timeLimitedAsyncFunction } from "./timeLimitedAsyncFunction.js";

// Define an asynchronous function
async function exampleAsyncFunction() {
  // Simulate a long-running operation
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return "Operation completed";
}

// Use timeLimitedAsyncFunction to set a time limit of 1000 ms for executing exampleAsyncFunction
timeLimitedAsyncFunction(exampleAsyncFunction, 1000)
  .then((result) => console.log(result)) // Output: "Time Limit Exceeded"
  .catch((error) => console.error(error)); // Output: "Time Limit Exceeded"

// Create a lab to implement time-limited asynchronous functions, which allows
// you to set a time limit in milliseconds for the given asynchronous function
// to be executed. If the function takes more time than the specified time
// limit, it should be rejected with the string "Time Limit Exceeded".

// Examples:
// Example 1:

// const timeLimitedFn = timeLimit(async (n) => {
//   await new Promise((res) => setTimeout(res, 100));
//   return n * n;
// }, 50);

// timeLimitedFn(5)
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
// // Output: "Time Limit Exceeded"
// Example 2:

// const timeLimitedFn = timeLimit(async (n) => {
//   await new Promise((res) => setTimeout(res, 100));
//   return n * n;
// }, 150);

// timeLimitedFn(5)
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
// // Output: 25
// Example 3:

// const timeLimitedFn = timeLimit(async (a, b) => {
//   await new Promise((res) => setTimeout(res, 120));
//   return a + b;
// }, 150);

// timeLimitedFn(5, 10)
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
// // Output: 15
// Example 4:

// const timeLimitedFn = timeLimit(async () => {
//   throw "Error";
// }, 1000);

// timeLimitedFn()
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));
// // Output: "Error"
