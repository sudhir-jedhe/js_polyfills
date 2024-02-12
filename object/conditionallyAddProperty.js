// Conditionally add a property to an object

const includeSalary = true;

const employee = {
  id: 1,
  name: "Sudhir",
  ...(includeSalary && { salary: 5000 }),
};

console.log(employee);
const isSalaryExist = "salary" in employee;
console.log(isSalaryExist);
