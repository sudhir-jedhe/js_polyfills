var num = 10;

(() => {
  console.log(num); // undefined num hoisted in function scope
  var num = 20;
  console.log(num); // 20
})();

/*********************************************************************************** */

let count = 10;
(function printCount() {
  if (count === 0) {
    let count = 1;
    console.log(count); // 1 localScope
  }
  console.log(count); // 2 global scope
})();

/*************************************************************************************************************** */

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // loop run fast even before  first setTimeout execute
  // only one instance of i shared across all iteration
  setTimeout(() => {
    console.log(i); // three times  3
  }, i * 1000);
}

for (let index = 0; index < 3; index++) {
  // variable declare  with  let block scope
  // loop run fast even before  first setTimeout execute
  // create seperate variable instance of i shared across each iteration
  setTimeout(() => {
    console.log(i); // 0  1 2
  }, i * 1000);
}

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // loop run fast even before  first setTimeout execute
  // only one instance of i shared across all iteration
  // capture value of i for each iteration
  // create IIFE for create new scope of i for each iteration
  (function (index) {
    setTimeout(() => {
      console.log(index); // 0 1 2
    }, i * 1000);
  })(index);
}

for (var index = 0; index < 3; index++) {
  // variable declare  with var function scope , hosted to top of the function
  // closure  new memory space for i  create new scope of i for each iteration

  function print(i) {
    setTimeout(() => {
      console.log(i); // 0 1 2
    }, i * 1000);
  }
  print(index); //
}

/******************************************************************** */
let dev = "bfe";

function a() {
  let dev = "BFE";
  return function () {
    console.log(dev);
  };
}

dev = "bigfrontend";
