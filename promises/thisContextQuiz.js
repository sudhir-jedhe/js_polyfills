// Create an object to demonstrate different 'this' contexts
const obj = {
  dev: "bfe",
  // Regular function using function keyword
  a: function() {
    return this.dev;
  },
  // Method shorthand - same as regular function
  b() {
    return this.dev;
  },
  // Arrow function - lexical this binding
  c: () => {
    return this.dev;
  },
  // IIFE inside regular function - inherits this from parent
  d: function() {
    return (() => {
      return this.dev;
    })();
  },
  // Method calling another method using this
  e: function() {
    return this.b();
  },
  // Method returning reference to another method
  f: function() {
    return this.b;
  },
  // Method calling arrow function
  g: function() {
    return this.c();
  },
  // Method returning reference to arrow function
  h: function() {
    return this.c;
  },
  // Method returning arrow function with preserved this
  i: function() {
    return () => {
      return this.dev;
    };
  }
};

// Test and explain each case
console.log('Case a:', obj.a());    // "bfe" - regular function, this = obj
console.log('Case b:', obj.b());    // "bfe" - method shorthand, this = obj
console.log('Case c:', obj.c());    // undefined - arrow function, this = global/window
console.log('Case d:', obj.d());    // "bfe" - IIFE arrow function inherits this from parent
console.log('Case e:', obj.e());    // "bfe" - calls method b() with correct this context
console.log('Case f:', obj.f()()); // undefined - loses this context when calling returned function
console.log('Case g:', obj.g());    // undefined - arrow function c has this = global/window
console.log('Case h:', obj.h()()); // undefined - arrow function c has this = global/window
console.log('Case i:', obj.i()()); // "bfe" - returned arrow function preserves this from creation

// Detailed explanation of each case:
console.log('\nDetailed Explanations:');
console.log(`
1. obj.a(): Regular function uses 'this' of caller (obj)
2. obj.b(): Method shorthand, same as regular function
3. obj.c(): Arrow function captures 'this' from definition context (global/window)
4. obj.d(): Arrow IIFE inherits 'this' from containing regular function
5. obj.e(): Calls method b() with correct 'this' context
6. obj.f()(): Returns b function but loses 'this' when called globally
7. obj.g(): Calls arrow function c which has global 'this'
8. obj.h()(): Returns and calls arrow function c with global 'this'
9. obj.i()(): Returns arrow function that preserves original 'this'
`);