add(1)(2).value() = 3; 
add(1, 2)(3).value() = 6; 
add(1)(2)(3).value() = 6; 
add(1)(2) + 3 = 6;


// Currying in JavaScript is a concept of functional programming in which we can pass functions as arguments (callbacks) and return functions without any side effects (Changes to program states).

// This is a little tricky question and requires us to use and modify the valueOf() method.

// When JavaScript wants to turn an object into a primitive value, it uses the function valueOf() method. JavaScript automatically calls the function valueOf() method when it comes across an object where a primitive value is anticipated, so you don’t even need to do it yourself.


function MyNumberType(n) {
    this.number = n;
  }
  
  MyNumberType.prototype.valueOf = function () {
    return this.number + 1;
  };
  
  const myObj = new MyNumberType(4);
  myObj + 3; // 8

  // Thus we can form closure and track the arguments in an Array and return a new function every time that will accept new arguments.

  // We will also override the valueOf() method and return the sum of all the arguments for each primitive action, also add a new method value() that will reference the valueOf() thus when invoked will return the sum of arguments.

  function add(...x){
    // store the current arguments
    let sum = x;
  
    function resultFn(...y){
        // merge the new arguments
        sum = [...sum, ...y];
        return resultFn;
    }
    
    // override the valueOf to return sum
    resultFn.valueOf = function(){
      return sum.reduce((a, b) => a + b, 0);
    };
    
    // extend the valueOf
    resultFn.value = resultFn.valueOf;
    
    // return the inner function
    // on any primitive action .valueOf will be invoked
    // and it will return the value
    return resultFn;
}

Input:
console.log(add(1)(2).value() == 3); 
console.log(add(1, 2)(3).value() == 6); 
console.log(add(1)(2)(3).value() == 6); 
console.log(add(1)(2) + 3);

Output:
true
true
true
6