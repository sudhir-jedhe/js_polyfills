/**
 * Get the initials of a name.
 *
 * 'Sudhir Jedhe' -> 'SJ'. Handles extra whitespace, hyphenated names and a
 * configurable maximum so long names do not produce five letters.
 */

/**
 * @param {string} name
 * @param {{ max?: number, separator?: string }} [options]
 * @returns {string}
 */
function getInitials(name, { max = 2, separator = '' } = {}) {
  const parts = String(name)
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean);

  if (parts.length === 0) return '';

  // With more parts than we want, keep the first and the last.
  const chosen =
    parts.length > max ? [parts[0], ...parts.slice(-(max - 1))] : parts;

  return chosen
    .slice(0, max)
    .map((part) => [...part][0].toUpperCase())
    .join(separator);
}

/** Every initial, no cap. */
const allInitials = (name) =>
  String(name)
    .trim()
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase())
    .join('');

/** Initials from a 'first last' pair, the common avatar case. */
const avatarInitials = (first = '', last = '') =>
  `${(first[0] || '').toUpperCase()}${(last[0] || '').toUpperCase()}`;

// ---- Examples ----
console.log(getInitials('Sudhir Jedhe'));               // 'SJ'
console.log(getInitials('  ada   lovelace  '));         // 'AL'
console.log(getInitials('Jean-Claude Van Damme'));      // 'JD'
console.log(getInitials('Jean-Claude Van Damme', { max: 4 })); // 'JCVD'
console.log(getInitials('Cher'));                       // 'C'
console.log(allInitials('John Ronald Reuel Tolkien'));  // 'JRRT'
console.log(avatarInitials('Ada', 'Lovelace'));         // 'AL'

module.exports = { getInitials, allInitials, avatarInitials };
