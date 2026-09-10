/**
 * Convert a long number into an abbreviated string.
 *
 * 1234 -> '1.2K', 1500000 -> '1.5M'
 *
 * Intl.NumberFormat with notation: 'compact' does this correctly for every
 * locale; the manual version shows the arithmetic and gives full control.
 */

const UNITS = [
  { value: 1e12, symbol: 'T' },
  { value: 1e9, symbol: 'B' },
  { value: 1e6, symbol: 'M' },
  { value: 1e3, symbol: 'K' },
];

/**
 * @param {number} n
 * @param {number} [decimals=1]
 * @returns {string}
 */
function abbreviate(n, decimals = 1) {
  if (!Number.isFinite(n)) return String(n);

  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);

  const unit = UNITS.find((u) => abs >= u.value);
  if (!unit) return sign + String(abs);

  const scaled = abs / unit.value;
  // Trim a trailing '.0' so 1000 reads as '1K', not '1.0K'.
  const text = scaled.toFixed(decimals).replace(/\.0+$/, '');

  return `${sign}${text}${unit.symbol}`;
}

/** The built-in, locale-aware version. */
const abbreviateIntl = (n, locale = 'en-US') =>
  new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n);

/** Byte sizes use 1024, not 1000. */
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), units.length - 1);

  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}

/** Thousands separators, without abbreviating. */
const withSeparators = (n, locale = 'en-US') => new Intl.NumberFormat(locale).format(n);

/** Parse an abbreviation back into a number. */
function parseAbbreviated(str) {
  const match = String(str).trim().match(/^(-?[\d.]+)\s*([KMBT])?$/i);
  if (!match) return NaN;

  const [, number, symbol] = match;
  const unit = UNITS.find((u) => u.symbol === (symbol || '').toUpperCase());

  return Number(number) * (unit ? unit.value : 1);
}

// ---- Examples ----
console.log(abbreviate(1234));       // '1.2K'
console.log(abbreviate(1000));       // '1K'
console.log(abbreviate(1500000));    // '1.5M'
console.log(abbreviate(-2500));      // '-2.5K'
console.log(abbreviate(999));        // '999'
console.log(abbreviateIntl(1234567));// '1.2M'
console.log(formatBytes(1536));      // '1.5 KB'
console.log(withSeparators(1234567));// '1,234,567'
console.log(parseAbbreviated('1.5M'));// 1500000

module.exports = { abbreviate, abbreviateIntl, formatBytes, withSeparators, parseAbbreviated };
