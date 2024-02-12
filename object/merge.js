// Implement a js function to merge rows of data from the same user

function mergeRows(data, userKey) {
  // Create a new object to store the merged data.
  const mergedData = {};

  // Iterate over the data and merge the rows for each user.
  for (const row of data) {
    const user = row[userKey];

    // If the user doesn't exist in the merged data object, create a new entry.
    if (!mergedData[user]) {
      mergedData[user] = [];
    }

    // Merge the current row with the existing rows for the user.
    mergedData[user].push(row);
  }

  // Return the merged data object.
  return mergedData;
}

const data = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 1, name: "Alice", occupation: "Software Engineer" },
];

const mergedData = mergeRows(data, "id");

console.log(mergedData);

// {
//     "1": [
//       { id: 1, name: "Alice", age: 25 },
//       { id: 1, name: "Alice", occupation: "Software Engineer" }
//     ],
//     "2": [
//       { id: 2, name: "Bob", age: 30 }
//     ]
//   }
