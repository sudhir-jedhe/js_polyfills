Run JavaScript promises in series

JavaScript promises are asynchronous, meaning that they are executed in parallel. This is great for performance, but sometimes you need to execute promises one after another (sequentially). This can be easily accomplished by chaining promises together, using Array.prototype.reduce(). Each promise in the chain returns the next promise when resolved, using Promise.prototype.then().

const runPromisesInSeries = ps =>
  ps.reduce((p, next) => p.then(next), Promise.resolve());

const delay = d => new Promise(r => setTimeout(r, d));
runPromisesInSeries([() => delay(1000), () => delay(2000)]);
// Executes each promise sequentially, taking a total of 3 seconds to complete