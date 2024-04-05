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
