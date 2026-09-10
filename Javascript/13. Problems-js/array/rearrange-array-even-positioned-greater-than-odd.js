/**
 * Rearrange an array so that even-positioned elements are greater than
 * odd-positioned ones.
 *
 * A single pass that swaps whenever the local condition is violated is
 * enough — fixing position i never breaks position i-1, because the swap
 * only moves a value that was already too small (or too large) into a slot
 * where it fits.
 *
 * Time  O(n)
 * Space O(1)
 */

/**
 * Wiggle: arr[0] <= arr[1] >= arr[2] <= arr[3] ...
 * Even indexes end up smaller than their odd neighbours.
 */
function wiggleSort(arr) {
  const out = [...arr];

  for (let i = 1; i < out.length; i++) {
    const shouldBeGreater = i % 2 === 1;

    if ((shouldBeGreater && out[i] < out[i - 1]) || (!shouldBeGreater && out[i] > out[i - 1])) {
      [out[i], out[i - 1]] = [out[i - 1], out[i]];
    }
  }

  return out;
}

/**
 * The other convention: EVEN positions greater than their odd neighbours,
 * i.e. arr[0] >= arr[1] <= arr[2] >= arr[3] ...
 */
function evenGreater(arr) {
  const out = [...arr];

  for (let i = 1; i < out.length; i++) {
    const shouldBeSmaller = i % 2 === 1;

    if ((shouldBeSmaller && out[i] > out[i - 1]) || (!shouldBeSmaller && out[i] < out[i - 1])) {
      [out[i], out[i - 1]] = [out[i - 1], out[i]];
    }
  }

  return out;
}

/** Sort-based version — clearer, O(n log n), and gives a strict wiggle. */
function wiggleSortBySorting(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const out = new Array(arr.length);

  const half = Math.ceil(arr.length / 2);
  const small = sorted.slice(0, half);
  const large = sorted.slice(half);

  // Fill from the back of each half to keep equal values apart.
  for (let i = 0, s = small.length - 1, l = large.length - 1; i < out.length; i++) {
    out[i] = i % 2 === 0 ? small[s--] : large[l--];
  }

  return out;
}

/** Verify a wiggle arrangement. */
function isWiggle(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (i % 2 === 1 && arr[i] < arr[i - 1]) return false;
    if (i % 2 === 0 && arr[i] > arr[i - 1]) return false;
  }
  return true;
}

/** Alternate positive and negative numbers. */
function rearrangePositiveNegative(arr) {
  const positives = arr.filter((n) => n >= 0);
  const negatives = arr.filter((n) => n < 0);

  const out = [];
  const max = Math.max(positives.length, negatives.length);

  for (let i = 0; i < max; i++) {
    if (i < positives.length) out.push(positives[i]);
    if (i < negatives.length) out.push(negatives[i]);
  }

  return out;
}

// ---- Examples ----
console.log(wiggleSort([3, 5, 2, 1, 6, 4]));    // 3 <= 5 >= 2 <= 6 >= 1 <= 4
console.log(isWiggle(wiggleSort([3, 5, 2, 1, 6, 4]))); // true
console.log(evenGreater([1, 2, 3, 4, 5]));      // 2 >= 1 <= 4 >= 3 <= 5
console.log(wiggleSortBySorting([1, 5, 1, 1, 6, 4]));
console.log(rearrangePositiveNegative([1, -2, 3, -4, 5])); // [1,-2,3,-4,5]

module.exports = { wiggleSort, evenGreater, wiggleSortBySorting, isWiggle, rearrangePositiveNegative };
