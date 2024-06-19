// Ever wanted to create an artificial pause in your JavaScript code? Did you incidentally need it to be a Promise instead of a simple setTimeout()? Well, you're in luck, because it's quite easy to create a promise that resolves after a given amount of time.

// All you have to do is create a new promise using the Promise() constructor, and then use setTimeout() to call the promise's resolve function with the passed value after the specified delay.

const resolveAfter = (value, delay) =>
  new Promise(resolve => {
    setTimeout(() => resolve(value, delay));
  });

resolveAfter('Hello', 1000);
// Returns a promise that resolves to 'Hello' after 1s