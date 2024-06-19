// To determine if an object is an array, you can either use Array.isArray() or the instanceof operator. While both methods work for arrays created either using the array literal syntax or the Array constructor, there's a key difference. Array.isArray() is more reliable, as it works with cross-realm-objects, such as those created in an iframe.

let iframeEl = document.createElement('iframe');
document.body.appendChild(iframeEl);
iframeArray = window.frames[window.frames.length - 1].Array;

let array1 = new Array(1,1,1,1);
let array2 = new iframeArray(1,1,1,1);

console.log(array1 instanceof Array);   // true
console.log(Array.isArray(array1));     // true

console.log(array2 instanceof Array);   // false
console.log(Array.isArray(array2));     // true