function flattenObject(inputObj) {
    const result = {};

    const flatten = (obj, prefix = '') => {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const newKey = prefix ? `${prefix}.${key}` : key;
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    flatten(obj[key], newKey);
                } else {
                    result[newKey] = obj[key];
                }
            }
        }
    };

    flatten(inputObj);
    return result;
}

// Example usage:
const inputObj = {
    "key1": "value1",
    "key2": {
        "subkey1": "subvalue1",
        "subkey2": {
            "subsubkey1": "subsubvalue1"
        }
    },
    "key3": "value3"
};

console.log(flattenObject(inputObj));




const flattenObject = (obj, parentKey = '') => {
    let flattenedObj = {};
  
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        const nestedObj = flattenObject(obj[key], `${parentKey}${key}.`);
        flattenedObj = { ...flattenedObj, ...nestedObj };
      } else {
        flattenedObj[`${parentKey}${key}`] = obj[key];
      }
    }
  
    return flattenedObj;
  };
  
  const response = {
    name: 'Manu',
    age: 21,
    characteristics: {
      height: '6 feet',
    },
    techStack: {
      language: 'Javascript',
      framework: {
        name: 'Nextjs',
        version: '12',
      },
    },
  };
  
  const flattenedResponse = flattenObject(response);
  console.log(flattenedResponse);
  

  /************************** */
  function flattenObject(obj, parentKey = '', result = {}) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let propName = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                flattenObject(obj[key], propName, result);
            } else {
                result[propName] = obj[key];
            }
        }
    }
    return result;
}


const nestedObject = {
  name: 'John',
  address: {
      city: 'New York',
      postal: {
          zip: '10001',
          country: 'USA'
      }
  },
  hobbies: ['Reading', 'Traveling'],
  social: {
      twitter: '@john_doe',
      linkedin: 'john.doe'
  }
};

const flattenedObject = flattenObject(nestedObject);
console.log(flattenedObject);



const flatten = (obj) => {
  let result = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'object') {
      result = { ...result, ...flatten(value) };
    } else {
      result[key] = value;
    }
  }
  return result;
};

const obj = {
  a: 1,
  b: [2, 3],
  c: {
    d: 4,
    e: [5, 6],
    f: {
      g: 7,
    },
  },
};

const flattenedObj = flatten(obj);

console.log(flattenedObj);


const flattenObject = (input) => {
  let result = {};
  for (const key in input) {
   if (!input.hasOwnProperty(key)) {
     continue;
   } 
   if (typeof input[key] === "object" &&!Array.isArray(input[key])) {
         var subFlatObject = flattenObject(input[key]);
         for (const subkey in subFlatObject) {
             result[key + "_" + subkey] = subFlatObject[subkey];
         }
     } else {
         result[key] = input[key];
     }
   }
   return result;
 }


 const input = {
  name: 'Mansi',
  age: 25,
  department: {
    name: 'Customer Experience',
    section: 'Technical',
    branch: {
       name: 'Bangalore',
       timezone: 'IST'
    }
  },
  company: {
   name: 'SAP',
   customers: ['Ford', 'Nestle']
  },
  skills: ['javascript', 'node.js', 'html']
}


const output = {
  name: 'Mansi',
  age: 25,
  department_name: 'Customer Experience',
  department_section: 'Technical',
  department_branch_name: 'Bangalore',
  department_branch_timezone: 'IST’,
  company_name: 'SAP',
  company_customers: ['Ford', 'Nestle'],
  skills: ['javascript', 'node.js', 'html']
}