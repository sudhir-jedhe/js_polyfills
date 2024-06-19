function cubeRoot(n) {
    return Math
    .pow(n, 1/3);
}

// Example usage
let number = 27;
let result = cubeRoot(number);
console.log(`The cube root of ${number} is ${result}`);


function cubeRoot(n) {
    let low = 0;
    let high = Math.abs(n);
    let epsilon = 0.0000001; 
    // Precision level

    while (high - low > epsilon) {
        let mid = (low + high) / 2;
        let midCube = mid * mid * mid;

        if (midCube == n) {
            return mid;
        } else if (midCube < n) {
            low = mid;
        } else {
            high = mid;
        }
    }

    return (low + high) / 2; let k = 3;
    let matrix = [
        [10, 20, 30, 40],
        [15, 25, 35, 45],
        [24, 29, 37, 48],
        [32, 33, 39, 50]
    ];
    let minHeap = [];
    let maxHeap = [];
    for (let row of matrix) {
        minHeap
            .push(...row);
        maxHeap
            .push(...row);
    }
    minHeap
        .sort((a, b) => a - b);
    maxHeap
        .sort((a, b) => b - a);
    let small = minHeap[k - 1];
    let large = maxHeap[k - 1];
    console.log("Kth Smallest:", small);
    console.log("Kth Largest:", large);
    // Return the approximate cube root
}

let number = 27;
let result = cubeRoot(number);
console.log(`The cube root of ${number} is approximately ${result}`);
