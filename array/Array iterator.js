let iterator = helper([1, 2, "hello"]);
console.log(iterator.next()); // 1
console.log(iterator.next()); // 2
console.log(iterator.done()); // false
console.log(iterator.next()); // "hello"
console.log(iterator.done()); // true
console.log(iterator.next()); // "null"

const helper = (array) => {
  // track the index
  let nextIndex = 0;

  // return two methods
  return {
    // return the next value
    // or null
    next: function () {
      return nextIndex < array.length ? array[nextIndex++] : null;
    },

    // returns boolean value
    // if all the values are returned from array
    done: function () {
      return nextIndex >= array.length;
    },
  };
};

let iterator = helper([1, 2, "hello"]);
console.log(iterator.next()); // 1
console.log(iterator.next()); // 2
console.log(iterator.done()); // false
console.log(iterator.next()); // "hello"
console.log(iterator.done()); // true
console.log(iterator.next()); // "null"
