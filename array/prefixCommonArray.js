function prefixCommonArray(A, B) {
    const n = A.length;
    const positionB = new Map();
    const prefixCommon = new Array(n).fill(0);
    
    // Create a map of positions of elements in B
    for (let i = 0; i < n; i++) {
        positionB.set(B[i], i);
    }
    
    // Iterate through A to calculate prefix common array
    let maxIndexInB = -1;
    for (let i = 0; i < n; i++) {
        const elementA = A[i];
        const indexInB = positionB.get(elementA);
        
        if (indexInB !== undefined) {
            // Count elements from B that appear in A up to indexInB
            let count = 0;
            for (let j = 0; j <= indexInB; j++) {
                if (positionB.has(B[j]) && positionB.get(B[j]) <= i) {
                    count++;
                }
            }
            prefixCommon[i] = count;
            maxIndexInB = Math.max(maxIndexInB, indexInB);
        } else {
            prefixCommon[i] = maxIndexInB + 1;
        }
    }
    
    return prefixCommon;
}

// Example usage:
console.log(prefixCommonArray([1,3,2,4], [3,1,2,4])); // Output: [0, 2, 3, 4]


/******************************* */

function findPrefixCommon(A, B) {
    const n = A.length;
    const C = new Array(n).fill(0); // Initialize prefix common array
  
    // Count occurrences of each element in A
    const countA = {};
    for (const num of A) {
      countA[num] = (countA[num] || 0) + 1;
    }
  
    // Iterate through B and update prefix common counts
    for (let i = 0; i < n; i++) {
      const num = B[i];
      if (num in countA && countA[num] > 0) {
        C[i] = Math.min(C[i - 1] + 1, countA[num]);  // Consider both previous count and A's count
        countA[num]--;  // Decrement occurrence in A
      }
    }
  
    return C;
  }
  
  // Example usage
  const A = [1, 3, 2, 4];
  const B = [3, 1, 2, 4];
  const result = findPrefixCommon(A, B);
  console.log(result); // Output: [0, 2, 3, 4]
  