// float value is 4.59;
let x = 4.59;
let z = Math.floor(x);
console.log("Converted value of " + x + " is " + z); // 4

// float value is 4.59;
let x = 4.59;
let z = Math.ceil(x);
console.log("Converted value of " + x + " is " + z); // 5

// float value is 4.59;
let x = 4.59;
let z = Math.round(x);
console.log("Converted value of " + x + " is " + z); // 5

// float value is 4.59;
let x = 4.59;
let z = Math.trunc(x);
console.log("Converted value of " + x + " is " + z); //4

// float value is 3.54;
let x = 3.54;
let z = parseInt(x);
console.log("Converted value of " + x + " is " + z); // 3

// float value is 4.59;
let x = 4.59;
let z = ~~x;
console.log("Converted value of " + x + " is " + z); // 4

// float value is 5.67;
let x = 5.67;
let z = x | 0;
console.log("Converted value of " + x + " is " + z); // 5

// float value is 5.63;
let x = 5.63;
let z = x >> 0;
// It is same as we are dividing the value by 1.
console.log("Converted value of " + x + " is " + z); //5

// float value is 5.68;
let x = 5.68;
// It is same as we are dividing the value by 1.
let z = x >>> 0;
console.log("Converted value of " + x + " is " + z); //5

// float value is 5.48;
let x = 5.48;
let z = x - (x % 1);
console.log("Converted value of " + x + " is " + z); //5

// float value is 5.49;
let x = 5.49;
let z = x ^ 0;
console.log("Converted value of " + x + " is " + z); //5
