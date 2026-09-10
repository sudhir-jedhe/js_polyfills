/**
 * async/await with a forEach loop.
 *
 * `Array.prototype.forEach` ignores the promise returned by an async
 * callback, so the loop finishes immediately and nothing is awaited.
 * This file shows the trap and the three correct alternatives.
 */

const delay = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** BROKEN: forEach does not await. "done" prints before any item. */
async function withForEach(items) {
  const out = [];
  items.forEach(async (n) => {
    out.push(await delay(10, n * 2));
  });
  return out; // always [] — the callbacks are still pending
}

/** Sequential: each iteration awaits the previous one. */
async function sequential(items) {
  const out = [];
  for (const n of items) {
    out.push(await delay(10, n * 2));
  }
  return out;
}

/** Parallel: start everything, then await all of it. */
async function parallel(items) {
  return Promise.all(items.map((n) => delay(10, n * 2)));
}

/** An async forEach helper, if you really want the forEach shape. */
async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}

// ---- Examples ----
(async () => {
  console.log('forEach   ->', await withForEach([1, 2, 3])); // []
  console.log('sequential->', await sequential([1, 2, 3]));  // [2, 4, 6]
  console.log('parallel  ->', await parallel([1, 2, 3]));    // [2, 4, 6]

  const collected = [];
  await asyncForEach([1, 2, 3], async (n) => {
    collected.push(await delay(10, n * 2));
  });
  console.log('asyncForEach ->', collected); // [2, 4, 6]
})();

module.exports = { withForEach, sequential, parallel, asyncForEach };
