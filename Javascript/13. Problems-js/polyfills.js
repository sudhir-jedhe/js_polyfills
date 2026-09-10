/**
 * Core JavaScript polyfills.
 *
 * Fresh implementations of the built-ins that come up most often in
 * interviews. Each is written to match the spec's observable behaviour:
 * sparse-array holes are skipped, `thisArg` is honoured, and the array is
 * re-read on every step so mutation during iteration behaves like the
 * native method.
 */

/* ------------------------------------------------------------------ *
 * Array iteration methods
 * ------------------------------------------------------------------ */

Array.prototype.myMap = function (callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`);

  const arr = Object(this);
  const len = arr.length >>> 0;
  const out = new Array(len);

  for (let i = 0; i < len; i++) {
    if (i in arr) out[i] = callback.call(thisArg, arr[i], i, arr);
  }

  return out;
};

Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`);

  const arr = Object(this);
  const len = arr.length >>> 0;
  const out = [];

  for (let i = 0; i < len; i++) {
    if (i in arr && callback.call(thisArg, arr[i], i, arr)) out.push(arr[i]);
  }

  return out;
};

Array.prototype.myReduce = function (callback, ...initial) {
  if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`);

  const arr = Object(this);
  const len = arr.length >>> 0;

  let i = 0;
  let acc;

  if (initial.length > 0) {
    acc = initial[0];
  } else {
    // Seed from the first present element.
    while (i < len && !(i in arr)) i++;
    if (i >= len) throw new TypeError('Reduce of empty array with no initial value');
    acc = arr[i++];
  }

  for (; i < len; i++) {
    if (i in arr) acc = callback(acc, arr[i], i, arr);
  }

  return acc;
};

Array.prototype.myForEach = function (callback, thisArg) {
  const arr = Object(this);
  const len = arr.length >>> 0;

  for (let i = 0; i < len; i++) {
    if (i in arr) callback.call(thisArg, arr[i], i, arr);
  }

  return undefined;
};

Array.prototype.myFlat = function (depth = 1) {
  const arr = Object(this);
  const out = [];

  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      out.push(...item.myFlat(depth - 1));
    } else {
      out.push(item);
    }
  }

  return out;
};

/* ------------------------------------------------------------------ *
 * Function.prototype: call / apply / bind
 * ------------------------------------------------------------------ */

Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') throw new TypeError('myCall called on a non-function');

  // A unique key avoids clobbering an existing property on `context`.
  const key = Symbol('fn');
  const ctx = context === null || context === undefined ? globalThis : Object(context);

  ctx[key] = this;
  try {
    return ctx[key](...args);
  } finally {
    delete ctx[key];
  }
};

Function.prototype.myApply = function (context, args = []) {
  return this.myCall(context, ...args);
};

Function.prototype.myBind = function (context, ...bound) {
  if (typeof this !== 'function') throw new TypeError('myBind called on a non-function');

  const target = this;

  function boundFn(...args) {
    // `new boundFn()` must ignore the bound `this`.
    const isNew = this instanceof boundFn;
    return target.apply(isNew ? this : context, [...bound, ...args]);
  }

  boundFn.prototype = Object.create(target.prototype || null);
  return boundFn;
};

/* ------------------------------------------------------------------ *
 * Promise combinators
 * ------------------------------------------------------------------ */

function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const items = [...promises];
    const results = new Array(items.length);
    let remaining = items.length;

    if (remaining === 0) return resolve([]);

    items.forEach((p, i) => {
      Promise.resolve(p).then((value) => {
        results[i] = value;
        if (--remaining === 0) resolve(results);
      }, reject);
    });
  });
}

function myPromiseAllSettled(promises) {
  return myPromiseAll(
    [...promises].map((p) =>
      Promise.resolve(p).then(
        (value) => ({ status: 'fulfilled', value }),
        (reason) => ({ status: 'rejected', reason })
      )
    )
  );
}

function myPromiseRace(promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) Promise.resolve(p).then(resolve, reject);
  });
}

function myPromiseAny(promises) {
  return new Promise((resolve, reject) => {
    const items = [...promises];
    const errors = new Array(items.length);
    let remaining = items.length;

    if (remaining === 0) return reject(new AggregateError([], 'All promises were rejected'));

    items.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (err) => {
        errors[i] = err;
        if (--remaining === 0) reject(new AggregateError(errors, 'All promises were rejected'));
      });
    });
  });
}

/* ------------------------------------------------------------------ *
 * Utilities
 * ------------------------------------------------------------------ */

/** Delay invocation until `wait` ms have passed with no new calls. */
function debounce(fn, wait = 0, { leading = false } = {}) {
  let timer = null;

  return function (...args) {
    const callNow = leading && timer === null;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!leading) fn.apply(this, args);
    }, wait);

    if (callNow) fn.apply(this, args);
  };
}

/** Run at most once per `wait` ms, with a trailing call for the last args. */
function throttle(fn, wait = 0) {
  let waiting = false;
  let lastArgs = null;

  return function (...args) {
    if (waiting) {
      lastArgs = args;
      return;
    }

    fn.apply(this, args);
    waiting = true;

    const tick = () => {
      if (lastArgs) {
        fn.apply(this, lastArgs);
        lastArgs = null;
        setTimeout(tick, wait);
      } else {
        waiting = false;
      }
    };

    setTimeout(tick, wait);
  };
}

/** Cache results by serialised arguments. */
function memoize(fn, resolver = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);

    const value = fn.apply(this, args);
    cache.set(key, value);
    return value;
  };
}

/** Structural deep clone, cycle-safe. */
function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);

  if (value instanceof Date) return new Date(value);
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const out = new Map();
    seen.set(value, out);
    for (const [k, v] of value) out.set(deepClone(k, seen), deepClone(v, seen));
    return out;
  }
  if (value instanceof Set) {
    const out = new Set();
    seen.set(value, out);
    for (const v of value) out.add(deepClone(v, seen));
    return out;
  }

  const out = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, out);
  for (const key of Reflect.ownKeys(value)) out[key] = deepClone(value[key], seen);
  return out;
}

/** Deep structural equality. */
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((k) => keysB.includes(k) && deepEqual(a[k], b[k]));
}

// ---- Examples ----
console.log([1, 2, 3].myMap((n) => n * 2));           // [2, 4, 6]
console.log([1, 2, 3, 4].myFilter((n) => n % 2 === 0));// [2, 4]
console.log([1, 2, 3].myReduce((a, b) => a + b, 0));   // 6
console.log([1, [2, [3, [4]]]].myFlat(2));             // [1, 2, 3, [4]]

function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
console.log(greet.myCall({ name: 'Sudhir' }, 'Hi'));   // 'Hi, Sudhir'
console.log(greet.myBind({ name: 'Ada' })('Hello'));   // 'Hello, Ada'

myPromiseAll([1, Promise.resolve(2), 3]).then(console.log); // [1, 2, 3]
myPromiseAllSettled([Promise.reject('x')]).then(console.log);
// [ { status: 'rejected', reason: 'x' } ]

console.log(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })); // true

module.exports = {
  myPromiseAll,
  myPromiseAllSettled,
  myPromiseRace,
  myPromiseAny,
  debounce,
  throttle,
  memoize,
  deepClone,
  deepEqual,
};
