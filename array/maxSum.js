function maxSum(arr1, arr2) {
    // Step 1: Sort arr1 in ascending order and arr2 in descending order
    arr1.sort((a, b) => a - b);  // Sort arr1 in ascending order
    arr2.sort((a, b) => b - a);  // Sort arr2 in descending order

    // Step 2: Calculate the maximum sum S
    let result = 0;
    for (let i = 0; i < arr1.length; i++) {
        result += (i + 1) * (arr2[i] - arr1[i]);
    }

    return result;
}

// Example usage
const arr1 = [1, 2, 3];
const arr2 = [3, 2, 1];
console.log(maxSum(arr1, arr2));  // Output: 6


// two arrays arr1, arr2. U can swap 2 elements of the array any number of times. Find the max possible sum of i*(arr2[i]-arr1[i]) for 1<= i <= n