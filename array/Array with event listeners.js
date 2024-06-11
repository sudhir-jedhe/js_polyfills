Input:
const arr = [];
arr.addListener('add', (eventName, items, Array) => {
  console.log('items were added', items);
});

arr.addListener('remove', (eventName, item, Array) => {
  console.log(item, ' was removed');
});

arr.pushWithEvent('add', [4, 5]);
arr.popWithEvent('remove');



Output:
"items were added" // [object Array] (2)
[4,5]

5 " was removed"


listeners : This will store the list of event listeners associated with the event name.
addListener(eventName, callback) : This will add a callback to the event.
pushWithEvent(eventName, items) : Adds all the items in the Array and triggers the event with the given name.
popWithEvent(eventName) : Removes the last items from the Array and triggers the event with the given name.
triggerEvent(eventName, args) : A helper function that triggers all the callbacks associated with the given event name.
removeListener(eventName, callback) : Removes the callback attached to the eventName. Note: It won’t work for anonymous functions.


// to track the events and their callbacks

Array.prototype.listeners = {};


// to add/assign a new event with listener
Array.prototype.addListener = function(name, callback){
  // if there are no listener present
  // create a new one
  // we will invoke all the callbacks when event is triggered
  if (!this.listeners[name]) {
    this.listeners[name] = [];
  }
  this.listeners[name].push(callback);
}

// add a new method that triggers an event on push
// Calls trigger event
Array.prototype.pushWithEvent = function(event, args) {
  // push the new values
  this.push(...args);
  
  // trigger add event
  this.triggerEvent(event, args);
};

// add a new method that triggers an event on pop
// Calls trigger event
Array.prototype.popWithEvent = function(event, args) {
  // push the new values
  const element = this.pop();
  
  // trigger add event
  this.triggerEvent(event, element);
};

Array.prototype.triggerEvent = function(eventName, elements) {
  // if the event is present
  // trigger all the callbacks with the value
  if (this.listeners[eventName]) {
    this.listeners[eventName].forEach(callback =>
      callback(eventName, elements, this)
    );
  }
};

Array.prototype.removeListener = function(eventName, callback){
  // if event exists
  if(this.listeners[eventName]){
    // filter out the listener
    // note: this won't work for anonymous function.
    this.listeners[eventName] = this.listeners[eventName].filter((e) => e !== callback);
  }
}


Input:
const arr = [];

const onAdd = (eventName, items, Array) => {
  console.log('items were added', items);
}

const onAddAgain = (eventName, items, Array) => {
  console.log('items were added again', items);
}

arr.addListener('add', onAdd);

arr.addListener('add', onAddAgain);

arr.addListener('remove', (eventName, item, Array) => {
  console.log(item, ' was removed');
});

arr.pushWithEvent('add', [1, 2, 3, 'a', 'b']);

arr.removeListener('add', onAddAgain); // removes the second listener

arr.pushWithEvent('add', [4, 5]);
arr.popWithEvent('remove');

console.log(arr);

Output:
"items were added" // [object Array] (5)
[1,2,3,"a","b"]

"items were added again" // [object Array] (5)
[1,2,3,"a","b"]

"items were added" // [object Array] (2)
[4,5]

5 " was removed"

// [object Array] (6)
[1,2,3,"a","b",4]