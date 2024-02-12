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
