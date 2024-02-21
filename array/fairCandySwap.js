export function fairCandySwap(aliceSizes, bobSizes) {
  const aliceTotal = aliceSizes.reduce((acc, curr) => acc + curr, 0);
  const bobTotal = bobSizes.reduce((acc, curr) => acc + curr, 0);
  const diff = (aliceTotal - bobTotal) / 2;

  const bobSet = new Set(bobSizes);

  for (const size of aliceSizes) {
    const bobSize = size - diff;
    if (bobSet.has(bobSize)) {
      return [size, bobSize];
    }
  }
}

import { fairCandySwap } from "./fairCandySwap.js";

const aliceSizes = [1, 1];
const bobSizes = [2, 2];
console.log(fairCandySwap(aliceSizes, bobSizes)); // Output: [1, 2]

// you will be solving a problem related to Alice and Bob's fair candy swap. The main objective is to implement a function fairCandySwap that takes two integer arrays, aliceSizes and bobSizes, representing the number of candies in each box that Alice and Bob have, respectively. Your task is to find an integer array answer where answer[0] corresponds to the number of candies in the box that Alice must exchange, and answer[1] denotes the number of candies in the box that Bob must exchange. After the exchange, both Alice and Bob should have the same total amount of candy. You can assume that at least one valid answer exists for the given input.

// Here's a more detailed description of the problem:

// Alice and Bob have a different total number of candies.
// You are given two integer arrays: aliceSizes is an array where aliceSizes[i]
// is the number of candies of the ith box of candy that Alice has. bobSizes is
// an array where bobSizes[j] is the number of candies of the jth box of candy
// that Bob has. They want to exchange one candy box each so that after the
// exchange, they both have the same total amount of candy. The total amount of
// candy a person has is the sum of the number of candies in each box they have.
// Find an integer array answer where answer[0] is the number of candies in the
// box that Alice must exchange, and answer[1] is the number of candies in the
// box that Bob must exchange. If multiple answers exist, you can return any one
// of them.
// Example:
// Input: aliceSizes = [1, 1], bobSizes = [2, 2] Output: [1, 2]

// Input: aliceSizes = [1, 2], bobSizes = [2, 3] Output: [1, 2] or [2, 3]

// Input: aliceSizes = [2], bobSizes = [1, 3] Output: [2, 3]
