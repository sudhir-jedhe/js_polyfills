To make multiple API calls concurrently in React and improve performance, you can use JavaScript’s built-in `Promise.all()` or `Promise.allSettled()` to run the API calls in parallel. This way, the requests are fired at the same time, and the component waits for all of them to finish before rendering the results.

Here's how to implement this in a React component:

### 1. **Using `Promise.all()`**

`Promise.all()` allows you to make multiple API calls concurrently and wait until all of them resolve. If any of the promises reject, `Promise.all()` will immediately reject with that error.

### Example with `Promise.all()`

```javascript
import React, { useEffect, useState } from 'react';

const ConcurrentApiCalls = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start multiple API calls concurrently
        const response1 = fetch('https://api.example.com/data1');
        const response2 = fetch('https://api.example.com/data2');
        const response3 = fetch('https://api.example.com/data3');

        // Wait for all API calls to finish
        const [data1, data2, data3] = await Promise.all([
          response1, 
          response2, 
          response3
        ]);

        // Parse the responses as JSON
        const data1Json = await data1.json();
        const data2Json = await data2.json();
        const data3Json = await data3.json();

        // Combine the results into one object or array
        setData({ data1: data1Json, data2: data2Json, data3: data3Json });
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>API Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ConcurrentApiCalls;
```

### Explanation:
- **`fetchData()`**: This function makes three API calls concurrently using `fetch`. The `Promise.all()` method waits for all promises to resolve, and it returns an array of the responses.
- **`await Promise.all([...])`**: This will wait for all promises to resolve before continuing.
- **Error Handling**: If any of the promises reject (for example, a network failure), the `catch` block will handle the error.
- **State Management**: We use React's `useState` hook to manage the loading state, the data once it's fetched, and any error that occurs.

### 2. **Using `Promise.allSettled()`**

`Promise.allSettled()` is another option if you want to ensure that all promises are resolved (either fulfilled or rejected), and it provides you with the outcome of each promise.

### Example with `Promise.allSettled()`

```javascript
import React, { useEffect, useState } from 'react';

const ConcurrentApiCalls = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start multiple API calls concurrently
        const response1 = fetch('https://api.example.com/data1');
        const response2 = fetch('https://api.example.com/data2');
        const response3 = fetch('https://api.example.com/data3');

        // Wait for all promises to settle
        const results = await Promise.allSettled([
          response1, 
          response2, 
          response3
        ]);

        // Handle the results
        const [data1, data2, data3] = results;

        if (data1.status === 'fulfilled') {
          const data1Json = await data1.value.json();
          setData(prevData => ({ ...prevData, data1: data1Json }));
        } else {
          setError('Error with data1');
        }

        if (data2.status === 'fulfilled') {
          const data2Json = await data2.value.json();
          setData(prevData => ({ ...prevData, data2: data2Json }));
        } else {
          setError('Error with data2');
        }

        if (data3.status === 'fulfilled') {
          const data3Json = await data3.value.json();
          setData(prevData => ({ ...prevData, data3: data3Json }));
        } else {
          setError('Error with data3');
        }

      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>API Data</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ConcurrentApiCalls;
```

### Explanation:
- **`Promise.allSettled()`**: Unlike `Promise.all()`, `Promise.allSettled()` resolves after **all promises** have settled (either fulfilled or rejected). It gives you an array of result objects, each with a `status` (either `'fulfilled'` or `'rejected'`), and if fulfilled, a `value` property.
- **Error Handling**: You can now handle errors for each individual API call instead of stopping the entire process if one request fails.
- **Improved State Management**: It helps you handle scenarios where some API calls fail but you still want to display the data from the successful ones.

### Conclusion:

- **`Promise.all()`** is ideal when you want to wait for all API calls to finish successfully. If any of the promises reject, the entire process will fail.
- **`Promise.allSettled()`** is more forgiving and allows you to handle both successful and failed requests individually, while still waiting for all promises to settle.

Both methods can significantly improve performance when you have multiple independent API requests to make, as they allow all the requests to run concurrently rather than sequentially.