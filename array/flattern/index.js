// Implement a function flatten that returns a newly-created array with
// all sub-array elements concatenated recursively into a single level.

// Examples
// // Single-level arrays are unaffected.
// flatten([1, 2, 3]); // [1, 2, 3]

// // Inner arrays are flattened into a single level.
// flatten([1, [2, 3]]); // [1, 2, 3]
// flatten([
//   [1, 2],
//   [3, 4],
// ]); // [1, 2, 3, 4]

// // Flattens recursively.
// flatten([1, [2, [3, [4, [5]]]]]); // [1, 2, 3, 4, 5]
// Companies


function flatten(array) {
    // Create an empty array to hold the flattened elements
    let result = [];

    // Helper function to recursively flatten the array
    function flattenHelper(arr) {
        for (let item of arr) {
            if (Array.isArray(item)) {
                // If the item is an array, call flattenHelper recursively
                flattenHelper(item);
            } else {
                // If it's not an array, push it to the result array
                result.push(item);
            }
        }
    }

    // Start the recursion with the input array
    flattenHelper(array);
    
    return result;
}

// Examples
console.log(flatten([1, 2, 3])); // [1, 2, 3]
console.log(flatten([1, [2, 3]])); // [1, 2, 3]
console.log(flatten([[1, 2], [3, 4]])); // [1, 2, 3, 4]
console.log(flatten([1, [2, [3, [4, [5]]]]])); // [1, 2, 3, 4, 5]
