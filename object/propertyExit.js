// Check property exists in an object

const employee = {
  id: 1,
  name: "Sudhir",
  salary: 5000,
};

const isSalaryExist = "salary" in employee;
console.log(isSalaryExist);

const isGenderExist = "gender" in employee;
console.log(isGenderExist);
