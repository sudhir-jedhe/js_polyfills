```js
const names1 = ["john", "mary", "bob", "jane"];
const uppercasedNames1 = mapToUppercase(names1);
console.log(uppercasedNames1);
// Output: ['JOHN', 'MARY', 'BOB', 'JANE']

const names2 = ["Alice", "Bob", "Charlie"];
const uppercasedNames2 = mapToUppercase(names2);
console.log(uppercasedNames2);
// Output: ['ALICE', 'BOB', 'CHARLIE']

const names3 = [];
const uppercasedNames3 = mapToUppercase(names3);
console.log(uppercasedNames3);
// Output: []

export const mapToUppercase = (names) => {
  return names.map((name) => name.toUpperCase());
};

export const mapToUppercase = (names) => {
  const uppercaseNames = [];
  names.forEach((name) => {
    uppercaseNames.push(name.toUpperCase());
  });
  return uppercaseNames;
};

```