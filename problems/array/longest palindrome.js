const longestPalindrome = (s) => {
  let max = Number.MIN_SAFE_INTEGER;
  let palindromeStr = "";

  for (let i = 0; i < s.length; i++) {
    //If we have already have palindrome string
    //Greater than remaining string to be checked
    //Then break
    if (max > s.length - i) {
      break;
    }

    let forward = "";
    let reverse = "";

    for (let j = i; j < s.length; j++) {
      //Forward substring
      forward = forward + s[j];

      //Reverse substring
      reverse = s[j] + reverse;

      //If forward === reverse then it is a palindrome
      //So store if it is greater than max
      if (forward === reverse && max < forward.length) {
        max = forward.length;
        palindromeStr = forward;
      }
    }
  }

  return palindromeStr;
};

Input: console.log(longestPalindrome("abbc"));
console.log(longestPalindrome("babad"));
console.log(longestPalindrome("adccda"));

Output: "bb";
("bab");
("adccda");
