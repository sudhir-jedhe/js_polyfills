Let’s break down each of these concepts and explore how to build them step by step in React:

### 1. **Build Your Own Router**
Building a custom router means handling the logic of matching URLs to components and rendering those components. This is similar to what React Router does, but with custom implementations.

#### Steps to Build a Simple Router:
- Use `window.location` or `history.pushState()` to manage the URL state.
- Match the URL to a specific component and render it based on the path.
- Track changes to the URL using events like `popstate`.

**Example:**

```javascript
import React, { useState, useEffect } from 'react';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
];

function Router() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const matchRoute = routes.find(route => route.path === currentPath);
  const CurrentComponent = matchRoute ? matchRoute.component : NotFound;

  return <CurrentComponent />;
}

function Home() {
  return <div>Home Page</div>;
}

function About() {
  return <div>About Page</div>;
}

function NotFound() {
  return <div>404 Not Found</div>;
}

export default Router;
```

### 2. **Build Your Own Custom State Management**
Custom state management can be done by using the `useState` hook or creating your own custom hooks to manage global state. For a more complex state management solution, we can create a simple version of Redux.

#### Example: Custom Global State with Context API

```javascript
import React, { createContext, useState, useContext } from 'react';

// Create a Context
const StateContext = createContext();

// Provider component
export function StateProvider({ children }) {
  const [state, setState] = useState({ user: null });

  const updateUser = (user) => setState({ ...state, user });

  return (
    <StateContext.Provider value={{ state, updateUser }}>
      {children}
    </StateContext.Provider>
  );
}

// Custom hook to use the state
export function useGlobalState() {
  return useContext(StateContext);
}
```

You can wrap your application with the `StateProvider` and use `useGlobalState` in any component to access or update the global state.

### 3. **Build a PWA (Progressive Web App)**
A Progressive Web App (PWA) is a web application that uses modern web capabilities to provide a native app-like experience.

#### Steps to Build a Basic PWA:
1. Create a basic React app using Create React App.
2. Add a `service-worker.js` to enable offline functionality.
3. Modify the `manifest.json` to define app details like icons, themes, and start URL.
4. Register the service worker in `index.js`.

**Example:**

- **manifest.json:**

```json
{
  "short_name": "ReactPWA",
  "name": "My Progressive Web App",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000"
}
```

- **Service Worker Registration in `index.js`:**

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
```

### 4. **Build a Real-Time Search Filter**
This functionality is useful for filtering data as the user types in a search box, fetching results in real-time.

**Example:**

```javascript
import React, { useState } from 'react';

function SearchFilter() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const data = ['Apple', 'Banana', 'Orange', 'Grapes', 'Pineapple'];

  const handleSearch = (event) => {
    setQuery(event.target.value);
    setResults(data.filter(item => item.toLowerCase().includes(event.target.value.toLowerCase())));
  };

  return (
    <div>
      <input type="text" value={query} onChange={handleSearch} placeholder="Search..." />
      <ul>
        {results.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 5. **Undo/Redo Functionality in React**
You can create an undo/redo functionality by maintaining a history stack and allowing users to navigate between them.

#### Example: Simple Undo/Redo Hook

```javascript
import { useState } from 'react';

function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const addState = (newState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    setHistory([...newHistory, newState]);
    setCurrentIndex(newHistory.length);
  };

  const undo = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const redo = () => {
    if (currentIndex < history.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return {
    state: history[currentIndex],
    addState,
    undo,
    redo,
  };
}

function Counter() {
  const { state, addState, undo, redo } = useUndoRedo(0);

  return (
    <div>
      <p>Counter: {state}</p>
      <button onClick={() => addState(state + 1)}>Increment</button>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}
```

### 6. **UI Library**
Building a simple UI library involves creating reusable components like buttons, modals, inputs, etc.

#### Example: Simple Button Component

```javascript
import React from 'react';

function Button({ children, onClick, style }) {
  return (
    <button onClick={onClick} style={style}>
      {children}
    </button>
  );
}

export default Button;
```

You can build other components like `Modal`, `Card`, `Input`, and `Tooltip` to create a comprehensive UI library.

### 7. **Infinite Scroll with Dynamic API Integration**
Infinite scroll involves fetching new data when the user scrolls to the bottom of the page. You can achieve this by monitoring the scroll position and making API calls as needed.

**Example:**

```javascript
import React, { useState, useEffect } from 'react';

function InfiniteScroll() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const newData = await response.json();
    setData((prevData) => [...prevData, ...newData]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = (e) => {
    if (e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight && !loading) {
      fetchData();
    }
  };

  return (
    <div onScroll={handleScroll} style={{ height: '400px', overflowY: 'auto' }}>
      {data.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

---

### Conclusion
By mastering these key concepts and building these custom solutions, you’ll have the foundation to handle routing, state management, real-time search, undo/redo, and infinite scrolling in React. You can further enhance these implementations by adding more features, improving performance, and following best practices in production-ready applications.