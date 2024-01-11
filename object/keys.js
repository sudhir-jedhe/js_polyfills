function isObject(object) {
  return object && typeof object === "object";
}

function keys(object) {
  return isObject(object) ? Object.keys(object) : [];
}

module.exports = keys;

/*********************************/
function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  Object.keys(exampleObj).forEach((key) => {
    const value = exampleObj[key];
    console.log(`${key}: ${value}`);
  });
}
iterateObject();

/************************************ */
console.log(Reflect.ownKeys([]));
console.log(Reflect.ownKeys([,]));
console.log(Reflect.ownKeys([1, , 2]));
console.log(Reflect.ownKeys([...[1, , 2]]));
