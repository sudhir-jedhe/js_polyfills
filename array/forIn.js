let words = ["pen", "pencil", "falcon", "rock", "sky", "earth"];

for (let idx in words) {
  console.log(`${words[idx]} has index ${idx}`);
}

/******************************************************* */

function iterateObject() {
  let exampleObj = {
    book: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
  };

  for (let key in exampleObj) {
    if (exampleObj.hasOwnProperty(key)) {
      value = exampleObj[key];
      console.log(key, value);
    }
  }
}
iterateObject();

/****************************************** */
// This is a JavaScript Quiz from BFE.dev

const obj = {
  foo: "bar",
};

console.log("foo" in obj);
console.log(["foo"] in obj);
