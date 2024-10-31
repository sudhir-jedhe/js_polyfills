function customOmit(object, keys) {
    if (!object || typeof object !== 'object') {
        throw new TypeError('First argument must be an object');
    }

    const result = {};

    // Ensure keys is an array
    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const key in object) {
        if (object.hasOwnProperty(key) && !keysArray.includes(key)) {
            result[key] = object[key]; // Copy property if not in keys
        }
    }

    return result; // Return the new object without omitted keys
}

// Example usage
const data = {
    name: 'Alice',
    age: 30,
    city: 'Wonderland',
    country: 'Fictional',
};

const omittedData = customOmit(data, ['age', 'city']);
console.log(omittedData); // Output: { name: 'Alice', country: 'Fictional' }

const omittedSingle = customOmit(data, 'country');
console.log(omittedSingle); // Output: { name: 'Alice', age: 30, city: 'Wonderland' }
