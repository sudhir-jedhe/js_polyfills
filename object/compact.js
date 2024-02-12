function removeFalsyValues(obj) {
  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value) {
      newObj[key] = value;
    }
  }
  return newObj;
}

// Example usage:
const obj = {
  name: "John Doe",
  age: 30,
  occupation: null,
  hobbies: ["coding", "reading"],
};

const newObj = removeFalsyValues(obj);

console.log(newObj); // { name: "John Doe", age: 30, hobbies: ["coding", "reading"] }
