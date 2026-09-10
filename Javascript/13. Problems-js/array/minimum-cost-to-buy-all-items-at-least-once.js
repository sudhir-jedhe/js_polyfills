/**
 * Minimum cost to buy all items at least once.
 *
 * Items come in bundles or with per-item prices, and every item must be
 * obtained at least once. Two useful shapes:
 *   - each item has independent options: take the cheapest per item
 *   - bundles cover sets of items: a set-cover DP over bitmasks
 */

/** Independent options: pick the cheapest price for each item. */
function minCostPerItem(items) {
  let total = 0;
  const chosen = {};

  for (const [item, prices] of Object.entries(items)) {
    const best = Math.min(...prices);
    total += best;
    chosen[item] = best;
  }

  return { total, chosen };
}

/**
 * Bundle version — weighted set cover, solved exactly with a bitmask DP.
 * Time  O(2^n * bundles)
 *
 * @param {string[]} itemNames
 * @param {Array<{items: string[], cost: number}>} bundles
 */
function minCostWithBundles(itemNames, bundles) {
  const n = itemNames.length;
  const index = new Map(itemNames.map((name, i) => [name, i]));
  const full = (1 << n) - 1;

  // Precompute each bundle's coverage mask.
  const masks = bundles.map((bundle) => ({
    cost: bundle.cost,
    mask: bundle.items.reduce((m, item) => m | (1 << index.get(item)), 0),
    bundle,
  }));

  const best = new Array(full + 1).fill(Infinity);
  const choice = new Array(full + 1).fill(null);
  best[0] = 0;

  for (let covered = 0; covered <= full; covered++) {
    if (best[covered] === Infinity) continue;

    for (const { cost, mask, bundle } of masks) {
      const next = covered | mask;
      if (best[covered] + cost < best[next]) {
        best[next] = best[covered] + cost;
        choice[next] = { from: covered, bundle };
      }
    }
  }

  // Walk the choices back to list the bundles used.
  const used = [];
  for (let state = full; state > 0; ) {
    const step = choice[state];
    if (!step) break;
    used.unshift(step.bundle);
    state = step.from;
  }

  return { total: best[full], bundles: used };
}

/** Greedy set cover — not optimal, but O(n log n) and a good baseline. */
function greedySetCover(itemNames, bundles) {
  const remaining = new Set(itemNames);
  const used = [];
  let total = 0;

  while (remaining.size) {
    let bestBundle = null;
    let bestRatio = Infinity;

    for (const bundle of bundles) {
      const newItems = bundle.items.filter((item) => remaining.has(item)).length;
      if (newItems === 0) continue;

      const ratio = bundle.cost / newItems;
      if (ratio < bestRatio) {
        bestRatio = ratio;
        bestBundle = bundle;
      }
    }

    if (!bestBundle) break; // some items are uncoverable

    used.push(bestBundle);
    total += bestBundle.cost;
    for (const item of bestBundle.items) remaining.delete(item);
  }

  return { total, bundles: used, uncovered: [...remaining] };
}

// ---- Examples ----
console.log(minCostPerItem({ apple: [3, 2, 5], bread: [4, 4], milk: [7, 6] }));
// { total: 12, chosen: { apple: 2, bread: 4, milk: 6 } }

const items = ['a', 'b', 'c'];
const bundles = [
  { items: ['a', 'b'], cost: 5 },
  { items: ['b', 'c'], cost: 4 },
  { items: ['a'], cost: 3 },
  { items: ['c'], cost: 3 },
];

console.log(minCostWithBundles(items, bundles)); // optimal combination
console.log(greedySetCover(items, bundles));     // greedy approximation

module.exports = { minCostPerItem, minCostWithBundles, greedySetCover };
