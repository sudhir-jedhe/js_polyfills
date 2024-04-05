// In Javascript, functions are first class objects.
// First-class functions means when functions in that language are treated
// like any other variable.

// For example, in such a language, a function can be passed as an argument
// to other functions, can be returned by another function and can be assigned
// as a value to a variable.
// For example, in the below example, handler functions assigned to a listener

const handler = () => console.log("This is a click handler function");
document.addEventListener("click", handler);
