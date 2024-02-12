// function Animal(breed) {
//   this.breed = breed;
// }

// Animal.prototype.sound = function () {
//   console.log("Meo Mewo");
// };

// function Cat(legs, breed) {
//   Animal.call(this, breed);
//   this.legs = legs;
// }

// Cat.prototype = Object.create(Animal.prototype);
// Cat.prototype.constructor = Cat;
// let cat = new Cat(4, "abc");

// console.log(cat);

/********************************************* */

function extend(child, parent) {
  child.prototype = Object.create(parent.prototype);
  child.prototype.constructor = child;
}
function Animal(breed) {
  this.breed = breed;
}

Animal.prototype.sound = function () {
  console.log("Sound");
};

let petAnimal = {
  pet() {
    console.log("pet Animal");
  },
};

function Cat(legs, breed) {
  Animal.call(this, breed);
  this.legs = legs;
}

extend(Cat, Animal);

// polymorphism
Cat.prototype.sound = function () {
  console.log("Meow Meow");
};
// mixins
Object.assign(Cat.prototype, petAnimal);

let cat = new Cat(4, "abc");
console.log(cat);
console.log(cat.pet());

function Dog(legs, breed) {
  Animal.call(this, breed);
  this.legs = legs;
}

extend(Dog, Animal);

Dog.prototype.sound = function () {
  console.log("Bhow Bhow");
};

// mixins
Object.assign(Dog.prototype, petAnimal);

let dog = new Dog(4, "lab");
console.log(dog);

function Lion() {}

extend(Lion, Animal);
let lion = new Lion();
console.log(lion);
