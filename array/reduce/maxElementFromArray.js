// Getting the maximum element of an array


const arr = [1, 2, 3];
const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);


function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }
  

  function findMinMax(array) {
    if (array.length === 0) {
        return { max: undefined, min: undefined };
    }

    let max = array[0];
    let min = array[0];

    for (let i = 1; i < array.length; i++) {
        if (array[i] > max) {
            max = array[i];
        }
        if (array[i] < min) {
            min = array[i];
        }
    }

    return { max, min };
}

// Example usage:
const numbers = [3, 1, 7, 4, 9, 2];
const result = findMinMax(numbers);
console.log("Maximum:", result.max); // Output: 9
console.log("Minimum:", result.min); // Output: 1


/********************** */

function findMinMax() {
  let Arr = [50, 60, 20, 10, 40];

  let minValue = Math.min(...Arr);
  let maxValue = Math.max(...Arr);
  
  console.log("Minimum element is:" + minValue);
  console.log("Maximum Element is:" + maxValue);
}

findMinMax()


/******************* */

function findMinMax() {
  let Arr = [50, 60, 20, 10, 40];
  let minValue = Infinity;
  let maxValue = -Infinity;

  for (let item of Arr) {

      // Find minimum value
      if (item < minValue)
          minValue = item;

      // Find maximum value
      if (item > maxValue)
          maxValue = item;
  }

  console.log("Minimum element is:" + minValue);
  console.log("Minimum element is:" + maxValue);
}

findMinMax();
/*********************** */

// Input array
let Arr = [50, 60, 20, 10, 40];

// Getting min value
let minValue = Arr.reduce((acc, current) => Math.min(acc, current));

// Getting max value
let maxValue = Arr.reduce((acc, current) => Math.max(acc, current));

// Display output
 console.log("Minimum element is:" + minValue);
 console.log("Minimum element is:" + maxValue);


 /****************************************** */
 // Sample array
const numbers = [5, 2, 8, 1, 4];

// Using apply method to find the minimum element
const minElement = Math.min.apply(null, numbers);
console.log('Minimum Element:', minElement);

// Using apply method to find the maximum element
const maxElement = Math.max.apply(null, numbers);
console.log('Maximum Element:', maxElement);


/*********************************** */
// Array
let s = [3, 2, 3, 4, 5];
function Gfg() {

    // Storing the first item and second in a variable
    let [f, l] = s.filter((item, i) => 
                (i == 0) || (i == s.length - 1));

    // Printing output to screen
    console.log("first element is " + f);
    console.log(" Last element is " + l);
}
Gfg(); // Calling the function


const array = [1, 2, 3, 4, 5];

const [firstItem, ...rest] = array;
const lastItem = rest.pop();

console.log('First item:', firstItem);
console.log('Last item:', lastItem);

// Get the array first and last elements using Array.at() method
function gfg() {
  let s = ["Geeks", "for", "geeks", "computer", "science"];

  // Get the first element (index 0)
  console.log(s.at(0))

  // Get the last element (index: length - 1)
  console.log(s.at(s.length - 1))
}

// Call the function
gfg();


// Array
let s = [3, 2, 3, 4, 5];
function Gfg() {

    // Storing the first item in a variable
    let f = s.find((_, index) => index === 0);

    // Storing the last item
    let l = s.find((_, index) => index === s.length - 1);

    // Printing output to screen
    console.log("first element is " + f);
    console.log("Last element is " + l);
}
Gfg(); // Calling the function
