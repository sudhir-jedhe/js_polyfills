const timer = (init = 0, step = 1) => {
    let intervalId;
    let count = init;
  
    const startTimer = () => {
      if (!intervalId){
        intervalId = setInterval(() => {
          console.log(count);
          count += step;
        }, 1000);
      }
    }
  
    const stopTimer = () => {
      clearInterval(intervalId);
      intervalId = null;
    }
  
    return {
      startTimer,
      stopTimer,
    };
  }


  Input:
const timerObj = timer(10, 10);
//start
timerObj.startTimer();

//stop
setTimeout(() => {
    timerObj.stopTimer();
}, 6000);

Output:
10
20
30
40
50