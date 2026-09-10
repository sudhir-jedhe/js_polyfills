/**
 * Iterate over a callback n times.
 *
 * The `times` helper, plus its async and lazy relatives.
 */

/** Call fn n times with the index, collecting the results. */
const times = (n, fn) => Array.from({ length: Math.max(0, n) }, (_, i) => fn(i));

/** Same, but discards the results — a plain loop. */
function repeat(n, fn) {
  for (let i = 0; i < n; i++) fn(i);
}

/** Lazy: a generator that yields each result on demand. */
function* timesLazy(n, fn) {
  for (let i = 0; i < n; i++) yield fn(i);
}

/** Sequential async: each iteration awaits the previous one. */
async function timesAsync(n, fn) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(await fn(i));
  return out;
}

/** Parallel async: all iterations start at once. */
const timesAsyncParallel = (n, fn) => Promise.all(times(n, fn));

/**
 * Retry a function up to n times with exponential backoff — the most
 * common real use of "do this n times".
 */
async function retry(fn, attempts = 3, baseDelayMs = 100) {
  let lastError;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * 2 ** attempt));
      }
    }
  }

  throw lastError;
}

/** Number.prototype extension, the "make 5..times(fn) work" version. */
function installTimes() {
  Object.defineProperty(Number.prototype, 'times', {
    value(fn) {
      return times(Number(this), fn);
    },
    writable: true,
    configurable: true,
  });
}

// ---- Examples ----
console.log(times(3, (i) => i * 2));        // [0, 2, 4]
console.log(times(3, () => 'x'));           // ['x', 'x', 'x']
console.log(times(0, (i) => i));            // []

repeat(3, (i) => process.stdout.write(`${i} `));
console.log();

console.log([...timesLazy(3, (i) => i ** 2)]); // [0, 1, 4]

installTimes();
console.log((4).times((i) => i));           // [0, 1, 2, 3]

timesAsyncParallel(3, async (i) => i * 10).then(console.log); // [0, 10, 20]

module.exports = { times, repeat, timesLazy, timesAsync, timesAsyncParallel, retry, installTimes };
