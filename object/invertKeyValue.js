/*****************implement a function called invert that takes an object as input parameter and inverts it i.e. return an object where the keys as values and values as keys*********** */
function invert(obj) {
  if (typeof obj !== "object" || obj === null) {
    throw new Error("Input must be a non-null object.");
  }

  const invertedObj = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      invertedObj[obj[key]] = key;
    }
  }

  return invertedObj;
}

// Example usage:
const originalObj = {
  name: "John",
  age: 30,
  occupation: "Engineer",
};

const invertedObj = invert(originalObj);

console.log(invertedObj);
/*
  Output:
  {
    John: 'name',
    30: 'age',
    Engineer: 'occupation'
  }
  */

function inverse(obj) {
  var retobj = {};
  for (var key in obj) {
    retobj[obj[key]] = key;
  }
  return retobj;
}

var student = {
  name: "Jack",
  age: 18,
  std: 12,
  fees: 5000,
};
console.log("Object before inversion");
console.log(student);
student = inverse(student);
console.log("Object after inversion");
console.log(student);
