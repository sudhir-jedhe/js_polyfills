/**
 * Detect a credit card provider from its number.
 *
 * Matches on the issuer identification number (IIN) prefix and length,
 * then optionally validates the check digit with the Luhn algorithm.
 */

const PROVIDERS = [
  { name: 'Visa', pattern: /^4[0-9]{12}(?:[0-9]{3})?(?:[0-9]{3})?$/ },
  {
    name: 'Mastercard',
    pattern: /^(?:5[1-5][0-9]{14}|2(?:2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/,
  },
  { name: 'American Express', pattern: /^3[47][0-9]{13}$/ },
  { name: 'Discover', pattern: /^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/ },
  { name: 'Diners Club', pattern: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/ },
  { name: 'JCB', pattern: /^(?:2131|1800|35[0-9]{3})[0-9]{11}$/ },
  { name: 'RuPay', pattern: /^(?:60|65|81|82|508)[0-9]{14}$/ },
  { name: 'Maestro', pattern: /^(?:5018|5020|5038|6304|6759|676[1-3])[0-9]{8,15}$/ },
];

/** Strip spaces and dashes people type in. */
const normalise = (cardNumber) => String(cardNumber).replace(/[\s-]/g, '');

/**
 * @param {string} cardNumber
 * @returns {string} provider name, or 'Unknown'
 */
function getCreditCardProvider(cardNumber) {
  const digits = normalise(cardNumber);
  if (!/^\d+$/.test(digits)) return 'Unknown';

  const match = PROVIDERS.find(({ pattern }) => pattern.test(digits));
  return match ? match.name : 'Unknown';
}

/**
 * Luhn checksum — catches single-digit typos and most transpositions.
 * @param {string} cardNumber
 * @returns {boolean}
 */
function isValidLuhn(cardNumber) {
  const digits = normalise(cardNumber);
  if (!/^\d{12,19}$/.test(digits)) return false;

  let sum = 0;
  let double = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48;
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }

  return sum % 10 === 0;
}

/** Provider + validity in one call. */
const inspectCard = (cardNumber) => ({
  provider: getCreditCardProvider(cardNumber),
  luhnValid: isValidLuhn(cardNumber),
  masked: normalise(cardNumber).replace(/\d(?=\d{4})/g, '*'),
});

// ---- Examples ----
console.log(getCreditCardProvider('4111 1111 1111 1111')); // 'Visa'
console.log(getCreditCardProvider('5500000000000004'));    // 'Mastercard'
console.log(getCreditCardProvider('340000000000009'));     // 'American Express'
console.log(getCreditCardProvider('1234567890123456'));    // 'Unknown'

console.log(isValidLuhn('4111111111111111')); // true
console.log(isValidLuhn('4111111111111112')); // false
console.log(inspectCard('4111-1111-1111-1111'));

module.exports = { getCreditCardProvider, isValidLuhn, inspectCard, PROVIDERS };
