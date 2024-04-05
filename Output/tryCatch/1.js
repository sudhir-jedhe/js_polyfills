var a = "a";
try {
  throw new Error("BFE.dev");
} catch {
  // no local variable being used
  var a = "a1"; // overwrites outer varibale a, redeclaring global a
}
console.log(a); // a1
// We have just written catch and are not even capturing the error parameter so var a declared inside actually becomes global and overwrites outer a hence printing a1 later

var b = "b";
try {
  throw new Error("BFE.dev");
} catch (b) {
  // local variable b references the passed error
  var b = "b1"; // No longer pointing to the global variable, its a locally scoped variable only
}
console.log(b); // b
// We have written catch(b) which means we are using b to hold the exception value which is only available locally inside this catch block. Hence, even after declaring b inside, the global value remains unchanged. Thus, printing b

var c = "c";
try {
  throw new Error("BFE.dev");
} catch (error) {
  // local variable error references the passed error
  var c = "c1"; // overwrites outer variable c, redeclaring global c
}
console.log(c); // c1

// We have written catch(error) and are using error variable to capture the error value , so error is a locally scoped variable but c is not. Hence, similar to 1. var c declared inside actually becomes global and overwrites outer c hence printing c1 later.
