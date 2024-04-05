function createIterator(collection) {
  let i = 0;
  return {
    next() {
      if (i < collection.length) {
        return { value: collection[i++], done: false };
      }

      return { value: null, done: true };
    },
  };
}

const arr = [1, 2, 3];
const iterator = createIterator(arr);
console.log(iterator.next());
// {"value": 1, "done": false }

console.log(iterator.next());
// {"value": 2, "done": false }

console.log(iterator.next());
// {"value": 3, "done": false }

console.log(iterator.next());
// {"value": null, "done": true }

/******************************** */
function* Gen() {
  yield* ["a", "b", "c"];
}

const g = Gen();

console.log(g.next());
// { value: "a", done: false }

console.log(g.next());
// { value: "b", done: false }

console.log(g.next());
// { value: "c", done: false }

console.log(g.next());
// { value: undefined, done: false }

/*************************** */
const g = {};

g[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

console.log([...g]);
// [1,2,3]

/********************************** */
function* createIterator() {
  yield 1;
  yield 2;
}

const iterator = createIterator();

for (const item of iterator) {
  console.log(item);
}
// 1
// 2

// this won't run
for (const item of iterator) {
  console.log(item);
}

/********************************* */

const customIterable = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  },
};

for (const value of customIterable) {
  console.log(value);
}
// 1
// 2
// 3

for (const value of customIterable) {
  console.log(value);
}
// 1
// 2
// 3

/************************************** */
function* RoundRobin(collection) {
  let current = 0;
  while (true) {
    const reset = yield collection[current++ % collection.length];
    if (reset) {
      current = 0;
    }
  }
}

const rr = RoundRobin([1, 2, 3, 4]);
console.log(rr.next()); //{"value": 1, "done": false }
console.log(rr.next()); //{"value": 2, "done": false }
console.log(rr.next()); //{"value": 3, "done": false }
console.log(rr.next(true)); //{"value": 1, "done": false } // reset's the counter
console.log(rr.next()); //{"value": 2, "done": false }
console.log(rr.next()); //{"value": 3, "done": false }
console.log(rr.next()); //{"value": 4, "done": false }
console.log(rr.next()); //{"value": 1, "done": false }
