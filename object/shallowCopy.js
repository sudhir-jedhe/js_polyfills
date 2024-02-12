const employee = {
  id: 1,
  name: "Sudhir",
  ...(includeSalary && { salary: 5000 }),
};

const newEmployee = {
  ...employee,
};
