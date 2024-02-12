function addContinentProperty(objectsArray, continent) {
  // Use map() to create a new array with modified objects
  return objectsArray.map((obj) => {
    // Create a new object with the same properties as the original object
    // and add the 'continent' property with the provided value
    return {
      ...obj, // Spread operator to copy existing properties
      continent: continent, // Add or overwrite the 'continent' property
    };
  });
}

// Example usage:
let countries = [
  { name: "USA", population: 331000000 },
  { name: "Canada", population: 38000000 },
  { name: "Brazil", population: 213000000 },
];
let countriesWithContinent = addContinentProperty(countries, "North America");
console.log(countriesWithContinent);
