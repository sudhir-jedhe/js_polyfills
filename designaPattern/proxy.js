// This is a JavaScript Quiz from BFE.dev

class Dev {
  #name;
  constructor(name) {
    this.#name = name;
  }
  get name() {
    return this.#name;
  }
}

const dev = new Dev("BFE");
console.log(dev.name);

const proxyDev = new Proxy(dev, {});
console.log(proxyDev.name);

/********************************************** */
// This is a JavaScript Quiz from BFE.dev

const obj = new Map();
const map = new Map();
obj.foo = 1;
map.set("foo", 2);
console.log(obj.foo);
console.log(map.get("foo"));

const proxyObj = new Proxy(obj, {});
const proxyMap = new Proxy(map, {});
console.log(proxyObj.foo);
console.log(proxyMap.get("foo"));

/******************************************************************************** */
// Create an interface for a function such that whenever a function is triggered the system should log the time. Do not modify the function code
// Function call can be handled using Proxy in JavaScript
// apply keyword in proxy can be used to achieve the functionality without modifying the existing function code
function generateSecretObject(key, value) {
  return { [key]: value };
}

generateSecretObject = new Proxy(generateSecretObject, {
  apply(target, context, args) {
    console.log(`${target.name} function is accessed at ${new Date()}`);
    return target.apply(context, args);
  },
});

// driver code
const user = {
  username: "0001",
  generateSecretObject,
};
generateSecretObject("username", "Password"); // "generateSecretObject function is accessed at {time}"

// Notes

// This technique is helpful in logging or managing the data being passed to & returned from function without modifying the actual function code especially when function is a part of library or framework
