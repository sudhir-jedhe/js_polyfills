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


function filterRows(data, filterCriteria, columns = []) {
  return data.filter((row) => {
    for (const key in filterCriteria) {
      // If columns are specified, only filter on those columns
      if (columns.length > 0 && !columns.includes(key)) {
        continue; // Skip columns not in the specified columns list
      }

      // Check if the row matches the criteria for this column
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

// Filter for rows where age is 25 (applies to all columns)
const filteredByAge = filterRows(tableData, { age: 25 });

// Filter for rows where city is 'Chicago' (applies to all columns)
const filteredByCity = filterRows(tableData, { city: "Chicago" });

// Filter by 'age' column only, filtering for age = 25
const filteredByAgeColumn = filterRows(tableData, { age: 25 }, ['age']);

// Filter by 'city' column only, filtering for city = 'Chicago'
const filteredByCityColumn = filterRows(tableData, { city: "Chicago" }, ['city']);

console.log(filteredByAge);
console.log(filteredByCity);
console.log(filteredByAgeColumn);
console.log(filteredByCityColumn);
