/**
 * @param {number} num
 */
function sum(num) {
    const func = function(num2) { // #4
      return num2 ? sum(num+num2) : num; // #3
    }
    
    func.valueOf = () => num; // #2
    return func; // #1
  }
  /*** ==== Explanat
   * 
   * /*************** */

   function sum(num) {
    const func = function(num2) { // #4
      return num2 !== undefined ? sum(num+num2) : num; // #3
    }
    
    func.valueOf = () => num; // #2
    return func; // #1
  }

  
  /***************************** */

  /**
 * @param {number} num
 */
function sum(a) {
    const fn = (b) => sum(a + b);
    fn[Symbol.toPrimitive] = () => a;
    return fn;
  }

  
  /************************* */

  /**
 * @param {number} num
 */
function sum(num) {
    const func = (...args) => {
      return args.length > 0 ? sum(num + args.reduce((acc, val) =>
        acc += val
        , 0)) : num;
    }
    // overriding valueOf allows us to assign a value to func when it is type coerced
    // i.e if we are comparing func to a value, we create a function that returns what type
    // of value it returns to. Here we want to return the value of num
    func.valueOf = () => num;
    return func
  }
  console.log("RETURN", sum(2)(2)(5, 6).valueOf()) // 15