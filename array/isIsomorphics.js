// somorphic Strings
// Easy
// Topics
// Companies
// Given two strings s and t, determine if they are isomorphic.

// Two strings s and t are isomorphic if the characters in s can be replaced to get t.

// All occurrences of a character must be replaced with another character while preserving the order of characters. No two characters may map to the same character, but a character may map to itself.

 

// Example 1:

// Input: s = "egg", t = "add"
// Output: true
// Example 2:

// Input: s = "foo", t = "bar"
// Output: false
// Example 3:

// Input: s = "paper", t = "title"
// Output: true


function isIsomorphic(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    
    const s_to_t = new Map(); // Map for character mapping from s to t
    const t_to_s = new Map(); // Map for character mapping from t to s
    
    for (let i = 0; i < s.length; i++) {
        const charS = s[i];
        const charT = t[i];
        
        // Check mapping from s to t
        if (s_to_t.has(charS)) {
            if (s_to_t.get(charS) !== charT) {
                return false;
            }
        } else {
            s_to_t.set(charS, charT);
        }
        
        // Check mapping from t to s
        if (t_to_s.has(charT)) {
            if (t_to_s.get(charT) !== charS) {
                return false;
            }
        } else {
            t_to_s.set(charT, charS);
        }
    }
    
    return true;
}

// Example cases
console.log(isIsomorphic("egg", "add"));      // Output: true
console.log(isIsomorphic("foo", "bar"));      // Output: false
console.log(isIsomorphic("paper", "title"));  // Output: true

/********************** */



function isIsomorphic(s, t) {
    if (s.length !== t.length) return false; // Length mismatch implies non-isomorphism
  
    const mapS = new Map();
    const mapT = new Map();
  
    for (let i = 0; i < s.length; i++) {
      const charS = s[i];
      const charT = t[i];
  
      if (mapS.has(charS)) {
        if (mapS.get(charS) !== charT) {
          return false; // Inconsistent mapping for s
        }
      } else if (mapT.has(charT)) {
        return false; // Inconsistent mapping for t
      } else {
        mapS.set(charS, charT);
        mapT.set(charT, charS);
      }
    }
  
    return true;
  }
  
  // Example usage
  const s1 = "egg";
  const t1 = "add";
  const s2 = "foo";
  const t2 = "bar";
  const s3 = "paper";
  const t3 = "title";
  
  console.log(isIsomorphic(s1, t1)); // Output: true
  console.log(isIsomorphic(s2, t2)); // Output: false
  console.log(isIsomorphic(s3, t3)); // Output: true
  