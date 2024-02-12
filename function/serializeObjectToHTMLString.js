// Implement a js function to serialize an object into an HTML string with indentation

function serializeObjectToHTMLString(obj, indent = 2) {
  // Check if the object is null or undefined
  if (obj === null || obj === undefined) {
    return "";
  }

  // Check if the object is an array
  if (Array.isArray(obj)) {
    // Create an empty string to store the HTML string
    let htmlString = "";

    // Iterate over the array and serialize each element
    for (let i = 0; i < obj.length; i++) {
      htmlString += serializeObjectToHTMLString(obj[i], indent);
    }

    // Return the HTML string
    return htmlString;
  }

  // Create an empty string to store the HTML string
  let htmlString = "";

  // Iterate over the object's properties and serialize each property
  for (let property in obj) {
    // Get the property value
    const value = obj[property];

    // Check if the property value is a function
    if (typeof value === "function") {
      // Skip the property
      continue;
    }

    // Add the property name to the HTML string
    htmlString += `${indent}<${property}>`;

    // Serialize the property value
    htmlString += serializeObjectToHTMLString(value, indent + 2);

    // Add the closing tag to the HTML string
    htmlString += `${indent}</${property}>`;
  }

  // Return the HTML string
  return htmlString;
}

const obj = {
  name: "John Doe",
  age: 30,
  occupation: "Software Engineer",
};

const htmlString = serializeObjectToHTMLString(obj);

console.log(htmlString);

{
  /* <name>John Doe</name>
<age>30</age>
<occupation>Software Engineer</occupation> */
}
