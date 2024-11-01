export const range = (start, end, step = 1) => {
  if (step <= 0 || start >= end) {
    return [];
  }

  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }

  return result;
};

const range1 = range(1, 5);
console.log(range1); // [1, 2, 3, 4]

const range2 = range(0, 10, 2);
console.log(range3); // [0, 2, 4, 6, 8]

const range3 = range(10, 0, -2);
console.log(range4); // [10, 8, 6, 4, 2]

/**************************************** */

function range() {
  const length = arguments.length;

  // early escape conditions
  // if no arguments or
  // single argument provide with value as 0
  // then return empty array
  if (!length || (length === 1 && arguments[0] === 0)) {
    return [];
  }

  let start = 0;
  let end;
  let step;

  // destructuring variables
  if (length === 3) {
    [start, end, step] = arguments;
  } else if (length === 2) {
    [start, end] = arguments;
  } else {
    [end] = arguments;
  }

  // checking if step is provided or not
  const isStepMissing = step === undefined;

  // if end < start => -4 < 0
  // and step is missing then default step should be -1
  if (end < start && isStepMissing) {
    step = -1;
  } else if (isStepMissing) {
    // else default step should be 1
    step = 1;
  }

  // if step is not missing then use the provided step

  const result = [];

  let i = 0;

  // calculate limit with fail safe check
  let limit = Math.abs(end) / Math.abs(step || 1) - start;

  // loop till iterator < limit
  while (i < limit) {
    // push the current value
    result.push(start + i * step);
    i += 1;
  }

  // return the final resulting array
  return result;
}

/********************************* */

function range(start = 0, end, step) {
  // write your solution below
  let ans = [];
  if (!end) {
    end = start;
    start = 0;
  }

  if (step === undefined) {
    end < 0 ? (step = -1) : (step = 1);
  }

  if (step === 0) {
    let counter = start;
    while (counter < end) {
      ans.push(start);
      counter++;
    }
    return ans;
  }

  for (let i = start; end > 0 ? i < end : i > end; i += step) {
    ans.push(i);
  }

  return ans;
}



/**************************** */
Initialize array with a numeric range
We can use Array.from() for the purpose of creating a new array. We need to know the length of the array beforehand, which can be calculated from the range of numbers we want to include.

The general formula for the length of the array is (end - start) / step. All three values are supplied as function arguments. To make sure that the length is an integer, we will use Math.ceil() to round up the result.

const range = (end, start = 0, step = 1) =>
  Array.from(
    { length: Math.ceil((end - start) / step) },
    (_, i) => i * step + start
  );

range(5); // [0, 1, 2, 3, 4]
range(7, 3); // [3, 4, 5, 6]
range(9, 0, 2); // [0, 2, 4, 6, 8]
Initialize array with a reversed numeric range
If you want a reversed range, you might be tempted to use Array.prototype.reverse() on the result of the previous snippet. However, this is relatively inefficient, as it requires iterating over the entire array twice.

Instead, we can modify the mapping function of the previous snippet to produce the desired result, iterating over the given range in reverse. In order to do so, we will need to swap start for end and negate the step value.

const rangeReverse = (end, start = 0, step = 1) =>
  Array.from(
    { length: Math.ceil((end - start) / step) },
    (_, i) => i * -step + end
  );

rangeReverse(5); // [5, 4, 3, 2, 1]
rangeReverse(7, 3); // [7, 6, 5, 4]
rangeReverse(9, 0, 2); // [9, 7, 5, 3, 1]
Generalized range() function, matching Python's signature
Having two functions that serve slightly different purposes is not uncommon, but we can generalize the solution to infer the correct behavior based on the supplied arguments. For reverse ranges, we would simply supply a negative step value.

Another quality of life improvement would be to match Python's range() signatures. This would allow us to supply either (end), (start, end), or (start, end, step) as arguments. Notice the change in order of the first two arguments. In order to do so, we will have to ditch the default values for the arguments and use a conditional statement to check the number of supplied arguments.

const range = (start, end, step) => {
  if (end === undefined) [end, start] = [start, 0];
  if (step === undefined) step = start < end ? 1 : -1;

  return Array.from(
    { length:  Math.ceil((end - start) / step) },
    (_, i) => i * step + start
  );
};

// Positive step value
range(5); // [0, 1, 2, 3, 4]
range(3, 7); // [3, 4, 5, 6]
range(0, 9, 2); // [0, 2, 4, 6, 8]

// Negative step value
range(5, 0, -1); // [5, 4, 3, 2, 1]
range(7, 3); // [7, 6, 5, 4]
range(9, 0, -2); // [9, 7, 5, 3, 1]