function formatList(list, separator) {
  // Check if the list is empty
  if (list.length === 0) {
    return "";
  }

  // Create a new string to store the formatted list
  let formattedList = "";

  // Iterate over the list and add each item to the formatted string,
  // separated by the specified separator
  for (let i = 0; i < list.length; i++) {
    formattedList += list[i];
    if (i < list.length - 1) {
      formattedList += separator;
    }
  }

  // Return the formatted list
  return formattedList;
}

// Implement a js function that formats a list of items into a single readable string

const list = ["apple", "banana", "orange"];

// Format the list with a comma separator
const formattedList = formatList(list, ", ");

// Output: "apple, banana, orange"

// Format the list with a space separator
const formattedList = formatList(list, " ");

// Output: "apple banana orange"
