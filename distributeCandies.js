// distributeCandies.js
export function distributeCandies(candyType) {
  const maxCandies = candyType.length / 2;
  const uniqueCandies = new Set(candyType);

  return Math.min(maxCandies, uniqueCandies.size);
}

// main.js
import { distributeCandies } from "./distributeCandies.js";

const candyType = [1, 1, 2, 2, 3, 3];
console.log(distributeCandies(candyType)); // Output: 3

/************************ */
// In this lab, your task is to help Alice, who has n candies of different
// types, to eat the maximum number of unique types of candies while following
// her doctor's advice to only eat n / 2 candies. You will be implementing a
// function distributeCandies(candyType) which takes an array candyType as input
// and returns the maximum number of different types of candies she can eat.

// Make sure to follow the ESM import/export conventions and properly export all
// the variables, functions, and objects you want to us

// Alice has n candies, where the ith candy is of type candyType[i]. She started
// to gain weight, so she visited a doctor who advised her to only eat n / 2 of
// the candies she has (n is always even). Alice likes her candies very much,
// and she wants to eat the maximum number of different types of candies while
// still following the doctor's advice.

// You need to implement a function distributeCandies(candyType) that takes an
// integer array candyType of length n and returns the maximum number of
// different types of candies she can eat if she only eats n / 2 of them.

// Example 1 distributeCandies([1, 1, 2, 2, 3, 3]); // Output: 3 Explanation:
// Alice can only eat 6 / 2 = 3 candies. Since there are only 3 types, she can
// eat one of each type.

// Example 2 distributeCandies([1, 1, 2, 3]); // Output: 2 Explanation: Alice
// can only eat 4 / 2 = 2 candies. Whether she eats types [1, 2], [1, 3], or [2,
// 3], she still can only eat 2 different types.

// Example 3 distributeCandies([6, 6, 6, 6]); // Output: 1
