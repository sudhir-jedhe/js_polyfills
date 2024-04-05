
The `__proto__` object is the actual object that is used in the lookup chain to resolve methods, etc. Whereas `prototype` is the object that is used to build `__proto__` when you create an object with new.


new Employee().__proto__ === Employee.prototype;
new Employee().prototype === undefined;





// Prototype:
// Access:  All the function constructors have prototype properties. 
// Purpose: Used to reduce memory wastage with a single copy of function
// ECMAScript: Introduced in ES6 
// Usage: Frequently used 



// proto:
// Access:  All the objects have \_\_proto\_\_ property   
// Purpose: Used in lookup chain to resolve methods, constructors etc.
// ECMAScript:  Introduced in ES5    
// Usage: Rarely used 
