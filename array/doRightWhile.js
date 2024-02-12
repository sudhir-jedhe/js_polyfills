function dropRightWhile(array, predicate) {
  let i = array.length;
  while (i > 0 && predicate(array[i - 1])) {
    i--;
  }
  return array.slice(0, i);
}

const array = [1, 2, 3, 4, 5];

// Exclude elements from the end of the array until the element is less than 3.
const result = dropRightWhile(array, (element) => element >= 3);

console.log(result); // [1, 2]
