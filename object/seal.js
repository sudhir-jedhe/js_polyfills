let array = ["a", "b", "c"];
Object.seal(array);
array.length = 1; // Error here
