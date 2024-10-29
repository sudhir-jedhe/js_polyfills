function moveZeroes(nums) {
    let nonZeroPointer = 0;

    // Move non-zero elements to the beginning of the array
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            nums[nonZeroPointer] = nums[i];
            nonZeroPointer++;
        }
    }

    // Fill the remaining elements with zeroes
    for (let i = nonZeroPointer; i < nums.length; i++) {
        nums[i] = 0;
    }

    return nums;
}

// Test cases
console.log(moveZeroes([0,1,0,3,12])); // Output: [1,3,12,0,0]
console.log(moveZeroes([1,0,0,4,5])); // Output: [1,4,5,0,0]
console.log(moveZeroes([0])); // Output: [0]


function moveZeroesToEnd(arr) {
    let lastNonZeroIndex = 0; // Pointer for the position of the last non-zero element

    // Move non-zero elements to the front of the array
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== 0) {
            arr[lastNonZeroIndex] = arr[i];
            lastNonZeroIndex++;
        }
    }

    // Fill the remaining positions with zeros
    for (let i = lastNonZeroIndex; i < arr.length; i++) {
        arr[i] = 0;
    }

    return arr;
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]


/******************************************** */

function moveZeroesToEnd(arr) {
    // Filter out all non-zero elements
    const nonZeroes = arr.filter(num => num !== 0);
    
    // Calculate the number of zeros to add
    const zeroCount = arr.length - nonZeroes.length;

    // Create a new array with non-zero elements followed by the zeros
    return [...nonZeroes, ...Array(zeroCount).fill(0)];
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]


/***************************** */

function moveZeroesToEnd(arr) {
    return arr.reduce((acc, num) => {
        // If the number is not zero, push it to the accumulator
        if (num !== 0) {
            acc.push(num);
        }
        return acc;
    }, []).concat(Array(arr.length - arr.filter(num => num !== 0).length).fill(0));
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]


function moveZeroesToEnd(arr) {
    const result = arr.reduce((acc, num) => {
        if (num !== 0) {
            acc.push(num); // Push non-zero numbers to the accumulator
        }
        return acc; // Return the accumulator
    }, []);

    // Calculate the number of zeros to add
    const zeroCount = arr.length - result.length;

    // Combine the non-zero elements with the zeros
    return [...result, ...Array(zeroCount).fill(0)];
}

// Example usage:
const input = [0, 1, 0, 3, 12];
const result = moveZeroesToEnd(input);
console.log(result); // Output: [1, 3, 12, 0, 0]
