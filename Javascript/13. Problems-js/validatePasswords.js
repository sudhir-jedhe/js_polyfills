/**
 * Validate passwords.
 *
 * A rule-driven validator: each rule has an id, a message and a test, so
 * the UI can show exactly which requirements are still unmet.
 */

const DEFAULT_RULES = [
  { id: 'minLength', message: 'At least 8 characters', test: (p) => p.length >= 8 },
  { id: 'maxLength', message: 'At most 64 characters', test: (p) => p.length <= 64 },
  { id: 'lowercase', message: 'At least one lowercase letter', test: (p) => /[a-z]/.test(p) },
  { id: 'uppercase', message: 'At least one uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', message: 'At least one number', test: (p) => /[0-9]/.test(p) },
  { id: 'symbol', message: 'At least one special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
  { id: 'noSpaces', message: 'No whitespace', test: (p) => !/\s/.test(p) },
];

/**
 * @param {string} password
 * @param {Array<{id:string,message:string,test:(p:string)=>boolean}>} [rules]
 * @returns {{ valid: boolean, failed: string[], messages: string[] }}
 */
function validatePassword(password, rules = DEFAULT_RULES) {
  const value = typeof password === 'string' ? password : '';
  const failed = rules.filter((rule) => !rule.test(value));

  return {
    valid: failed.length === 0,
    failed: failed.map((r) => r.id),
    messages: failed.map((r) => r.message),
  };
}

/** Validate a password + confirmation pair. */
function validatePasswords(password, confirmation, rules = DEFAULT_RULES) {
  const result = validatePassword(password, rules);

  if (password !== confirmation) {
    return {
      valid: false,
      failed: [...result.failed, 'match'],
      messages: [...result.messages, 'Passwords do not match'],
    };
  }

  return result;
}

// ---- Examples ----
console.log(validatePassword('Str0ng!Pass'));
// { valid: true, failed: [], messages: [] }

console.log(validatePassword('weak'));
// { valid: false, failed: [ 'minLength', 'uppercase', 'number', 'symbol' ], ... }

console.log(validatePasswords('Str0ng!Pass', 'Str0ng!Pas'));
// { valid: false, failed: [ 'match' ], messages: [ 'Passwords do not match' ] }

module.exports = { validatePassword, validatePasswords, DEFAULT_RULES };
