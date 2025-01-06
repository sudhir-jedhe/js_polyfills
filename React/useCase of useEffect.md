`useEffect` is a React Hook that allows you to perform side effects in functional components. It runs after the render cycle and can be used for a variety of scenarios such as data fetching, event listeners, subscriptions, and more. Below are several use cases of `useEffect` in different scenarios:

---

### 1️⃣ **Data Fetching**

One of the most common use cases of `useEffect` is for fetching data from an API when the component mounts.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function DataFetching() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data when component mounts
    fetch('https://api.example.com/data')
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once when the component mounts

  if (loading) {
    return <p>Loading...</p>;
  }

  return <ul>{data.map((item) => <li key={item.id}>{item.name}</li>)}</ul>;
}

export default DataFetching;
```

### 2️⃣ **Event Listeners**

You can add event listeners (like `scroll`, `resize`, etc.) within `useEffect` and clean them up when the component unmounts.

#### Example:

```jsx
import React, { useEffect } from 'react';

function WindowResizeListener() {
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized');
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array ensures the effect runs only once on mount

  return <div>Resize the window and check the console</div>;
}

export default WindowResizeListener;
```

### 3️⃣ **Subscriptions (e.g., WebSocket)**

When working with subscriptions (e.g., WebSocket, Firebase), you can establish and clean them up within `useEffect`.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function WebSocketComponent() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://example.com/socket');

    socket.onmessage = (event) => {
      setMessage(event.data);
    };

    // Clean up WebSocket connection on unmount
    return () => {
      socket.close();
    };
  }, []); // Empty array ensures the effect runs once when the component mounts

  return <div>Message from WebSocket: {message}</div>;
}

export default WebSocketComponent;
```

### 4️⃣ **Animating Elements**

You can trigger animations in response to state changes by utilizing `useEffect`. This is often used to animate DOM elements when a state or prop changes.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function AnimateComponent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        alert('Element is visible!');
      }, 500); // Simulate animation or delay
      return () => clearTimeout(timer); // Cleanup
    }
  }, [isVisible]); // Effect runs when `isVisible` changes

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>
        Toggle Visibility
      </button>
      {isVisible && <div className="animated-element">I am visible!</div>}
    </div>
  );
}

export default AnimateComponent;
```

### 5️⃣ **Updating the DOM directly**

`useEffect` can be used for DOM manipulations, such as updating the document title, focusing input elements, etc.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function DocumentTitleUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Update document title every time `count` changes
    document.title = `You clicked ${count} times`;

    // Optionally, return a cleanup function to reset the title on unmount
    return () => {
      document.title = 'React App'; // Reset to default title when component unmounts
    };
  }, [count]); // Effect runs whenever `count` changes

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Click Me</button>
      <p>You clicked {count} times</p>
    </div>
  );
}

export default DocumentTitleUpdater;
```

### 6️⃣ **Timers (e.g., setInterval, setTimeout)**

You can set up timers like `setInterval` or `setTimeout` inside `useEffect`, and clean them up when the component unmounts or when a condition changes.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function TimerComponent() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(timer);
  }, []); // Empty array ensures the effect runs only once (on mount)

  return <div>Timer: {seconds} seconds</div>;
}

export default TimerComponent;
```

### 7️⃣ **Fetching Data on State Changes**

You can trigger side effects based on state changes, such as re-fetching data when a certain state changes.

#### Example:

```jsx
import React, { useState, useEffect } from 'react';

function DataFetcher() {
  const [query, setQuery] = useState('react');
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`https://api.example.com/search?q=${query}`);
      const result = await response.json();
      setData(result.items);
    };

    fetchData();
  }, [query]); // Effect runs whenever `query` changes

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
      />
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default DataFetcher;
```

### 8️⃣ **Cleanup on Unmount (Memory Leaks)**

You can use the cleanup function to prevent memory leaks when components are unmounted. For example, cleanup subscriptions, timers, or event listeners.

#### Example:

```jsx
import React, { useEffect } from 'react';

function CleanupExample() {
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Timer running');
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(timer);
      console.log('Cleanup: Timer cleared');
    };
  }, []); // Effect runs once on mount

  return <div>Check the console for timer output</div>;
}

export default CleanupExample;
```

---

### Summary of Use Cases:
- **Data Fetching**: Fetch data when the component mounts or when state changes.
- **Event Listeners**: Set up and clean up event listeners like `resize`, `scroll`, etc.
- **Subscriptions**: Use for setting up and cleaning up WebSockets or other subscriptions.
- **Animating Elements**: Trigger animations or DOM updates based on state.
- **Direct DOM Manipulation**: Update the document title or perform other DOM manipulations.
- **Timers**: Manage `setInterval`, `setTimeout`, and clean them up on unmount.
- **State-Driven Fetching**: Re-fetch data or trigger side effects when specific state values change.
- **Cleanup**: Prevent memory leaks by cleaning up event listeners, subscriptions, or timers when components unmount.

In each case, the second argument to `useEffect` (`[]` or a dependency array) controls when the effect runs (e.g., only once, on specific state changes, etc.).