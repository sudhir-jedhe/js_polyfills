Lazy loading in React Router 6.4 is a way to load components only when they are needed (i.e., when the user navigates to a specific route). This can significantly improve the initial loading time of your application by reducing the amount of JavaScript needed at the start.

In React Router 6.4, you can implement lazy loading using the `React.lazy()` function in combination with `Suspense` for handling the loading state.

### Steps to Implement Lazy Loading in React Router 6.4

1. **Set Up React Router**: First, ensure that you have React Router 6.4 installed and set up in your project.

   ```bash
   npm install react-router-dom@6.4
   ```

2. **Use `React.lazy()`**: You can use `React.lazy()` to dynamically import components. This allows React to split the bundle and load only the necessary component when the user navigates to that route.

3. **Wrap in `Suspense`**: Since `React.lazy()` is asynchronous, you must wrap your lazy-loaded components with `Suspense` to handle the loading state while the component is being loaded.

### Example of Lazy Loading in React Router 6.4

Here's how you can implement lazy loading in React Router 6.4:

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
```

### Key Concepts:
1. **`React.lazy()`**: This function is used to define a lazy-loaded component. It accepts a function that returns a dynamic import (`import()`), which tells React to load the component only when it's needed (i.e., when the user navigates to that route).
   - Example: `const Home = lazy(() => import('./components/Home'));`

2. **`Suspense`**: This is a React component that must wrap any lazy-loaded components. The `fallback` prop is used to define what should be displayed while the component is being loaded (e.g., a loading spinner or text).
   - Example: `<Suspense fallback={<div>Loading...</div>}>`

3. **Routes Configuration**: `React Router 6.4` uses the `Routes` component instead of `Switch` (which was used in earlier versions). You define routes inside `Routes` and use `element` to specify the component to be rendered.
   - Example: `<Route path="/" element={<Home />} />`

### Explanation of the Example:

- **Lazy Loading**: Components like `Home`, `About`, and `Contact` are loaded only when the user navigates to their respective routes. This helps in reducing the initial bundle size and improving the application's loading performance.
  
- **Suspense**: While waiting for the lazy-loaded components to be fetched, React shows a fallback UI (a loading message or spinner in this case). Once the component is loaded, it replaces the fallback UI with the actual content.

### Handling Code Splitting

Lazy loading effectively splits your JavaScript bundle into smaller chunks, each associated with a route. React will load the chunk of code when the user navigates to that route.

#### Example:

- When the user first visits the site, only the code required for the initial route is loaded.
- As they navigate to different routes, additional chunks of code are fetched lazily.

This approach can drastically improve the performance of larger applications where different sections or pages of the app have significantly large components.

### Advanced Example with Nested Routes

```jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('./components/Home'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const DashboardSettings = lazy(() => import('./components/DashboardSettings'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Nested Routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="settings" element={<DashboardSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
```

### Summary

- **`React.lazy()`**: Allows you to dynamically import components only when they are needed.
- **`Suspense`**: Displays a loading fallback until the lazy-loaded component is available.
- **React Router 6.4**: Supports lazy loading seamlessly with the `Routes` component, allowing for optimized bundle loading.

Lazy loading components with `React.lazy()` and `Suspense` can drastically improve the performance of your React application by splitting the JavaScript bundle and loading only what's needed for each route.