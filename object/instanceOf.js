// This is a JavaScript Quiz from BFE.dev

console.log(Function instanceof Object);
console.log(Object instanceof Function);
console.log(Function instanceof Function);
console.log(Object instanceof Object);

// This is a JavaScript Quiz from BFE.dev

console.log(typeof null);
console.log(null instanceof Object);
console.log(typeof 1);
console.log(1 instanceof Number);
console.log(1 instanceof Object);
console.log(Number(1) instanceof Object);
console.log(new Number(1) instanceof Object);
console.log(typeof true);
console.log(true instanceof Boolean);
console.log(true instanceof Object);
console.log(Boolean(true) instanceof Object);
console.log(new Boolean(true) instanceof Object);
console.log([] instanceof Array);
console.log([] instanceof Object);
console.log((() => {}) instanceof Object);


/********************************** */
class A {}
class B extends A {}

let objB = new B()
instanceOfClass(objB , B) // true
instanceOfClass(objB, A) // true

class C {}
instanceOfClass(objB, C) // false


function instanceOfClass(obj, targetClass) {
    if (!obj || typeof obj !== 'object') return false
    if (!target.prototype) throw Error

    if (Object.getPrototypeOf(obj) === target.prototype) {
        return true
    } else {
        return instanceOfClass(Object.getPrototypeOf(obj), target)
    }
}