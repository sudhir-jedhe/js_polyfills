isPalindrome(123321); // Output: true
isPalindrome(12321); // Output: true
isPalindrome(123); // Output: false

export const isPalindrome = (number) => {
  const stringNum = number.toString();
  return (stringNum === stringNum.split("").reverse().join("")) === true
    ? true
    : false;
};

export const isPalindrome = (str) => {
  str = str.toLowerCase();
  return str === str.split("").reverse().join("");
};

export const isPalindrome = (str) => {
  str = str.toLowerCase();
  let start = 0,
    end = str.length - 1;
  while (start < end) {
    if (str[start] !== str[end]) return false;
    start++;
    end--;
  }
  return true;
};
