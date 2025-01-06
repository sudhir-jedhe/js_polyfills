// This is a JavaScript Quiz from BFE.dev

const obj = {
  dev: "bfe",
  a: function () {
    return this.dev; // obj.a() =>  obj.dev
  },
  b() {
    // same as above as we can declare function same way
    return this.dev; // obj.b() =>  obj.dev
  },
  c: () => {
    return this.dev; // window.c() =>  undefined  lexical parent context
  },
  d: function () {
    return (() => {
      // IFFE , not assigned name.
      return this.dev;
      //  obj.d() =>  obj.dev array fuction called inside function so hold context from which it is calling
    })();

    /** same as IFFE
     const test = () => {
        return this,dev
     }

     test()
     */
  },
  e: function () {
    return this.b(); // invoke bm return obj.b => // obj.b() =>  obj.dev
  },
  f: function () {
    return this.b;
    // not caling, returning another function,
    // obj.f() =>  returning reference to b =>  return function b
    // obj.f() => b()
    // obj.f()() => b()() calling b globally obj.b() =>  window.dev
  },
  g: function () {
    return this.c(); //  undefined invocatoion , c is arrow function window.dev
  },
  h: function () {
    return this.c;
    // reference to arrow function, Obj.h() return c,  then Obj.h()() second invocation calling c . window,dev
  },
  i: function () {
    return () => {
      // obj.i() arrow function return and obj.i()() execute arrow function  => obj.dev
      return this.dev;
    };
  },
};

console.log(obj.a()); // bfe
console.log(obj.b()); // bfe
console.log(obj.c()); // undfined
console.log(obj.d()); // bfe
console.log(obj.e()); // bfe
console.log(obj.f()()); // undefined
console.log(obj.g()); // undefined
console.log(obj.h()()); // undefined
console.log(obj.i()()); // bfe
