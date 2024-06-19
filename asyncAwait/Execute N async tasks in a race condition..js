// Example async function (simulated with setTimeout)
function asyncTask(taskName, duration) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`${taskName} finished after ${duration}ms`);
        // Simulate an error condition
        // Uncomment the next line to simulate an error for a task
        // if (taskName === 'Task 2') return reject(new Error(`${taskName} failed`));
        resolve(`${taskName} result`); // Resolve with a result
      }, duration);
    });
  }
  
  async function executeRaceTasks(tasks) {
    try {
      const winner = await Promise.race(tasks.map(task => asyncTask(task.name, task.duration)));
      console.log("Race completed. Winner:", winner);
      return winner; // Optionally return the winner
    } catch (error) {
      console.error("Error in race:", error.message);
      throw error; // Rethrow the error if needed
    }
  }
  
  // Example tasks array
  const tasks = [
    { name: 'Task 1', duration: 2000 },
    { name: 'Task 2', duration: 1000 },
    { name: 'Task 3', duration: 1500 }
  ];
  
  // Execute tasks in a race condition
  executeRaceTasks(tasks)
    .then(winner => {
      // Handle winner if needed
      console.log("Final winner:", winner);
    })
    .catch(error => {
      // Handle errors if needed
      console.error("Final error:", error.message);
    });
  