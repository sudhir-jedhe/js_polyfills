// Input: n = 123
// Output: 231 312
// Input: n = 1445
// Output: 4451 4514 5144

// Javascript implementation of the approach

// Function to return the count of digits of n
function numberOfDigits(n) {
  let cnt = 0;
  while (n > 0) {
    cnt++;
    n = parseInt(n / 10, 10);
  }
  return cnt;
}

// Function to print the left shift numbers
function cal(num) {
  let digits = numberOfDigits(num);
  let powTen = Math.pow(10, digits - 1);

  for (let i = 0; i < digits - 1; i++) {
    let firstDigit = parseInt(num / powTen, 10);

    // Formula to calculate left shift
    // from previous number
    let left = num * 10 + firstDigit - firstDigit * powTen * 10;
    document.write(left + " ");

    // Update the original number
    num = left;
  }
}

let num = 1445;
cal(num);

/***************************************************** */

// Function to print the left shift numbers
function cal(num) {
  var temp = "" + num;
  var len = temp.length;
  temp += temp;
  for (let i = 1; i * 2 < temp.length; i++) {
    console.log(temp.slice(i, i + len));
  }
}

let num = 1445;
cal(num);
