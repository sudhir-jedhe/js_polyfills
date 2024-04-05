obj = new Proxy(obj, {
  get: (target, property) => {
    if (property === "i") {
      target[property] = target[property] + 1;
      return target[property];
    }
  },
});

console.log(obj.i); // 1
console.log(obj.i); // 2
console.log(obj.i); // 3





implement negative indexing in JavaScript arrays using Proxies

const array = [1, 2, 3, 4, 5];

const proxy = new Proxy(array, {
  get(target, index) {
    if (index < 0) {
      index = target.length + index;
    }

    return Reflect.get(target, index);
  }
});

console.log(proxy[-1]); // 5
console.log(proxy[-2]); // 4
console.log(proxy[-3]); // 3




/**************************** */

const handler = {
  get(target, key, receiver) {
    const index = Number(key);
    const prop = index < 0 ? `${target.length + index}` : key;
    return Reflect.get(target, prop, receiver);
  },
};

const createArray = (...elements) => {
  const arr = [...elements];
  return new Proxy(arr, handler);
};

let arr = createArray('a', 'b', 'c');

arr[-1]; // 'c'
arr[-1]; // 'b'



function makeArrayNegativeFriendly(array) {
  return new Proxy(array, {
    get(target, prop, receiver) {
      /* … */
    },
    set(target, prop, value, receiver) {
      if (typeof prop === 'string' && Number(prop) < 0) {
        prop = target.length + Number(prop)
      }
      return Reflect.set(target, prop, value, receiver)
    },
  })
}

const fibo = [1, 1, 2, 3, 5, 8, 13]
const niceFibo = makeArrayNegativeFriendly(fibo)
niceFibo[-1] = 14
niceFibo[6] // => 14 🎉😍
fibo[6] // => 14 🎉😍