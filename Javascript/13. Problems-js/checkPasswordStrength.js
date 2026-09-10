/**
 * Check password strength.
 *
 * Rules:
 *   shorter than 6 characters      -> 'weak'
 *   otherwise score 1 point each for lowercase, uppercase, digit, symbol
 *   score <= 1 -> 'weak', 2 -> 'medium', 3 -> 'strong', 4 -> 'very strong'
 */

const RULES = [
  { name: 'lowercase', test: /[a-z]/ },
  { name: 'uppercase', test: /[A-Z]/ },
  { name: 'number', test: /[0-9]/ },
  { name: 'symbol', test: /[^A-Za-z0-9]/ },
];

/**
 * @param {string} password
 * @returns {'weak' | 'medium' | 'strong' | 'very strong'}
 */
function checkPasswordStrength(password) {
  if (typeof password !== 'string' || password.length < 6) return 'weak';

  const score = RULES.reduce((n, rule) => n + (rule.test.test(password) ? 1 : 0), 0);

  if (score <= 1) return 'weak';
  if (score === 2) return 'medium';
  if (score === 3) return 'strong';
  return 'very strong';
}

/** Same check, but reports which rules failed. */
function describePasswordStrength(password) {
  const missing = RULES.filter((r) => !r.test.test(String(password))).map((r) => r.name);
  return {
    strength: checkPasswordStrength(password),
    tooShort: String(password).length < 6,
    missing,
  };
}

// ---- Examples ----
console.log(checkPasswordStrength('abc'));          // 'weak'
console.log(checkPasswordStrength('abcdefg'));      // 'weak'
console.log(checkPasswordStrength('abcdEfg'));      // 'medium'
console.log(checkPasswordStrength('abcdEf1'));      // 'strong'
console.log(checkPasswordStrength('abcdEf1!'));     // 'very strong'
console.log(describePasswordStrength('abcdefg'));
// { strength: 'weak', tooShort: false, missing: [ 'uppercase', 'number', 'symbol' ] }

module.exports = { checkPasswordStrength, describePasswordStrength };
