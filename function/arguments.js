// This is a JavaScript Quiz from BFE.dev

function log(a, b, c, d) {
  console.log(a, b, c, d);
  arguments[0] = "bfe";
  arguments[3] = "dev";

  console.log(a, b, c, d);
}

log(1, 2, 3);

// 1 2 3 undefined
// bfe 2 3 undefined

function countArgs() {
  return arguments.length;
}

console.log(countArgs(1, 2, 3, 4)); // 4
console.log(countArgs()); // 0
