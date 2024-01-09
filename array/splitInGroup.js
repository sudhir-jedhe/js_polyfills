/***************************************************Split Array into group ******************* */
function splitArrayIntoGroups(array, groupSize) {
    if (!Array.isArray(array) || !Number.isInteger(groupSize) || groupSize <= 0) {
        throw new Error('Invalid input. Please provide a valid array and a positive integer group size.');
    }
  
    const result = [];
    for (let i = 0; i < array.length; i += groupSize) {
        result.push(array.slice(i, i + groupSize));
    }
  
    return result;
  }
  
  // Example usage:
  
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const groupSize = 3;
  
  const groupedArrays = splitArrayIntoGroups(originalArray, groupSize);
  
  console.log(groupedArrays);
  // Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]