function separateDuplicatesAndUnique(arr) {
    const counts = arr.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1; // Count occurrences of each number
        return acc;
    }, {});

    const duplicates = Object.keys(counts).filter(key => counts[key] > 1).map(Number);
    const uniques = Object.keys(counts).filter(key => counts[key] === 1).map(Number);

    return {
        duplicates,
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }



function separateDuplicatesAndUnique(arr) {
    const counts = new Map();

    // Count occurrences of each number
    arr.forEach(num => {
        counts.set(num, (counts.get(num) || 0) + 1);
    });

    const duplicates = [];
    const uniques = [];

    // Separate duplicates and unique values
    counts.forEach((count, num) => {
        if (count > 1) {
            duplicates.push(num);
        } else {
            uniques.push(num);
        }
    });

    return {
        duplicates,
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }


function separateDuplicatesAndUnique(arr) {
    const seen = new Set();
    const duplicates = new Set();
    
    // First pass: Identify duplicates
    arr.forEach(num => {
        if (seen.has(num)) {
            duplicates.add(num); // If it's already seen, it's a duplicate
        } else {
            seen.add(num); // Otherwise, add it to seen
        }
    });

    // Second pass: Separate unique values
    const uniques = arr.filter(num => !duplicates.has(num));

    // Convert duplicates back to an array
    return {
        duplicates: Array.from(duplicates),
        uniques
    };
}

// Example usage:
const input = [1, 2, 3, 4, 4, 5, 1, 6, 7, 2];
const result = separateDuplicatesAndUnique(input);
console.log(result);
// Output: { duplicates: [1, 2, 4], uniques: [3, 5, 6, 7] }
