/********************shuffle an array in JavaScript*************************** */
function shuffleArray(array) {
  if (!Array.isArray(array)) {
    throw new Error("Input must be an array.");
  }

  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
}

// Example usage:
const originalArray = [1, 2, 3, 4, 5];
const shuffledArray = shuffleArray(originalArray);

console.log(shuffledArray);
// Output: [3, 1, 5, 4, 2] (or any other random permutation)

/****************************** */

// Shuffle function implementation - fill in your code!
function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    const j = i + Math.floor(Math.random() * (arr.length - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

const arr = [1, 2, 3, 4];
const permutations = [
  [1, 2, 3, 4],
  [1, 2, 4, 3],
  [1, 3, 2, 4],
  [1, 3, 4, 2],
  [1, 4, 2, 3],
  [1, 4, 3, 2],
  [2, 1, 3, 4],
  [2, 1, 4, 3],
  [2, 3, 1, 4],
  [2, 3, 4, 1],
  [2, 4, 1, 3],
  [2, 4, 3, 1],
  [3, 1, 2, 4],
  [3, 1, 4, 2],
  [3, 2, 1, 4],
  [3, 2, 4, 1],
  [3, 4, 1, 2],
  [3, 4, 2, 1],
  [4, 1, 2, 3],
  [4, 1, 3, 2],
  [4, 2, 1, 3],
  [4, 2, 3, 1],
  [4, 3, 1, 2],
  [4, 3, 2, 1],
];

// Shuffle the array
shuffle(arr);

// Validate the shuffled array
const isValidPermutation = permutations.some(
  (permutation) => JSON.stringify(permutation) === JSON.stringify(arr)
);

if (isValidPermutation) {
  console.log("The shuffled array is a valid permutation:", arr);
} else {
  console.log(
    "Something went wrong! The shuffled array does not match any of the valid permutations."
  );
}

/********************************* */
const random = (max, min = 0) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// /**
//  * @param {any[]} arr
//  * @returns {void}
//  */
function shuffle(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    const rand = random(i);

    [arr[i], arr[rand]] = [arr[rand], arr[i]];
  }
}

/***************************************** */

/**
 * @param {any[]} arr
 */

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const randIdx = Math.floor(Math.random() * (i + 1));
    const storedItem = arr[i];
    arr[i] = arr[randIdx];
    arr[randIdx] = storedItem;
  }

  return arr;
}

/************************************** */
function shuffle(arr) {
  const op = [...arr];

  while (op.length) {
    const randomIndex = Math.floor(Math.random() * op.length);
    [arr[op.length - 1], arr[randomIndex]] = [
      arr[randomIndex],
      arr[op.length - 1],
    ];
    op.splice(0, 1);
  }

  return arr;
}

/************************************** */
export const shuffleArray = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
