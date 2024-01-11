console.log(parseInt(" 1"));
console.log(parseInt(" 00001"));
console.log(parseInt(" 0100"));
console.log(parseInt(" 1e2 "));

console.log(parseInt(0.00001));
console.log(parseInt(0.000001));
console.log(parseInt(0.0000001));
console.log(parseInt("0x12"));
console.log(parseInt("1e2"));

console.log(["0"].map(parseInt));
console.log(["0", "1"].map(parseInt));
console.log(["0", "1", "1"].map(parseInt));
console.log(["0", "1", "1", "1"].map(parseInt));
