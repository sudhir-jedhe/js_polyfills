Function.prototype.myapply = function (obj = {}, args = []) {
  let fn = this;
  if (typeof fn !== "function") {
    throw new Error("Invalid function provided for binding.");
  }
  let randomProp = Math.random();
  while (obj[randomProp] !== undefined) {
    randomProp = Math.random();
  }
  obj[randomProp] = this;
  let result = obj[randomProp](...args);
  delete obj[randomProp];
  return result;
};

let getName = function (city, age) {
  let res = {
    fullname: `${this.firstname} ${this.lastname}`,
    city: city,
    age: age,
  };
  console.log(res);
};

let name = {
  firstname: "shubham",
  lastname: "gupta",
};
getName.mycall(name, "Delhi", 26);
getName.myappply(name, ["Delhi", 26]);
//{ fullname: 'shubham gupta', city: 'Delhi', age: 26 }

const array = ["a", "b"];
const elements = [0, 1, 2];
array.push.apply(array, elements);
console.info(array); // ["a", "b", 0, 1, 2]

const array = ["a", "b"];
const elements = [0, 1, 2];
array.push(...elements);
console.info(array); // ["a", "b", 0, 1, 2]

const objIntro = {
  name: "rahul",
  city: "gwalior",
};

function sayIntro(company, place) {
  console.log(
    `name is ${this.name}, place is ${this.city} and company is ${company} and work place is ${place} `
  );
}

Function.prototype.myApply = function (context, args) {
  if (typeof this !== "function") {
    throw new Error(this, "invalid call");
  }
  if (!Array.isArray(args)) {
    throw new TypeError("arguments are not in array");
  }
  context.fnc = this;
  context.fnc(...args);
};
sayIntro.myApply(objIntro, ["cognizant", "gurgaon"]);
