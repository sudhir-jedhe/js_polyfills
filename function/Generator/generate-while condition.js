// Almost every generator function needs a termination condition. Instead of writing the same code over and over again, we can easily create a generator function that takes a predicate function as an argument and keeps producing new values as long as the condition is met.

// Given a condition, we can initialize the current value using a provided seed value. Then, using a while loop we can iterate as long as the predicate function called with the current val returns true.

// Inside the loop, we can use yield to return the current val and optionally receive a new seed value, nextSeed. Finally, we can use the next function to calculate the next value from the current val and the nextSeed.

const generateWhile = function* (seed, predicate, next) {
    let val = seed;
    let nextSeed = null;
    while (predicate(val)) {
      nextSeed = yield val;
      val = next(val, nextSeed);
    }
    return val;
  };
  
  [...generateWhile(1, v => v <= 5, v => ++v)]; // [1, 2, 3, 4, 5]