// You need to check browser support for web workers before using it

if (typeof Worker !== "undefined") {
  // code for Web worker support.
} else {
  // Sorry! No Web Worker support..
}

// You need to follow below steps to start using web workers for counting example

// 1. Create a Web Worker File: You need to write a script to increment the count value. Let's name it as counter.js

let i = 0;

function timedCount() {
  i = i + 1;
  postMessage(i);
  setTimeout("timedCount()", 500);
}

timedCount();

// Here postMessage() method is used to post a message back to the HTML page

// 2. Create a Web Worker Object: You can create a web worker object by checking for browser support. Let's name this file as web_worker_example.js

if (typeof w == "undefined") {
  w = new Worker("counter.js");
}

// and we can receive messages from web worker

w.onmessage = function (event) {
  document.getElementById("message").innerHTML = event.data;
};

// 3. Terminate a Web Worker:
//     Web workers will continue to listen for messages (even after the external script is finished) until it is terminated. You can use the terminate() method to terminate listening to the messages.

w.terminate();

// 4. Reuse the Web Worker: If you set the worker variable to undefined you can reuse the code

w = undefined;

// What are the restrictions of web workers on DOM

// WebWorkers don't have access to below javascript objects since they are defined in an external files

// 1. Window object
// 2. Document object
// 3. Parent object
