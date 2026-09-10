/**
 * getTimeLeft — humanised "X years and Y months" string.
 *
 * Pluralises each unit and drops units that are zero.
 */

/**
 * @param {number} years
 * @param {number} months
 * @returns {string}
 */
function getTimeLeft(years, months) {
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? '' : 's'}`;

  const parts = [];
  if (years) parts.push(plural(years, 'year'));
  if (months) parts.push(plural(months, 'month'));

  if (parts.length === 0) return '0 months';
  return parts.join(' and ');
}

/** Given a total number of months, split it into years + months first. */
function getTimeLeftFromMonths(totalMonths) {
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return getTimeLeft(years, months);
}

// ---- Examples ----
console.log(getTimeLeft(1, 1));  // '1 year and 1 month'
console.log(getTimeLeft(2, 5));  // '2 years and 5 months'
console.log(getTimeLeft(3, 0));  // '3 years'
console.log(getTimeLeft(0, 0));  // '0 months'
console.log(getTimeLeftFromMonths(29)); // '2 years and 5 months'

module.exports = { getTimeLeft, getTimeLeftFromMonths };
