Functions in JavaScript
A function is the singular independent unit in a programming language that abstracts the particular logic which does have to be repeated and can be extended.

It can accept any number argument depending upon how it is defined and may and may not return a value. The returned value can also be different for the same arguments depending on how it is defined.

function sum(a, b){
  return a + b;
}

console.log(sum(10, 20));
// 30
Copy
This is a simple example of a sum function that accepts two arguments and returns their sum, now this function can be used anytime when you want to calculate the sum of two numbers.

And the way it is invoked is called a normal function expression.

Methods in JavaScript
A method is a function that is part of an object and can only be accessed on the instance of that object.

For example,

const obj = {
  sum: function(a, b){
    return a + b;
  }
};

console.log(obj.sum(10, 20));
// 30
Copy
Here the sum method can be only accessed on the object obj. In JavaScript, we can directly define the objects, but in other programming languages, objects are always returned from the class.

class MethodExample{
  sum(a, b){
    return a + b;
  }
};

const methodExample = new MethodExample();
console.log(methodExample.sum(10, 20));
// 30
Copy
When an instance of the class MethodExample is created it returns a new object that has the method sum. As every time a new instance is created, changing the method property of one instance does not affect the other instance’s methods.