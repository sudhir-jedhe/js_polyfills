/**
 * Convert a 12-hour time string to 24-hour format.
 *
 * '07:05:45PM' -> '19:05:45'
 * Rules: 12AM is 00, 12PM stays 12, everything else PM adds 12.
 */

/**
 * @param {string} time e.g. '07:05:45PM' or '7:05 pm'
 * @returns {string} 'HH:MM:SS'
 */
function to24Hour(time) {
  const match = String(time)
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([APap][Mm])$/);

  if (!match) throw new Error(`Unrecognised time: ${time}`);

  const [, h, m, s = '00', meridiem] = match;
  const isPM = meridiem.toUpperCase() === 'PM';

  let hour = Number(h) % 12;      // 12 -> 0
  if (isPM) hour += 12;           // PM shifts by 12

  return [hour, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

/** The reverse: 24-hour -> 12-hour with meridiem. */
function to12Hour(time) {
  const [h, m, s = '00'] = String(time).split(':');
  const hour = Number(h);
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;

  return `${String(display).padStart(2, '0')}:${m}:${s}${meridiem}`;
}

// ---- Examples ----
console.log(to24Hour('07:05:45PM')); // '19:05:45'
console.log(to24Hour('12:00:00AM')); // '00:00:00'
console.log(to24Hour('12:30:00PM')); // '12:30:00'
console.log(to24Hour('7:05 am'));    // '07:05:00'
console.log(to12Hour('19:05:45'));   // '07:05:45PM'
console.log(to12Hour('00:15:00'));   // '12:15:00AM'

module.exports = { to24Hour, to12Hour };
