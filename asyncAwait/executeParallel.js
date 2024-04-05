// Implement a function in JavaScript that takes a list of async functions as input 
// and a callback function and executes the async tasks in parallel that is all at once 
// and invokes the callback after every task is executed.

// Input:
// executeParallel([asyncTask(3), asyncTask(1), asyncTask(2)], (result) => {
// console.log(result);
// });

// Output:
// // output in the order of execution
// [2, 1, 3]


function asyncParallel(tasks, callback) {
    // store the result
    const results = [];
    
    // track the task executed
    let tasksCompleted = 0;
    
    // run each task
    tasks.forEach(asyncTask => {
      
      // invoke the async task
      // it can be a promise as well
      // for a promise you can chain it with then
      asyncTask(value => {
        // store the output of the task
        results.push(value);
        
        // increment the tracker
        tasksCompleted++;
      
        // if all tasks are executed 
        // invoke the callback
        if (tasksCompleted >= tasks.length) {
          callback(results);
        }
      });
    });
  };

  function createAsyncTask() {
    const value = Math.floor(Math.random() * 10);
    return function(callback) {
      setTimeout(() => {
        callback(value);
      }, value * 1000);
    };
  }

  Input:
const taskList = [
  createAsyncTask(),
  createAsyncTask(),
  createAsyncTask(),
  createAsyncTask(),
  createAsyncTask(),
  createAsyncTask()
];

asyncParallel(taskList, result => {
  console.log('results', result);
});

Output:
"results" // [object Array] (6)
[1,6,7,7,9,9]




/************************************* */
function createAsyncTask() {
    const value = Math.floor(Math.random() * 10);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value < 5) {
          reject(`Error ${value}`);
        } else {
          resolve(value * 1000);
        }
      }, value * 1000);
    });
  }

  function asyncParallel(tasks, callback) {
    // store the result
    const results = [];
  
    const errors = [];
  
    // track the task executed
    let tasksCompleted = 0;
  
    // run each task
    tasks.forEach((asyncTask) => {
      // invoke the async task
      // it can be a promise as well
      // for a promise you can chain it with then
      asyncTask
        .then((value) => {
          // store the output of the task
          results.push(value);
        })
        .catch((error) => {
          errors.push(error);
        })
        .finally(() => {
          // increment the tracker
          tasksCompleted++;
  
          // if all tasks are executed
          // invoke the callback
          if (tasksCompleted >= tasks.length) {
            callback(errors, results);
          }
        });
    });
  };

  asyncParallel(taskList, (error, result) => {
    console.log("errors", error);
    console.log("results", result);
  });
  
  
  //errors (4) ["Error 0", "Error 1", "Error 1", "Error 2"]
  //results (2) [5000, 9000]




  /********************************* */
  const asyncTasks = [
    () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Task 1');
        }, 1000);
      });
    },
    () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Task 2');
        }, 2000);
      });
    },
    () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Task 3');
        }, 3000);
      });
    },
  ];
  
  const runTasksInParallel = async (tasks) => {
    const results = await Promise.all(tasks);
    return results;
  };
  
  const results = await runTasksInParallel(asyncTasks);
  
  console.log(results); // ['Task 1', 'Task 2', 'Task 3']


  https://medium.com/@omar.hsouna/how-to-run-async-await-in-parallel-with-javascript-19b91adfc45d

  https://maximorlov.com/parallel-tasks-with-pure-javascript/