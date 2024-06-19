function gcd(a, b) {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }
  return a;
}

function lcmFunction(a, b) {
  const gcdValue = gcd(a, b);
  return (a * b) / gcdValue;
}

let num1 = 12;
let num2 = 18;
let lcm = lcmFunction(num1, num2);
console.log("LCM of given numbers is :", lcm);

// JavaScript program to find LCM of 2 numbers
// without using GCD

// Function to return LCM of two numbers
function findLCM(a, b) {
  let lar = Math.max(a, b);
  let small = Math.min(a, b);
  for (i = lar; ; i += lar) {
    if (i % small == 0) return i;
  }
}

// Driver program to test above function
let a = 5,
  b = 7;
console.log("LCM of " + a + " and " + b + " is " + findLCM(a, b));


function lcmFunction(a, b) { 
	let larger = Math.max(a, b); 
	let smaller = Math.min(a, b); 
	for (let i = larger; ; i += larger) { 
		if (i % smaller === 0) { 
			return i; 
		} 
	} 
} 

let num1 = 12; 
let num2 = 18; 
let result = lcmFunction(num1, num2); 
console.log(`LCM of ${num1} and ${num2} is ${result}`);
