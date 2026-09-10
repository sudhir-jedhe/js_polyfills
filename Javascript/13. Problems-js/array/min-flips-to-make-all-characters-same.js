/**
 * Minimum flips of continuous characters to make all characters the same.
 *
 * A "flip" inverts one contiguous block. Counting the BLOCKS of each
 * character answers it: to make everything '1' you must flip every block of
 * '0's, and vice versa.
 *
 * Time  O(n)
 * Space O(1)
 */

/** Count the maximal runs of each character. */
function countBlocks(str) {
  let zeros = 0;
  let ones = 0;

  for (let i = 0; i < str.length; i++) {
    if (i === 0 || str[i] !== str[i - 1]) {
      if (str[i] === '0') zeros++;
      else ones++;
    }
  }

  return { zeros, ones };
}

/**
 * @param {string} str binary string
 * @returns {number}
 */
function minFlips(str) {
  const { zeros, ones } = countBlocks(str);
  return Math.min(zeros, ones);
}

/** Which blocks to flip, as [start, end] index pairs. */
function blocksToFlip(str) {
  const { zeros, ones } = countBlocks(str);
  const target = zeros <= ones ? '0' : '1'; // flip the rarer kind of block

  const out = [];
  let start = -1;

  for (let i = 0; i <= str.length; i++) {
    if (i < str.length && str[i] === target) {
      if (start === -1) start = i;
    } else if (start !== -1) {
      out.push([start, i - 1]);
      start = -1;
    }
  }

  return { flipCharacter: target, blocks: out };
}

/**
 * A different classic with the same name: minimum SINGLE-character flips to
 * make a string alternate, e.g. '010101...' (LeetCode 1758).
 */
function minFlipsToAlternate(str) {
  let startingWithZero = 0;

  for (let i = 0; i < str.length; i++) {
    const expected = i % 2 === 0 ? '0' : '1';
    if (str[i] !== expected) startingWithZero++;
  }

  return Math.min(startingWithZero, str.length - startingWithZero);
}

/** Minimum single-character flips to make the string all the same. */
function minSingleFlips(str) {
  const zeros = [...str].filter((c) => c === '0').length;
  return Math.min(zeros, str.length - zeros);
}

/** Apply a flip to a range, for verification. */
const applyFlip = (str, start, end) =>
  str.slice(0, start) +
  [...str.slice(start, end + 1)].map((c) => (c === '0' ? '1' : '0')).join('') +
  str.slice(end + 1);

// ---- Examples ----
console.log(minFlips('00011110001110'));      // 2
console.log(minFlips('010101100011'));        // 4
console.log(minFlips('11111'));               // 0
console.log(countBlocks('00011110001110'));   // { zeros: 3, ones: 2 }
console.log(blocksToFlip('00011110001110'));
console.log(minFlipsToAlternate('111000'));   // 3
console.log(minSingleFlips('0001'));          // 1
console.log(applyFlip('0000', 1, 2));         // '0110'

module.exports = { minFlips, countBlocks, blocksToFlip, minFlipsToAlternate, minSingleFlips, applyFlip };
