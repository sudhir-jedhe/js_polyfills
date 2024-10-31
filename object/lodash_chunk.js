function customChunk(array, size) {
    if (!Array.isArray(array) || size <= 0) {
        return []; // Return an empty array for invalid input
    }

    const result = [];
    for (let i = 0; i < array.length; i += size) {
        // Slice the array into chunks of the specified size
        result.push(array.slice(i, i + size));
    }

    return result;
}

// Example usage
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const chunkedArray = customChunk(array, 3);

console.log(chunkedArray); // Output: [ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]

const chunkedArray2 = customChunk(array, 4);
console.log(chunkedArray2); // Output: [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9 ] ]

const chunkedArray3 = customChunk([], 2);
console.log(chunkedArray3); // Output: []
