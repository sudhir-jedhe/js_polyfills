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



const isFloat = (num) => {

    // check if the input value is a number
    if(typeof num == 'number' && !isNaN(num)){
   
        // check if it is float
        // alter this condition to check the integer
        if (!Number.isInteger(num)) {
            return true
        }
    } 
  
  return false;
}

console.log(isFloat(100)); // false
console.log(isFloat(100.1)); // true
console.log(isFloat(null)); // false