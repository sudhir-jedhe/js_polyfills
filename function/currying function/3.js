add(1)(2).value() = 3; 
add(1, 2)(3).value() = 6; 
add(1)(2)(3).value() = 6; 
add(1)(2) + 3 = 6;



function MyNumberType(n) {
    this.number = n;
  }
  
  MyNumberType.prototype.valueOf = function () {
    return this.number + 1;
  };
  
  const myObj = new MyNumberType(4);
  myObj + 3; // 8



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