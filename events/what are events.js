// Events are "things" that happen to HTML elements. When JavaScript is used in HTML pages, JavaScript can `react` on these events. Some of the examples of HTML events are,

//      1. Web page has finished loading
//      2. Input field was changed
//      3. Button was clicked

function greeting() {
  alert("Hello! Good morning");
}
//    <button type="button" onclick="greeting()">Click me</button>

// The preventDefault() method cancels the event if it is cancelable, meaning that the default action or behaviour that belongs to the event will not occur. For example, prevent form submission when clicking on submit button and prevent opening the page URL when clicking on hyperlink are some common use cases.

document.getElementById("link").addEventListener("click", function (event) {
  event.preventDefault();
});

// **Note:** Remember that not all events are cancelable.

// The stopPropagation method is used to stop the event from bubbling up the event chain. For example, the below nested divs with stopPropagation method prevents default event propagation when clicking on nested div(Div1)

{
  /* <p>Click DIV1 Element</p>
<div onclick="secondFunc()">DIV 2
  <div onclick="firstFunc(event)">DIV 1</div>
</div> */
}

function firstFunc(event) {
  alert("DIV 1");
  event.stopPropagation();
}

function secondFunc() {
  alert("DIV 2");
}

// What are the steps involved in return false usage

// The return false statement in event handlers performs the below steps,

// 1. First it stops the browser's default action or behaviour.
// 2. It prevents the event from propagating the DOM
// 3. Stops callback execution and returns immediately when called.

// What is an event delegation

// Event delegation is a technique for listening to events where you delegate a parent element as the listener for all of the events that happen inside it.

// For example, if you wanted to detect field changes in inside a specific form, you can use event delegation technique,

var form = document.querySelector("#registration-form");

// Listen for changes to fields inside the form
form.addEventListener(
  "input",
  function (event) {
    // Log the field that was changed
    console.log(event.target);
  },
  false
);
