// The Object.isPrototypeOf() method in Javascript checks if an object exists in another object’s prototype chain.
function obj1() {}
function obj2() {}

obj1.prototype = Object.create(obj2.prototype);
const obj3 = new obj1();
console.log(obj1.prototype.isPrototypeOf(obj3));
console.log(obj2.prototype.isPrototypeOf(obj3));

//  C.prototype, B.prototype, A.prototype, and Object.prototype exist in the prototype chain for object c:

function A() {}
function B() {}
function C() {}

B.prototype = Object.create(A.prototype);
C.prototype = Object.create(B.prototype);

let c = new C();

console.log(C.prototype.isPrototypeOf(c));
console.log(B.prototype.isPrototypeOf(c));
console.log(A.prototype.isPrototypeOf(c));
console.log(Object.prototype.isPrototypeOf(c));

// This is a trick question

// case 1
const obj1 = {
  foo() {
    console.log(super.foo());
  },
};

Object.setPrototypeOf(obj1, {
  foo() {
    return "bar";
  },
});

obj1.foo();

// case 2

const obj2 = {
  foo: function () {
    console.log(super.foo());
  },
};

Object.setPrototypeOf(obj2, {
  foo() {
    return "bar";
  },
});

obj2.foo();
