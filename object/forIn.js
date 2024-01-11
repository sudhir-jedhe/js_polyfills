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
