// This is a JavaScript Quiz from BFE.dev

class MyArray extends Array {
  get length() {
    return 3;
  }
}

const arr1 = new MyArray(10);
console.log(arr1.length);

const arr2 = new Array(10);
console.log(arr2.length);

/*************************************************** */
function foo(a, b, undefined, undefined) {
  console.log("BFE.dev");
}
console.log(foo.length);

/*********************************** */
// This is a JavaScript Quiz from BFE.dev

const a = [0];
console.log(a.length);
a[3] = 3;
console.log(a.length);
for (let item of a) {
  console.log(item);
}
a.map((item) => {
  console.log(item);
});
a.forEach((item) => {
  console.log(item);
});
console.log(Object.keys(a));
delete a[3];
console.log(a.length);
a[2] = 2;
a.length = 1;
console.log(a[0], a[1], a[2]);
