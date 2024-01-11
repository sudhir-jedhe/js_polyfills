class IncrementCounter {
  // Private variable
  #value = 0;

  // Public variable
  Count = 0;

  Increment() {
    this.#value++;
  }
}

const counter = new IncrementCounter();

// Raises an error
console.log(counter.#value);

// Calling the increment function
counter.increment();

// Printing the private variable value
console.log(counter.#value);

/***************************************** */

class User {
  // Private static field of string type
  static #name = "";

  // Private static field
  static #age;

  // Constructor function
  Person(user_name, user_age) {
    User.#name = user_name;
    User.#age = user_age;
    return User.#name + " " + User.#age;
  }
}

// Create an object user1
user1 = new User();
console.log(user1.Person("John", 45));

// Create an object user2
user2 = new User();
console.log(user1.Person("Mark", 35));

/************************** */

class IncrementCounter {
  // Public instance field
  value = 1;

  Increment() {
    return this.value++;
  }
}

const counter = new IncrementCounter();

// Accessing a public instance field
console.log(counter.value);

// Calling the Increment function
counter.Increment();

// Printing the updated value
console.log(counter.value);

/***************************************** */

class Example {
  // Private static field
  static value = 42;
}

// Accessing a public static field using
// name of the Constructor class
console.log(Example.value);

console.log(Example.value === 42);
