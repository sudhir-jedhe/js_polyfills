// helper function to create a promise
// that resolves after a certain time
const asyncTask = function(i) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(`Completing ${i}`), 100*i)
    });
  }
  
  // create an array of task
  const promises = [
    asyncTask(3),
    asyncTask(1),
    asyncTask(7),
    asyncTask(2),
    asyncTask(5),
  ];
  
  // manin function to run promise in series
  const asyncSeriesExecuter = function(promises) {
    promises.reduce((acc, curr) => {
      // return when previous promise is resolved
      return acc.then(() => {
        // run the current promise
        return curr.then(val => {console.log(val)});
      });
    }, Promise.resolve());
  };
  
  asyncSeriesExecuter(promises);
  
  "Completing 3"
  "Completing 1"
  "Completing 7"
  "Completing 2"
  "Completing 5"