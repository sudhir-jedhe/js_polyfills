/********************shuffle an array in JavaScript*************************** */
function shuffleArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('Input must be an array.');
    }
  
    const shuffledArray = [...array];
  
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    return shuffledArray;
  }
  
  // Example usage:
  const originalArray = [1, 2, 3, 4, 5];
  const shuffledArray = shuffleArray(originalArray);
  
  console.log(shuffledArray);
  // Output: [3, 1, 5, 4, 2] (or any other random permutation)