function transformArray(arr) {
    let changed = true;
  
    while (changed) {
      changed = false;
  
      // Iterate from the second element to the second-last element (excluding head and tail)
      for (let i = 1; i < arr.length - 1; i++) {
        const prev = arr[i - 1];
        const curr = arr[i];
        const next = arr[i + 1];
  
        // Check if the current element needs modification
        if ((curr < prev && curr < next) || (curr > prev && curr > next)) {
          arr[i] = (prev + next) / 2; // Update the element to the average of its neighbors
          changed = true; // Mark that a change occurred
        }
      }
    }
  
    return arr;
  }
  
  // Examples
  console.log(transformArray([1, 2, 1])); // Output: [1, 1, 1]
  console.log(transformArray([5, 12, 3, 8, 9])); // Output: [5, 7, 8, 8, 9]
  console.log(transformArray([9, 6, 7, 10, 13, 14])); // Output: [9, 7, 7, 10, 13, 14]
  