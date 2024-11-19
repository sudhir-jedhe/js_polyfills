// This is a JavaScript Quiz from BFE.dev

let func = () => {
  console.log(1);
};
setTimeout(() => {
  func = () => {
    console.log(2);
  };
}, 0);

setTimeout(func, 100);

/**************************** */

let num;

for (let i = 0; i < 5; i++) {
  num = i;
  setTimeout(() => {
    console.log(num);
  }, 100);
}

// 4

/************************************************** */
// This is a JavaScript Quiz from BFE.dev

// This snippet's result may vary on browsers

setTimeout(() => {
  console.log(2);
}, 2);

setTimeout(() => {
  console.log(1);
}, 1);

setTimeout(() => {
  console.log(0);
}, 0);



/********************************* */


setTimeout(function(){
  console.log('I will be visible after 1 sec delay');
}, 1000);

//"I will be visible after 1 sec delay"

setTimeout(function, milliseconds, param1, param2, ...){ () => {}, milliseconds};

// Calling predefined function
let greet = (param1, param2) => {
  console.log(`${param1} is ${param2}`)
}

setTimeout(function(){ greet('Prashant', 'Happy') }, 2000);

//"Prashant is Happy"


// Passing params separately
let greet = (param1, param2) => {
  console.log(`${param1} is ${param2}`)
}

setTimeout(greet, 2000, 'Prashant', 'Happy');

//"Prashant is Happy"


// Handling this
// Handling this with setTimeout was not so easy before, We had to use a workaround for that.

let increment = {
  count: 1,
  start: function(){
    setTimeout(function(){
      console.log(++that.count);
    }, 1000)
  }
}

increment.start();
//NaN


let increment = {
  count: 1,
  start: function(){
    //Assign this to variable that
    var that = this;
    setTimeout(function(){
      console.log(++that.count);
    }, 1000)
  }
}

increment.start();
//2

let increment = {
  count: 1,
  start: function(){
    setTimeout(() => {
      console.log(++this.count);
    }, 1000)
  }
}

increment.start();
//2

let start = setTimeout(() => {
  console.log('I just started');
  clearMe();
}, 2000);

let clearMe = () => {
  clearTimeout(start);
}

//"I just started"


// Using setTimeout to create setInterval

let increment = (num) => {
  setTimeout(() => {
     //print the num
     console.log(num);

     //increment the value
     num = num + 1;

     //recursively call the function
     increment(num);

  }, 1000);
}
 
increment(1);

//1
//2
//3
//4