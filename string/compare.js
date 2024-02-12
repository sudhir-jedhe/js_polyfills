const sameStrings = (inputString1, inputString2) => {
  return inputString1.localeCompare(inputString2) === 0;
};
console.log(sameStrings("Geeks", "Geeks"));

// /************************************* */
// const stringsSame = (inputString1, inputString2) => {
//   return (
//     inputString1.startsWith(inputString2) && inputString2.endsWith(inputString1)
//   );
// };
// console.log(stringsSame("Geeks", "Geeks"));

// /***************************************************************** */
// const sameString = (inputString1, inputString2) => {
//   return inputString1.match(new RegExp(`^${inputString2}$`)) !== null;
// };
// console.log(sameString("geeks", "geeks"));

// /*********************************** */
// const sameString = (inputString1, inputString2) => {
//   return (
//     Array.from(inputString1).join("") === Array.from(inputString2).join("")
//   );
// };
// console.log(sameString("geeks", "geeks"));
