const inputNumber = 42;
const isInteger = Number.isInteger(inputNumber);
console.log(`Is ${inputNumber} an integer? ${isInteger}`);

/***************************************** */
const inputNumber = 3.14;
const isInteger = inputNumber % 1 === 0;
console.log(`Is ${inputNumber} a integer? ${isInteger}`);

/**************************** */

const inputNumber = 123.456;
const numberString = inputNumber.toString();
const isFloat = /\d+\.\d+/.test(numberString);
console.log(`Is ${inputNumber} a float? ${isFloat}`);
