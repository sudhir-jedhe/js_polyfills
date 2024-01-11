function range(start, end) {
  if (end === undefined) {
    return function (end) {
      return range(start, end);
    };
  }

  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
}

// Create a range function which returns an array for the provided inputs as start and end
// // Example
// range(3, 6); // [3, 4, 5, 6]
// range(3)(5); // [3, 4, 5]
// range(3)(0); // []
