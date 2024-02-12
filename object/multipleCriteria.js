// const isRGBColor = (color) => {
//   if (color === "red" || color === "green" || color === "red") {
//     return true;
//   }
//   return false;
// };

const rgbColors = ["red", "green", "blue"];
const isRGBColor = (color) => rgbColors.includes(color);

console.log(isRGBColor("red"));

console.log(isRGBColor("yellow"));
