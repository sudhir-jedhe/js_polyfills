/**
 * Leap year.
 *
 * The Gregorian rule: divisible by 4, EXCEPT century years, UNLESS they are
 * divisible by 400. So 2000 is a leap year and 1900 is not.
 */

/**
 * @param {number} year
 * @returns {boolean}
 */
const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

/**
 * Date-based check: 29 February only exists in a leap year, so asking the
 * Date object for it is a nice cross-check.
 */
const isLeapYearByDate = (year) => new Date(year, 1, 29).getDate() === 29;

/** Days in a given month (1-12). */
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

/** Days in a year. */
const daysInYear = (year) => (isLeapYear(year) ? 366 : 365);

/** How many leap years there are in [start, end]. */
function countLeapYears(start, end) {
  const upTo = (y) => Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);
  return upTo(end) - upTo(start - 1);
}

/** The next leap year at or after `year`. */
function nextLeapYear(year) {
  let candidate = year;
  while (!isLeapYear(candidate)) candidate++;
  return candidate;
}

/** All leap years in a range. */
const leapYearsBetween = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i).filter(isLeapYear);

/** Day of the year for a date, which the leap rule affects after February. */
function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date - start) / 86400000);
}

// ---- Examples ----
console.log(isLeapYear(2024));       // true
console.log(isLeapYear(1900));       // false  (century, not divisible by 400)
console.log(isLeapYear(2000));       // true   (divisible by 400)
console.log(isLeapYearByDate(2024)); // true
console.log(daysInMonth(2024, 2));   // 29
console.log(daysInYear(2023));       // 365
console.log(countLeapYears(1900, 2000)); // 25
console.log(nextLeapYear(2025));     // 2028
console.log(leapYearsBetween(2020, 2030)); // [2020, 2024, 2028]
console.log(dayOfYear(new Date(2024, 2, 1))); // 61

module.exports = { isLeapYear, isLeapYearByDate, daysInMonth, daysInYear, countLeapYears, nextLeapYear, leapYearsBetween, dayOfYear };
