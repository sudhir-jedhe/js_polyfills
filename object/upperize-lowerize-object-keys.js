Uppercase object keys
In order to convert all the keys of an object to upper case, we first need to obtain an array of the object's keys, using Object.keys(). Then, use Array.prototype.reduce() to map the array to an object, using String.prototype.toUpperCase() to uppercase the object's keys.

const upperize = obj =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k.toUpperCase()] = obj[k];
    return acc;
  }, {});

upperize({ Name: 'John', Age: 22 }); // { NAME: 'John', AGE: 22 }
Lowercase object keys
Similarly, to convert all the keys of an object to lower case, we can use the same approach. The only notable difference is that we use String.prototype.toLowerCase() to lowercase the object's keys.

const lowerize = obj =>
  Object.keys(obj).reduce((acc, k) => {
    acc[k.toLowerCase()] = obj[k];
    return acc;
  }, {});

lowerize({ Name: 'John', Age: 22 }); // { name: 'John', age: 22 }
