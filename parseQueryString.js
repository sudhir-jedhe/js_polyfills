function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}
const queryString = "name=John&age=30&city=New%20York";

const parsedObject = parseQueryString(queryString);
console.log(parsedObject);


// {
//     "name": "John",
//     "age": "30",
//     "city": "New York"
// }


/************************** */
const parseQueryString = function(queryString) {
    // Split into key/value pairs.
    const queries = queryString.split("&");
  
    // Convert the array of strings into an object.
    const params = {};
    for (let i = 0; i < queries.length; i++) {
      const temp = queries[i].split("=");
      params[temp[0]] = temp[1];
    }
  
    return params;
  };
  
  // Example usage:
  const queryString = "foo=bar&baz=qux";
  const params = parseQueryString(queryString);
  
  console.log(params); // { foo: "bar", baz: "qux" }