// This is a JavaScript Quiz from BFE.dev

const obj = {
  msg: "BFE",
  foo() {
    console.log(this.msg);
  },
  bar() {
    console.log("dev");
  },
};

obj.foo();
obj.foo();
(obj.foo || obj.bar)();
