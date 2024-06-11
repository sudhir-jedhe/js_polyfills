function uniqueOccurrences(arr) {
    const occurrenceCount = new Map();

    // Count occurrences of each integer
    for (const num of arr) {
        occurrenceCount.set(num, (occurrenceCount.get(num) || 0) + 1);
    }

    const occurrenceSet = new Set(occurrenceCount.values());

    // Check if the count of occurrences is unique
    return occurrenceSet.size === occurrenceCount.size;
}

// Test cases
const arr1 = [1, 2, 2, 1, 1, 3];
console.log(uniqueOccurrences(arr1)); // Output: true

const arr2 = [1, 2];
console.log(uniqueOccurrences(arr2)); // Output: false

const arr3 = [-3, 0, 1, -3, 1, 1, 1, -3, 10, 0];
console.log(uniqueOccurrences(arr3)); // Output: true
