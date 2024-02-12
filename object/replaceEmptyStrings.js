function replaceEmptyStrings(obj) {
  // Iterate over the object's properties
  for (let key in obj) {
    if (typeof obj[key] === "string" && obj[key].trim() === "") {
      // If the property value is an empty string or contains only whitespace, replace it with null
      obj[key] = null;
    }
  }
  return obj;
}

// Example usage:
let data = {
  name: "John",
  age: "",
  city: "  ",
  country: "USA",
};
let updatedData = replaceEmptyStrings(data);
console.log(updatedData);
