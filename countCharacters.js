// countCharacters.js
export function countCharacters(words, chars) {
  const charCount = {};
  let result = 0;

  // Count characters in chars
  for (const char of chars) {
    charCount[char] = (charCount[char] || 0) + 1;
  }

  // Helper function to check if a word can be formed from chars
  function canFormWord(word) {
    const wordCount = {};
    for (const char of word) {
      wordCount[char] = (wordCount[char] || 0) + 1;
      if (!charCount[char] || wordCount[char] > charCount[char]) {
        return false;
      }
    }
    return true;
  }

  // Check each word in words
  for (const word of words) {
    if (canFormWord(word)) {
      result += word.length;
    }
  }

  return result;
}

// main.js
import { countCharacters } from "./countCharacters.js";

const words = ["cat", "bt", "hat", "tree"];
const chars = "atach";

console.log(countCharacters(words, chars)); // Output: 6 (as "cat" and "hat" can be formed)

// Find Words Formed by Characters
// Easy 1 38.5% Acceptance In this lab, you will
// be working on a function called countCharacters that takes in two inputs - an
// array of strings words and a string chars. The goal of this function is to
// find good strings from the words array that can be formed by characters from
// the chars string, with each character being used only once. The function
// should return the sum of lengths of all good strings found in the words
// array.

// To make it clearer, let's go through a couple of examples:

// Example 1:

// const words = ["cat", "bt", "hat", "tree"]; const chars = "atach"; const
// result = countCharacters(words, chars); // The output should be 6
// Explanation: The strings "cat" and "hat" can be formed using characters from
// the chars string, so the result is the sum of their lengths: 3 + 3 = 6.

// Example 2:

// const words = ["hello", "world", "leetcode"]; const chars = "welldonehoneyr";
// const result = countCharacters(words, chars); // The output should be 10
// Explanation: The strings "hello" and "world" can be formed using characters
// from the chars string, so the result is the sum of their lengths: 5 + 5 = 10.
