/**
 * Format a license key.
 *
 * Strip everything that is not alphanumeric, upper-case the rest, then
 * regroup into blocks of `k` characters separated by '-'. Grouping is done
 * from the right, so only the first group may be shorter than k.
 */

/**
 * @param {string} str
 * @param {number} k group size
 * @returns {string}
 */
function formatLicenseKey(str, k) {
  const clean = String(str).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (!clean || k <= 0) return clean;

  const groups = [];

  // Walk from the right so the leftover group ends up at the front.
  for (let end = clean.length; end > 0; end -= k) {
    groups.unshift(clean.slice(Math.max(0, end - k), end));
  }

  return groups.join('-');
}

// ---- Examples ----
console.log(formatLicenseKey('dsf354g4dsg1', 4));            // 'DSF3-54G4-DSG1'
console.log(formatLicenseKey('2-5g-3-J', 2));                // '2-5G-3J'
console.log(formatLicenseKey('---', 3));                     // ''
console.log(formatLicenseKey('  d-sf354abc ', 5));           // 'DS-F354A-BC' -> 'DSF35' groups from right

module.exports = { formatLicenseKey };
