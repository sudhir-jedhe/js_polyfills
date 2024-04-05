
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



  Input:
const obj = {
  a: 1,
  b: {
    c: "Hello World",
    d: 2,
    e: {
     f: {
       g: -4,
      },
    },
    h: "Good Night Moon",
  },
};

const filter = (s) => typeof s === "string";

Output:
{
  b: {
    c: "Hello World",
    h: "Good Night Moon",
  }
};

const deepFilter = (obj, filter) => {
    //iterate the object
    for (let key in obj) {
      const val = obj[key];
  
      //if val is also object (nested)
      if (typeof val === "object") {
        //recur
        deepFilter(val, filter);
      } 
      // normal value
      else {
        //current val fails filter condition
        //delete it
        if (filter(val) === false) {
          delete obj[key];
        }
      }
  
      //if value is empty obj
      //delete it
      if (JSON.stringify(val) === "{}") {
        delete obj[key];
      }
    }
  };