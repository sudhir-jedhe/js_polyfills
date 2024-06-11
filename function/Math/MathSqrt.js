function mySqrt(x) {
    if (x < 0) return NaN; // Return NaN for negative numbers
    if (x === 0 || x === 1) return x; // Return x for 0 and 1

    let left = 1;
    let right = x;
    let result = 0;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (mid * mid === x) {
            return mid; // Return mid if it's a perfect square
        } else if (mid * mid < x) {
            left = mid + 1;
            result = mid; // Update result if mid is a potential square root
        } else {
            right = mid - 1;
        }
    }

    return result; // Return the closest integer square root
}

// Example usage:
// const result = mySqrt(8);
// console.log(result); // Output: 2 (since the square root of 8 is approximately 2.83)
