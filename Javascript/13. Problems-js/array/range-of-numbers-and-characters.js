/**
 * Generate a range of numbers or characters.
 *
 * Python's range(), plus the character equivalent and an inclusive variant.
 */

/**
 * range(5)        -> [0,1,2,3,4]
 * range(2, 6)     -> [2,3,4,5]
 * range(0, 10, 3) -> [0,3,6,9]
 * range(5, 0, -1) -> [5,4,3,2,1]
 */
function range(start, end, step = 1) {
  if (end === undefined) [start, end] = [0, start];
  if (step === 0) throw new RangeError('step must not be 0');

  const length = Math.max(0, Math.ceil((end - start) / step));
  return Array.from({ length }, (_, i) => start + i * step);
}

/** Inclusive of both ends: rangeInclusive(1, 5) -> [1,2,3,4,5]. */
const rangeInclusive = (start, end, step = 1) =>
  range(start, end + Math.sign(step), step);

/** Characters: charRange('a', 'e') -> ['a','b','c','d','e']. */
function charRange(from, to) {
  const start = from.charCodeAt(0);
  const end = to.charCodeAt(0);
  const step = start <= end ? 1 : -1;

  const length = Math.abs(end - start) + 1;
  return Array.from({ length }, (_, i) => String.fromCharCode(start + i * step));
}

/** The whole lowercase alphabet. */
const alphabet = () => charRange('a', 'z');

/** A lazy generator, for very large ranges. */
function* rangeLazy(start, end, step = 1) {
  if (end === undefined) [start, end] = [0, start];

  if (step > 0) for (let i = start; i < end; i += step) yield i;
  else for (let i = start; i > end; i += step) yield i;
}

/** Evenly spaced values including both endpoints, like numpy's linspace. */
function linspace(start, end, count) {
  if (count < 2) return count === 1 ? [start] : [];

  const step = (end - start) / (count - 1);
  return Array.from({ length: count }, (_, i) => start + i * step);
}

/** Is a value inside a range? */
const inRange = (value, start, end) =>
  value >= Math.min(start, end) && value < Math.max(start, end);

/** Clamp a value into a range. */
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ---- Examples ----
console.log(range(5));              // [0,1,2,3,4]
console.log(range(2, 6));           // [2,3,4,5]
console.log(range(0, 10, 3));       // [0,3,6,9]
console.log(range(5, 0, -1));       // [5,4,3,2,1]
console.log(rangeInclusive(1, 5));  // [1,2,3,4,5]
console.log(charRange('a', 'e'));   // ['a','b','c','d','e']
console.log(charRange('e', 'a'));   // ['e','d','c','b','a']
console.log(alphabet().length);     // 26
console.log([...rangeLazy(0, 5)]);  // [0,1,2,3,4]
console.log(linspace(0, 1, 5));     // [0, 0.25, 0.5, 0.75, 1]
console.log(inRange(5, 1, 10), clamp(15, 0, 10)); // true 10

module.exports = { range, rangeInclusive, charRange, alphabet, rangeLazy, linspace, inRange, clamp };
