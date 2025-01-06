It looks like you've almost got it right, but there’s a slight issue with the placement of the `home` method in the `Animal` constructor function. You should add the `home` method to the `Animal.prototype` **outside** of the constructor function, otherwise it will be redefined every time an instance of `Animal` (or `Bird`) is created, which is inefficient.

Let's fix this and explain the full process.

### Corrected Code:

```js
// Animal constructor function
function Animal() {
  // Animal properties can be added here (if needed)
}

// Adding home method to Animal's prototype
Animal.prototype.home = function() {
  console.log('forest');
};

// Bird constructor function
function Bird() {
  // Bird specific properties can be added here
}

// Make Bird inherit from Animal by setting its prototype
Bird.prototype = Object.create(Animal.prototype);

// Create an instance of Bird
const bird = new Bird();

// Call the home method from the Animal prototype (inherited by Bird)
bird.home();  // This will log 'forest'
```

### Explanation:

1. **Animal Constructor**:
   - The `Animal` constructor is used to define the "type" of an object, but it doesn't hold the methods like `home`. Instead, those methods are added to the prototype of `Animal`.

2. **Adding `home` method**:
   - The method `home` is added to the `Animal.prototype` outside the constructor function. This means all instances of `Animal` (and any instances of objects inheriting from `Animal`, like `Bird`) will have access to this method.

3. **Bird Constructor**:
   - The `Bird` constructor is defined as an empty function, but we want it to inherit from `Animal`, so we set `Bird.prototype = Object.create(Animal.prototype);`. This line of code ensures that `Bird` inherits from `Animal`, meaning `Bird` objects will have access to the `home` method from `Animal`.

4. **Creating an instance of `Bird`**:
   - We create an instance of `Bird` by calling `new Bird()`. The `bird` object now inherits the `home` method from the `Animal` prototype.

5. **Calling the `home` method**:
   - Since `Bird` inherits from `Animal`, calling `bird.home()` will invoke the `home` method from the `Animal.prototype`, which logs `"forest"`.

### Output:
```
forest
```

### Key Points:
- The `home` method is defined on the **prototype** of `Animal`, which means all instances of `Animal` (and any objects inheriting from `Animal`, like `Bird`) can access it.
- **Prototype inheritance** is achieved by setting `Bird.prototype = Object.create(Animal.prototype);`. This creates a new object (`Object.create(Animal.prototype)`) and sets it as the prototype of `Bird`, enabling `Bird` instances to access `Animal`'s methods.
  
### Alternative with ES6 Classes:
You can also use ES6 class syntax to make this inheritance clearer:

```js
// Animal class
class Animal {
  home() {
    console.log('forest');
  }
}

// Bird class that extends Animal
class Bird extends Animal {}

// Create an instance of Bird
const bird = new Bird();

// Call the home method from the Animal class (inherited by Bird)
bird.home();  // Logs 'forest'
```

This achieves the same functionality in a more modern, readable format, utilizing `class` and `extends` for inheritance.