/*************************** Array For Fill method ***************************/

Array.prototype.customFill = function (
  filledValue,
  start = 0,
  end = this.length
) {
  for (let i = start; i < end; i++) {
    this[i] = filledValue;
  }
  return this;
};

//declaring array with given values
var Given_values = [1, 2, 3, 4, 5];

console.log(`Given values array ${Given_values}`);

//creating an array filled with given values
var filledArray = Array(2).fill(Given_values);

//printing output array
console.log(`Array filled with given values is [${filledArray}]`);

/************************************************ */

//declaring array with Given values
var Given_values = [1, 2, 3, 4, 5];

console.log("Given values array " + Given_values);

//creating an array filled with Given_values array
var filledArray = Array.from({ length: 1 }, () => Given_values);

//printing output
console.log("Array filled with given values [ " + filledArray + " ]");

/*********************************************************** */

//declaring array with given values var givenValues = [1, 2, 3, 4, 5];
console.log("Given elements:" + givenValues); //create an array filled with   given values
var filledArray = Array.apply(null, Array(1)).map((_, i) => givenValues);
//printing output array console.log('Array filled with given   values [ '+filledArray+' ]');

/******************************************** */

//declaring array with given values
var givenValues = [1, 2, 3, 4, 5];

console.log("Given elements:" + givenValues);

//declaring empty array
var filledArray = [];

//filling array using for loop
for (let i = 0; i < givenValues.length; i++) {
  filledArray.push(givenValues[i]);
}

//printing output array
console.log("Array filled with given values [ " + filledArray + " ]");

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
