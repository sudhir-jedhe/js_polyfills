// Convert a Map to an object
// Using Map.prototype.entries(), we can convert a Map to an array of key-value pairs. Then, we can use Object.fromEntries() to convert the array to an object.

const mapToObject = map => Object.fromEntries(map.entries());

mapToObject(new Map([['a', 1], ['b', 2]])); // {a: 1, b: 2}

// Convert an object to a Map
// Similarly, using Object.entries(), we can convert an object to an array of key-value pairs. Then, we can use the Map() constructor to convert the array to a Map.

const objectToMap = obj => new Map(Object.entries(obj));

objectToMap({a: 1, b: 2}); // Map {'a' => 1, 'b' => 2}