/****************************How to implement cloneDeep********************* */
function cloneDeep(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
  
    if (Array.isArray(obj)) {
        // If obj is an array, create a deep copy of each element
        return obj.map(element => cloneDeep(element));
    }
  
    // If obj is an object, create a deep copy of each property
    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = cloneDeep(obj[key]);
        }
    }
  
    return clonedObj;
  }
  
  // Example usage:
  const originalData = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA'
    },
    hobbies: ['Reading', 'Gaming']
  };
  
  const clonedData = cloneDeep(originalData);
  
  console.log(clonedData);
  // Output: { name: 'John', age: 30, address: { city: 'New York', country: 'USA' }, hobbies: ['Reading', 'Gaming'] }
  
  // Verify that the original and cloned objects are not the same reference
  console.log(originalData !== clonedData); // Output: true
  console.log(originalData.address !== clonedData.address); // Output: true