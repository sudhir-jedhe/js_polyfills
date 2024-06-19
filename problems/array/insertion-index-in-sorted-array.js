// Insertion index in sorted array
// To find the lowest insertion index of an element in a sorted array, you can use Array.prototype.findIndex() to find the appropriate index where the element should be inserted.

const insertionIndex = (arr, n) => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.findIndex(el => (isDescending ? n >= el : n <= el));
  return index === -1 ? arr.length : index;
};

insertionIndex([5, 3, 2, 1], 4); // 1
insertionIndex([30, 50], 40); // 1
// Conversely, to find the highest insertion index of an element in a sorted array, you can use Array.prototype.findLastIndex() to find the appropriate index where the element should be inserted.

const lastInsertionIndex = (arr, n) => {
  const isDescending = arr[0] > arr[arr.length - 1];
  const index = arr.findLastIndex(el => (isDescending ? n <= el : n >= el));
  return index === -1 ? arr.length : index;
};

lastInsertionIndex([10, 20, 30, 30, 40], 30); // 3
// Using a comparator function to determine the insertion index
// For more complex data, you might need a comparator function to determine the insertion index. For example, if you have an array of objects, you might want to find the insertion index based on a specific property of each object.

// The technique is the same as above, except for applying the given comparator function to each element of the array before comparing it to the given value.

// The comparator expects two elements to compare and should return 0 if they are equal, a negative number if the first element comes before the second, or a positive number if the first element comes after the second. In the case of a descending order, the order of the elements should be reversed.

const insertionIndexBy = (arr, n, comparatorFn) => {
  const index = arr.findIndex(el => comparatorFn(n, el) < 0);
  return index === -1 ? arr.length : index;
};

insertionIndexBy([{ x: 4 }, { x: 6 }], { x: 5 }, (a, b) => a.x - b.x); // 1
insertionIndexBy([{ x: 6 }, { x: 4 }], { x: 5 }, (a, b) => b.x - a.x); // 1