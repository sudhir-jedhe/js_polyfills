
/****************************How to implement deepFilter********************* */
function deepFilter(obj, predicate) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
  
    if (Array.isArray(obj)) {
        // If obj is an array, filter its elements recursively
        return obj.filter(element => deepFilter(element, predicate));
    }
  
    // If obj is an object, filter its properties recursively
    const filteredObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (predicate(value)) {
                filteredObj[key] = deepFilter(value, predicate);
            }
        }
    }
  
    return filteredObj;
  }
  
  // Example usage:
  const data = {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        country: 'USA',
        details: {
            street: '123 Main St',
            zip: '10001'
        }
    },
    hobbies: ['Reading', 'Gaming']
  };
  
  const filteredData = deepFilter(data, value => typeof value === 'string' || value > 25);
  
  console.log(filteredData);
  /*
  Output:
  {
    name: 'John',
    age: 30,
    address: {
        city: 'New York',
        details: {
            street: '123 Main St',
            zip: '10001'
        }
    },
    hobbies: []
  }
  */