function countGoodSubsequences(arr) {
    // Step 1: Extract unique elements and sort them
    let uniqueArr = [...new Set(arr)].sort((a, b) => a - b);

    let n = uniqueArr.length;
    let count = 0;

    // Step 2: Generate all contiguous subarrays
    for (let i = 0; i < n; i++) {
        for (let j = i; j < n; j++) {
            // Check if the subarray [uniqueArr[i], ..., uniqueArr[j]] is good
            let isGood = true;
            for (let k = i; k <= j; k++) {
                if (uniqueArr[k] !== uniqueArr[i] + (k - i)) {
                    isGood = false;
                    break;
                }
            }
            if (isGood) {
                count++;
            }
        }
    }

    return count;
}

// Example usage:
const arr = [1, 2, 3, 1, 2];
console.log(countGoodSubsequences(arr));  // Output: 6


// CountGoodSubsequences. Conditions for good:


// all elements in sequence are unique
// if minimum in sequence is a, max is b, then all numbers in the range [a,b] should be present in the sequence.