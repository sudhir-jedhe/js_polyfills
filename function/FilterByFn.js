function filter(arr, fn) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        if (fn(arr[i], i)) {
            result.push(arr[i]);
        }
    }
    return result;
}

// Test cases
const arr1 = [0, 10, 20, 30];
const fn1 = function greaterThan10(n) {
    return n > 10;
};
console.log(filter(arr1, fn1)); // Output: [20, 30]

const arr2 = [1, 2, 3];
const fn2 = function firstIndex(n, i) {
    return i === 0;
};
console.log(filter(arr2, fn2)); // Output: [1]

const arr3 = [-2, -1, 0, 1, 2];
const fn3 = function plusOne(n) {
    return n + 1;
};
console.log(filter(arr3, fn3)); // Output: [-2, -1, 0, 1, 2]
