/****************************** Array difference ****************  */
function arrayDifference(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error('Invalid input. Please provide valid arrays.');
    }
  
    // Use Set to efficiently check for unique values
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
  
    // Use filter to find values in set1 that are not in set2
    const differenceArray = arr1.filter(value => !set2.has(value));
  
    return differenceArray;
  }
  
  // Example usage:
  
  const array1 = [1, 2, 3, 4, 5];
  const array2 = [3, 4, 5, 6, 7];
  
  const difference = arrayDifference(array1, array2);
  
  console.log(difference);
  // Output: [1, 2]
  
  function valuesNotIncluded(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
        throw new Error('Both parameters must be arrays.');
    }
  
    return arr1.filter(value => !arr2.includes(value));
  }
  
  // Example usage:
  
  const array3 = [1, 2, 3, 4, 5];
  const array4 = [3, 4, 5, 6, 7];
  
  const resultArray = valuesNotIncluded(array3, array4);
  
  console.log(resultArray);
  // Output: [1, 2]