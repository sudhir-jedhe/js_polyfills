/**
 * Length of an "associative array" (a plain object).
 *
 * Objects have no `length`, so counting means counting keys — and which
 * keys count depends on enumerability, inheritance and symbols.
 */

/** Own enumerable STRING keys — the usual answer. */
const size = (obj) => Object.keys(obj).length;

/** Own enumerable string keys, via entries. */
const sizeByEntries = (obj) => Object.entries(obj).length;

/** Own keys including non-enumerable ones. */
const sizeAllOwn = (obj) => Object.getOwnPropertyNames(obj).length;

/** Own keys including symbols. */
const sizeIncludingSymbols = (obj) => Reflect.ownKeys(obj).length;

/** for...in counts INHERITED enumerable keys too — usually a bug. */
function sizeForIn(obj) {
  let count = 0;
  for (const key in obj) count++;
  return count;
}

/** for...in restricted to own properties, the safe old-school form. */
function sizeOwnForIn(obj) {
  let count = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) count++;
  }
  return count;
}

/** Is the object empty? */
const isEmpty = (obj) => obj == null || Object.keys(obj).length === 0;

/** Deep count: every leaf value in a nested structure. */
function deepSize(value) {
  if (Array.isArray(value)) return value.reduce((n, v) => n + deepSize(v), 0);
  if (value !== null && typeof value === 'object') {
    return Object.values(value).reduce((n, v) => n + deepSize(v), 0);
  }
  return 1;
}

/** Map and Set expose `size` directly — the reason to prefer them. */
const collectionSize = (collection) => collection.size;

// ---- Examples ----
const obj = { a: 1, b: 2, c: 3 };
Object.defineProperty(obj, 'hidden', { value: 4, enumerable: false });
obj[Symbol('s')] = 5;

console.log(size(obj));                 // 3
console.log(sizeAllOwn(obj));           // 4  (includes 'hidden')
console.log(sizeIncludingSymbols(obj)); // 5  (includes the symbol)

const child = Object.create({ inherited: 1 });
child.own = 2;
console.log(size(child), sizeForIn(child)); // 1 2  <- the for...in trap

console.log(isEmpty({}));               // true
console.log(deepSize({ a: 1, b: { c: 2, d: [3, 4] } })); // 4
console.log(collectionSize(new Map([['a', 1]])));        // 1

module.exports = { size, sizeByEntries, sizeAllOwn, sizeIncludingSymbols, sizeForIn, sizeOwnForIn, isEmpty, deepSize, collectionSize };
