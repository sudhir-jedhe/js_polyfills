/*********************************create a function toggle that accepts an array as input and toggles between the values in a cyclic manner.******************************************** */
function toggle(inputArray) {
    if (!Array.isArray(inputArray) || inputArray.length === 0) {
        throw new Error('Input must be a non-empty array.');
    }
  
    let currentIndex = 0;
  
    return function () {
        const currentValue = inputArray[currentIndex];
        currentIndex = (currentIndex + 1) % inputArray.length;
        return currentValue;
    };
  }
  
  // Example usage:
  const myToggle = toggle(['Option A', 'Option B', 'Option C']);
  
  console.log(myToggle());  // Output: 'Option A'
  console.log(myToggle());  // Output: 'Option B'
  console.log(myToggle());  // Output: 'Option C'
  console.log(myToggle());  // Output: 'Option A'