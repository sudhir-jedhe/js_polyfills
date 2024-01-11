const arr = ["a", "b", "c", "1"];
const regExp = /^[a-z]$/gi;
const chars = arr.filter((elem) => regExp.test(elem));
console.log(chars);

// This is a JavaScript Quiz from BFE.dev

console.log(/^4\d\d$/.test("404"));
console.log(/^4\d\d$/.test(404));
console.log(/^4\d\d$/.test(["404"]));
console.log(/^4\d\d$/.test([404]));
