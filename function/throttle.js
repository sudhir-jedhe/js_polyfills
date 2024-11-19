/******************************Throtlling *****************/
function throttle(func, delay) {
  let lastExecTime = 0;
  let timeoutId;

  return function (...args) {
    const currentTime = new Date().getTime();

    if (currentTime - lastExecTime >= delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = currentTime;
      }, delay);
    }
  };
}

// The throttling function forces a function to run once in an amount of time for one or multiple calls
// The function is built to limit the number of function calls to improve the performance

// Example usage:

// A function to be throttled
function expensiveOperation() {
  console.log("Executing expensive operation...");
}

// Throttle the function with a delay of 500 milliseconds
const throttledOperation = throttle(expensiveOperation, 500);

// Trigger the throttled function
throttledOperation(); // This will execute the expensive operation

// Quickly trigger the throttled function multiple times
// The expensive operation will be executed at most once every 500 milliseconds
setTimeout(() => {
  throttledOperation();
  throttledOperation();
  throttledOperation();
}, 100);

/***************************************************************** */
function throttle(func, waitTime) {
  // Set isThrottling flag to false to start
  // and savedArgs to null
  let isThrottling = false,
    savedArgs = null;
  // Spread the arguments for .apply
  return function (...args) {
    // Return a wrapped function
    // Flag preventing immediate execution
    if (!isThrottling) {
      // Actual initial function execution
      func.apply(this, args);
      // Flip flag to throttling state
      isThrottling = true;
      // Queue up timer to flip the flag so future iterations can occur
      function queueTimer() {
        setTimeout(() => {
          // Stop throttling
          isThrottling = false;
          // Queueing up the next invocation after wait time passes
          if (savedArgs) {
            func.apply(this, savedArgs);
            isThrottling = true;
            savedArgs = null;
            queueTimer();
          }
        }, waitTime);
      }
      queueTimer();
    }
    // Wait state until timeout is done
    // Save arguments
    else savedArgs = args;
  };
}

let time = 0;

function testThrottle(input) {
  const calls = [];
  time = 0;

  function wrapper(arg) {
    calls.push(`${arg}@${time}`);
  }

  const throttledFunc = throttle(wrapper, 3);
  input.forEach((call) => {
    const [arg, time] = call.split("@");
    setTimeout(() => throttledFunc(arg), time);
  });
  return calls;
}

expect(testThrottle(["A@0", "B@2", "C@3"])).toEqual(["A@0", "C@3"]);

/************************************************* */
function throttle(fn, delay, context) {
  let timer;
  let lastArgs;

  return function (...args) {
    lastArgs = args;
    context = this ?? context;

    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(context, lastArgs);
      clearTimeout(timer);
    }, delay);
  };
}

// /******************************************************* */
// Design an interface which limits the number of function calls by executing the function
// once for a given count of calls
// function forces a function run to for specific number of times in a given number of execution calls
// The function is built to limit the number of times a function is called
// Throttling function design can take function (to be throttled), delay and the optional context
function sampler(fn, count, context) {
  let counter = 0;

  return function (...args) {
    lastArgs = args;
    context = this ?? context;

    if (++counter !== count) return;

    fn.apply(context, args);
    counter = 0;
  };
}

/************************** */

function throttle(fn, delay) {
  let timer = null;

  return function (...args) {
    if (timer === null) {
      timer = setTimeout(() => {
        fn(...args);
        timer = null;
      }, delay);
    }
  };
}
const handleClick = () => {
  // Do something
};

const throttledHandleClick = throttle(handleClick, 1000);

// Call the throttled function
throttledHandleClick();

// Call the throttled function again, but it will not be executed because it has already been called within the last 1000 milliseconds.
throttledHandleClick();

/********************** */
/**
 * @param {Function} func
 * @param {number} wait
 */
function throttle(func, wait) {
  let timer = null;
  // Not that this question is slightly different where you have to save the arguments of the
  // last throttled call
  let lastArgs = [];

  return function throttledFunc(...args) {
    // Initial case timer would be null, so this would get invoked
    if (timer == null) {
      // Call the underlying function, then setup the timer
      func.apply(this, args);
      timer = setTimeout(() => {
        // If there were throttled calls, run the function post timer
        // with the saved arguments
        if (lastArgs.length) {
          func.apply(this, lastArgs);
        }
        // Back to initial condition
        timer = null;
        lastArgs = [];
      }, wait);
    } else {
      // Function is throttled, no call, just save the arguments and do nothing else.
      lastArgs = args;
      return;
    }
  };
}

//  implement throttle() with leading & trailing option In this problem, you
// are asked to implement a enhanced throttle() which accepts third parameter,
// option: {leading: boolean, trailing: boolean}

// leading: whether to invoke right away trailing: whether to invoke after the
// delay.
// 4. implement basic throttle() is the default case with {leading: true,
//    trailing: true}.
/*********************** */

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} option.leading
 * @param {boolean} option.trailing
 */
function throttle(func, wait, option = { leading: true, trailing: true }) {
  if (!option.leading && !option.trailing) return () => null;
  let waiting = false;
  let lastArgs;
  let timeoutId = null;
  const timeoutFn = (context) => {
    timeoutId = setTimeout(() => {
      if (option.trailing && lastArgs) {
        func.apply(context, lastArgs);
        lastArgs = null;
        if (timeoutId) timeoutId = null;
        timeoutFn(context);
      } else {
        waiting = false;
      }
    }, wait);
  };

  return function () {
    if (!waiting) {
      waiting = true;
      if (option.leading) func.apply(this, arguments);
      timeoutFn(this);
    } else {
      lastArgs = [...arguments];
    }
  };
}


/************************** */
In many interviews, Interviewers often ask questions related to web performance. It is an important domain when it comes to large scale web applications. One way to improve performance is to use Throttling. It is way to minimise function calls.

You have to implement throttle(func, delay) that will return a throttled function, which delays the invoke.

To throttle a function means to ensure that the function is called at most once in a specified time period (for instance, once every 10 seconds). This means throttling will prevent a function from running if it has run “recently”. Throttling also ensures a function is run regularly at a fixed rate.

Here is an example.

Before throttling we have a series of calling like

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

After throttling at wait time of 3 dashes

─A─ ─ ─C─ ─ ─D ─ ─ ─ ─ E─ ─ ─G

Testing would look like:

var callback = function() { ... };
var throttled = throttle(callback, 3);

throttled();
throttled();
throttled();

clock.tick(04); // increasing clock by 4 seconds
assert.equal(callback.callCount, 1);

throttled();
throttled();
throttled();

clock.tick(04); // increasing clock by 4 seconds
assert.equal(callback.callCount, 2);
Callback should be called only twice. Don't worry about calledCount property. That is on us.

/*********************************************** */

Implement a throttler that executes an array of tasks. When the throttler is passed a number, only executes that number of the tasks and passes the other tasks into a queue.

Example
Input:
const task = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const count = 5;

throttle(task, count, 2000); // [1, 2, 3, 4, 5] // immediately 
throttle(task, count, 2000); // [6, 7, 8, 9, 10] // after 2 seconds
throttle(task, count, 2000); // [1, 2, 3, 4, 5] // after 2 seconds Copy
In each call, 10 new tasks are pushed and only 5 are executed, remaining are stored in the queue.

What is a throttling?
Throttling is a way/technique to restrict the number of function execution/calls.

Throttling an array of tasks.
For this implementation, we will modify the original throttle function to accept an array of tasks and a count and run the number of tasks the same as the count.

In the original implementation, we will add a queue array that will store the task. In each throttle call, copy all the tasks to the queue and then run only the count of tasks from the queue and so on in the consecutive call.

By default, the count will be of the same size as the array of tasks.




const throttle = (task, count = task.length, callback, delay = 1000) => {
  // track the throttle
  let lastFunc;
  let lastRan;
  
  // track the task
  let queue = [];
  
  return function() {
    // store the context to pass it to the callback function
    const context = this;
    const args = arguments; 
    
    // if the throttle is executed the first time
    // run it immediately
    if (!lastRan) {
      // copy all the tasks to the queue
      queue = [...queue, ...task];
      
      // get the amount of task to run
      const execute = queue.splice(0, count);
      
      // pass those tasks to the callback
      callback(execute); 
      
      // update the last ran time
      // to run it after the delay
      lastRan = Date.now();
    } else {
      // clear the timer 
      clearTimeout(lastFunc);
      
      // start a new timer
      // run the function after the delay
      lastFunc = setTimeout(function() {
        // calc the difference between 
        // the last ran and current time
        // if it is greater than the delay 
        // invoke it
        if ((Date.now() - lastRan) >= delay) {
          // copy all the tasks to the queue
          queue = [...queue, ...task];
          
           // get the amount of task to run
          const execute = queue.splice(0, count);
          
          // pass those tasks to the callback
          callback(execute);
          
          // update the last ran time
          // to run it after the delay
          lastRan = Date.now();
        }
      }, delay - (Date.now() - lastRan));
    }
  }
};


Input:
// this will add these tasks at each call
btn.addEventListener('click',  throttle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 2, (task) => {
  console.log(task);
}, 2000));

Output:
// [object Array] (2)
[1,2] // 1st call

// [object Array] (2)
[3,4] // 2nd call after 2 seconds

// [object Array] (2)
[5,6] // 3rd call after 2 seconds

// [object Array] (2)
[7,8] // 4th call after 2 seconds

// [object Array] (2)
[9,10] // 5th call after 2 seconds

// [object Array] (2)
[1,2] // 6th call after 2 seconds


/*********************************** */


// Learn what is throttling in javascript.

// Excessive function invocations in javascript applications hamper the performance drastically. To optimize an app we need to handle this correctly.

// There are scenarios where we may invoke functions when it isn’t necessary. For example, consider a scenario where we want to make an API call to the server on a button click.

// If the user spam’s the click then this will make API call on each click. This is not what we want, we want to restrict the no of API calls that can be made. The other call will be made only after a specified interval of time.

// Debouncing and Throttling help us to gain control over the rate at which function is called or executes.

// What exactly is throttling in javascript?
// Throttling is a way/technique to restrict the number of function execution/call. For example, consider a lucky draw number generator, we want to get a number only after a particular time.

// With throttling, we can achieve this.

// Here is the code for throttling in javascript.



const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args)
          lastRan = Date.now()
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}


btn.addEventListener('click', throttle(function() {
  return console.log('HOLA! oppo', new Date().toUTCString());
}, 1000));


// Then what is the difference between debouncing and throttling?
// Debouncing:- It is used to invoke/call/execute function only when things have stopped happening for a given specific time. For example, Call a search function to fetch the result when the user has stopped typing in the search box. If the user keeps on typing then reset the function.

// Throttling:- It is used to restrict the no of times a function can be called/invoked/executed. For example, making an API call to the server on the user’s click. If the user spam the click then also there will be specific calls only. Like, make each call after 10 seconds.