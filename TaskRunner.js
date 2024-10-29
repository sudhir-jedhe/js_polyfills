// How to implement an Asynchronous Task Runner with Concurrency Control? Rippling Frontend Interview Question

/**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO CHANGE THE CLASS NAME
class TaskRunner {
    constructor(concurrency) {
      // write your code below
      this.concurrency = concurrency;
      this.taskList = [];
      this.currentRunning = 0;
      this.currentIndex = 0; 
    }
  
    async processTask() {
      if(this.currentRunning >= this.concurrency || this.taskList.length === 0) {
        return;
      }
  
      const task = this.taskList.shift();
      this.currentRunning++;
  
      try {
        await task();
      } finally {
        this.currentRunning--;  
        this.processTask();
      }
    }
  
    push(task) {
      // write your code below
      this.taskList.push(task);
      this.processTask();
    }
  }

  
  /************************ */

  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO CHANGE THE CLASS NAME
class TaskRunner {
    constructor(concurrency) {
      // write your code below
      this.waitingList = []
      this.executedCount = 0
      this.concurrencyLimit = concurrency
    }
  
    async push(task) {
      // write your code below
      if(this.executedCount < this.concurrencyLimit) {
        await this.execute(task)
      } else {
        this.waitingList.push(task)
      }
    }
    
    async execute(task) {
      this.executedCount += 1
      try {
        await task()
      } finally {
        this.executedCount -= 1
        if(this.waitingList.length && this.executedCount < this.concurrencyLimit){
          await this.push(this.waitingList.shift())
        }
      }
    }
  }
  
  
  const ex = new TaskRunner(3);
  
  // Simulated async tasks
  const t1 = async () => { console.log('t1 started'); await delay(2000); console.log('t1 finished'); };
  const t2 = async () => { console.log('t2 started'); await delay(10000); console.log('t2 finished'); };
  const t3 = async () => { console.log('t3 started'); await delay(1500); console.log('t3 finished'); };
  const t4 = async () => { console.log('t4 started'); await delay(1000); console.log('t4 finished'); };
  const t5 = async () => { console.log('t5 started'); await delay(500); console.log('t5 finished'); };
  
  // Add tasks to the executor
  ex.push(t1);  // Starts immediately
  ex.push(t2);  // Starts immediately
  ex.push(t3);  // Starts immediately
  ex.push(t4);  // Waits until at least one task finishes
  ex.push(t5);  // Waits until another task finishes


  /******************** */


  /**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
// DO CHANGE THE CLASS NAME
class TaskRunner {
    constructor(concurrency) {
      // write your code below
      this.concurrency = concurrency;
      this.running = 0;
      this.queue = [];
    }
  
    push(task) {
      // write your code below
      if(this.running < this.concurrency){
             await this.execute(task);
      }
    }
  
     async execute(task){
        this.runningTasks += 1;
        await task();
     }
  }

  
  /****************************** */