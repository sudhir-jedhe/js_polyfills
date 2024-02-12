function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  Object.entries(exampleObj).map((entry) => {
    let key = entry[0];
    let value = entry[1];
    console.log(key, value);
  });
}
iterateObject();

/************* */
// Implement a js function that returns an object composed from key-value pairs
function createObjectFromKeyValuePairs(keyValuePairArray) {
  const object = {};
  for (const [key, value] of keyValuePairArray) {
    object[key] = value;
  }
  return object;
}

// Example usage:

const keyValuePairArray = [
  ["name", "John Doe"],
  ["age", 30],
];
const object = createObjectFromKeyValuePairs(keyValuePairArray);

console.log(object); // { name: 'John Doe', age: 30 }

const employee = {
  id: 204,
  name: "sudhir",
  city: "badlapur",
};
Object.entries(employee).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

const videoEntries = [
  ["id", 24365],
  ["title", "video101"],
  ["size", "500MB"],
  ["status", "active"],
];

const video = Object.fromEntries(videoEntries);
console.log(video);
console.log(Object.entries(video));
