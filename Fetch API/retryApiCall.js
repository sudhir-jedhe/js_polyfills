async function retryApiCall(apiFunction, maxRetries, retryInterval) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await apiFunction();
            return result; // Return the result if the API call is successful
        } catch (error) {
            if (attempt < maxRetries) {
                // If not the last attempt, wait for the retry interval before trying again
                await new Promise(resolve => setTimeout(resolve, retryInterval));
            } else {
                // If it's the last attempt and still unsuccessful, throw the error
                throw error;
            }
        }
    }
}

// Example usage:
// Define your API function to retry (replace with your actual API function)
async function myApiFunction() {
    // Simulate API call that might fail
    const randomNum = Math.random();
    if (randomNum < 0.8) {
        return 'API call successful';
    } else {
        throw new Error('API call failed');
    }
}

// Call retryApiCall with your API function and retry parameters
retryApiCall(myApiFunction, 3, 1000) // Retry up to 3 times with a retry interval of 1000ms
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Failed after retries:', error.message));
