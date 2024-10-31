function largestUniqueNumber(nums) {
    const frequencyMap = new Map();
    
    // Step 1: Populate frequency map
    for (let num of nums) {
        if (frequencyMap.has(num)) {
            frequencyMap.set(num, frequencyMap.get(num) + 1);
        } else {
            frequencyMap.set(num, 1);
        }
    }
    
    let maxUnique = -1;
    
    // Step 2: Find the largest unique number
    for (let [num, count] of frequencyMap) {
        if (count === 1 && num > maxUnique) {
            maxUnique = num;
        }
    }
    
    return maxUnique;
}

// Example usage:
console.log(largestUniqueNumber([5, 7, 3, 9, 4, 9, 8, 3, 3])); // Output: 8
console.log(largestUniqueNumber([9, 9, 8, 8])); // Output: -1
console.log(largestUniqueNumber([1, 2, 3, 4, 5])); // Output: 5
