let array = [];
Object.defineProperty(array, 1, { value: 4 });
Object.defineProperty(array, 2, { value: "4" });
array.length = 1; // Error here
// TypeError: can't delete non-configurable array element
/******************************************** */
const a = {};
Object.defineProperty(a, "foo1", {
  value: 1,
});
const b = Object.create(a);
b.foo2 = 1;

console.log(b.foo1);
console.log(b.foo2);

b.foo1 = 2;
b.foo2 = 2;

console.log(b.foo1);
console.log(b.foo2);
