const kebabCase = (str) =>
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join("-")
    .toLowerCase();

console.log(kebabCase("Geeks For Geeks"));
console.log(kebabCase("GeeksForGeeks"));
console.log(kebabCase("Geeks_For_Geeks"));
// geeks-for-geeks
// geeks-for-geeks
// geeks-for-geeks

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

console.log(kebabCase("Geeks For Geeks"));
console.log(kebabCase("GeeksForGeeks"));
console.log(kebabCase("Geeks_For_Geeks"));
