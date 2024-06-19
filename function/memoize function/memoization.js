// Memoization is a functional programming technique which attempts to increase a function’s performance by caching its previously computed results. Each time a memoized function is called, its parameters are used to index the cache. If the data is present, then it can be returned, without executing the entire function. Otherwise the function is executed and then the result is added to the cache.

const memoizAddition = () => {
  let cache = {};
  return (value) => {
    if (value in cache) {
      console.log("Fetching from cache");
      return cache[value]; // Here, cache.value cannot be used as property name starts with the number which is not a valid JavaScript  identifier. Hence, can only be accessed using the square bracket notation.
    } else {
      console.log("Calculating result");
      let result = value + 20;
      cache[value] = result;
      return result;
    }
  };
};
// returned function from memoizAddition
const addition = memoizAddition();
console.log(addition(20)); //output: 40 calculated
console.log(addition(20)); //output: 40 cached


const memoize = fn => {
  const cache = new Map();
  const cached = function (val) {
    return cache.has(val)
      ? cache.get(val)
      : cache.set(val, fn.call(this, val)) && cache.get(val);
  };
  cached.cache = cache;
  return cached;
};

// This function is slow and will benefit from memoization
const anagrams = str => {
  if (str.length <= 2) return str.length === 2 ? [str, str[1] + str[0]] : [str];
  return str
    .split('')
    .reduce(
      (acc, letter, i) =>
        acc.concat(
          anagrams(str.slice(0, i) + str.slice(i + 1)).map(val => letter + val)
        ),
      []
    );
};

const anagramsCached = memoize(anagrams);

anagramsCached('javascript');
// takes a long time
anagramsCached('javascript');
// returns virtually instantly since it's cached


// Using a Proxy object for memoization
// While the previous example is a good way to implement memoization, JavaScript's Proxy object provides an interesting alternative via the use of the handler.apply() trap.

// Using the trap, we can intercept the function call and check if the result is already cached. If it is, we return the cached result. If it's not, we call the original function and cache the result before returning it.
const memoize = fn => new Proxy(fn, {
  cache: new Map(),
  apply (target, thisArg, argsList) {
    let cacheKey = argsList.toString();
    if(!this.cache.has(cacheKey))
      this.cache.set(cacheKey, target.apply(thisArg, argsList));
    return this.cache.get(cacheKey);
  }
});

const fibonacci = n => (n <= 1 ? 1 : fibonacci(n - 1) + fibonacci(n - 2));
const memoizedFibonacci = memoize(fibonacci);

for (let i = 0; i < 100; i ++)
  fibonacci(30);                      // ~5000ms
for (let i = 0; i < 100; i ++)
  memoizedFibonacci(30);              // ~50ms
