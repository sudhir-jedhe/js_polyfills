// This is a JavaScript Quiz from BFE.dev

console.log(1);

setTimeout(() => {
  console.log(2);
}, 100);

requestAnimationFrame(() => {
  console.log(3);
});

requestAnimationFrame(() => {
  console.log(4);
  setTimeout(() => {
    console.log(5);
  }, 10);
});

const end = Date.now() + 200;
while (Date.now() < end) {}

console.log(6);



// Did you know JavaScript has two types of task queues⚡

// JavaScript has two secret queues to handle tasks Microtask Queue and the Macrotask Queue.

// 𝗠𝗶𝗰𝗿𝗼𝘁𝗮𝘀𝗸 𝗤𝘂𝗲𝘂𝗲: Picture it like a super-fast line where tiny tasks wait for their turn. These tasks are usually promises or mutation observers. When a promise resolves, or a mutation happens, they jump into this queue.

// 𝗠𝗮𝗰𝗿𝗼𝘁𝗮𝘀𝗸 𝗤𝘂𝗲𝘂𝗲: It's like a regular line but for bigger tasks. Think setTimeout, callbacks or fetching data from a server. When these tasks need handling, they join the Macrotask Queue.

// So, why does this matter?
// Well, 

// → JavaScript always finishes what it's doing before checking these queues. 

// But, 𝗵𝗲𝗿𝗲'𝘀 𝘁𝗵𝗲 𝗸𝗶𝗰𝗸𝗲𝗿: 𝗶𝘁 𝗽𝗿𝗶𝗼𝗿𝗶𝘁𝗶𝘇𝗲𝘀 𝗠𝗶𝗰𝗿𝗼𝘁𝗮𝘀𝗸𝘀 𝗼𝘃𝗲𝗿 𝗠𝗮𝗰𝗿𝗼𝘁𝗮𝘀𝗸𝘀!

// So, next time you're coding and wondering how JavaScript juggles tasks, remember these queues. They keep things organized and ensure your code runs smoothly!

// And the event loop continually checks if the call stack is empty. If it is, it looks at the Microtask Queue first, then the Macrotask Queue. It grabs tasks from these queues one by one, executing them until both queues are empty.

// There is a difference between setTimeout and fetching data from server 
// SetTimeout is executed in macrotask which has less priority then microtask queue 

// In case of fetching data from server it returns a promise which will be pushed In microtask high priority then macrotask and then executed 

// I prefer (engineers choice) saying MicroTask queue as Priority queue and MacroTask queue as Callback queue. As this resembles more to its use case.



What is the Event Loop in JavaScript?

The Event Loop is a source of confusion for many developers, but it's a fundamental piece of the JavaScript engine. It's what allows JavaScript to be single-threaded, yet able to execute in a non-blocking fashion. To understand the Event Loop, we first need to explain a few things about the JavaScript engine, such as the Call Stack, Tasks, Microtasks and their respective Queues. Let's break them down one by one.

The Call Stack
The Call Stack is a data structure that keeps track of the execution of JavaScript code. As the name suggests, it's a stack, thus a LIFO (Last In, First Out) data structure in memory. Each function that's executed is represented as a frame in the Call Stack and placed on top of the previous function.

Let's look at a simple example, step by step:

function foo() {
  console.log('foo');
  bar();
}

function bar() {
  console.log('bar');
}
The Call Stack is initially empty.
The function foo() is pushed onto the Call Stack.
The function foo() is executed and popped off the Call Stack.
The function console.log('foo') is pushed onto the Call Stack.
The function console.log('foo') is executed and popped off the Call Stack.
The function bar() is pushed onto the Call Stack.
The function bar() is executed and popped off the Call Stack.
The function console.log('bar') is pushed onto the Call Stack.
The function console.log('bar') is executed and popped off the Call Stack.
The Call Stack is now empty.
Tasks and the Task Queue
Tasks are scheduled, synchronous blocks of code. While executing, they have exclusive access to the Call Stack and can also enqueue other tasks. Between Tasks, the browser can perform rendering updates. Tasks are stored in the Task Queue, waiting to be executed by their associated functions. The Task Queue, in turn, is a FIFO (First In, First Out) data structure. Examples of Tasks include the callback function of an event listener associated with an event and the callback of setTimeout().

Microtasks and the Microtask Queue
Microtasks are similar to Tasks in that they're scheduled, synchronous blocks of code with exclusive access to the Call Stack while executing. Additionally, they are stored in their own FIFO (First In, First Out) data structure, the Microtask Queue. Microtasks differ from Tasks, however, in that the Microtask Queue must be emptied out after a Task completes and before re-rendering. Examples of Microtasks include Promise callbacks and MutationObserver callbacks.

Microtasks and the Microtask Queue are also referred to as Jobs and the Job Queue.

The Event Loop
Finally, the Event Loop is a loop that keeps running and checks if the Call Stack is empty. It processes Tasks and Microtasks, by placing them in the Call Stack one at a time and also controls the rendering process. It's made up of four key steps:

Script evaluation: Synchronously executes the script until the Call Stack is empty.
Task processing: Select the first Task in the Task Queue and run it until the Call Stack is empty.
Microtask processing: Select the first Microtask in the Microtask Queue and run it until the Call Stack is empty, repeating until the Microtask Queue is empty.
Rendering: Re-render the UI and loop back to step 2.
A practical example
To better understand the Event Loop, let's look at a practical example, incorporating all of the above concepts:

console.log('Script start');

setTimeout(() => console.log('setTimeout()'), 0);

Promise.resolve()
  .then(() => console.log('Promise.then() #1'))
  .then(() => console.log('Promise.then() #2'));

console.log('Script end');

// LOGS:
//   Script start
//   Script end
//   Promise.then() #1
//   Promise.then() #2
//   setTimeout()
Does the output look like what you expected? Let's break down what's happening, step by step:

The Call Stack is initially empty. The Event Loop begins evaluating the script.
console.log() is pushed to the Call Stack and executed, logging 'Script start'.
setTimeout() is pushed to the Call Stack and executed. This creates a new Task for its callback function in the Task Queue.
Promise.prototype.resolve() is pushed to the Call Stack and executed, calling in turn Promise.prototype.then().
Promise.prototype.then() is pushed to the Call Stack and executed. This creates a new Microtask for its callback function in the Microtask Queue.
console.log() is pushed to the Call Stack and executed, logging 'Script end'.
The Event Loops has finished its current Task, evaluating the script. It then begins running the first Microtask in the Microtask Queue, which is the callback of Promise.prototype.then() that was queued in step 5.
console.log() is pushed to the Call Stack and executed, logging 'Promise.then() #1'.
Promise.prototype.then() is pushed to the Call Stack and executed. This creates a new entry for its callback function in the Microtask Queue.
The Event Loop checks the Microtask Queue. As it’s not empty, it executes the first Microtask, which is the callback of Promise.prototype.then() that was queued in step 9.
console.log() is pushed to the Call Stack and executed, logging 'Promise.then() #2'.
Re-rendering would occur here, if there was any.
The Microtask Queue is empty, so the Event Loop moves to the Task Queue and executes the first Task, which is the callback of setTimeout() that was queued in step 3.
console.log() is pushed to the Call Stack and executed, logging 'setTimeout()'.
Re-rendering would occur here, if there was any.
The Call Stack is now empty.
Summary
The Event Loop is responsible for executing the JavaScript code. It first evaluates and executes the script, then processes Tasks and Microtasks.
Tasks and Microtasks are scheduled, synchronous blocks of code. They are executed one at a time, and are placed in the Task Queue and Microtask Queue, respectively.
For all of these, the Call Stack is used to keep track of function calls.
Whenever Microtasks are executed, the Microtask Queue must be emptied out before the next Task can be executed.
Rendering occurs between Tasks, but not between Microtasks.
Notes
The script evaluation step of the Event Loop is in itself treated similarly to a Task.
The second argument of setTimeout() indicates a minimum time until execution, not a guaranteed time. This is due to the fact that Tasks execute in order and that Microtasks may be executed in-between.
The behavior of the event loop in Node.js is similar, but has some differences. Most notably, there is no rendering step.
Older browser versions did not completely respect the order of operations, so Tasks and Microtasks may execute in different orders.