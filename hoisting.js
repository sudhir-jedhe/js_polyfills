// console.log(y); // reference error  y is not defined
// y = 10;

// /********** */

// console.log(y); // undefined  creation phase
// var y = 10; // execution phase line by line

// /***************************** */
// y = 3; 
// console.log(y); // reference error  y is not defined as not declare with var
// var y = 10; 
// // y is not declare in current scope, so look in to global scope
// // This line attempts to use the value of y before it's even defined, 
// // which leads to the reference error "y is not defined". 
// // JavaScript tries to look up the variable y but can't find 
// // it because it hasn't been declared yet.
// /******************************** */

// console.log(x); //  hoisted without default initialization  , temporal deadzone cannot access before initailization
// let x;

// /**************************************** */
// // var x = 5;
// // let x = 10; // already declare. variable not allowed to redeclare in same scope

// /************************************************** */

// function abc() {
//   // hoisted
//   console.log("localScope", a); // 10
// }
// console.log("globalScope", a); // undefined as  a hoisted global with undefined
// var a = 10;  // a = 10 during assignment before abc called
// abc();


// /************************************* */

// function abc() {
//   a = 10; // Since a is not declared with var, let, or const, JavaScript treats a as a global variable.
// }
// abc();
// console.log(a); // 10

// /************************************* */

// function abc() {
//   var a = 10; // function scope can not access outer side
// }
// abc();
// console.log(a); // a is not defined

// /******************************************************* */

// function a() {
//   console.log(1);
// }

// a(); // 2  hoisted with last function with same name
// function a() {
//   console.log(2);
// }
// a(); // 2
// // When functions with the same name are re-declared, the latter one overrides
// // the previous one. The output you see reflects the most recently defined a() function.
// /************************************************************ */

// var test = 10;

// function a() {
//   test = 20;
//   return; 
//   function test() {}
//   // hosted defination in creation phase then replace with 20 in execution phase
//   //not added in global scope as already created due to return this nested function is not called and doesn't affect the output we're looking at.
 
// }
// a();
// console.log(test);

// /************************************* */

// var a = "BFE"; // global object Window.a; in Node this undefined
// let b = "bigfrontend"; // local script scope so this.b is undefined.
// console.log(this.a);
// console.log(this.b);

// /************************************ */

// let a = 1;
// (function () {
//   let foo = () => a; // function expression
//   let a = 2;
//   console.log(foo()); // 2 // function expression called a = 2
// })();

// /********************************************* */

// function func() {
//   const a = (b = c = 1); 
//   // by the time assignment of a =, b and c become global variable as a declare 
//   // with const have scope in function func, where as (b = c = 1) becomes function expression 
//   // with global scope without declare with var, let const,  assign c =1 and c = b which is also 1
//   // inside func a = 1 as a=b=c 
// }
// func();
// console.log(typeof a, typeof b, typeof c); // outSide function func a undefined
// // undefined 1  1
// /************************************************* */
function foo() {
  console.log(1);
}
var foo = 2;
function foo() {
  console.log(3);
}
foo();

// /**************************************************** */

// if (
//   function foo() {
//     console.log("BFE");
//   }
// ) {
//   console.log("dev");
// }
// foo();

// /*********************************************************** */
// /* This is a JavaScript Quiz from BFE.dev*/


// if (true) {
//   function foo() {
//     console.log('BFE')
//   }
// }
// if (false) {
//   function bar() {
//     console.log('dev')
//   }
// }

// foo()
// bar()


// /*************************************************************** */
// // This is a JavaScript Quiz from BFE.dev

// var foo = 1;
// (function () {
//   console.log(foo);
//   foo = 2;
//   console.log(window.foo);
//   console.log(foo);
//   var foo = 3;
//   console.log(foo);
//   console.log(window.foo)
// })()




// /************************************ */
// // This is a JavaScript Quiz from BFE.dev

// (() => {
//   if (!fn) {
//     function fn() {
//       console.log('2')
//     }
//   }
//   fn()
// })()

// function fn() {
//   console.log('1')
// }

// // another one
// function fn1() {
//   console.log('3')
// }

// (() => {
//   if (!fn1) {
//     function fn1() {
//       console.log('4')
//     }
//   }
//   fn1()
// })()


// // another one !
// (() => {
//   if (false) {
//     function fn3() {
//       console.log('5')
//     }
//   }
//   fn3()
// })()

// /****************************************** */
// function foo() {
//   console.log(i)
//   for (var i = 0; i < 3; i++) {
//     console.log(i)
//   }
// }

// foo()

// /*************************************************** */
// // This is a JavaScript Quiz from BFE.dev

// var a = 1
// function a() {
// }

// console.log(typeof a)

// var b
// function b() {
// }
// b = 1

// console.log(typeof b)

// function c() {
// }
// var c = 1;

// console.log(typeof c)

// var d = 1;

// (function(){
//   d = '2'
//   console.log(typeof d)
//   function d() {
//   }
// })()

// console.log(typeof d)

// var e = 1
// const f = function e() {}

// console.log(typeof e)
// /************************************************** */
// // This is a JavaScript Quiz from BFE.dev

// const a = 1
// console.log(a)

// var b
// console.log(b)
// b = 2

// console.log(c)
// var c = 3

// console.log(d)
// let d = 2
// /***************************************** */


// // This is a JavaScript Quiz from BFE.dev

// const func1 = () => console.log(1)

// func1()

// func2()

// function func2() {
//   console.log(2)
// }


// func3()

// var func3 = function func4() {
//   console.log(3)
// }







// /******************************************* */
// // This is a JavaScript Quiz from BFE.dev

// var a = 1

// function func() {
//   a = 2
//   console.log(a)
//   var a
// }

// func()

// console.log(a)

// if (!('b' in window)) {
//   var b = 1
// }

// console.log(b)

// /******************************** */

// /************************************************************ */
// // This is a JavaScript Quiz from BFE.dev

// let foo = 10
// function func1() {
//     console.log(foo)
//     var foo = 1
// }
// func1 ()


// function func2() {
//     console.log(foo)
//     let foo = 1
// }
// func2 ()

