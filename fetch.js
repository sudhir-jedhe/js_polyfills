// articles list (high by default)
let articles = await fetch('/articles');

// articles recommendation list (suggested low)
let recommendation = await fetch('/articles/recommendation', {priority: 'low'});

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