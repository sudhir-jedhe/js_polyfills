function filterRows(data, requirement) {
  // Create a new array to store the filtered rows.
  const filteredRows = [];

  // Iterate over the data and add each row to the filteredRows array if it matches the requirement.
  for (const row of data) {
    if (requirement(row)) {
      filteredRows.push(row);
    }
  }

  // Return the filteredRows array.
  return filteredRows;
}

const data = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Carol", age: 27 },
];

// Filter the data to only include rows where the age is greater than 25.
const filteredRows = filterRows(data, (row) => row.age > 25);

// Print the filtered rows.
console.log(filteredRows);
// [{ name: "Bob", age: 30 }, { name: "Carol", age: 27 }]
