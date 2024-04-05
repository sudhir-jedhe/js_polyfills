/*************************User Implement custom chaining ************************ */
/**
 * For more programming concepts, questions, tips, and tutorials, visit:
 *
 * https://bit.ly/devtools-yt
 * https://code.devtools.tech
 * https://devtools.tech
 *
 * Author: Puneet Ahuja (https://puneetahuja.in)
 */

/**
  * Question: Create a function calculator that should take one initial value.
  * Chain calculations like add, subtract on it.
  * Return the calculated value on invocation of val function at the end of the chain.
  * 
    var result = cal(2)
            .add(5)
            .sub(4)
            .val()

    console.log("Result is : " , result)

    // Output : 3 (2 + 5 - 4)
  */

/**
 * **********  Approach - 4  **********
 */

class Calculator {
  constructor(initialValue) {
    this.accumulator = initialValue;
  }

  add(num) {
    this.accumulator += num;
    return this;
  }

  sub(num) {
    this.accumulator -= num;
    return this;
  }

  val() {
    return this.accumulator;
  }
}

function cal(initialValue) {
  return new Calculator(initialValue);
}

var result = cal(2).add(5).sub(4).val();

console.log("Result is : ", result);

/************************************** */
const ComputeAmount = function () {
  return {
    store: 0,
    crore: function (val) {
      this.store += val * Math.pow(10, 7);
      return this;
    },

    lacs: function (val) {
      this.store += val * Math.pow(10, 5);
      return this;
    },

    thousand: function (val) {
      this.store += val * Math.pow(10, 3);
      return this;
    },

    hundred: function (val) {
      this.store += val * Math.pow(10, 2);
      return this;
    },

    ten: function (val) {
      this.store += val * 10;
      return this;
    },

    unit: function (val) {
      this.store += val;
      return this;
    },

    value: function () {
      return this.store;
    },
  };
};


Input:
const amount = ComputeAmount().lacs(9).lacs(1).thousand(10).ten(1).unit(1).value();
console.log(amount === 1010011);

const amount2 = ComputeAmount().lacs(15).crore(5).crore(2).lacs(20).thousand(45).crore(7).value();
console.log(amount2 === 143545000);

Output:
true
true



const ComputeAmount = function(){
  this.store = 0;
  
  this.crore = function(val){
    this.store += val * Math.pow(10, 7);
    return this;
  };
  
  this.lacs = function(val){
    this.store += val * Math.pow(10, 5);
    return this;
  }
  
  this.thousand = function(val){
    this.store += val * Math.pow(10, 3);
    return this;
  }
  
  this.hundred = function(val){
    this.store += val * Math.pow(10, 2);
    return this;
  }
  
  this.ten = function(val){
    this.store += val * 10;
    return this;
  }
  
  this.unit = function(val){
    this.store += val;
    return this;
  }
  
  this.value = function(){
    return this.store;
  }
}