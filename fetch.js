// Using Request.Priority
// The fetch method in the browser comes with an additional option to prioritize the API requests.

// It can be one of the following values low, high, and auto. By default browsers fetch requests on high priority.

// // articles list (high by de

// articles list (high by default)
let articles = await fetch('/articles');

// articles recommendation list (suggested low)
let recommendation = await fetch('/articles/recommendation', {priority: 'low'});


// Using mircotask queue
// According to MDN –

// A microtask is a short function which is executed after the function or program which created it exits and only if the JavaScript execution stack is empty, but before returning control to the event loop being used by the user agent to drive the script’s execution environment.

// Thus while throttling, the calls will be made after some delay using the timer functions.

// We can make a high-priority call between the consecutive timer functions.

let callback = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => console.log(json))
  }
  let callback2 = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/2')
    .then(response => response.json())
    .then(json => console.log(json))
  }
  let urgentCallback = () => {
    fetch('https://jsonplaceholder.typicode.com/todos/3')
    .then(response => response.json())
    .then(json => console.log(json))
  }
  
  console.log("Main program started");
  setTimeout(callback, 0);
  setTimeout(callback2, 10);
  queueMicrotask(urgentCallback);
  console.log("Main program exiting");
  
  Output:
  "Main program started"
  "Main program exiting"
  
  {
    "userId": 1,
    "id": 3,
    "title": "fugiat veniam minus",
    "completed": false
  }
  
  {
    "userId": 1,
    "id": 1,
    "title": "delectus aut autem",
    "completed": false
  }
  
  {
    "userId": 1,
    "id": 2,
    "title": "quis ut nam facilis et officia qui",
    "completed": false
  }