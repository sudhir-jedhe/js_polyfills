// Event flow is the order in which event is received on the web page. When you click an element that is nested in various other elements, before your click actually reaches its destination, or target element, it must trigger the click event for each of its parent elements first, starting at the top with the global window object.
//     There are two ways of event flow

//     1. Top to Bottom(Event Capturing)
//     2. Bottom to Top (Event Bubbling)

// Event bubbling is a type of event propagation where the event first triggers on the innermost target element, and then successively triggers on the ancestors (parents) of the target element in the same nesting hierarchy till it reaches the outermost DOM element.
// Bubbling means that the event propagates from the target element (i.e. the button the user clicked) up through its ancestor tree, starting from the nearest one. By default, all events bubble.

// Event capturing is a type of event propagation where the event is first captured by the outermost element, and then successively triggers on the descendants (children) of the target element in the same nesting hierarchy till it reaches the innermost DOM element.


<html>
  <body>
    <div id="btn-container">
      <button class="btn">Click me</button>
    </div>
  </body>
</html>
const ancestors = [
  window, document, document.documentElement,
  document.body, document.getElementById('btn-container')
];

// If we add an event listener to each element in the tree, as shown above, we would see a listener fired by the button first, then each one of the others firing from the nearest ancestor all the way up to Window.

// Target phase
document.querySelector('.btn').addEventListener('click', e => {
  console.log(`Hello from ${e.target}`);
});
// Bubble phase
ancestors.forEach(a => {
  a.addEventListener('click', e => {
    console.log(`Hello from ${e.currentTarget}`);
  });
});

// Capturing is the exact opposite of bubbling, meaning that the outer event handlers are fired before the most specific handler (i.e. the one on the button). Note that all capturing event handlers are run first, then all the bubbling event handlers. 
ancestors.forEach(a => {
    a.addEventListener('click', e => {
      console.log(`Hello from ${e.currentTarget}`);
    }, true);
  });


  window.addEventListener('click', e => {
    if (e.target.className === 'btn') console.log('Hello there!');
  });


//   Event propagation
// Having explained event bubbling and capturing, we can now explain the three phases of event propagation:

// During the capture phase, the event starts from Window and moves down to Document, the root element and through ancestors of the target element.
// During the target phase, the event gets triggered on the event target (e.g. the button the user clicked).
// During the bubble phase, the event bubbles up through ancestors of the target element until the root element, Document and, finally, Window.


const addEventListenerAll = (targets, type, listener, options, useCapture) => {
    targets.forEach(target =>
      target.addEventListener(type, listener, options, useCapture)
    );
  };
  
  addEventListenerAll(document.querySelectorAll('a'), 'click', () =>
    console.log('Clicked a link')
  );
  // Logs 'Clicked a link' whenever any anchor element is clicked


  const removeEventListenerAll = (
    targets,
    type,
    listener,
    options,
    useCapture
  ) => {
    targets.forEach(target =>
      target.removeEventListener(type, listener, options, useCapture)
    );
  };
  
  const linkListener = () => console.log('Clicked a link');
  document.querySelector('a').addEventListener('click', linkListener);
  removeEventListenerAll(document.querySelectorAll('a'), 'click', linkListener);


  const addMultipleListeners = (el, types, listener, options, useCapture) => {
    types.forEach(type =>
      el.addEventListener(type, listener, options, useCapture)
    );
  };
  
  addMultipleListeners(
    document.querySelector('.my-element'),
    ['click', 'mousedown'],
    () => { console.log('hello!') }
  );