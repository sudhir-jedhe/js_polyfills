// 6. **Object's assign method:**

//    The `Object.assign` method is used to copy all the properties from one or more source objects and stores them into a target object.

//    The following code creates a new staff object by copying properties of his working company and the car he owns.

const orgObject = { company: "XYZ Corp" };
const carObject = { name: "Toyota" };
const staff = Object.assign({}, orgObject, carObject);
