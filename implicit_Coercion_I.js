console.log(Boolean("false")); // true String not empty
console.log(Boolean(false)); //  false => bollean of false false
console.log("3" + 1); // '31'
console.log("3" - 1); // 2
console.log("3" - " 02 "); // 1. white space trim out
console.log("3" * " 02 "); // 6
console.log(Number("1")); // 1. allow number 1 to conversion from string  valid number
console.log(Number("number")); // NaN
console.log(Number(null)); // 0
console.log(Number(false)); // 0

// This is a JavaScript Quiz from BFE.dev

const foo = [0];
if (foo) {
  console.log(foo == true);
} else {
  console.log(foo == false);
}

// This is a JavaScript Quiz from BFE.dev

console.log([] + {});
console.log(+{});
console.log(+[]);
console.log({} + []);
console.log({} + []);
console.log({} + []);
console.log({} + []);
console.log({} + +[]);
console.log({} + +[] + {});
console.log({} + +[] + {} + []);

// This is a JavaScript Quiz from BFE.dev

console.log(1 + 2);
console.log(1 + +2);
console.log(1 + +(+2));
console.log(1 + "2");
console.log(1 + +"2");
console.log("1" + 2);
console.log("1" + +2);
console.log(1 + true);
console.log(1 + +true);
console.log("1" + true);
console.log("1" + +true);
console.log(1 + null);
console.log(1 + +null);
console.log("1" + null);
console.log("1" + +null);
console.log(1 + undefined);
console.log(1 + +undefined);
console.log("1" + undefined);
console.log("1" + +undefined);
console.log("1" + +(+undefined));
