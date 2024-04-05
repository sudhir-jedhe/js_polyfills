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