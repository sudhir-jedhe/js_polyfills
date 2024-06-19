function renameKeys(obj, keyMap) {
    // Create a new object to store the renamed keys
    const renamed = {};

    // Iterate over each key in the original object
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            // Check if the key exists in the keyMap
            if (keyMap.hasOwnProperty(key)) {
                // Rename the key using the keyMap
                renamed[keyMap[key]] = obj[key];
            } else {
                // Keep the key unchanged if not in keyMap
                renamed[key] = obj[key];
            }
        }
    }

    return renamed;
}


const user = {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    email: 'john.doe@example.com'
};

const keyMap = {
    firstName: 'name',
    lastName: 'surname'
};

const renamedUser = renameKeys(user, keyMap);
console.log(renamedUser);


// {
//     "name": "John",
//     "surname": "Doe",
//     "age": 30,
//     "email": "john.doe@example.com"
// }



const originalObj = {
    city: "Kanpur",
    state: "UP",
  };
  
  const renamedObj = Object.fromEntries(
    Object.entries(originalObj).map(([key, value]) => {
      const newKey = mapping[key] || key;
      return [newKey, value];
    })
  );
  
  console.log(renamedObj);



  const originalObj = { name: "John", age: 30 };
const renamedObj = {};

for (const key in originalObj) {
	const newKey = key === "name" ? "fullName" : key;
	renamedObj[newKey] = originalObj[key];
}

console.log(renamedObj);



const product = {
	name: "T-Shirt",
	price: 20,
	discount: 10
};
const renamedProduct = {
	...product,
	[product.discount > 0 ?
		"discountedPrice" : "price"]:
		product.price,
};

console.log(renamedProduct);
