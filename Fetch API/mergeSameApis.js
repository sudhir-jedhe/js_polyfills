function mergeIdenticalAPICalls(apiFunction) {
    const cache = new Map(); // Create a cache to store results of API calls

    return async function (...args) {
        const key = JSON.stringify(args); // Generate a unique key based on the API call parameters

        if (cache.has(key)) {
            // If the result is cached, return it
            return cache.get(key);
        }

        // If the result is not cached, make the API call and cache the result
        const result = await apiFunction(...args);
        cache.set(key, result);
        return result;
    };
}

// Example usage:
// Define your API function (replace with your actual API function)
async function fetchDataFromAPI(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Merge identical API calls
const mergedFetchData = mergeIdenticalAPICalls(fetchDataFromAPI);

// Call the merged API function with the same parameters multiple times
mergedFetchData('https://api.example.com/data')
    .then(data => console.log(data));

mergedFetchData('https://api.example.com/data')
    .then(data => console.log(data));

// The second call should return the cached result of the first call without making another API request
