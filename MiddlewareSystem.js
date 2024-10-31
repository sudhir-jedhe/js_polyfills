class Middleware {
    /**
     * @param {MiddlewareFunc} func
     */
    constructor() {
      this.callbacks = [];
      this.errHandlers = [];
    }
    use(func) {
      if(func.length === 2) {
        this.callbacks.push(func);
      }
      if(func.length === 3) {
        this.errHandlers.push(func);
      }
    }
    /**
     * @param {Request} req
     */
    start(req) {
      let idx = 0;
      let errIdx = 0;
      let self = this;
      function next(nextError) {
        let args = [req, next];
        let func;
        if (nextError) {
          func = self.errHandlers[errIdx++];
          args.unshift(nextError);
        } else {
          func = self.callbacks[idx++];
        }
        try {
          func && func(...args);
        } catch(error) {
          next(error);
        }
      }
      next();
    }
  }
  

//   Have you ever used Express Middleware before?

// Middleware functions are functions with fixed interface that could be chained up like following two functions.

// app.use('/user/:id', function (req, res, next) {
//   next()
// }, function (req, res, next) {
//   next(new Error('sth wrong'))
// })


// You are asked to create simplified Middleware system:

// type Request = object
// type NextFunc =  (error?: any) => void
// type MiddlewareFunc = 
//   (req: Request, next: NextFunc) => void
// type ErrorHandler = 
//   (error: Error, req: Request, next: NextFunc) => void
// class Middleware {
//   use(func: MiddlewareFunc | ErrorHandler) {
//     // do any async operations
//     // call next() to trigger next function
//   }
//   start(req: Request) {
//     // trigger all functions with a req object
//   }
// }
// Now we can do something similar with Express

// const middleware = new Middleware()
// middleware.use((req, next) => {
//    req.a = 1
//    next()
// })
// middleware.use((req, next) => {
//    req.b = 2
//    next()
// })
// middleware.use((req, next) => {
//    console.log(req)
// })
// middleware.start({})
// // {a: 1, b: 2}
// Notice that use() could also accept an ErrorHandler which has 3 arguments. The error handler is triggered if next() is called with an extra argument or uncaught error happens, like following.

// const middleware = new Middleware()
// // throw an error at first function
// middleware.use((req, next) => {
//    req.a = 1
//    throw new Error('sth wrong') 
//    // or `next(new Error('sth wrong'))`
// })
// // since error occurs, this is skipped
// middleware.use((req, next) => {
//    req.b = 2
// })
// // since error occurs, this is skipped
// middleware.use((req, next) => {
//    console.log(req)
// })
// // since error occurs, this is called
// middleware.use((error, req, next) => {
//    console.log(error)
//    console.log(req)
// })
// middleware.start({})
// // Error: sth wrong
// // {a: 1}
