/******************************************** */

/******************************************** */
//declaring array with given values
var givenValues = [1, 2, 3, 4, 5];

console.log("Given elements:" + givenValues);

//filling array using spread operator
var filledArray = [...givenValues];

//printing output array
console.log("Array filled with given values [ " + filledArray + " ]");

/********************** */

const length = 5;
const value = 5;
const filledArray = new Array(length).fill(value);
console.log(filledArray);

/************************** */
// Creating an array filled with  zero's in efficient way
let filledArray = Array(10).fill(0);

// Printing output array
console.log(`Array filled with zero's
values is [${filledArray}]`);

/***************************** */
// Creating 2d array filled with zero values
const arr2D = new Array(3).fill().map(() => new Array(3).fill(0));
// Printing output
console.log(`2D array filled with zero's is`);
console.log(arr2D);

/********************************** */

function customFill(value, start, end) {
  // DO NOT REMOVE
  "use strict";

  // write your code below
  if (!start && !end) {
    for (let i = 0; i < this.length; i++) {
      this[i] = value;
    }
  } else if (start && !end) {
    for (let i = start; i < this.length; i++) {
      this[i] = value;
    }
  } else if (start < 0 && end < 0) {
    for (let i = start + this.length; i < end + this.length; i++) {
      this[i] = value;
    }
  } else {
    for (let i = start; i < end; i++) {
      this[i] = value;
    }
  }

  return this;
}

Array.prototype.customFill = customFill;

/******************************************** */

function customFill(value, start, end) {
  // DO NOT REMOVE
  "use strict";

  // write your code below
  if (
    start >= this.length ||
    end <= start ||
    (start != undefined && isNaN(start)) ||
    (end != undefined && isNaN(end))
  ) {
    return this;
  }

  if (!start || start < -this.length) {
    start = 0;
  } else if (start < 0) {
    start = start + this.length;
  }

  if (!end || end >= this.length) {
    end = this.length;
  } else if (end < -this.length) {
    end = 0;
  } else if (end < 0) {
    end = end + this.length;
  }
  for (let idx = 0; idx < this.length; idx++) {
    if (idx >= start && idx < end) {
      this[idx] = value;
    }
  }
  return this;
}

Array.prototype.customFill = customFill;

/*********************************************** */

function customFill(value, start, end) {
  // DO NOT REMOVE
  "use strict";
  let actualStart = 0;
  let actualEnd = this.length;

  if (
    (start !== undefined && isNaN(start)) ||
    (end !== undefined && isNaN(end))
  ) {
    return this;
  }

  if (!start) {
    actualStart = 0;
  } else if (start < 0) {
    actualStart = start + this.length;
  } else if (start < this.length * -1) {
    actualStart = 0;
  } else if (start >= this.length) {
    return this;
  } else {
    actualStart = start;
  }

  if (!end) {
    actualEnd = this.length;
  } else if (end < 0) {
    actualEnd = end + this.length;
  } else if (start < this.length * -1) {
    actualEnd = 0;
  } else if (end >= this.length) {
    actualEnd = this.length;
  } else {
    actualEnd = end;
  }

  for (let i = actualStart; i <= actualEnd - 1; i++) {
    this[i] = value;
  }
  return this;
}

Array.prototype.customFill = customFill;
