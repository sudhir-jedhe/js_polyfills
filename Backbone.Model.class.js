// JavaScript class that resembles Backbone.Model and allows storing of
// attributes/values and responding to changes in specific attribute values:

class Model {
  constructor(attributes) {
    this.attributes = attributes;
    this._changes = {};
  }

  get(attribute) {
    return this.attributes[attribute];
  }

  set(attribute, value) {
    this.attributes[attribute] = value;
    this._changes[attribute] = value;
    this.trigger("change", attribute);
  }

  on(event, callback) {
    this.addEventListener(event, callback);
  }

  off(event, callback) {
    this.removeEventListener(event, callback);
  }

  trigger(event, ...args) {
    this.dispatchEvent(new CustomEvent(event, { detail: args }));
  }
}

const model = new Model({
  name: "John Doe",
  age: 30,
});

model.on("change:name", (event) => {
  console.log("The name has changed to:", event.detail);
});

model.set("name", "Jane Doe");

// In this example, we create a new Model instance with the attributes name and
// age. We then listen for changes to the name attribute using the on() method.
// When the name attribute is changed, we log the new value to the console. We
// then set the name attribute to Jane Doe. This triggers the change event,
// which in turn calls the callback function that we registered in the on()
// method. The callback function logs the new value of the name attribute to the
// console. This class can be used to store any type of data, and it can be used
// to respond to changes in any attribute value. It is a simple and flexible way
// to model data in JavaScript.
