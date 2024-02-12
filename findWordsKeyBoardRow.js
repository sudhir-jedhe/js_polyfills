export function findWords(words) {
  const row1 = new Set("qwertyuiop");
  const row2 = new Set("asdfghjkl");
  const row3 = new Set("zxcvbnm");

  return words.filter((word) => {
    const lowercaseWord = word.toLowerCase();
    const firstCharRow =
      lowercaseWord[0] in row1 ? row1 : lowercaseWord[0] in row2 ? row2 : row3;

    for (let i = 1; i < lowercaseWord.length; i++) {
      if (!(lowercaseWord[i] in firstCharRow)) {
        return false; // Word uses letters from multiple rows
      }
    }
    return true; // Word uses letters from only one row
  });
}

import { findWords } from "./findWords.js";

const words = ["Hello", "Alaska", "Dad", "Peace"];
console.log(findWords(words)); // Output: ["Alaska", "Dad"]
