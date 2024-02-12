function removeKeys(obj, keys) {
  // Check if the object is an array
  if (Array.isArray(obj)) {
    // Iterate over the array and remove the specified keys
    obj.forEach((item) => {
      removeKeys(item, keys);
    });
  } else if (typeof obj === "object") {
    // Iterate over the object's keys and remove the specified keys
    Object.keys(obj).forEach((key) => {
      if (keys.includes(key)) {
        delete obj[key];
      } else {
        // Recursively remove the specified keys from nested objects
        removeKeys(obj[key], keys);
      }
    });
  }
}

// Example usage:
const obj = {
  name: "John Doe",
  age: 30,
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
  },
  hobbies: ["coding", "reading", "hiking"],
};

const keysToRemove = ["age", "hobbies"];

removeKeys(obj, keysToRemove);

console.log(obj); // { name: "John Doe", address: { street: "123 Main Street", city: "San Francisco", state: "CA" } }
