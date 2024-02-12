function firstDuplicateCharacter(str) {
  const charCount = {};

  for (let char of str) {
    if (charCount[char]) {
      return char;
    } else {
      charCount[char] = true;
    }
  }

  return null; // No duplicate character found
}

// Example usage:
const inputString = "abcdefgahij";
const firstDuplicate = firstDuplicateCharacter(inputString);
console.log("First duplicate character:", firstDuplicate);

/******************************** */
function firstDuplicateCharacter(str) {
  const charMap = new Map();

  for (let char of str) {
    // If the character is already in the map, return it
    if (charMap.has(char)) {
      return char;
    }
    // Otherwise, add the character to the map
    charMap.set(char, true);
  }

  // If no duplicate character is found, return null
  return null;
}

// Example usage:
const inputString = "abcdefgabc";
const firstDuplicate = firstDuplicateCharacter(inputString);
console.log("First duplicate character:", firstDuplicate);

/************************************ */
/**
 * @param {string} str
 * @return {string | null}
 */
function firstDuplicate(str) {
  const map = new Map();

  for (let i = 0; i < str.length; i++) {
    const num = str[i];

    if (map.get(num)) return num;

    map.set(num, true);
  }

  return null;
}

/******************************************** */
function firstDuplicate(str) {
  // your code here
  let set = new Set();
  let duplicate = [...str].find((char) => {
    if (set.has(char)) {
      return char;
    }
    set.add(char);
  });
  return duplicate ? duplicate : null;
}

firstDuplicate("abcdefe");
