// Example functions to be lazily evaluated
function add(a, b) {
    console.log('Adding:', a, '+', b);
    return a + b;
}

function multiply(c, d) {
    console.log('Multiplying:', c, '*', d);
    return c * d;
}

function divide(e, f) {
    console.log('Dividing:', e, '/', f);
    return e / f;
}


class LazyChain {
    constructor(value) {
        this.value = value;
        this.functions = [];
    }

    add(func) {
        this.functions.push(func);
        return this;
    }

    evaluate() {
        let result = this.value;
        this.functions.forEach(func => {
            result = func(result);
        });
        return result;
    }
}

// Example usage
const lazyChain = new LazyChain(2);
lazyChain
    .add(value => add(value, 3))
    .add(value => multiply(value, 4))
    .add(value => divide(value, 2));

// At this point, no computations have been performed

// Evaluate the lazy chain to get the final result
const finalResult = lazyChain.evaluate();
console.log('Final Result:', finalResult);



// Create a function that takes a function as an argument and returns a new function
// that delays the evaluation of the argument function until the result is needed.
const lazy = (fn) => {
    // Create a thunk, which is a function that returns the result of the argument function.
    const thunk = () => fn();
  
    // Return a new function that returns the result of the thunk.
    return () => thunk();
  };
  
  // Create a chain of functions.
  const addOne = (x) => x + 1;
  const multiplyByTwo = (x) => x * 2;
  const square = (x) => x * x;
  
  // Lazy evaluate the chain of functions.
  const lazyChain = lazy(addOne)(lazy(multiplyByTwo)(lazy(square)));
  
  // Evaluate the lazy chain and print the result.
  console.log(lazyChain()); // 16