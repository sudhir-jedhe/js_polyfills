// Create a function to create a negative array proxy
function createNegativeArrayProxy(array) {
    if (!Array.isArray(array)) {
      throw new TypeError('Expected an array');
    }
  
    // Create a new proxy object
    return new Proxy(array, {
      // Define a get trap to handle negative indexes
      get: (target, index) => {
        // Convert the index to a number
        index = +index;
  
        // If the index is negative, calculate the corresponding positive index
        if (index < 0) {
          index = target.length + index;
        }
  
        // Return the element at the specified index
        return target[index];
      },
    });
  }
  
  // Create a new array
  const array = [1, 2, 3, 4, 5];
  
  // Create a negative array proxy
  const negativeArrayProxy = createNegativeArrayProxy(array);
  
  // Access the last element of the array using a negative index
  console.log(negativeArrayProxy[-1]); // 5
  
  // Access the second to last element of the array using a negative index
  console.log(negativeArrayProxy[-2]); // 4