console.dir(JSON.stringify(1));
console.dir(JSON.stringify(5.9));
console.dir(JSON.stringify(true));
console.dir(JSON.stringify(false));
console.dir(JSON.stringify("falcon"));
console.dir(JSON.stringify("sky"));
console.dir(JSON.stringify(null));

console.dir(JSON.stringify({ x: 5, y: 6 }));
console.dir(JSON.stringify(new Number(6)));
console.dir(JSON.stringify(new String("falcon")));
console.dir(JSON.stringify(new Boolean(false)));
console.dir(JSON.stringify(new Date(2020, 0, 6, 21, 4, 5)));
console.dir(JSON.stringify(new Int8Array([1, 2, 3])));
console.dir(JSON.stringify(new Int16Array([1, 2, 3])));
console.dir(JSON.stringify(new Int32Array([1, 2, 3])));
console.dir(
  JSON.stringify({
    x: 2,
    y: 3,
    toJSON() {
      return this.x + this.y;
    },
  })
);

let users = [
  {
    id: 1,
    first_name: "Robert",
    last_name: "Schwartz",
    email: "rob23@gmail.com",
  },
  {
    id: 2,
    first_name: "Lucy",
    last_name: "Ballmer",
    email: "lucyb56@gmail.com",
  },
  {
    id: 3,
    first_name: "Anna",
    last_name: "Smith",
    email: "annasmith23@gmail.com",
  },
];

let data = JSON.stringify(users, null, 2);

console.log(typeof data);
console.log(typeof users);
console.log("------------------");
console.dir(data);
console.log("------------------");
console.dir(users);

/************************************************** */
function replacer(key, value) {
  if (typeof value === "string") {
    return value.toUpperCase();
  }
  return value;
}

var user = {
  name: "John Doe",
  occupation: "gardener",
  age: 34,
  dob: new Date("1992-12-31"),
};

console.dir(JSON.stringify(user, replacer));

/******************************* */
var user = {
  name: "John Doe",
  occupation: "gardener",
  dob: new Date("1992-12-31"),
};

console.dir(JSON.stringify(user, ["name", "occupation"]));
/****************************** */
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((response) => response.json())
  .then(
    (json) =>
      (document.body.appendChild(document.createElement("pre")).innerHTML =
        JSON.stringify(json, null, 4))
  );

/*************************************************** */
// This is a JavaScript Quiz from BFE.dev

// attention that for console.log('"a"'), you should enter ""a""
// please refer to format guide

console.log(JSON.stringify(["false", false]));
console.log(JSON.stringify([NaN, null, Infinity, undefined]));
console.log(JSON.stringify({ a: null, b: NaN, c: undefined }));

/********************************************** */
function stringify(data) {
  if (typeof data === "string") {
    return `"${data}"`;
  }
  if (typeof data === "function") {
    return undefined;
  }
  if (
    data === Infinity ||
    data === -Infinity ||
    data === null ||
    data === undefined ||
    typeof data === "symbol"
  ) {
    return "null";
  }
  if (typeof data === "number" || typeof data === "boolean") {
    return `${data}`;
  }

  if (data instanceof Date) {
    return `"${data.toISOString()}"`;
  }
  if (Array.isArray(data)) {
    const arr = data.map((el) => stringify(el));
    return `[${arr.join(",")}]`;
  }
  if (typeof data === "object") {
    const arr = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }
      acc.push(`"${key}":${stringify(value)}`);
      return acc;
    }, []);
    return `{${arr.join(",")}}`;
  }
}

const employee = {
  id: 1,
  name: "Sudhir",
  salary: 5000,
  address: {
    city: "badlapur",
    state: "maharashtra",
    country: "india",
  },
};

const spacer = 2 || "xxxx";
const format = JSON.stringify(employee, null, spacer); // 2 as spaces of indentation as spacer string or number
console.log(format);

const filters = ["name", "address", "city", "country"];

const filtered = JSON.stringify(employee, filters);
console.log(filtered);

const doubleSalary = (key, value) => {
  return key === "salary" ? value * 2 : value;
};

const result = JSON.stringify(employee, doubleSalary);
console.log(result);


/*********************************************** */

function jsonStringify(obj) {
  if (typeof obj === 'string') {
      return '"' + obj + '"';
  } else if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null) {
      return String(obj);
  } else if (Array.isArray(obj)) {
      return '[' + obj.map(jsonStringify).join(',') + ']';
  } else if (typeof obj === 'object') {
      const keys = Object.keys(obj);
      return '{' + keys.map(key => '"' + key + '":' + jsonStringify(obj[key])).join(',') + '}';
  }
}

// Test cases
console.log(jsonStringify({"y": 1, "x": 2})); // Output: '{"y":1,"x":2}'
console.log(jsonStringify({"a":"str","b":-12,"c":true,"d":null})); // Output: '{"a":"str","b":-12,"c":true,"d":null}'
console.log(jsonStringify({"key":{"a":1,"b":[{},null,"Hello"]}})); // Output: '{"key":{"a":1,"b":[{},null,"Hello"]}}'
