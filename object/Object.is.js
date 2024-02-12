// Object.is() is similar to === except following cases

Object.is(0, -0); // false
0 === -0; // true

Object.is(NaN, NaN); // true
NaN === NaN; // false

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
function is(a, b) {
  if (a !== a) {
    // Only NaN is not equal to itself
    return b !== b; // returns true if the second parameter is NaN too
  }

  if (a === 0 && b === 0) {
    // -0 === 0 is true, so when both parameters equals to 0
    return 1 / a === 1 / b; // 1 / -0 is -Infinity and -Infinity === -Infinity
  }

  return a === b; // All other cases with regular === comparison
}

/************************* */

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
// mdn polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#polyfill - good code sample there
function is(a, b) {
  // this is for those cases:  Number.NaN, 0/0, NaN
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }

  if (a === 0 && b === 0 && 1 / a !== 1 / b) {
    return false;
  }

  return a === b;
}

/*********************************** */

/**
 * @param {any} a
 * @param {any} b
 * @return {boolean}
 */
function is(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a) && Number.isNaN(b)) {
      return true;
    }

    if (a === 0 && b === 0 && 1 / a !== 1 / b) {
      return false;
    }
  }

  return a === b;
}
