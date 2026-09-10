/**
 * Add two binary numbers given as strings.
 *
 * Column addition from the right with a carry — works for numbers far
 * beyond Number.MAX_SAFE_INTEGER, unlike parseInt + toString(2).
 *
 * Time  O(max(m, n))
 * Space O(max(m, n))
 */

/**
 * @param {string} a binary string, e.g. '1011'
 * @param {string} b binary string
 * @returns {string}
 */
function addBinary(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  let out = '';

  while (i >= 0 || j >= 0 || carry) {
    const sum = (i >= 0 ? +a[i--] : 0) + (j >= 0 ? +b[j--] : 0) + carry;
    out = (sum % 2) + out;
    carry = sum > 1 ? 1 : 0;
  }

  return out;
}

/** BigInt one-liner — concise, and exact for huge inputs. */
function addBinaryBigInt(a, b) {
  return (BigInt(`0b${a}`) + BigInt(`0b${b}`)).toString(2);
}

// ---- Examples ----
console.log(addBinary('11', '1'));         // '100'
console.log(addBinary('1010', '1011'));    // '10101'
console.log(addBinary('0', '0'));          // '0'
console.log(addBinaryBigInt('1111', '1')); // '10000'

module.exports = { addBinary, addBinaryBigInt };
