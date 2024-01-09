/**********************************************Implement a function to convert all object keys to camel case *****************************************/
function keysToCamelCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
        throw new Error('Input must be a non-null object.');
    }
  
    const camelCasedObject = {};
  
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            camelCasedObject[camelCaseKey] = obj[key];
        }
    }
  
    return camelCasedObject;
  }
  
  // Example usage:
  
  const snakeCaseObject = {
    first_name: 'John',
    last_name: 'Doe',
    age_group: 'Adult'
  };
  
  const camelCaseObject = keysToCamelCase(snakeCaseObject);
  
  console.log(camelCaseObject);
  // Output: { firstName: 'John', lastName: 'Doe', ageGroup: 'Adult' }