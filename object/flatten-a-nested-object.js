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