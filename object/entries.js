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
