let a = 39;
let b = 5;
function Geeks() {
  console.log("quotient = " + Math.floor(a / b));
  console.log("remainder = " + (a % b));
}
Geeks();

/****************************************** */

let a = 39;
let b = 5;
function Geeks() {
  let num = ~~(a / b);
  console.log("quotient = " + num);
  console.log("remainder = " + (a % b));
}
Geeks();

/*********************************************** */
let a = 39;
let b = 5;
function Geeks() {
  let num = (a / b) >> 0;
  console.log("quotient = " + num);
  console.log("remainder = " + (a % b));
}
Geeks();
