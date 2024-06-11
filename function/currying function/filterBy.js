const filterBy = (propertyName) => {
    return (propertyValue) => {
      return (dataArray) => {
        return dataArray.filter((item) => item[propertyName] === propertyValue);
      };
    };
  };

  const MOCK_DATA = [
    { id: 1, name: "John", email: "john@example.com" },
    { id: 2, name: "Jane", email: "jane@example.com" },
    { id: 3, name: "Michael", email: "michael@test.com" },
    { id: 4, name: "Emma", email: "emma@example.com" },
    { id: 5, name: "William", email: "william@example.com" },
    // Add more mock data as needed
  ];
  
  
  // Example usage:
  const filterByName = filterBy("name");
  const filterByEmail = filterBy("email");
  
  const filteredByName = filterByName("Michael")(MOCK_DATA);
  const filteredByEmail = filterByEmail("michael@test.com")(MOCK_DATA);
  
  console.log("Filtered by name:", filteredByName);
  console.log("Filtered by email:", filteredByEmail);
  