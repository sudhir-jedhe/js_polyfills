// In JavaScript, the this keyword refers to the object that is currently executing the code. The short version of what this evaluates to is as follows:

// By default, this refers to the global object.
// In a function, when not in strict mode, this refers to the global object.
// In a function, when in strict mode, this is undefined.
// In an arrow function, this retains the value of the enclosing lexical context's this.
// In an object method, this refers to the object the method was called on.
// In a constructor call, this is bound to the new object being constructed.
// In an event handler, this is bound to the element on which the listener is placed.

// In the global execution context, this refers to the global object.

console.log(this === window); // true

// Function context
// When not in strict mode, a function's this refers to the global object.

function f() {
  return this;
}

console.log(f() === window); // true

// Object context
// When a function is called as a method of an object, this refers to the object the method is called on. This applies to methods defined anywhere in the object's prototype chain (i.e. own and inherited methods).

const obj = {
  f: function () {
    return this;
  },
};

const myObj = Object.create(obj);
myObj.foo = 1;

console.log(myObj.f()); // { foo: 1 }

class C {
  constructor() {
    this.x = 10;
  }
}

const obj = new C();
console.log(obj.x); // 10

const f = () => this;

console.log(f() === window); // true

const obj = {
  foo: function () {
    const baz = () => this;
    return baz();
  },
  bar: () => this,
};

console.log(obj.foo()); // { foo, bar }
console.log(obj.bar() === window); // true

const el = document.getElementById("my-el");

el.addEventListener("click", function () {
  console.log(this === el); // true
});

function f() {
  return this.foo;
}

const x = f.bind({ foo: "hello" });
console.log(x()); // 'hello'

function f() {
  return this.foo;
}

console.log(f.call({ foo: "hi" })); // 'hi'
