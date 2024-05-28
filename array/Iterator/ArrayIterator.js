function helper(arr) {
  let nextIndex = 0;
  let arrLength = arr.length;
  let value = null;
  let done = false;
  return {
    next() {
      return nextIndex <= arrLength
        ? { value: arr[nextIndex++], done: nextIndex >= arrLength }
        : null;
    },
    done() {
      return nextIndex >= arrLength;
    },
  };
}
const input = [2, 4, 7, 8];
let iterator = helper(input);

console.log(iterator.next()); // 1
console.log(iterator.next()); // 2
console.log(iterator.done()); // false
console.log(iterator.next()); // "hello"
console.log(iterator.done()); // true
console.log(iterator.next()); // "null"
