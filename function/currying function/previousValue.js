// We will see how to create a javascript function that will remember its previously passed values and return the sum of the current and previous value.


const curry = () => {
  //To store the previous values
  let sum = 0;

  //Return an inner function
  //Which will have access to its parent function's store
  return function (num = 0) {
    sum += num;
    return sum;
  };
};

//Returns and store the inner function.
let sum = curry();

console.log(sum(5)); //5
console.log(sum(3)); //8
console.log(sum(4)); //12
console.log(sum(0)); //12
console.log(sum()); //12
