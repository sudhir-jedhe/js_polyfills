// JavaScript is used to convert elements of the given array from right to left to a single value.
let arr = [175, 50, 25];

function subofArray(total, num) {
  return total - num;
}
function myGeeks(item) {
  console.log(arr.reduceRight(subofArray));
}
myGeeks();

/******************************** */
let arr = [10, 20, 30, 40, 50, 60];

function subofArray(total, num) {
  return total - num;
}
function myGeeks(item) {
  console.log(arr.reduceRight(subofArray));
}
myGeeks();
