export function checkDistances(s, distance) {
  const indices = new Array(26).fill(-1).map(() => []);

  // Record indices of each character
  for (let i = 0; i < s.length; i++) {
    const index = s.charCodeAt(i) - 97; // Get character index (0-25)
    indices[index].push(i);
  }

  // Check distances between pairs of identical characters
  for (let i = 0; i < 26; i++) {
    const idxList = indices[i];
    if (idxList.length !== 2) {
      return false; // Characters should appear exactly twice
    }
    const [idx1, idx2] = idxList;
    const calculatedDistance = Math.abs(idx2 - idx1);
    if (calculatedDistance !== distance[i]) {
      return false; // Distance doesn't match
    }
  }

  return true; // All distances match
}

import { checkDistances } from "./checkDistances.js";

const s = "abcdeedcba";
const distance = [
  1, 3, 1, 4, 2, 2, 2, 1, 3, 1, 2, 3, 3, 3, 4, 4, 1, 1, 2, 1, 3, 2, 3, 3, 4, 4,
];
console.log(checkDistances(s, distance)); // Output: true

// Example 1:

// const s = "abaccb"; const distance = [1, 3, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; checkDistances(s, distance);  //
// Output: true Explanation:

// 'a' appears at indices 0 and 2 so it satisfies distance[0] = 1. 'b' appears
// at indices 1 and 5 so it satisfies distance[1] = 3. 'c' appears at indices 3
// and 4 so it satisfies distance[2] = 0. Note that distance[3] = 5, but since
// 'd' does not appear in s, it can be ignored. Return true because s is a
// well-spaced string. Example 2:

// const s = "aa"; const distance = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
// 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; checkDistances(s, distance);  // Output:
// false Explanation:

// 'a' appears at indices 0 and 1 so there are zero letters between them.
// Because distance[0] = 1, s is not a well-spaced string.
