function countOccurrences(arr) {
    const counts = new Map();

    // Count occurrences of each number
    arr.forEach(num => {
        counts.set(num, (counts.get(num) || 0) + 1);
    });

    return counts;
}

// Example usage:
const input = [1, 2, 2, 3, 1, 4, 5, 1, 3];
const result = countOccurrences(input);
console.log(result);
// Output: Map(5) { 1 => 3, 2 => 2, 3 => 2, 4 => 1, 5 => 1 }


function countOccurrences(arr) {
    const counts = {};

    // Count occurrences of each number
    arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
    });

    return counts;
}

// Example usage:
const input = [1, 2, 2, 3, 1, 4, 5, 1, 3];
const result = countOccurrences(input);
console.log(result);
// Output: { '1': 3, '2': 2, '3': 2, '4': 1, '5': 1 }


function countOccurrences(arr) {
    return arr.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1; // Increment the count for each number
        return acc; // Return the accumulator for the next iteration
    }, {});
}

// Example usage:
const input = [1, 2, 2, 3, 1, 4, 5, 1, 3];
const result = countOccurrences(input);
console.log(result);
// Output: { '1': 3, '2': 2, '3': 2, '4': 1, '5': 1 }
