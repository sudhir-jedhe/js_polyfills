function func() {
  try {
    console.log(1);
    return;
  } catch (e) {
    console.log(2);
  } finally {
    console.log(3);
  }
  console.log(4);
}

func();

/******************************************** */
// This is a JavaScript Quiz from BFE.dev

var a = "a";
try {
  throw new Error("BFE.dev");
} catch {
  var a = "a1";
}
console.log(a);

var b = "b";
try {
  throw new Error("BFE.dev");
} catch (b) {
  var b = "b1";
}
console.log(b);

var c = "c";
try {
  throw new Error("BFE.dev");
} catch (error) {
  var c = "c1";
}
console.log(c);
