function flattenNestedStructure(input) {
    const flatten = (arr) => {
        return arr.reduce((acc, item) => {
            if (Array.isArray(item)) {
                acc = acc.concat(flatten(item));
            } else if (typeof item === 'object' && item !== null) {
                acc = acc.concat(flatten(Object.values(item)));
            } else {
                acc.push(item);
            }
            return acc;
        }, []);
    };

    return flatten(input);
}

// Example usage:
const input = [
    1,
    [2, 3],
    {
        "key1": "value1",
        "key2": [4, 5],
        "key3": {
            "subkey1": 6,
            "subkey2": [7, 8]
        }
    }
];

console.log(flattenNestedStructure(input));
