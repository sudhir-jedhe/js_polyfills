// str1 = 'ABCA'
// str2 = 'XYZX'
// 'A' maps to 'X'
// 'B' maps to 'Y'
// 'C' maps to 'Z'

// str1 = 'ABCA'
// str2 = 'WXYZ'
// 'A' maps to 'W'
// 'B' maps to 'X'
// 'C' maps to 'Y'
// 'A' again maps to 'Z'

function isStringIsomorphic(str1, str2) {
  if (str1.length !== str2.length) {
    return false;
  }
  for (let i = 0; i < str1.length; i++) {
    for (let j = i + 1; j < str1.length; j++) {
      if (
        (str1[i] === str1[j] && str2[i] !== str2[j]) ||
        (str1[i] !== str1[j] && str2[i] === str2[j])
      ) {
        return false;
      }
    }
  }
  return true;
}

str1 = "ABCA";
str2 = "XYZX";
console.log(isStringIsomorphic(str1, str2));

/******************************************** */

// JavaScript program for above approach

// Function to check isomorphic strings
function isIsomorphic(str1, str2) {
  // If length of strings are not equal then
  // they are not isomorphic
  if (str1.length !== str2.length) {
    return false;
  }

  // Map to store the mapping between
  // characters of first string to second
  const map = new Map();

  // Set to store the already mapped
  // character of second string
  const set = new Set();

  for (let i = 0; i < str1.length; i++) {
    // Taking ith char from both strings
    char1 = str1.charAt(i);
    char2 = str2.charAt(i);

    // If char1 has already been mapped
    if (map.has(char1) == true) {
      // Then we have to check that
      // mapped char should be same
      if (map.get(char1) !== char2) {
        return false;
      }
    }

    // If char1 is appearing for the first time
    else {
      // Check in the set that the char2
      // is already there or not
      if (set.has(char2)) {
        return false;
      }

      // If none of above condition is true
      // it means both char1 and char2 are
      // appearing for the first time
      // insert them into the map
      map.set(char1, char2);
      set.add(char2);
    }
  }
  return true;
}
str1 = "ABCA";
str2 = "XYZX";
console.log(isIsomorphic(str1, str2));
