// Ques 1 - Palindrome Number
// An integer is a palindrome when it reads the same forward and backward.

// Input: x = 121  ----->>>>>   Output: true
// Input: x = 10   ----->>>>>   Output: false

var isPalindrome = function (x) {
  return x < 0 ? false : x === +x.toString().split("").reverse().join("");
};

const res = isPalindrome(10);
console.log(res);

// 121 => "121" => ["1","2","1"] => ["1","2","1"] => "121"

function isPalindrome(str) {
  // Remove non-alphanumeric characters and convert to lowercase
  const cleanStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
  // Compare the original string with its reverse
  return cleanStr === cleanStr.split('').reverse().join('');
}

// Test the function
console.log(isPalindrome("manuunam")); // Output: true
console.log(isPalindrome("race car")); // Output: false
console.log(isPalindrome("algochurn practice")); // Output: false



/ Time: O(n)
const palindromeCheckTwoPointers = (str) => {
  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
};

const str = "manuunam";
console.log(palindromeCheckTwoPointers(str));


const palindromeCheckRecursive = (str, i = 0) => {
  let j = str.length - 1 - i;
  if (i >= j) {
    return true;
  }
  if (str[i] !== str[j]) {
    return false;
  }
  return palindromeCheckRecursive(str, i + 1);
};

const str = "manuunam";
console.log(palindromeCheckRecursive(str));