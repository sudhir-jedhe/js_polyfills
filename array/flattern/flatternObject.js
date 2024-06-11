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
  