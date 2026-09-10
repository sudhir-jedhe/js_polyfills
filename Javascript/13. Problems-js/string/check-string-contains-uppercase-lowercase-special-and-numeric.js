/**
 * Check whether a string contains uppercase, lowercase, special characters
 * and numeric values.
 *
 * Returns a breakdown rather than a single boolean, so a UI can show which
 * requirement is still missing.
 */

const CHECKS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numeric: /[0-9]/,
  special: /[^A-Za-z0-9]/,
};

/**
 * @param {string} str
 * @returns {{ uppercase:boolean, lowercase:boolean, numeric:boolean, special:boolean, all:boolean }}
 */
function analyseString(str) {
  const value = String(str);
  const result = {};

  for (const [name, re] of Object.entries(CHECKS)) {
    result[name] = re.test(value);
  }

  result.all = Object.values(result).every(Boolean);
  return result;
}

/** Single boolean: does it contain all four categories? */
const hasAllTypes = (str) => Object.values(CHECKS).every((re) => re.test(String(str)));

/** One regex with lookaheads — the same test in a single pass. */
const ALL_TYPES_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

/** Count characters per category. */
function countByType(str) {
  const counts = { uppercase: 0, lowercase: 0, numeric: 0, special: 0 };

  for (const ch of String(str)) {
    if (/[A-Z]/.test(ch)) counts.uppercase++;
    else if (/[a-z]/.test(ch)) counts.lowercase++;
    else if (/[0-9]/.test(ch)) counts.numeric++;
    else counts.special++;
  }

  return counts;
}

// ---- Examples ----
console.log(analyseString('Abc123!'));
// { uppercase: true, lowercase: true, numeric: true, special: true, all: true }

console.log(analyseString('abc123'));
// { uppercase: false, lowercase: true, numeric: true, special: false, all: false }

console.log(hasAllTypes('Passw0rd!'));      // true
console.log(ALL_TYPES_RE.test('Passw0rd!'));// true
console.log(countByType('Ab1! z'));         // { uppercase:1, lowercase:2, numeric:1, special:2 }

module.exports = { analyseString, hasAllTypes, countByType, ALL_TYPES_RE, CHECKS };
