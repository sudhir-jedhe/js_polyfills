// An arrow function is a shorter/concise syntax for a function expression
// and does not have its own **this, arguments, super, or new.target**.
// These functions are best suited for non-method functions,
// and they cannot be used as constructors.

const arrowFunc1 = (a, b) => a + b; // Multiple parameters
const arrowFunc2 = (a) => a * 10; // Single parameter
const arrowFunc3 = () => {}; // no parameters

// Arrow functions do not have their own bindings for this, resulting in this retaining the value of the enclosing lexical context's this.

const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', function() {
    this.classList.toggle('active');
  });
});


// Arrow functions as callbacks
// As we have already explained, arrow functions do not have their own bindings for this. So what happens if we convert the previous code snippet's callback to an arrow function? Its this context refers to the global one, which in this case is the Window object.

const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', () => {
    this.classList.toggle('active'); // `this` refers to `Window`
    // Error: Cannot read property 'toggle' of undefined
  });
});



const toggleElements = document.querySelectorAll('.toggle');
toggleElements.forEach(el => {
  el.addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active'); // works correctly
  });
});