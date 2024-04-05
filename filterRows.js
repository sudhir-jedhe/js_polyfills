function filterRows(data, filterCriteria) {
  return data.filter((row) => {
    for (const key in filterCriteria) {
      if (row[key] !== filterCriteria[key]) {
        return false; // Row doesn't match this criterion
      }
    }
    return true; // Row matches all criteria
  });
}

const tableData = [
  { name: "Alice", age: 25, city: "New York" },
  { name: "Bob", age: 30, city: "Chicago" },
  { name: "Charlie", age: 25, city: "Los Angeles" },
];

// Filter for rows where age is 25
const filteredByAge = filterRows(tableData, { age: 25 });

// Filter for rows where city is 'Chicago'
const filteredByCity = filterRows(tableData, { city: "Chicago" });

console.log(filteredByAge);
console.log(filteredByCity);
