async function fetchAllApis(apis) {
    try {
        // Create an array of promises by mapping over the APIs and fetching data
        const promises = apis.map(api => fetch(api));

        // Wait for all promises to resolve using Promise.all()
        const responses = await Promise.all(promises);

        // Extract JSON data from each response
        const data = await Promise.all(responses.map(response => response.json()));

        return data;
    } catch (error) {
        // Handle errors
        console.error("Error fetching APIs:", error);
        throw error;
    }
}

// Example usage:
const apis = [
    'https://api.example.com/endpoint1',
    'https://api.example.com/endpoint2',
    // Add more API endpoints as needed
];

fetchAllApis(apis)
    .then(data => {
        console.log("Data from all APIs:", data);
    })
    .catch(error => {
        console.error("Error fetching data from APIs:", error);
    });
