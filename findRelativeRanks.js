export function findRelativeRanks(score) {
  // Copy and sort the score array in descending order
  const sortedScore = [...score].sort((a, b) => b - a);

  // Define ranks
  const ranks = ["Gold Medal", "Silver Medal", "Bronze Medal"];

  // Initialize the result array
  const result = new Array(score.length);

  // Assign ranks based on sorted score
  for (let i = 0; i < score.length; i++) {
    const rankIndex = sortedScore.indexOf(score[i]);
    if (rankIndex < 3) {
      result[i] = ranks[rankIndex];
    } else {
      result[i] = (rankIndex + 1).toString();
    }
  }

  return result;
}

import { findRelativeRanks } from "./findRelativeRanks.js";

const score = [5, 4, 3, 2, 1];
console.log(findRelativeRanks(score)); // Output: ["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"]

// Example 1:

// Input: score = [5, 4, 3, 2, 1] Output: ["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"] Explanation: The placements are [1st, 2nd, 3rd, 4th, 5th].

// Example 2:

// Input: score = [10, 3, 8, 9, 4] Output: ["Gold Medal", "5", "Bronze Medal", "Silver Medal", "4"] Explanation: The placements are [1st, 5th, 3rd, 2nd, 4th].

// Example 3:

// Input: score = [50, 40, 30, 20, 10] Output: ["Gold Medal", "Silver Medal", "Bronze Medal", "4", "5"] Explanation: The placements are [1st, 2nd, 3rd, 4th, 5th].
