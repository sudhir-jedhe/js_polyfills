function isBetween(number, min, max) {
  return number >= min && number <= max;
}

// Example usage:

const number = 5;
const min = 3;
const max = 8;

if (isBetween(number, min, max)) {
  console.log("The number is between 3 and 8.");
} else {
  console.log("The number is not between 3 and 8.");
}

/*************** */

// ✅ If you aren't sure which of the two numbers is low
// and which is high use Math.max() and Math.min()
const num = 50;

const low = 30;
const high = 150;

const max = Math.max(low, high);
console.log(max); // 👉️ 150

const min = Math.min(low, high);
console.log(min); // 👉️ 30

if (num > min && num < max) {
  // 👇️ this runs
  console.log("✅ num is between the two numbers");
} else {
  console.log("⛔️ num is NOT between the two numbers");
}

function numberInRange(num, low, high) {
  if (num > low && num < high) {
    return true;
  }

  return false;
}

console.log(numberInRange(5, 1, 10)); // 👉️ true

console.log(numberInRange(50, 1, 10)); // 👉️ false

/********************* */
const num = 50;

const low = 30;
const high = 150;

const max = Math.max(low, high);
console.log(max); // 👉️ 150

const min = Math.min(low, high);
console.log(min); // 👉️ 30

if (num > min && num < max) {
  // 👇️ this runs
  console.log("✅ num is between the two numbers");
} else {
  console.log("⛔️ num is NOT between the two numbers");
}

/*********************************** */
function numberInRange(num, first, second) {
  const max = Math.max(first, second);
  const min = Math.min(first, second);

  if (num > min && num < max) {
    return true;
  }

  return false;
}

console.log(numberInRange(5, 10, 50)); // 👉️ false

console.log(numberInRange(5, 1, 50)); // 👉️ true

console.log(numberInRange(5, 50, 1)); // 👉️ true
