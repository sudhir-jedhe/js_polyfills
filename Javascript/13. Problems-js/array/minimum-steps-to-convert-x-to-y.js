/**
 * Minimum steps to convert X to Y by repeated multiplication and division.
 *
 * Allowed moves are multiply by 2 and subtract 1 (the classic form), or a
 * given set of multipliers/divisors. BFS over the reachable values finds
 * the shortest path, because every move costs the same.
 *
 * Time  O(states)
 */

/**
 * Classic: from x you may double or subtract one (LeetCode 991 in reverse).
 * Working BACKWARDS from y is far faster: halve when even, otherwise add 1.
 */
function minStepsDoubleOrDecrement(x, y) {
  let steps = 0;
  let current = y;

  while (current > x) {
    // Undo the moves: halving undoes a doubling, +1 undoes a -1.
    current = current % 2 === 0 ? current / 2 : current + 1;
    steps++;
  }

  return steps + (x - current); // any remaining gap needs -1 moves
}

/**
 * BFS with an arbitrary move set, bounded by a maximum value.
 * @param {number} x
 * @param {number} y
 * @param {Array<(n:number) => number>} moves
 * @param {number} [limit]
 */
function minStepsBFS(x, y, moves, limit = 10000) {
  if (x === y) return { steps: 0, path: [x] };

  const seen = new Set([x]);
  let frontier = [{ value: x, path: [x] }];
  let steps = 0;

  while (frontier.length && steps < limit) {
    steps++;
    const next = [];

    for (const { value, path } of frontier) {
      for (const move of moves) {
        const candidate = move(value);

        if (!Number.isInteger(candidate) || candidate <= 0 || candidate > limit) continue;
        if (seen.has(candidate)) continue;

        if (candidate === y) return { steps, path: [...path, candidate] };

        seen.add(candidate);
        next.push({ value: candidate, path: [...path, candidate] });
      }
    }

    frontier = next;
  }

  return { steps: -1, path: [] };
}

/** Multiply by 2 or 3, subtract 1 — a common variant. */
const minStepsMulDiv = (x, y) =>
  minStepsBFS(x, y, [(n) => n * 2, (n) => n * 3, (n) => n - 1]).steps;

/** Only multiplications: is y reachable from x at all, and in how many steps? */
function minStepsMultiplyOnly(x, y, factors = [2, 3]) {
  if (y % x !== 0) return -1;

  let ratio = y / x;
  let steps = 0;

  // Greedily strip the largest factors first.
  for (const factor of [...factors].sort((a, b) => b - a)) {
    while (ratio % factor === 0) {
      ratio /= factor;
      steps++;
    }
  }

  return ratio === 1 ? steps : -1;
}

// ---- Examples ----
console.log(minStepsDoubleOrDecrement(2, 3));  // 2  (2 -> 4 -> 3)
console.log(minStepsDoubleOrDecrement(5, 8));  // 2  (5 -> 4 -> 8)
console.log(minStepsBFS(2, 9, [(n) => n * 2, (n) => n - 1]));
console.log(minStepsMulDiv(2, 9));             // 2  (2*... path)
console.log(minStepsMultiplyOnly(3, 24));      // 3  (3*2*2*2)
console.log(minStepsMultiplyOnly(3, 25));      // -1

module.exports = { minStepsDoubleOrDecrement, minStepsBFS, minStepsMulDiv, minStepsMultiplyOnly };
