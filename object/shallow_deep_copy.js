// When a reference variable is copied into a new reference variable using the assignment operator,
// a shallow copy of the referenced object is created

let employee = {
  eid: "E102",
  ename: "Jack",
  eaddress: "New York",
  salary: 50000,
  get getName() {
    return this.ename;
  },
  set setName(name) {
    this.ename = name;
  },
};

Object.defineProperty(employee, "ename", {
  value: "Sagar",
  configurable: true,
  writable: true,
  enumerable: true,
});

console.log("Employee=> ", employee);
let newEmployee = employee; // Shallow copy
console.log("New Employee=> ", newEmployee);

console.log("---------After modification----------");
newEmployee.ename = "Beck";
console.log("Employee=> ", employee);
console.log("New Employee=> ", newEmployee);
// Name of the employee as well as
// newEmployee is changed.

//Deep Copy
// Unlike the shallow copy, deep copy makes a copy of all the members of the old object,
// allocates a separate memory location for the new object, and then assigns the copied members to the new object.
let employee = {
  eid: "E102",
  ename: "Jack",
  eaddress: "New York",
  salary: 50000,
};
console.log("=========Deep Copy========");
let newEmployee = JSON.parse(JSON.stringify(employee));
console.log("Employee=> ", employee);
console.log("New Employee=> ", newEmployee);
console.log("---------After modification---------");
newEmployee.ename = "Beck";
newEmployee.salary = 70000;
console.log("Employee=> ", employee);
console.log("New Employee=> ", newEmployee);
