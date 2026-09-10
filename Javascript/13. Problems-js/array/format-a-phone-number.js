/**
 * Format a phone number into a human-readable form.
 *
 * Strip everything that is not a digit, then group. The generic formatter
 * takes a pattern so any country's layout can be expressed.
 */

/** Keep digits only. */
const digitsOnly = (input) => String(input).replace(/\D/g, '');

/** US style: (555) 123-4567 */
function formatUS(input) {
  const d = digitsOnly(input).replace(/^1/, ''); // drop a leading country code
  if (d.length !== 10) return String(input);

  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** India style: +91 98765 43210 */
function formatIN(input) {
  const d = digitsOnly(input).replace(/^91/, '');
  if (d.length !== 10) return String(input);

  return `+91 ${d.slice(0, 5)} ${d.slice(5)}`;
}

/**
 * Generic: a pattern where '#' is a digit placeholder.
 * formatWithPattern('5551234567', '(###) ###-####')
 */
function formatWithPattern(input, pattern) {
  const d = digitsOnly(input);
  let index = 0;

  return pattern.replace(/#/g, () => d[index++] ?? '').trim();
}

/**
 * Progressive formatting for a live input field — formats what has been
 * typed so far without waiting for a complete number.
 */
function formatAsYouType(input, pattern = '(###) ###-####') {
  const d = digitsOnly(input);
  let index = 0;
  let out = '';

  for (const ch of pattern) {
    if (index >= d.length) break;
    out += ch === '#' ? d[index++] : ch;
  }

  return out;
}

/** Split into country code, area code and the rest. */
function parsePhone(input) {
  const d = digitsOnly(input);

  if (d.length === 11 && d[0] === '1') {
    return { country: '1', area: d.slice(1, 4), exchange: d.slice(4, 7), line: d.slice(7) };
  }
  if (d.length === 10) {
    return { country: null, area: d.slice(0, 3), exchange: d.slice(3, 6), line: d.slice(6) };
  }

  return { country: null, area: null, exchange: null, line: d };
}

// ---- Examples ----
console.log(formatUS('5551234567'));            // '(555) 123-4567'
console.log(formatUS('1-555-123-4567'));        // '(555) 123-4567'
console.log(formatIN('919876543210'));          // '+91 98765 43210'
console.log(formatWithPattern('5551234567', '###.###.####')); // '555.123.4567'
console.log(formatAsYouType('55512'));          // '(555) 12'
console.log(parsePhone('15551234567'));

module.exports = { formatUS, formatIN, formatWithPattern, formatAsYouType, parsePhone, digitsOnly };
