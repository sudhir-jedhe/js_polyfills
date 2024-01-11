// This is a JavaScript Quiz from BFE.dev

function F() {
  this.foo = "bar";
}

const f = new F();
console.log(f.prototype);

/**************************************************** */
// This is a JavaScript Quiz from BFE.dev

function Foo() {}
Foo.prototype.bar = 1;
const a = new Foo();
console.log(a.bar);

Foo.prototype.bar = 2;
const b = new Foo();
console.log(a.bar);
console.log(b.bar);

Foo.prototype = { bar: 3 };
const c = new Foo();
console.log(a.bar);
console.log(b.bar);
console.log(c.bar);
