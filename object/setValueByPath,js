/*********************set a value in an object by providing a path ******************* */
function setValueByPath(obj, path, value) {
  const pathArray = path.split('.');
  let currentObj = obj; // {}

  for (let i = 0; i < pathArray.length - 1; i++) {
      const key = pathArray[i]; // user
      if (!currentObj[key] || typeof currentObj[key] !== 'object') {
          currentObj[key] = {};
      }
      currentObj = currentObj[key];  // { user: {} }
  }

  const lastKey = pathArray[pathArray.length - 1];
  currentObj[lastKey] = value;
}

// Example usage:
const myObject = {};

setValueByPath(myObject, 'user.name.first', 'John');
setValueByPath(myObject, 'user.name.last', 'Doe');
setValueByPath(myObject, 'user.age', 30);

console.log(myObject);
/*
Output:
{
  user: {
      name: {
          first: 'John',
          last: 'Doe'
      },
      age: 30
  }
}
*/