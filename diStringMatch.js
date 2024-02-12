// diStringMatch.js
export function diStringMatch(s) {
  const n = s.length;
  let lo = 0,
    hi = n;
  const perm = [];

  for (let i = 0; i <= n; i++) {
    if (s[i] === "I") {
      perm.push(lo++);
    } else {
      perm.push(hi--);
    }
  }

  return perm;
}

// Input: s = "IDID" Output: [0,4,1,3,2]

// Example 2:

// Input: s = "III" Output: [0,1,2,3]

// Example 3:

// Input: s = "DDI" Output: [3,2,0,1]
