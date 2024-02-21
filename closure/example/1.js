function add(x) {
  function addTo(y) {
    console.log(x + y);
  }
  return addTo;
}

console.log(add(10)(5));

/**************************** */
function makeAdder(x) {
  return function (y) {
    return x + y;
  };
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2)); // 7
console.log(add10(2)); // 12
