var foo = function bar() {
  return "BFE";
};

console.log(foo());
console.log(bar());

/************************************************ */
// This is a JavaScript Quiz from BFE.dev

function a() {}
const b = function () {};

const c = function d() {
  console.log(typeof d);
  d = "e";
  console.log(typeof d);
};

console.log(typeof a);
console.log(typeof b);
console.log(typeof c);
console.log(typeof d);
c();
