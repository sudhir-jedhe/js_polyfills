/**
 * K Nearest Neighbors (KNN).
 *
 * Find the k training points closest to a query point, then vote
 * (classification) or average (regression).
 *
 * Time  O(n * d + n log n) with a full sort; a heap makes it O(n log k).
 */

/** Euclidean distance between two vectors. */
const euclidean = (a, b) => Math.sqrt(a.reduce((sum, v, i) => sum + (v - b[i]) ** 2, 0));

/** Manhattan distance — often better for high-dimensional data. */
const manhattan = (a, b) => a.reduce((sum, v, i) => sum + Math.abs(v - b[i]), 0);

/** Cosine distance: 1 - cosine similarity. */
function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return 1 - dot / (magA * magB);
}

/**
 * The k nearest points to `query`.
 * @param {Array<{point: number[], label?: *, value?: number}>} data
 * @param {number[]} query
 * @param {number} k
 * @param {(a:number[], b:number[]) => number} [distance]
 */
function kNearest(data, query, k, distance = euclidean) {
  return data
    .map((item) => ({ ...item, distance: distance(item.point, query) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, k);
}

/** Classification: majority vote among the k neighbours. */
function classify(data, query, k, distance = euclidean) {
  const votes = new Map();

  for (const neighbour of kNearest(data, query, k, distance)) {
    votes.set(neighbour.label, (votes.get(neighbour.label) || 0) + 1);
  }

  return [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

/** Regression: mean of the k neighbours' values. */
function regress(data, query, k, distance = euclidean) {
  const neighbours = kNearest(data, query, k, distance);
  return neighbours.reduce((sum, n) => sum + n.value, 0) / neighbours.length;
}

/** Distance-weighted vote — closer neighbours count for more. */
function classifyWeighted(data, query, k, distance = euclidean) {
  const votes = new Map();

  for (const n of kNearest(data, query, k, distance)) {
    const weight = 1 / (n.distance + 1e-9); // avoid division by zero
    votes.set(n.label, (votes.get(n.label) || 0) + weight);
  }

  return [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
}

// ---- Examples ----
const data = [
  { point: [1, 1], label: 'A', value: 10 },
  { point: [2, 2], label: 'A', value: 12 },
  { point: [8, 8], label: 'B', value: 90 },
  { point: [9, 9], label: 'B', value: 95 },
];

console.log(kNearest(data, [1.5, 1.5], 2).map((n) => n.label)); // ['A', 'A']
console.log(classify(data, [7, 7], 3));            // 'B'
console.log(regress(data, [1, 1], 2));             // 11
console.log(classifyWeighted(data, [2, 2], 3));    // 'A'
console.log(euclidean([0, 0], [3, 4]));            // 5
console.log(manhattan([0, 0], [3, 4]));            // 7

module.exports = { kNearest, classify, regress, classifyWeighted, euclidean, manhattan, cosine };
