// numEquivDominoPairs.js
export function numEquivDominoPairs(dominoes) {
  const countMap = new Map();
  let pairs = 0;

  for (const domino of dominoes) {
    // Sort the domino so that [1, 2] and [2, 1] are considered equivalent
    const key =
      domino[0] < domino[1]
        ? `${domino[0]}:${domino[1]}`
        : `${domino[1]}:${domino[0]}`;

    // Increment the count of equivalent dominoes
    countMap.set(key, (countMap.get(key) || 0) + 1);
  }

  // Calculate the number of equivalent pairs
  for (const count of countMap.values()) {
    pairs += (count * (count - 1)) / 2;
  }

  return pairs;
}

// main.js
import { numEquivDominoPairs } from "./numEquivDominoPairs.js";

const dominoes = [
  [1, 2],
  [2, 1],
  [3, 4],
  [5, 6],
];
console.log(numEquivDominoPairs(dominoes)); // Output: 1

// In this lab, you will build a function that calculates the number of
// equivalent domino pairs. A pair of dominoes dominoes[i] = [a, b] is
// equivalent to dominoes[j] = [c, d] if and only if either (a == c and b == d)
// or (a == d and b == c). In other words, one domino can be rotated to be equal
// to another domino.

const dominoes = [
    [1, 2],
    [2, 1],
    [3, 4],
    [5, 6],
  ];
  console.log(numEquivDominoPairs(dominoes)); // Output: 1
  Example 2:
  
  const dominoes = [
    [1, 2],
    [1, 2],
    [1, 1],
    [1, 2],
    [2, 2],
  ];
  console.log(numEquivDominoPairs(dominoes)); // Output: 3

// Your task is to create a function numEquivDominoPairs that takes an array of
// dominoes as input and returns the number of equivalent pairs (i, j) for which
// 0 <= i < j < dominoes.length and dominoes[i] is equivalent to dominoes[j].
