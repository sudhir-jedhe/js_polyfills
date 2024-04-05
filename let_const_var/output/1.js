let a = 10;
if (true) {
  let a = 20;
  console.log(a, "inside"); // 20 inside
}
console.log(a, "outside"); // 10 outside

// - 1: 20, "inside" and 20, "outside"
// - 2: 20, "inside" and 10, "outside"
// - 3: 10, "inside" and 10, "outside"
// - 4: 10, "inside" and 20, "outside"

// The variable "a" declared inside "if" has block scope and does not affect the value of the outer "a" variable.
