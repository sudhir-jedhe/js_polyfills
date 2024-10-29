// Suppose we have a Callback type

// type Callback = 
//   (error: Error, result: any | Thunk) => void
// A Thunk is a function that take a Callback as parameter

// type Thunk = (callback: Callback) => void
// Like following three thunks

// const func1 = (cb) => {
//   setTimeout(() => cb(null, 'ok'), 10)
// }
// const func2 = (cb) => {
//   setTimeout(() => cb(null, func1), 10)
// }
// const func3 = (cb) => {
//   setTimeout(() => cb(null, func2), 10)
// }
// in above example, three functions are kind of chained up, func3 → func2 → func1, but it don't work without some glue.

// OK, now you are asked to implement a flattenThunk() which glue them up and returns a new thunk.

// flattenThunk(func3)((error, data) => {
//    console.log(data) // 'ok'
// })
// note

// Once error occurs, the rest uncalled functions should be skipped



**
 * @param {Thunk} thunk
 * @return {Thunk}
 */
//简单来说就是劫持callback,自己实现一个支持链式调用的callback;
function flattenThunk(thunk){ // thunk: 即案例的func3
    return function(callback){// callback: 给定的回调
        const _callback = (error,data) => {
           if(error){
               //立即处理错误
               callback(error);
           }else if(typeof data == 'function'){
               //如果data是一个"Thunk"即函数
               data(_callback);
           }else{
               callback(error,data);
           }
        }
        thunk(_callback);
    }
}




/************************ */



/**
 * @param {Thunk} thunk
 * @return {Thunk}
 */
function flattenThunk(thunk) {
    return function(callback) {
      const callbackWrapper = (err, data) => {
        if(err) {
          callback(err);
        } else if (typeof data === 'function') {
          data(callbackWrapper);
        } else {
         callback(err, data);
        }
      }
      thunk(callbackWrapper);
    }
  }