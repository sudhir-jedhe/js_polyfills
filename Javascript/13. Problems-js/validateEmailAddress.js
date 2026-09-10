/**
 * Validate an email address.
 *
 * A pragmatic validator: catches the mistakes users actually make without
 * pretending to implement RFC 5322 in a regex. For anything that matters,
 * send a confirmation email — that is the only real validation.
 */

// local@domain.tld — no spaces, no consecutive dots, TLD of 2+ chars.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[A-Za-z]{2,}$/;

/**
 * @param {string} email
 * @returns {boolean}
 */
function validateEmailAddress(email) {
  if (typeof email !== 'string') return false;

  const value = email.trim();
  if (value.length === 0 || value.length > 254) return false;
  if (value.includes('..')) return false;

  const [local] = value.split('@');
  if (!local || local.length > 64) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;

  return EMAIL_RE.test(value);
}

/** Returns the reason validation failed, useful for form messages. */
function explainEmail(email) {
  const value = String(email).trim();
  if (!value) return 'Email is required';
  if (!value.includes('@')) return 'Email must contain @';
  if (value.split('@').length > 2) return 'Email must contain a single @';
  if (/\s/.test(value)) return 'Email must not contain spaces';
  if (value.includes('..')) return 'Email must not contain consecutive dots';
  if (!validateEmailAddress(value)) return 'Email format is invalid';
  return null;
}

// ---- Examples ----
console.log(validateEmailAddress('jedhesudhir@gmail.com')); // true
console.log(validateEmailAddress('a.b+tag@sub.example.co.uk')); // true
console.log(validateEmailAddress('no-at-sign.com'));        // false
console.log(validateEmailAddress('two@@at.com'));           // false
console.log(validateEmailAddress('trailing.@dot.com'));     // false
console.log(explainEmail('bad email@x.com'));               // 'Email must not contain spaces'

module.exports = { validateEmailAddress, explainEmail, EMAIL_RE };
