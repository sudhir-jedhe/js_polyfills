Function & this in JavaScript
Posted on March 6, 2023 | by Prashant Yadav

Posted in ES6, Javascript

Functions are the building blocks of JavaScript, it is one of the programming languages that uses functional programming at the core.

As easy as it is to use the functions, understanding the this keyword is that complex. Because the value of the this is decided at the execution time, unlike other programming languages.

Majorly there are four different ways to invoke a function in Javascript.
1. As a normal function.

function example(){
  console.log("Hello World!");
};

example();
// "Hello World!"
Copy
2. As a method.

const obj = {
  blog: "learnersbucket",
  displayBlog: function (){
   console.log(this.blog);
  }
};

obj.displayBlog();
// "learnersbucket"
Copy
3. As a constructor.

const number = new Number("10");
console.log(number);
// 10
Copy
4. Indirectly using call, apply, & bind.

function example(arg1, arg2){
  console.log(arg1 + arg2);
};

example.call(undefined, 10, 20);
// 30
Copy
The value of this is decided upon how the function is invoked, each invocation creates its own context and the context decides the value of this. Also the “strict mode” affects the behavior of this too.

Value of “this” when invoked as a normal function
The value of this in the function invocation refers to the global object. window in the browser and global in nodejs.

function example(){
  // in browser this refers to window
  console.log(this === window);
}

example();
// true
Copy
Because this refers to the window object, if we assign any property to it we can access it outside.

function example(){
  // in strict mode this refers to undefined
  this.blog = "learnersbucket";
  this.displayBlog = function(){
    console.log(`Awesome ${this.blog}`)
  }
}

example();
console.log(this.blog);
// "learnersbucket"

this.displayBlog();
// "Awesome learnersbucket"
Copy
Strict mode
If you invoke the function with the strict mode the value of this will be undefined.

function example(){
  "use strict"
  // in strict mode this refers to undefined
  console.log(this === undefined);
}

example();
// true
Copy
It also affects all the inner functions that are defined in the function which is declared in strict mode.

function example(){
  "use strict"
  // in strict mode this refers to undefined
  console.log(this === undefined);
   
  // inner function
  function inner(){
    // in strict mode this refers to undefined
    console.log(this === undefined);
  }
  
  // invoke the inner function
  inner();
}

example();
// true
// true
Copy
IIFE (Immediately Invoked Function Expression)
When we immediately invoke the function, it is invoked as a normal function thus depending upon the mode, the value of this inside it is decided.

// normal mode
(function example(){
  // in strict mode this refers to undefined
  console.log(this === window);
})();
// true

// strict mode
(function example(){
  "use strict"
  // in strict mode this refers to undefined
  console.log(this === undefined);
})();
// true
Copy
Value of “this” when invoked as a method
When a function is declared inside an object the value of this inside that function will refer to the object it is declared in.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    // this refers to the current object
    console.log(this === example);
    console.log(this.blog);
  }
};

example.displayBlog();
// true
//"learnersbucket"
Copy
The context is set at the time of invocation, thus if we update the value of the object property value, it will be reflected.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    // this refers to the current object
    console.log(this === example);
    console.log(this.blog);
  }
};

example.blog = "MDN";
example.displayBlog();
// true
// "MDN"
Copy
If the object is passed as a reference, then the context is shared between both the variables, the original and the one that has the reference.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    // this refers to the current object
    console.log(this === example);
    console.log(this === example2);
    console.log(this.blog);
  }
};

const example2 = example;
example2.blog = "MDN";

example.displayBlog();
// true
// true
// "MDN"

example2.displayBlog();
// true
// true
// "MDN"
Copy
But, if we extract the method and save it in a variable, and then invoke the variable, the outcome will change.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    console.log(this === example);
    console.log(this.blog);
  }
};

const display = example.displayBlog;
display();
// false
// undefined
Copy
This is because when extracted to a variable and invoked it will be treated as a normal function.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    // this refers to the window object
    console.log(this === window);
    console.log(this.blog);
  }
};

const display = example.displayBlog;
display();
// true
// undefined
Copy
The same happens when you pass the methods to the timers i.e setTimeout and setInterval. Timers invoke the function as a normal function or throw errors in strict mode.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    // this refers to the window object
    console.log(this === window);
    console.log(this.blog);
  }
};

setTimeout(example.displayBlog, 200);
// true
// undefined
Copy
If there are any inner functions inside the methods, the value of this inside them depends upon how inner function is invoked.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    function inner(){
      // this refers to the window object
      console.log(this === window);
      console.log(this.blog);
    };
    
    inner();
  }
};

example.displayBlog();
// true
// undefined
Copy
Because the inner function is invoked as a normal function the value of this is a window object.

To access the value of the parent we can use either the Fat arrow function or indirect invocation technique using call & apply

Fat arrow function
The fat arrow function does not have the this of its own, it access the this in its nearest scope.

In the below example, the fat arrow’s this refers to the this of displayBlog() which refers to the this of the object it is part of.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    const inner = () => {
      // this refers to the example object
      console.log(this === example);
      console.log(this.blog);
    };
    
    inner();
  }
};

example.displayBlog();
// true
// "learnersbucket"
Copy
Using call() method
We can change the value of this inside a function by calling it indirectly with the call method.

const example = {
  blog: 'learnersbucket',
  displayBlog: function(){
    function inner(){
      // this refers to the example object
      console.log(this === example);
      console.log(this.blog);
    };
    
    inner.call(this);
  }
};

example.displayBlog();
// true
// "learnersbucket"
Copy
Value of “this” when invoked as a constructor
The value of this in the function invoked as a constructor refers to a new object which has the value passed as an argument. Each instance creates a new object.

function Example(blog){
  this.blog = blog;
  this.displayBlog = function(){
    console.log(this.blog);
  };
};

const example = new Example("learnersbucket");
example.displayBlog();
//"learnersbucket"

const example2 = new Example("MDN");
example2.displayBlog();
//"MDN"

console.log(example === example2);
//false
Copy
Note – There are some methods in JavaScript that when invoked normally behave as a constructor.

const reg1 = RegExp('\\w+');
const reg2 = RegExp('\\w+');

console.log(reg1 === reg2);
// false
Copy
To avoid this we can add a check to the function which we want to be invoked as a constructor only.

function Example(blog) {
  if (!(this instanceof Example)) {
    throw Error('Can be invoked only as a constructor');
  }
  this.blog = blog;
};

const example = new Example("learnersbucket");
console.log(example.blog);

const example2 = Example("MDN");
// Error: Can be invoked only as a constructor 
Copy
Value of “this” when invoked indirectly
When the function is invoked indirectly the value of this is what is passed as an argument to the call, apply, & bind method.

Run time binding
Using the call and apply methods we can invoke the function with the new context. The values will be attached to that execution only.

const exampleObj = {
  blog: 'learnersbucket',
};

function example(name) {
   console.log(`${name} runs ${this.blog}`);
};

example.call(exampleObj, 'Prashant');
// "Prashant runs learnersbucket"

example.apply(exampleObj, ['Prashant']);
// "Prashant runs learnersbucket"
Copy
The difference between call and apply is that apply accepts arguments in an array, while call accepts it normally.

Permanent binding
When using bind, we can create a new function with the new values and store it in a variable, and then use it further. It creates fresh permanent binding without affecting the original function.

const exampleObj = {
  name: 'prashant',
};

function example(blog) {
   console.log(`${this.name} runs ${blog}`);
};

const bounded = example.bind(exampleObj);

bounded('learnersbucket');
// "Prashant runs learnersbucket"

bounded('MDN');
// "Prashant runs MDN"
Copy
