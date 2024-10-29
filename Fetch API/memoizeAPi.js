const cache = new Map();

async function fetchWithCache(url) {
  // Check if the URL is already in cache
  if (cache.has(url)) {
    console.log('Returning cached data for:', url);
    return cache.get(url);
  }

  // If not, make the API call
  console.log('Fetching data from API for:', url);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  const data = await response.json();
  
  // Store the result in cache
  cache.set(url, data);
  
  return data;
}

// Usage example
const apiUrl = 'https://api.example.com/data';

fetchWithCache(apiUrl)
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Call again to see cached response
fetchWithCache(apiUrl)
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
