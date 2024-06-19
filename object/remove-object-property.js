// Set the property to undefined

// Setting a property to undefined isn't generally optimal, as the property itself will still be present in the object, albeit undefined. It also mutates the original object, which might be undesired. You might want to use this in cases where you check for the property's value or truthiness but not its presence.
const pet = {
    species: 'dog',
    age: 3,
    name: 'celeste',
    gender: 'female'
  };
  
  pet.gender = undefined;
  Object.keys(pet); // ['species', 'age', 'name', 'gender']

  // Use the delete operator

  // delete will completely remove the property from the object, but it will still cause a mutation.

  const pet = {
    species: 'dog',
    age: 3,
    name: 'celeste',
    gender: 'female'
  };
  
  delete pet.gender;
  Object.keys(pet); // ['species', 'age', 'name']


//   Use object destructuring
// Using the spread syntax, (...), you can destructure and assign the object with specific properties omitted to a new object. This trick comes in handy especially if you want to remove a subset of properties instead of just one and has the added benefit of not mutating the original object.

const pet = {
    species: 'dog',
    age: 3,
    name: 'celeste',
    gender: 'female'
  };
  
  const { gender, ...newPet } = pet;
  Object.keys(pet); // ['species', 'age', 'name', 'gender]
  Object.keys(newPet); // ['species', 'age', 'name']