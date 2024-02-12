const input = {
  name: "Mansi",
  age: 25,
  department: {
    name: "Customer Experience",
    section: "Technical",
    branch: {
      name: "Bangalore",
      timezone: "IST",
    },
  },
  company: {
    name: "SAP",
    customers: ["Ford", "Nestle"],
  },
  skills: ["javascript", "node.js", "html"],
};


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

 const flattenObject = (input, sepertor) => {
    let result = {};
    for (const key in input) {
     if (!input.hasOwnProperty(key)) {
       continue;
     } 
     if (typeof input[key] === "object" &&!Array.isArray(input[key])) {
           var subFlatObject = flattenObject(input[key]);
           for (const subkey in subFlatObject) {
               result[key + sepertor + subkey] = subFlatObject[subkey];
           }
       } else {
           result[key] = input[key];
       }
     }
     return result;
   }

   flattenObject(input, '_')
   flattenObject(input, '.')

   const flattenObject = (input, keyName) => {
    var result = {};
    for (const key in input) {
     const newKey =  keyName ? `${keyName}_${key}` : key;
     if (typeof input[key] === "object" && !Array.isArray(input[key])) {
           result = {...result, ...flattenObject(input[key], newKey)}
     } else {
           result[newKey] = input[key];
     }
    }
    return result;
    };


    
function transform(collection, prefix) {
  let result = {};
  for (let key in collection) {
      if (typeof collection[key] === 'object' && collection[key] !==null&& Array.isArray(collection[key]) == false) {
          Object.assign(result, transform(collection[key], `${prefix}${key}_`));
      } else {
          result[`${prefix}${key}`] = collection[key];
      }
  }
  return result;
}


function transform(collection, prefix) {
  let result = {};
  for (let key in collection) {
      if (typeof collection[key] === 'object' && collection[key] !==null&& Array.isArray(collection[key]) == false) {
          Object.assign(result, transform(collection[key], `${prefix}${key}_`));
      } else {
          result[`${prefix}${key}`] = collection[key];
      }
  }
  return result;
}
const data = {
  name: 'Devtools Tech',
  channel: {
    youtube: {
      link: 'bit.ly/devtools-yt',
      name: 'Devtools Tech',
      subscribe: "true"
    },
    platform: {
      link: 'devtools.tech',
      resources: {
        pages: ['/questions', '/resources']
      },
    }
  }
}

const output = transform(data, 'data');
console.print(output);




function transform(collection, prefix) {
  // write your solution here
 let result = {}
  for(let key in collection){
    let value = collection[key];
    let newParent = prefix +'_'+ key 
    if(typeof value === 'object' && !Array.isArray(value)){
      result = {...result, ...transform(value, newParent)}
    }else{
      result[newParent] = value
    }
  }
  // console.print(result)
  return result;
};



function transform(collection, prefix) {
  // write your solution here

  const res = {};
  const recursivelyFlatten = (curObj, prefix) => {
    for (let [key, val] of Object.entries(curObj)) {
      const curPrefix = `${prefix}_${key}`; //data_name
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        // its 100% an object here
        recursivelyFlatten(val, curPrefix);
      } else {
        res[curPrefix] = val;
      }
    }
  };
  recursivelyFlatten(collection, prefix);
  return res;
}


function solve(collection, prefix, ds) {
  if(typeof collection !== 'object' || Array.isArray(collection)) {
    console.log(prefix, collection);
    ds[prefix] = collection
    return;
  }
  
  Object.keys(collection).forEach(key => {
      return solve(collection[key], prefix + '_' + key, ds);
  });
  
}



/* FLATTEN NESTED OBJECTS */
const data = {
  name: 'Devtools Tech',
  channel: {
      youtube: {
          link: 'bit.ly/devtools-yt',
          name: 'Devtools Tech',
          subscribe: "true"
      },
      platform: {
          link: 'devtools.tech',
          resources: {
              pages: ['/questions', '/resources']
          },
      }
  }
}

const result = {}
function transform(data, prefix) {
  if (Object.keys(data).length === 0) return {}
  for (let key in data) {
      if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
          transform(data[key], `${prefix}_${key}`)
      }
      else {
          result[`${prefix}_${key}`] = data[key]
      }
  }
  return result
}

const output = transform(data, 'data');
console.log(output);