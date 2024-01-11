function sum(a, b) { 
    return a + b; 
} 
  
// Defining another global function  
function multiply(a, b) { 
    return a * b; 
} 
// Function calls 
console.log(sum(4, 6));  
console.log(multiply(4, 6))

/****************************************** */

// Defining a function to be exported 
function sum(a, b) { 
    return a + b; 
} 
  
// Defining another function to be exported 
function multiply(a, b) { 
    return a * b; 
} 
  
// Exporting the functions 
export { sum, multiply }; 

import { sum, multiply } from './helper.js'; 
  
// Function calls 
console.log(sum(4, 6));  
console.log(multiply(4, 6));  

/*********************************************** */

// Defining a Helper module 
const Helper = (function () { 
  
    // Defining a function to be exported 
    function sum(a, b) { 
        return a + b; 
    } 
  
    // Defining another function to be exported 
    function multiply(a, b) { 
        return a * b; 
    } 
  
    // Returning the functions 
    return { 
        sum: sum, 
        multiply: multiply, 
    }; 
})(); 
  
// Exporting the Helper module 
export default Helper;

// Importing the Helper module 
import Helper from './helper'; 
  
// Calling the imported functions 
console.log(Helper.sum(4, 6)); 
console.log(Helper.multiply(4, 6));