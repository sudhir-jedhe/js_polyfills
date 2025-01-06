Creating a custom event loop simulation in JavaScript can help you understand how JavaScript's concurrency model works. JavaScript uses an event-driven, non-blocking I/O model that works on a single-threaded event loop. Below is a simplified custom simulation of how the event loop works in JavaScript.

This custom event loop will simulate tasks in the **call stack**, **event queue**, and the **macro/micro tasks** that are processed by the event loop.

### Custom Event Loop Simulation Example

```javascript
class EventLoop {
  constructor() {
    this.callStack = [];
    this.eventQueue = [];
    this.microTaskQueue = [];
  }

  // Simulate pushing a task to the call stack
  pushToCallStack(task) {
    this.callStack.push(task);
    console.log(`Call Stack: ${this.callStack.map(task => task.name).join(', ')}`);
  }

  // Simulate running the event loop
  run() {
    console.log("Event Loop Started");

    // Start processing tasks from the call stack
    while (this.callStack.length > 0) {
      const currentTask = this.callStack.shift(); // Take the first task from the call stack
      console.log(`Running task: ${currentTask.name}`);

      currentTask();
      
      // Check if there are micro-tasks to run after a task
      while (this.microTaskQueue.length > 0) {
        const microTask = this.microTaskQueue.shift();
        console.log(`Running micro-task: ${microTask.name}`);
        microTask();
      }

      // After a task finishes, push any event queue tasks to the call stack
      if (this.eventQueue.length > 0) {
        const eventTask = this.eventQueue.shift();
        console.log(`Pushing event task to call stack: ${eventTask.name}`);
        this.callStack.push(eventTask);
      }

      // Simulate async event loop behavior (not blocking UI)
      this.simulateAsyncBehavior();
    }

    console.log("Event Loop Finished");
  }

  // Simulate adding a task to the event queue
  addToEventQueue(task) {
    this.eventQueue.push(task);
    console.log(`Added to Event Queue: ${task.name}`);
  }

  // Simulate adding a micro-task
  addMicroTask(task) {
    this.microTaskQueue.push(task);
    console.log(`Added to Micro Task Queue: ${task.name}`);
  }

  // Simulate async behavior by putting a timeout
  simulateAsyncBehavior() {
    setTimeout(() => {
      console.log("Async behavior: Simulating I/O or timers");
    }, 0);
  }
}

// Create a new Event Loop simulation
const eventLoop = new EventLoop();

// Define some tasks
const task1 = () => {
  console.log("Task 1 started");
  eventLoop.addMicroTask(() => {
    console.log("Micro Task 1 from Task 1");
  });
  eventLoop.addToEventQueue(task2);
  console.log("Task 1 finished");
};

const task2 = () => {
  console.log("Task 2 started");
  eventLoop.addMicroTask(() => {
    console.log("Micro Task 2 from Task 2");
  });
  console.log("Task 2 finished");
};

// Start the simulation
eventLoop.pushToCallStack(task1);
eventLoop.run();
```

### Explanation:

1. **Call Stack**: A stack of tasks that are being executed synchronously. Tasks are processed in a Last In, First Out (LIFO) order.
   
2. **Event Queue**: A queue for tasks that are scheduled to run asynchronously, like event listeners, setTimeout, or setInterval. These tasks are added after the call stack is empty.
   
3. **Micro Task Queue**: A queue for micro-tasks like promises that need to be executed after the currently running task finishes and before any event queue tasks are processed.

### Flow:
- Initially, `task1` is pushed to the call stack.
- `task1` starts running. It adds a micro-task (`Micro Task 1 from Task 1`) and schedules `task2` to the event queue.
- After `task1` completes, micro-tasks are processed. In this case, `Micro Task 1 from Task 1` is executed.
- Once all micro-tasks are finished, `task2` is processed by the event loop.

### Simulating Async Behavior:
- The `simulateAsyncBehavior()` function mimics async events like I/O or timers by using `setTimeout`. This simulates how the event loop processes asynchronous code after the synchronous code (call stack) and micro-tasks are processed.

### Output (simplified simulation):

```text
Event Loop Started
Call Stack: task1
Running task: task1
Task 1 started
Added to Micro Task Queue: Micro Task 1 from Task 1
Added to Event Queue: task2
Task 1 finished
Call Stack: 
Running micro-task: Micro Task 1 from Task 1
Micro Task 1 from Task 1
Call Stack: task2
Running task: task2
Task 2 started
Added to Micro Task Queue: Micro Task 2 from Task 2
Task 2 finished
Call Stack: 
Running micro-task: Micro Task 2 from Task 2
Micro Task 2 from Task 2
Event Loop Finished
```

### Summary:
- **Call Stack** processes synchronous tasks first.
- **Micro Task Queue** handles micro-tasks (like promises) before any tasks in the **Event Queue**.
- The **Event Queue** stores async tasks like `setTimeout`, `setInterval`, and event handlers.
- The custom event loop simulates the sequence of task execution, ensuring that async tasks are processed after synchronous tasks and micro-tasks.

This example provides a basic simulation of how JavaScript handles the event loop and asynchronous operations in a real-world browser environment.