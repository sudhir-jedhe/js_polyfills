Singleton design pattern in JavaScript

Create an implementation of a singleton design pattern in JavaScript.

In a singleton design pattern, only one object is created for each interface (class or function) and the same object is returned every time when called.

It is really useful in scenarios where only one object is needed to coordinate actions across the system. For example, notification object, which sends notification across the system.

Example

const object1 = singleton.getInstance();
const object2 = singleton.getInstance();

console.log(object1 === object2); //true


const Singleton = (function () {
    let instance;
 
    function createInstance() {
        const object = new Object("I am the instance");
        return object;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const object1 = singleton.getInstance();
const object2 = singleton.getInstance();

console.log(object1 === object2); //true