function convertValueToJsonString(value) {
  // Check if the value is a JavaScript object or array.
  if (typeof value === "object" && value !== null) {
    // If the value is an object, use the JSON.stringify() method to convert it to a JSON string.
    return JSON.stringify(value);
  } else {
    // If the value is not an object, return the value as a string.
    return value.toString();
  }
}

const value = {
  name: "John Doe",
  age: 30,
};

const jsonString = convertValueToJsonString(value);

console.log(jsonString);

// {"name":"John Doe","age":30}
