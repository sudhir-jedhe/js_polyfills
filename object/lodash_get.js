function customGet(object, path, defaultValue) {
    if (!object || typeof object !== 'object') {
        return defaultValue; // Return default value if the object is not valid
    }

    const pathArray = Array.isArray(path) ? path : path.split('.'); // Convert path to array if it's a string
    let current = object;

    for (const key of pathArray) {
        if (current === null || current === undefined || !(key in current)) {
            return defaultValue; // Return default if the key is not found
        }
        current = current[key]; // Traverse the object
    }

    return current; // Return the found value
}

// Example usage
const data = {
    user: {
        info: {
            name: 'Alice',
            age: 30,
            address: {
                city: 'Wonderland',
                zip: '12345',
            },
        },
    },
};

console.log(customGet(data, 'user.info.name')); // Output: 'Alice'
console.log(customGet(data, 'user.info.address.city')); // Output: 'Wonderland'
console.log(customGet(data, 'user.info.address.country', 'Unknown')); // Output: 'Unknown'
console.log(customGet(data, 'user.info.age')); // Output: 30
console.log(customGet(data, 'user.info.hobbies', [])); // Output: []
console.log(customGet(data, ['user', 'info', 'name'])); // Output: 'Alice'


