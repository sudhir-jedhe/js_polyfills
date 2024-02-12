function toCamelCase(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = key.replace(/([-_][a-z])/gi, (group) =>
      group.toUpperCase().replace("-", "").replace("_", "")
    );
    newObj[newKey] = toCamelCase(value);
  }

  return newObj;
}

const obj = {
  snake_case_key: "value",
  another_snake_case_key: {
    nested_snake_case_key: "nested value",
  },
};

const camelCasedObj = toCamelCase(obj);

console.log(camelCasedObj);
// Output:
// {
//   snakeCaseKey: 'value',
//   anotherSnakeCaseKey: {
//     nestedSnakeCaseKey: 'nested value'
//   }
// }
