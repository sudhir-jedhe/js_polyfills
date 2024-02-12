function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}

// Example usage:
fizzBuzz(15);

/****************************** */
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    let output = "";

    if (i % 3 === 0) {
      output += "Fizz";
    }

    if (i % 5 === 0) {
      output += "Buzz";
    }

    // If neither 3 nor 5 divides the number, print the number itself
    if (output === "") {
      output = i;
    }

    console.log(output);
  }
}

// Example usage:
fizzBuzz(20);

/********************************************* */
function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    // Check if the number is divisible by both 3 and 5
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    }
    // Check if the number is divisible by 3
    else if (i % 3 === 0) {
      console.log("Fizz");
    }
    // Check if the number is divisible by 5
    else if (i % 5 === 0) {
      console.log("Buzz");
    }
    // If the number is not divisible by 3 or 5, print the number itself
    else {
      console.log(i);
    }
  }
}

// Example usage:
fizzBuzz(15);
