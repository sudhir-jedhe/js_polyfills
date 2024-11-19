// Create a function in JavaScript that accepts a function as input and a count and executes that input function once for a given count of calls. Known as sampling function.

function sampler(fn, count, context){
    let counter = 0;

    return function(...args){
        // set the counters
        let lastArgs = args;
        context = this ?? context;
        
        // invoke only when number of calls is equal to the counts
        if(++counter !== count) return;
        
        fn.apply(context, args);
        counter = 0;
    };
}


function message(){
    console.log("hello");
  }
  
  const sample = sampler(message, 4);
  sample();
  sample();
  sample();
  sample(); // hello
  sample();
  sample();
  sample();
  sample(); // hello