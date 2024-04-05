// How do you check if a key exists in an object

//      You can check whether a key exists in an object or not using three approaches,

//      1. **Using in operator:** You can use the in operator whether a key exists in an object or not

"key" in obj;

//      and If you want to check if a key doesn't exist, remember to use parenthesis,

!("key" in obj);

//      2. **Using hasOwnProperty method:** You can use `hasOwnProperty` to particularly test for properties of the object instance (and not inherited properties)

obj.hasOwnProperty("key"); // true

//      3. **Using undefined comparison:** If you access a non-existing property from an object, the result is undefined. Let’s compare the properties against undefined to determine the existence of the property.

const user = {
  name: "John",
};

console.log(user.name !== undefined); // true
console.log(user.nickName !== undefined); // false
