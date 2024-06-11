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