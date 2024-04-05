let gcd = (num1, num2) => {
  //Loop till both numbers are not equal
  while (num1 != num2) {
    //check if num1 > num2
    if (num1 > num2) {
      //Subtract num2 from num1
      num1 = num1 - num2;
    } else {
      //Subtract num1 from num2
      num2 = num2 - num1;
    }
  }

  return num2;
};

let gcd = (num1, num2) => {
  //Loop till both numbers are not equal
  while (num1 != num2) {
    //check if num1 > num2
    if (num1 > num2) {
      //Subtract num2 from num1
      num1 = num1 - num2;
    } else {
      //Subtract num1 from num2
      num2 = num2 - num1;
    }
  }

  return num2;
};

let gcd = (num1, num2) => {
  //if num2 is 0 return num1;
  if (num2 === 0) {
    return num1;
  }

  //call the same function recursively
  return gcd(num2, num1 % num2);
};

Input: console.log(gcd(60, 15));
console.log(gcd(36, 60));

Output: 15;
12;
