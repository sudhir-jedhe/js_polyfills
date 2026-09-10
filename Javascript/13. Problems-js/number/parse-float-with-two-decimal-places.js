/**
 * Parse a float with two decimal places.
 *
 * toFixed returns a STRING and rounds half-away-from-zero on the decimal
 * representation, which is subtly wrong for values like 1.005 (stored as
 * 1.00499999...). The epsilon variant fixes the common cases.
 */

/** String with exactly two decimals — right for display. */
const toTwoDecimalsString = (n) => Number(n).toFixed(2);

/** Number rounded to two decimals. */
const toTwoDecimals = (n) => Number(Number(n).toFixed(2));

/** Round half-up reliably by nudging past the representation error. */
function roundTo(n, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((Number(n) + Number.EPSILON * Math.sign(n)) * factor) / factor;
}

/** Truncate instead of round — never inflates a displayed price. */
function truncateTo(n, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.trunc(Number(n) * factor) / factor;
}

/** Locale-aware currency formatting, which is what you usually actually want. */
const formatCurrency = (n, currency = 'INR', locale = 'en-IN') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);

// ---- Examples ----
console.log(toTwoDecimalsString(3.14159)); // '3.14'
console.log(toTwoDecimals('2.5'));         // 2.5
console.log(toTwoDecimals(2));             // 2
console.log((1.005).toFixed(2));           // '1.00'  <- the float trap
console.log(roundTo(1.005));               // 1.01
console.log(truncateTo(9.999));            // 9.99
console.log(formatCurrency(1234.5));       // '₹1,234.50'

module.exports = { toTwoDecimals, toTwoDecimalsString, roundTo, truncateTo, formatCurrency };
