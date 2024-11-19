// Often during the development or testing, when the Rest APIs are not available, we can create and make use of a mock server that will return the random response at the random latency (delay) and will fail also at random.

// To create the mock server we will create a function from a closure with random results and then return a promise from the function.

// This promise will have a setTimeout function that will run for a random duration showcasing there is a delay in the API response and we will reject or resolve the promise based on random the values.


// Derive the randomness
// This function will take a count and will return a boolean value true or false randomly.

// function getRandomBool(n) {
//   const threshold = 1000;
//   if (n > threshold) n = threshold;
//   return Math.floor(Math.random() * threshold) % n === 0;
// }
// Copy
// Using this we can derive if the promise will resolve or reject.

// Mock server with random delay and result
// We will have failure count and latency value that will help to derive the randomness of failure and the delay in the mock server.


const FAILURE_COUNT = 10;
const LATENCY = 200;

function mockServer() {
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve();
      }
    }, randomTimeout);
  });
}



Using the mock-server as auto-suggestion
Let us say we are creating a search function, that will return the auto-suggestion list for the text passed to with the prefix and postfix values.

We can create a mock server for the auto-suggestion by taking the text as input and then pushing random values in the results list and resolving the promise with this result.


const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  let pre = 'pre';
  let post = 'post';
  let results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}