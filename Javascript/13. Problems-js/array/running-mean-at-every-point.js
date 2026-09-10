/**
 * Find the mean at every point in an array (running / cumulative average).
 *
 * Keeping a running sum makes it O(n); recomputing the average at each
 * step would be O(n^2).
 */

/** Cumulative mean after each element. */
function runningMean(arr) {
  const out = [];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    out.push(sum / (i + 1));
  }

  return out;
}

/**
 * Incremental update form: mean_n = mean_{n-1} + (x - mean_{n-1}) / n.
 * Numerically more stable than dividing a large running sum.
 */
function runningMeanIncremental(arr) {
  const out = [];
  let mean = 0;

  for (let i = 0; i < arr.length; i++) {
    mean += (arr[i] - mean) / (i + 1);
    out.push(mean);
  }

  return out;
}

/** Moving average over a fixed window — a sliding sum, O(n). */
function movingAverage(arr, window) {
  if (window <= 0 || window > arr.length) return [];

  const out = [];
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
    if (i >= window) sum -= arr[i - window];
    if (i >= window - 1) out.push(sum / window);
  }

  return out;
}

/** Exponential moving average — recent values weigh more. */
function exponentialMovingAverage(arr, alpha = 0.3) {
  const out = [];
  let ema = arr[0];

  for (const value of arr) {
    ema = alpha * value + (1 - alpha) * ema;
    out.push(ema);
  }

  return out;
}

/** Cumulative sum, the building block. */
const runningSum = (arr) => {
  let sum = 0;
  return arr.map((n) => (sum += n));
};

/** Streaming class — feed values one at a time. */
class RunningStats {
  #count = 0;
  #mean = 0;
  #m2 = 0; // Welford's algorithm, for a stable variance

  add(value) {
    this.#count++;
    const delta = value - this.#mean;
    this.#mean += delta / this.#count;
    this.#m2 += delta * (value - this.#mean);
    return this;
  }

  get mean() {
    return this.#mean;
  }
  get variance() {
    return this.#count > 1 ? this.#m2 / (this.#count - 1) : 0;
  }
  get stdDev() {
    return Math.sqrt(this.variance);
  }
  get count() {
    return this.#count;
  }
}

// ---- Examples ----
console.log(runningMean([1, 2, 3, 4]));            // [1, 1.5, 2, 2.5]
console.log(runningMeanIncremental([1, 2, 3, 4])); // [1, 1.5, 2, 2.5]
console.log(movingAverage([1, 2, 3, 4, 5], 3));    // [2, 3, 4]
console.log(exponentialMovingAverage([1, 2, 3]).map((n) => Number(n.toFixed(3))));
console.log(runningSum([1, 2, 3, 4]));             // [1, 3, 6, 10]

const stats = new RunningStats();
[2, 4, 4, 4, 5, 5, 7, 9].forEach((n) => stats.add(n));
console.log(stats.mean, Number(stats.stdDev.toFixed(3))); // 5 2.138

module.exports = { runningMean, runningMeanIncremental, movingAverage, exponentialMovingAverage, runningSum, RunningStats };
