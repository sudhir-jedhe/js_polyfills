function round(x) {
  return Math.ceil(x / 5) * 5;
}

var n = 34;
console.log(round(n)); //35

/****************************** */

function round(x) {
  if (x % 5 == 0) {
    return Math.floor(x / 5) * 5;
  } else {
    return Math.floor(x / 5) * 5 + 5;
  }
}

var n = 34;
console.log(round(n));
