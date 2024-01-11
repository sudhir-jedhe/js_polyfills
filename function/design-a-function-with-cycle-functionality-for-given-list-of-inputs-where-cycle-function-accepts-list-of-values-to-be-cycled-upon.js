// 1. Design a Calulator interface for 2 number inputs which can perform sum, difference, product and dividend whenever invoked on the same interface
// Example
const calc12And5 = Calculator(12, 5);
calc12And5.sum(); // 17
calc12And5.difference(); // 7
calc12And5.product(); // 60
calc12And5.dividend(); // 2

// Simple revealing module pattern can be used which receives inputs and executes different operations exposed through functions
function Calulator(num1, num2) {
  function sum() {
    return num1 + num2;
  }

  function difference() {
    return num1 - num2;
  }

  function product() {
    return num1 * num2;
  }

  function dividend() {
    return Math.floor(num1 / num2);
  }

  return { sum, difference, product, dividend };
}
