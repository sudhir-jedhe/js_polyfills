// LazyMan is very lazy, he only eats and sleeps.

// LazyMan(name: string, logFn: (log: string) => void) would output a message, the passed logFn is used.

// LazyMan('Jack', console.log)
// // Hi, I'm Jack.
// He can eat(food: string)

// LazyMan('Jack', console.log)
//   .eat('banana')
//   .eat('apple')
// // Hi, I'm Jack.
// // Eat banana.
// // Eat Apple.


// interface Laziness {
//   sleep: (time: number) => Laziness
//   sleepFirst: (time: number) => Laziness
//   eat: (food: string) => Laziness
// }
class ALazyMan {
    constructor(name, logFn) {
      this.name = name
      this.log = logFn
      
      this.normalTasks = []
      this.urgentTasks = []
      
      this.greet()
      
      setTimeout(() => {
        this._triggerNext()
      }, 0)
    }
    
    greet() {
      this.normalTasks.push(['greet'])
      return this
    }
    
    eat(food) {
      this.normalTasks.push(['eat', food])
      return this
    }
    
    sleep(time) {
      this.normalTasks.push(['sleep', time])
      return this
    }
    
    sleepFirst(time) {
      this.urgentTasks.push(['sleep', time])
      return this
    }
    
    _triggerNext() {
      let task = this.urgentTasks.shift()
      if (!task) {
        task = this.normalTasks.shift()
      }
      
      if (!task) {
        return
      }
      
      const [action, param] = task
      
      switch (action) {
        case 'greet':
          this.log(`Hi, I'm ${this.name}.`)
          this._triggerNext()
          return
        case 'eat':
          this.log(`Eat ${param}.`)
          this._triggerNext()
          return
        case 'sleep':
          setTimeout(() => {
            this.log(`Wake up after ${param} second${param > 1 ? 's' : ''}.`)
            this._triggerNext()
            return
          }, param * 1000)
      }
    }
  }
  /**
   * @param {string} name
   * @param {(log: string) => void} logFn
   * @returns {Laziness}
   */
  function LazyMan(name, logFn) {
    // use 2 array to to hold tasks , one for sleepFirs, one for the other
    // return `this` for each method call
    return new ALazyMan(name, logFn)
  }

  /**************************** */


  
/**
 * @param {string} name
 * @param {(log: string) => void} logFn
 * @returns {Laziness}
 */
function LazyMan(name, logFn) {
    const ids = new Map();
    let delay = 0;
    let called = false;
    const man = {
      intro: (param) => {
        ids.set(`intro-${param}`, setTimeout(() => {
          debugger
          logFn(`Hi, I'm ${param}.`);
        }, delay));
        return man;
      },
      eat: (param) => {
        ids.set(`eat-${param}`, setTimeout(() => logFn(`Eat ${param}.`), delay));
        return man;
      },
      sleep: (param) => {
        delay += param * 1000;
        setTimeout(() => logFn(`Wake up after ${param} second${param > 1 ? 's': ''}.`), delay);
        return man;
      },
      sleepFirst: (param) => {
        man.sleep(param);
        for (const [name, timeout] of ids) {
          clearTimeout(timeout); 
          const [n, p] = name.split('-');
          man[n](p);
        }
        return man;
      }
    }
    man.intro(name);
    return man;  
  }
  