Given a string s, return the number of segments in the string.

A segment is defined to be a contiguous sequence of non-space characters.

 

Example 1:

Input: s = "Hello, my name is John"
Output: 5
Explanation: The five segments are ["Hello,", "my", "name", "is", "John"]
Example 2:

Input: s = "Hello"
Output: 1


class Solution {
    countSegments(s) {
        let ans = 0;
        for (let i = 0; i < s.length; ++i) {
            if (s[i] !== ' ' && (i === 0 || s[i - 1] === ' ')) {
                ++ans;
            }
        }
        return ans;
    }
}


const solution = new Solution();
console.log(solution.countSegments("Hello, my name is John")); // Output: 5
console.log(solution.countSegments("   This is   a test "));  // Output: 4
