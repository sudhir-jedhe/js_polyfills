// What is JSON and its common operations

//    **JSON** is a text-based data format following JavaScript object syntax, which was popularized by `Douglas Crockford`. It is useful when you want to transmit data across a network. It is basically just a text file with an extension of .json, and a MIME type of application/json

// Why do you need JSON

// When exchanging data between a browser and a server, the data can only be text. Since JSON is text only, it can easily be sent to and from a server, and used as a data format by any programming language.

//    **Parsing:** Converting a string to a native object

JSON.parse(text);

//    **Stringification:** Converting a native object to a string so that it can be transmitted across the network

JSON.stringify(object);

// What is the purpose JSON stringify

// When sending data to a web server, the data has to be in a string format. You can achieve this by converting JSON object into a string using stringify() method.

var userJSON = { name: "John", age: 31 };
var userString = JSON.stringify(userJSON);
console.log(userString); //"{"name":"John","age":31}"

// How do you parse JSON string

// When receiving the data from a web server, the data is always in a string format. But you can convert this string value to a javascript object using parse() method.

var userString = '{"name":"John","age":31}';
var userJSON = JSON.parse(userString);
console.log(userJSON); // {name: "John", age: 31}
