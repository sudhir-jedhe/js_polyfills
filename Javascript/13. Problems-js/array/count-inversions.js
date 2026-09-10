/**
 * Count inversions in an array.
 *
 * An inversion is a pair i < j with arr[i] > arr[j] — a measure of how far
 * the array is from sorted. Merge sort counts them in O(n log n); the
 * "inversions of size three" variant counts triples i < j < k with
 * arr[i] > arr[j] > arr[k].
 */

/** Merge-sort based inversion count — O(n log n). */
function countInversions(arr) {
  const working = [...arr];
  const temp = new Array(working.length);

  function sortAndCount(lo, hi) {
    if (hi - lo < 2) return 0;

    const mid = (lo + hi) >> 1;
    let count = sortAndCount(lo, mid) + sortAndCount(mid, hi);

    let i = lo;
    let j = mid;
    let k = lo;

    while (i < mid && j < hi) {
      if (working[i] <= working[j]) temp[k++] = working[i++];
      else {
        // working[i..mid) are all greater than working[j].
        count += mid - i;
        temp[k++] = working[j++];
      }
    }

    while (i < mid) temp[k++] = working[i++];
    while (j < hi) temp[k++] = working[j++];
    for (let x = lo; x < hi; x++) working[x] = temp[x];

    return count;
  }

  return sortAndCount(0, working.length);
}

/** Brute force — O(n^2), useful for verifying the merge version. */
function countInversionsBrute(arr) {
  let count = 0;

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) count++;
    }
  }

  return count;
}

/**
 * Inversions of size THREE: triples i < j < k with arr[i] > arr[j] > arr[k].
 * For each middle index j, count larger values before it and smaller values
 * after it, then multiply.
 *
 * Time  O(n^2)
 */
function countInversionsOfSizeThree(arr) {
  const n = arr.length;
  let total = 0;

  for (let j = 1; j < n - 1; j++) {
    let largerBefore = 0;
    let smallerAfter = 0;

    for (let i = 0; i < j; i++) if (arr[i] > arr[j]) largerBefore++;
    for (let k = j + 1; k < n; k++) if (arr[k] < arr[j]) smallerAfter++;

    total += largerBefore * smallerAfter;
  }

  return total;
}

/** The inversion pairs themselves. */
function findInversions(arr) {
  const out = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) out.push([i, j]);
    }
  }

  return out;
}

/** Minimum adjacent swaps to sort — exactly the inversion count. */
const minAdjacentSwapsToSort = (arr) => countInversions(arr);

// ---- Examples ----
console.log(countInversions([8, 4, 2, 1]));            // 6
console.log(countInversionsBrute([8, 4, 2, 1]));       // 6
console.log(countInversions([1, 2, 3]));               // 0
console.log(countInversionsOfSizeThree([8, 4, 2, 1])); // 4
console.log(countInversionsOfSizeThree([9, 6, 4, 5, 8])); // 2
console.log(findInversions([3, 1, 2]));                // [[0,1],[0,2]]
console.log(minAdjacentSwapsToSort([2, 1, 3]));        // 1

module.exports = { countInversions, countInversionsBrute, countInversionsOfSizeThree, findInversions, minAdjacentSwapsToSort };
