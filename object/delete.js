// The delete operator is used to delete the property as well as its value.

const employee = {
  id: 1,
  name: "Sudhir",
  salary: 5000,
};

delete employee.salary;

console.log(employee);
//  employee = {
//   id: 1,
//   name: "Sudhir",
// };

// To AVoid delete use rest operator
const { salary, ...newEmployee } = employee;

console.log(newEmployee);

// newEmployee = {
//   id: 1,
//   name: "Sudhir",
// };

var user = { firstName: "John", lastName: "Doe", age: 20 };
delete user.age;

console.log(user); // {firstName: "John", lastName:"Doe"}
