Switching between different components for displaying different pages in a React application is a common requirement for building multi-page applications (MPAs) or single-page applications (SPAs). In React, this is usually done with the help of **routing**. The most popular library for handling routing in React applications is **React Router**.

React Router allows you to define multiple routes and associate each route with a specific component (or "page"). Based on the URL in the browser, React Router will render the corresponding component. This enables seamless navigation between different pages without reloading the entire application.

### **Steps for Switching Components (Pages) in React using React Router**

1. **Install React Router**:
   First, you need to install **React Router** by running:

   ```bash
   npm install react-router-dom
   ```

2. **Setup React Router**:
   React Router consists of several components:
   - **BrowserRouter**: Wraps the entire app and provides routing context.
   - **Route**: Maps a URL path to a component.
   - **Switch**: Renders the first matching route.
   - **Link**: Provides navigation between routes (instead of using `<a>` tags).

### Example: Setting Up Multiple Pages with React Router

Let's set up a basic React app with React Router to navigate between different "pages" of the app.

#### 1. **Create Components for Each Page**

```jsx
// HomePage.js
import React from 'react';

const HomePage = () => {
  return <h1>Welcome to the Home Page</h1>;
};

export default HomePage;

// AboutPage.js
import React from 'react';

const AboutPage = () => {
  return <h1>Welcome to the About Page</h1>;
};

export default AboutPage;

// ContactPage.js
import React from 'react';

const ContactPage = () => {
  return <h1>Welcome to the Contact Page</h1>;
};

export default ContactPage;
```

#### 2. **Set Up Routing in the App**

Next, you'll use `BrowserRouter`, `Route`, and `Switch` to create the routing system.

```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';

const App = () => {
  return (
    <Router>
      <div>
        {/* Navigation links */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Switch and Route to render different components */}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
```

### **Explanation of the Code**:

1. **`<BrowserRouter>`**: This component wraps the entire app and makes it aware of the router and URL changes.
   
2. **`<Route>`**: The `Route` component is used to map a URL path to a specific component. The `path` prop defines the URL path, and the `component` prop defines which component to render when the URL matches the path.
   - The `exact` prop is used for the Home page (`/`) to ensure it only matches when the path is exactly `/` and not when it partially matches, such as `/about` or `/contact`.
   
3. **`<Switch>`**: The `Switch` component ensures that only the first matching `Route` is rendered. Without the `Switch`, all matching routes would be rendered, which could lead to unexpected results.

4. **`<Link>`**: The `Link` component is used for navigation between routes. Unlike a standard anchor tag (`<a>`), `Link` does not reload the page, making the app behave like a single-page application (SPA).

### **Run the Application**

When you run the app (`npm start`), you will see:
- A navigation bar with links to "Home", "About", and "Contact" pages.
- Clicking on each link will change the content displayed on the page without reloading the entire application, thanks to React Router.

### **Using Dynamic Routes (with URL Parameters)**

You can also create routes that are dynamic, meaning they change based on parameters in the URL. For example, if you want to create a user profile page where each profile is displayed based on the user ID, you can do something like this:

#### Example:

```jsx
// ProfilePage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams(); // This will extract the userId from the URL
  return <h1>Profile Page for User {userId}</h1>;
};

export default ProfilePage;
```

```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import HomePage from './HomePage';
import ProfilePage from './ProfilePage';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/profile/1">User 1 Profile</Link>
            </li>
            <li>
              <Link to="/profile/2">User 2 Profile</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/profile/:userId" component={ProfilePage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
```

#### Explanation:

1. **Dynamic Route**: In the `Route` for `ProfilePage`, the path is defined as `/profile/:userId`. The `:userId` part of the path is a dynamic segment that can be accessed using the `useParams` hook from `react-router-dom`.
   
2. **Accessing Parameters**: Inside `ProfilePage`, we use `useParams()` to retrieve the `userId` from the URL. For example, when navigating to `/profile/1`, `userId` will be `1`, and when navigating to `/profile/2`, `userId` will be `2`.

### **Handling Not Found Pages (404 Page)**

If you want to display a "404 Page Not Found" when a user navigates to a URL that doesn't match any defined routes, you can add a fallback route at the end of your `Switch`.

```jsx
// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import HomePage from './HomePage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import NotFoundPage from './NotFoundPage'; // Create this page for 404

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFoundPage} /> {/* This will match for all non-defined routes */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
```

In the above code:
- **`NotFoundPage`** will be rendered for any URL that doesn't match any of the defined routes. This acts as your 404 page.

### **Conclusion**

- **React Router** is a powerful library for managing navigation and switching between components based on the URL.
- You can set up routes using `<Route>`, and control navigation using `<Link>`.
- You can handle dynamic URLs with parameters, and even handle not-found routes using a fallback route in the `<Switch>` component.

This makes building multi-page or single-page applications in React very straightforward and enhances user experience by avoiding full-page reloads.