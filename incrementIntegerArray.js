// main.js
import { incrementInteger } from "./incrementInteger.js";

const digits = [9, 9, 9];

console.log(incrementInteger(digits)); // Output: [1, 0, 0, 0]

// incrementInteger.js
export function incrementInteger(digits) {
  const n = digits.length;
  let carry = 1;

  for (let i = n - 1; i >= 0; i--) {
    if (carry === 0) {
      break; // No need to continue if there's no carry left
    }
    const sum = digits[i] + carry;
    digits[i] = sum % 10; // Update the current digit
    carry = Math.floor(sum / 10); // Update the carry
  }

  if (carry > 0) {
    digits.unshift(carry); // Add a new digit if there's still a carry left
  }

  return digits;
}
