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
  
/***************************************** */

    function simulateTask(taskId, duration) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              // Randomly resolve or reject to simulate success or failure
              if (Math.random() > 0.2) {
                  resolve(`Task ${taskId} completed`);
              } else {
                  reject(`Task ${taskId} failed`);
              }
          }, duration);
      });
  }
  
  async function executeTasksWithRaceCondition(tasks) {
      const results = [];
  
      for (const [taskId, duration] of tasks) {
          const taskPromise = simulateTask(taskId, duration);
  
          try {
              const result = await Promise.race([
                  taskPromise,
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Task timed out')), 3000)) // 3 seconds timeout
              ]);
              results.push({ taskId, result });
          } catch (error) {
              results.push({ taskId, error: error.message });
          }
      }
  
      return results;
  }
  
  // Example usage
  const tasks = [
      [1, 2000], // Task ID 1, duration 2 seconds
      [2, 1500], // Task ID 2, duration 1.5 seconds
      [3, 3000], // Task ID 3, duration 3 seconds
      [4, 1000]  // Task ID 4, duration 1 second
  ];
  
  executeTasksWithRaceCondition(tasks)
      .then(results => {
          console.log('All tasks completed:', results);
      })
      .catch(error => {
          console.error('Error in executing tasks:', error);
      });
  
/************************************************************ */

    async function fetchUrlsWithRaceCondition(urls) {
      // Ensure urls is an array of strings
      if (!Array.isArray(urls) || !urls.every(url => typeof url === 'string')) {
          throw new TypeError('URLs should be an array of strings.');
      }
  
      const results = [];
  
      for (const url of urls) {
          const promise = fetch(url)
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json(); // Parse JSON
              })
              .catch(error => {
                  return { error: error.message }; // Handle error and return a structured object
              });
  
          // Race against the promise with a timeout
          const racePromise = Promise.race([
              promise,
              new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 5000)) // 5 seconds timeout
          ]);
  
          try {
              const result = await racePromise; // Wait for the fastest response
              results.push(result); // Store the result
          } catch (error) {
              results.push({ error: error.message }); // Handle race error
          }
      }
  
      return results;
  }
  
  // Example usage
  const apiUrls = [
      'https://jsonplaceholder.typicode.com/posts/1',
      'https://jsonplaceholder.typicode.com/posts/2',
      'https://jsonplaceholder.typicode.com/posts/3',
      // You can add more URLs or even invalid ones to test
  ];
  
  fetchUrlsWithRaceCondition(apiUrls)
      .then(results => {
          console.log('API calls completed:', results);
      })
      .catch(error => {
          console.error('Error in fetching data:', error);
      });
  