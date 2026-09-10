/**
 * Two Sum — problem statement and a small test harness.
 *
 * Problem
 * -------
 * Given an array of integers `nums` and an integer `target`, return the
 * INDICES of the two numbers such that they add up to `target`.
 *
 * You may assume that each input has exactly one solution, and you may not
 * use the same element twice. The answer may be returned in any order.
 *
 * Constraints
 * -----------
 *   2 <= nums.length <= 10^4
 *   -10^9 <= nums[i] <= 10^9
 *   -10^9 <= target <= 10^9
 *   Exactly one valid answer exists.
 *
 * Follow-up: can you do it in better than O(n^2) time?
 *
 * Approach
 * --------
 * Walk the array once, keeping a map from value -> index. At each element,
 * the complement (target - value) either has already been seen — in which
 * case you have the answer — or it is recorded for a later element to find.
 *
 * Time  O(n)  — one pass, O(1) map operations
 * Space O(n)  — the map holds at most n entries
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @returns {[number, number] | []}
 */
function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) return [seen.get(complement), i];
    seen.set(nums[i], i);
  }

  return [];
}

/** Test cases from the problem statement, plus the edge cases. */
const TEST_CASES = [
  { nums: [2, 7, 11, 15], target: 9, expected: [0, 1] },
  { nums: [3, 2, 4], target: 6, expected: [1, 2] },
  { nums: [3, 3], target: 6, expected: [0, 1] },
  { nums: [-1, -2, -3, -4, -5], target: -8, expected: [2, 4] },
  { nums: [0, 4, 3, 0], target: 0, expected: [0, 3] },
];

/** Run the cases and report pass/fail. */
function runTests(solution = twoSum) {
  const results = TEST_CASES.map(({ nums, target, expected }) => {
    const actual = solution(nums, target);
    const pass =
      actual.length === expected.length &&
      actual.slice().sort().join() === expected.slice().sort().join();

    return { nums, target, expected, actual, pass };
  });

  const passed = results.filter((r) => r.pass).length;
  return { passed, total: results.length, results };
}

// ---- Examples ----
const report = runTests();
console.log(`${report.passed}/${report.total} passed`);

for (const { nums, target, expected, actual, pass } of report.results) {
  console.log(`${pass ? 'PASS' : 'FAIL'} twoSum(${JSON.stringify(nums)}, ${target}) -> ${JSON.stringify(actual)} (expected ${JSON.stringify(expected)})`);
}

module.exports = { twoSum, TEST_CASES, runTests };
