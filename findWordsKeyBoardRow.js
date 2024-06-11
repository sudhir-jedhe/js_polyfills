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


// This function takes an array of strings words as input and returns the words that can be typed using letters of the alphabet on only one row of the American keyboard.

// In the American keyboard:

// the first row consists of the characters "qwertyuiop",
// the second row consists of the characters "asdfghjkl", and
// the third row consists of the characters "zxcvbnm".
// Your task is to implement the findWords() function using the provided initial code in index.js and pass the challenges given below. Your code will be evaluated based on these challenges, so make sure to carefully read and understand the requirements of each challenge.