function findMatches(data, match) {
    return data.filter(item => {
        for (const key in match) {
            if (match.hasOwnProperty(key)) {
                if (item[key] !== match[key]) {
                    return false; // If any key-value pair does not match, exclude the item
                }
            }
        }
        return true; // Include the item if all key-value pairs match
    });
}

// Example usage:
const data = [
    { id: 1, name: 'John', age: 30 },
    { id: 2, name: 'Alice', age: 25 },
    { id: 3, name: 'Bob', age: 35 }
];

const match = { age: 30 };

const matches = findMatches(data, match);
console.log(matches);
