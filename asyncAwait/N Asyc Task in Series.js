async function runTasksInSeries(tasks) {
  for (const task of tasks) {
    await task();
  }
}

const asyncTask1 = async () => {
  console.log("Task 1 started");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Task 1 finished");
};

const asyncTask2 = async () => {
  console.log("Task 2 started");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Task 2 finished");
};

const asyncTask3 = async () => {
  console.log("Task 3 started");
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("Task 3 finished");
};

const tasks = [asyncTask1, asyncTask2, asyncTask3];

runTasksInSeries(tasks);

/**************************** */
const asyncSeriesExecuter = async function (promises) {
  for (let promise of promises) {
    try {
      const result = await promise;
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }
};



Input:
const asyncTask = function(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`Completing ${i}`), 100*i)
  });
}

const promises = [
  asyncTask(3),
  asyncTask(1),
  asyncTask(7),
  asyncTask(2),
  asyncTask(5),
];

asyncSeriesExecuter(promises);

Output:
"Completing 3"
"Completing 1"
"Completing 7"
"Completing 2"
"Completing 5"



/***************************** */
const asyncSeriesExecuter = function(promises) {
    // get the top task
    let promise = promises.shift();
    
    //execute the task
    promise.then((data) => {
      //print the result
      console.log(data);
      
      //recursively call the same function
      if (promises.length > 0) {
        asyncSeriesExecuter(promises);
      }
    });
  }


  Input:
const asyncTask = function(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`Completing ${i}`), 100*i)
  });
}

const promises = [
  asyncTask(3),
  asyncTask(1),
  asyncTask(7),
  asyncTask(2),
  asyncTask(5),
];

asyncSeriesExecuter(promises);

Output:
"Completing 3"
"Completing 1"
"Completing 7"
"Completing 2"
"Completing 5"

/*************************************** */


const asyncSeriesExecuter = function(promises) {
    promises.reduce((acc, curr) => {
      return acc.then(() => {
        return curr.then(val => {console.log(val)});
      });
    }, Promise.resolve());
  }


  Input:
const asyncTask = function(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`Completing ${i}`), 100*i)
  });
}

const promises = [
  asyncTask(3),
  asyncTask(1),
  asyncTask(7),
  asyncTask(2),
  asyncTask(5),
];

asyncSeriesExecuter(promises);

Output:
"Completing 3"
"Completing 1"
"Completing 7"
"Completing 2"
"Completing 5"


/***************************** */
let taskList = [asyncTask(1), asyncTask(3),asyncTask(2)];

const asyncInSeries = () => {
  for (let promise of taskList){
    try{
       const result = await promise
       return result
    } catch {
       console.log(error)
     }
  }
}


let taskList = [asyncTask(1), asyncTask(3),asyncTask(2)];

const asyncInSeries = () => {
  let promise = taskList.shift()

    promise.then(result => {
       console.log(result)
       if (taskList.length > 0) {
         asyncInSeries()
       }
    })
}


/********************************* */
async function runTasksInSeries(tasks) {
  for (let task of tasks) {
      await task();
  }
}

// Example async tasks (promisified for simplicity)
function asyncTask(name, duration) {
  return new Promise(resolve => {
      setTimeout(() => {
          console.log(`Task ${name} finished after ${duration}ms`);
          resolve();
      }, duration);
  });
}

// Define an array of async tasks
const tasks = [
  async () => await asyncTask("Task 1", 2000),
  async () => await asyncTask("Task 2", 1000),
  async () => await asyncTask("Task 3", 1500)
];

// Run tasks in series
runTasksInSeries(tasks)
  .then(() => {
      console.log('All tasks completed.');
  })
  .catch(err => {
      console.error('Error running tasks:', err);
  });



  

  async function fetchUrlsInSerial(urls) {
    // Ensure urls is an array of strings
    if (!Array.isArray(urls) || !urls.every(url => typeof url === 'string')) {
        throw new TypeError('URLs should be an array of strings.');
    }

    const results = [];

    for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Parse JSON
        results.push(data); // Store the result
    }

    return results;
}

// Example usage
const apiUrls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://jsonplaceholder.typicode.com/posts/2',
    'https://jsonplaceholder.typicode.com/posts/3'
];

fetchUrlsInSerial(apiUrls)
    .then(results => {
        console.log('All API calls completed:', results);
    })
    .catch(error => {
        console.error('Error in fetching data:', error);
    });
