// Implement a js function that returns a counter object with methods to retrieve and manipulate the value

function Counter() {
  // Initialize the count variable to 0.
  let count = 0;

  // Return an object with methods to retrieve and manipulate the count.
  return {
    // Retrieve the current count.
    get() {
      return count;
    },

    // Increment the count by 1.
    increment() {
      count++;
    },

    // Decrement the count by 1.
    decrement() {
      count--;
    },
  };
}

// Create a new counter object.
const counter = Counter();

// Retrieve the current count.
console.log(counter.get()); // 0

// Increment the count.
counter.increment();

// Retrieve the current count.
console.log(counter.get()); // 1

// Decrement the count.
counter.decrement();

// Retrieve the current count.
console.log(counter.get()); // 0

/*********************** */
// Global function which would form
// closure with modify function
function counter() {
  // Private counter variable
  let count = 0;

  // To increment the value of counter
  function increment() {
    count++;
  }

  // To decrement the value of counter
  function decrement() {
    count--;
  }

  // Modify function forms closure
  // here which is used outside
  function modify(val) {
    // To check increment or decrement
    // button has been clicked
    if (val === "1") increment();
    else if (val === "0") decrement();

    // Return the counter
    return count;
  }

  // Returning to make it available
  // outside counter function
  return modify;
}

// Storing the closure modify
const closure = counter();

// This function handles the button
// click, objButton to get value
function counterHandler(objButton) {
  // Storing the value return by modify
  let count = closure(objButton.value);

  // Getting div by it's id
  // and modifying its inner html
  document.getElementById("counter_div").innerHTML = "<h2>" + count + "</h2>";
}

/**************************************** */
// create a counter object
Create an object with property count, which increments every time count is accessed, initial value is 0.

const counter = createCounter()
counter.count // 0, then it should increment
counter.count // 1
counter.count // 2
counter.count = 100 // it cannot be altered
counter.count // 3



function createCounter() {
  let counter = -1;

  return {
    get count() {
      counter += 1;
      return counter;
    }
  }
}


/********************************* */
function createCounter(): {count: number } {
  let count = 0;
  return {
    get count() {
      return count++;
    }
  }
}


/******************************** */



function createCounter(): {count: number } {
 
  let count = 0

  const obj = {
    count: 0
  }

  Object.defineProperty(obj, 'count', {
    get: function() {
      return count++
    }
  })

  return obj
}


/************************************** */




/**
 * @returns { {count: number}}
 */
function createCounter() {
  return new Proxy({count: 0}, {
    get: (obj, prop) => obj[prop]++,
  set: () => 'it cannot be altered'
})
}


/************************************** */


/*
2620. Counter

Given an integer n, return a counter function. This counter function initially returns n and then returns 1 more than the previous value every subsequent time it is called (n, n + 1, n + 2, etc).
Example 1:

Input: 
n = 10 
["call","call","call"]
Output: [10,11,12]
Explanation: 
counter() = 10 // The first time counter() is called, it returns n.
counter() = 11 // Returns 1 more than the previous time.
counter() = 12 // Returns 1 more than the previous time.

*/

var createCounter = function(n) {
  return function() {
      return n++;
  };
};

const counter = createCounter(10)
counter()
counter()
counter()


/****************************************** */


/*
2665. Counter II

Write a function createCounter. It should accept an initial integer init. It should return an object with three functions.

The three functions are:
increment() increases the current value by 1 and then returns it.
decrement() reduces the current value by 1 and then returns it.
reset() sets the current value to init and then returns it.
 

Example 1:

Input: init = 5, calls = ["increment","reset","decrement"]
Output: [6,5,4]
Explanation:
const counter = createCounter(5);
counter.increment(); // 6
counter.reset(); // 5
counter.decrement(); // 4
*/

//solution:

var createCounter = function(init) {
  let cnt = init;
  return{
      increment: () => cnt+=1, decrement: () => cnt-=1, reset: () => (cnt=init),
  }
};