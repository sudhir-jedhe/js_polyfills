The task is to reformat a given license key string `s` according to specific rules:

1. The string contains alphanumeric characters and dashes (`-`).
2. We need to group the characters into groups of size `k`, except the first group, which can be shorter but must contain at least one character.
3. Dashes should be inserted between the groups, and all characters should be converted to uppercase.
4. The result should not contain leading or trailing dashes.

Let's break down the approach to solve this problem:

### **Steps:**

1. **Remove Dashes**: The first step is to remove all the dashes from the string `s` so that we only deal with the alphanumeric characters.
2. **Group the Characters**: We need to group the characters into blocks of size `k`. The first group can be smaller if necessary, but all subsequent groups should be exactly `k` characters long.
3. **Uppercase the Characters**: Convert all the alphanumeric characters to uppercase.
4. **Insert Dashes Between Groups**: Add dashes (`-`) between the groups.
5. **Return the Result**: Join the groups and return the formatted string.

### **Solution Implementation:**

```typescript
function licenseKeyFormatting(s: string, k: number): string {
    // Step 1: Remove dashes and convert to uppercase
    const cleanStr = s.replace(/-/g, '').toUpperCase();
    
    // Step 2: Find the length of the first group
    const n = cleanStr.length;
    let firstGroupLength = n % k || k; // The first group length is the remainder of n / k, or k if it's 0
    
    // Step 3: Initialize result array
    const result: string[] = [];
    
    // Step 4: Add the first group (if it is smaller than k)
    result.push(cleanStr.substring(0, firstGroupLength));
    
    // Step 5: Add remaining groups
    for (let i = firstGroupLength; i < n; i += k) {
        result.push(cleanStr.substring(i, i + k));
    }
    
    // Step 6: Join the groups with dashes and return the result
    return result.join('-');
}
```

### **Explanation:**

1. **Removing Dashes and Uppercasing**: 
   - We use `replace(/-/g, '')` to remove all dashes from the string.
   - We use `toUpperCase()` to convert the remaining characters to uppercase.
   
2. **First Group Length**:
   - The first group can be smaller than `k`, but it must still have at least one character. We calculate the length of the first group by using `n % k`. If the remainder is zero (i.e., the string length is a perfect multiple of `k`), the first group will contain exactly `k` characters.
   
3. **Iterating Through the String**:
   - After the first group, we iterate through the remaining string in chunks of size `k`, adding each chunk to the result array.
   
4. **Joining the Groups**:
   - Finally, we join all groups using a dash (`-`) and return the formatted string.

### **Test Cases:**

#### Example 1:
```typescript
const result = licenseKeyFormatting("5F3Z-2e-9-w", 4);
console.log(result);  // Output: "5F3Z-2E9W"
```

**Explanation**:  
- Remove dashes and uppercase the string: `"5F3Z2E9W"`.
- The first group has `4` characters: `"5F3Z"`.
- The remaining characters form the second group: `"2E9W"`.
- The result is `"5F3Z-2E9W"`.

#### Example 2:
```typescript
const result2 = licenseKeyFormatting("2-5g-3-J", 2);
console.log(result2);  // Output: "2-5G-3J"
```

**Explanation**:  
- Remove dashes and uppercase the string: `"25G3J"`.
- The first group has `1` character: `"2"`.
- The next groups are `"5G"` and `"3J"`.
- The result is `"2-5G-3J"`.

### **Time Complexity:**
- **O(n)**: The time complexity is `O(n)`, where `n` is the length of the input string `s`. We iterate through the string a few times:
  - Once to remove the dashes and uppercase the characters (`O(n)`).
  - Once to split the string into groups of size `k` and append to the result (`O(n)`).
  
### **Space Complexity:**
- **O(n)**: We use an additional array `result` to store the groups, which takes up `O(n)` space.

This solution efficiently handles the problem within the constraints.