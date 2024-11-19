class Solution {
    checkPerfectNumber(num) {
      if (num === 1) {
        return false;
      }
      let s = 1; // Start with 1 as it's always a divisor of any number
      for (let i = 2; i * i <= num; ++i) {
        if (num % i === 0) {
          s += i;
          if (i !== num / i) {
            s += num / i;
          }
        }
      }
      return s === num;
    }
  }

  
  let sol = new Solution();
console.log(sol.checkPerfectNumber(28)); // true, because 28 is a perfect number (1 + 2 + 4 + 7 + 14 = 28)
console.log(sol.checkPerfectNumber(6));  // true, because 6 is a perfect number (1 + 2 + 3 = 6)
console.log(sol.checkPerfectNumber(12)); // false, because 12 is not a perfect number
