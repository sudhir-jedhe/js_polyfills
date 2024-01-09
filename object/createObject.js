
/********************Literal*********** */
const person = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'jdoe@example.com',
    info: function() {
        return `${this.firstName} ${this.lastName}, ${this.email}`
    }
};

console.log(person.info());


/****************Object Constructor************************ */
let person = new Object();

person.firstName = "John";
person.lastName = "Doe";
person.email = 'jdoe@example.com';

person.info = function(){
    return `${this.firstName} ${this.lastName}, ${this.email}`;
};

console.log(person.info());
/*********************Function constructor******************************* */

function Person(firstName, lastName, email) {

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;

    this.info = function() {
        return `${this.firstName} ${this.lastName}, ${this.email}`;
    }
}

let person = new Person('John', 'Doe', 'jdoe@example.com');
console.log(person.info());

/***************************Class******************************* */
class Person {

    constructor(firstName, lastName, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    info() {
        return `${this.firstName} ${this.lastName}, ${this.email}`;
    }
}

let person = new Person('John', 'Doe', 'jdoe@example.com');
console.log(person.info());

/*********************Builder Pattern******************* */
let Person = function (firstName, lastName, email) {

    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
}

let PersonBuilder = function () {

    let firstName;
    let lastName;
    let email;

    return {
        setFirstName: function (firstName) {
            this.firstName = firstName;
            return this;
        },
        setLastName: function (lastName) {
            this.lastName = lastName;
            return this;
        },
        setEmail: function (email) {
            this.email = email;
            return this;
        },
        info: function () {
            return `${this.firstName} ${this.lastName}, ${this.email}`;
        },
        build: function () {
            return new Person(firstName, lastName, email);
        }
    };
};

var person = new PersonBuilder().setFirstName('John').setLastName('Doe')
    .setEmail('jdoe@example.com');
console.log(person.info());

/**************************Factory Pattern****************************** */
const personFactory = (firstName, lastName, email) => {
    return {
        firstName: firstName,
        lastName: lastName,
        email: email,
        info() {
            return `${this.firstName} ${this.lastName}, ${this.email}`;
        }
    };
};

let person = personFactory('John', 'Doe', 'jdoe@example.com');

console.log(person.info());