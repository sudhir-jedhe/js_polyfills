// Implement a function compute amount such that it adds the numbers passed to it as shown below and .value() returns the output.


// computeAmount().lacs(15).crore(5).crore(2).lacs(20).thousand(45).crore(7).value()
// Expected output: 143545000


// 1 Lac = 100,000
// 1 Crore = 10,000,000
// 1 Thousand = 1,000


function computeAmount() {
    let totalAmount = 0; // To store the accumulated total
  
    // Function to add lacs
    function lacs(value) {
      totalAmount += value * 100000;
      return this; // Return the object to allow method chaining
    }
  
    // Function to add crores
    function crore(value) {
      totalAmount += value * 10000000;
      return this;
    }
  
    // Function to add thousands
    function thousand(value) {
      totalAmount += value * 1000;
      return this;
    }
  
    // Function to return the computed value
    function value() {
      return totalAmount;
    }
  
    // Returning an object with the methods
    return {
      lacs,
      crore,
      thousand,
      value
    };
  }
  
  // Example usage:
  const result = computeAmount()
    .lacs(15)
    .crore(5)
    .crore(2)
    .lacs(20)
    .thousand(45)
    .crore(7)
    .value();
  
  console.log(result); // Expected output: 143545000
  