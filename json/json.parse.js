console.log(JSON.parse("-3"));
console.log(JSON.parse("12"));
console.log(JSON.parse("true"));
console.log(JSON.parse('"falcon"'));

/******************************************** */

let data = `[
    {
      "id": 1,
      "first_name": "Robert",
      "last_name": "Schwartz",
      "email": "rob23@gmail.com"
    },
    {
      "id": 2,
      "first_name": "Lucy",
      "last_name": "Ballmer",
      "email": "lucyb56@gmail.com"
    },
    {
      "id": 3,
      "first_name": "Anna",
      "last_name": "Smith",
      "email": "annasmith23@gmail.com"
    }
  ]`;

let users = JSON.parse(data);

console.log(typeof users);
console.log("-------------------");
console.log(users[1]);
console.log("-------------------");
console.log(users);
/*************************************************** */

let user = `{
    "username": "John Doe",
    "email": "john.doe@example.com",
    "state": "married",
    "profiles": [
        {"name": "jd7", "job": "actor" },
        {"name": "johnd7", "job": "spy"}
    ],
    "active": true,
    "employed": true
}`;

let data = JSON.parse(user);

function printValues(obj) {
  for (var k in obj) {
    if (obj[k] instanceof Object) {
      printValues(obj[k]);
    } else {
      console.log(obj[k]);
    }
  }
}

printValues(data);

console.log("-------------------");

Object.entries(data).map((e) => {
  console.log(e);
});

/******************************************************* */

let data =
  '{ "name": "John Doe", "dateOfBirth": "1976-12-01", "occupation": "gardener"}';

let user = JSON.parse(data, (k, v) => {
  if (k == "dateOfBirth") {
    return new Date(v);
  } else {
    return v;
  }
});

console.log(user);

/**************************************************************** */
function parseJSON(input) {
  // if the input is empty or starts with an invalid character, throw an error
  if (input === "" || input[0] === "'") {
    throw Error();
  }

  // check if the input is null, an empty object, empty array, or a boolean and return the value from the input
  if (input === "null") {
    return null;
  }
  if (input === "{}") {
    return {};
  }
  if (input === "[]") {
    return [];
  }
  if (input === "true") {
    return true;
  }
  if (input === "false") {
    return false;
  }

  //if the input starts with a quote, return the value from inside the quotes
  if (input[0] === '"') {
    return input.slice(1, -1);
  }

  // if it starts with a bracket, perform parsing of the contents within the brackets
  if (input[0] === "{") {
    return input
      .slice(1, -1)
      .split(",")
      .reduce((acc, item) => {
        // get the key and the value of the JSON property by splitting the string on the colon character
        const index = item.indexOf(":");
        const key = item.slice(0, index);
        const value = item.slice(index + 1);
        acc[parse(key)] = parse(value);
        return acc;
      }, {});
  }
  // if the input is an array, return the value from inside the array
  if (input[0] === "[") {
    return input
      .slice(1, -1)
      .split(",")
      .map((x) => parse(x));
  }
}
