/**
 * Change values in an array while iterating with forEach.
 *
 * The callback's `item` parameter is a copy of the reference, so
 * `item = x` does nothing. To mutate you must write through the array
 * (or, for objects, mutate the object the reference points at).
 */

/** BROKEN: reassigning the parameter has no effect on the array. */
function brokenDouble(arr) {
  arr.forEach((item) => {
    item = item * 2; // discarded
  });
  return arr;
}

/** Mutating: write back via index (forEach's 3rd argument is the array). */
function mutateDouble(arr) {
  arr.forEach((item, index, self) => {
    self[index] = item * 2;
  });
  return arr;
}

/** Preferred: map returns a new array and leaves the input alone. */
const mapDouble = (arr) => arr.map((n) => n * 2);

/**
 * With objects, mutating a PROPERTY does work, because both the array slot
 * and the callback parameter point at the same object.
 */
function markAllDone(todos) {
  todos.forEach((todo) => {
    todo.done = true; // same object — this sticks
  });
  return todos;
}

/** Immutable equivalent for objects. */
const markAllDoneImmutable = (todos) => todos.map((t) => ({ ...t, done: true }));

// ---- Examples ----
console.log(brokenDouble([1, 2, 3])); // [1, 2, 3]  <- unchanged
console.log(mutateDouble([1, 2, 3])); // [2, 4, 6]
console.log(mapDouble([1, 2, 3]));    // [2, 4, 6]

console.log(markAllDone([{ id: 1, done: false }])); // [{ id: 1, done: true }]
console.log(markAllDoneImmutable([{ id: 1, done: false }]));

module.exports = { brokenDouble, mutateDouble, mapDouble, markAllDone, markAllDoneImmutable };
