To build your own real-time search filter in React, we'll walk through how to achieve the following:

- Fetch data from the **JSONPlaceholder API** (`/posts` endpoint).
- Display a list of posts.
- Filter posts dynamically as the user types in the search input.
- Show appropriate messages when no results are found.
- Make the search case-insensitive and responsive.

Here’s how you can implement it:

### 1. **Set Up the React Project**

First, create a new React project if you haven’t already.

```bash
npx create-react-app real-time-search-filter
cd real-time-search-filter
npm start
```

### 2. **Create Components for Search and Display**

Now, create components for your search input and the display of filtered results.

**App.js** (Main Component):

```jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  // Fetch posts from JSONPlaceholder API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
        setPosts(response.data);
        setFilteredPosts(response.data); // Initialize filteredPosts with all posts
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  useEffect(() => {
    const filtered = posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.body.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [query, posts]);

  // Handle input change
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search posts..."
          className="search-input"
        />
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <p>No results found</p>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
```

### 3. **Styling with CSS (Responsive Design)**

You can add basic styles for the search input and posts container, ensuring the app is responsive.

**App.css**:

```css
.App {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  max-width: 500px;
  margin: 0 auto;
}

.posts-container {
  display: flex;
  flex-direction: column;
}

.post-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  color: #555;
}

@media (min-width: 768px) {
  .post-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  h3 {
    font-size: 20px;
  }

  p {
    font-size: 16px;
  }
}
```

### 4. **How It Works**

- **Fetching Data:** The `useEffect` hook is used to fetch data from the JSONPlaceholder API when the component mounts. The fetched posts are stored in the `posts` state and initially shown in `filteredPosts`.
  
- **Real-time Search:** When the user types in the search input, the `handleInputChange` function updates the `query` state. Another `useEffect` hook filters the posts based on the query, using `String.prototype.includes()` to search for the query in both the `title` and `body` of each post. The filter is case-insensitive using `toLowerCase()`.

- **Empty State Handling:** If no posts match the search query, a message "No results found" is shown.

### 5. **Test Your Application**

Now, when you start your React app (`npm start`), you should see a list of posts with a search bar on top. As you type in the search bar, the displayed posts will dynamically update to match the query.

### 6. **Optional Enhancements**

- **Debouncing:** To optimize performance (especially for larger datasets), you can add **debouncing** to the search input, so it doesn't trigger every keystroke. This will reduce the number of filters performed.

```js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

// Inside your App component:
const [query, setQuery] = useState('');
const handleInputChange = debounce((event) => setQuery(event.target.value), 300);

useEffect(() => {
  // Same filtering logic here
}, [query]);
```

- **Pagination or Infinite Scroll:** If the dataset grows, consider adding **pagination** or **infinite scrolling** to display a manageable number of posts at a time.

---

### Conclusion

With this approach, you now have a **real-time search filter** in React that fetches data from an API, filters it dynamically based on user input, and displays the results with responsive design principles. This can be easily adapted to work with any other data source or extended to include additional features like sorting and filtering.


To implement a real-time search filter with **Redux** and **TanStack Query** (formerly React Query), we'll break the project into three main steps:

1. **Set up Redux for state management**.
2. **Integrate TanStack Query for data fetching**.
3. **Create the real-time search filter functionality**.

Let’s walk through how to achieve this:

### Step 1: Set Up Redux

First, set up Redux for state management. We'll need to install Redux Toolkit and React-Redux.

```bash
npm install @reduxjs/toolkit react-redux
```

Now, let’s set up a basic Redux store and slice for managing the search query.

#### Create Redux Slice (`src/store/searchSlice.js`):

```js
import { createSlice } from "@reduxjs/toolkit";

// Search slice to manage query state
const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "", // Store the search query
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
  },
});

export const { setQuery } = searchSlice.actions;

export default searchSlice.reducer;
```

#### Configure Redux Store (`src/store/store.js`):

```js
import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";

const store = configureStore({
  reducer: {
    search: searchReducer,
  },
});

export default store;
```

#### Provide Redux Store to Your App (`src/index.js`):

```js
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store/store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

### Step 2: Set Up TanStack Query for Data Fetching

Next, we need to install **TanStack Query** (React Query) to handle the data fetching from the JSONPlaceholder API.

```bash
npm install @tanstack/react-query axios
```

#### Set Up TanStack Query Client (`src/queryClient.js`):

```js
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default queryClient;
```

#### Provide TanStack Query Client (`src/index.js`):

```js
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./queryClient";

// Modify the ReactDOM.render part in index.js:
ReactDOM.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </Provider>,
  document.getElementById("root")
);
```

### Step 3: Implement the Real-Time Search Filter

Now, we will create the component that:

- Fetches posts using TanStack Query.
- Uses Redux to manage the search query.
- Filters posts in real-time based on the query.

#### Main Component (`src/App.js`):

```jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { setQuery } from "./store/searchSlice";

// Fetch posts from JSONPlaceholder API
const fetchPosts = async () => {
  const { data } = await axios.get("https://jsonplaceholder.typicode.com/posts");
  return data;
};

function App() {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const { data: posts, isLoading, error } = useQuery(["posts"], fetchPosts);

  // Handle the input change and update the Redux state
  const handleInputChange = (event) => {
    dispatch(setQuery(event.target.value));
  };

  // Filter posts based on the search query (case-insensitive)
  const filteredPosts = posts
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching posts: {error.message}</p>;
  }

  return (
    <div className="App">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search posts..."
          className="search-input"
        />
      </div>

      <div className="posts-container">
        {filteredPosts.length === 0 ? (
          <p>No results found</p>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
```

### Explanation

1. **Redux Setup**:
   - The Redux store holds the `query` state (the search input value).
   - The `setQuery` action updates the query when the user types in the input.

2. **TanStack Query Setup**:
   - We use `useQuery` from **TanStack Query** to fetch posts from the `JSONPlaceholder` API.
   - The `fetchPosts` function uses **Axios** to make the GET request and return the posts.

3. **Real-time Search**:
   - When the user types in the search input, the Redux store is updated with the `setQuery` action.
   - The posts are filtered in real-time as the `query` value changes, and the matching posts are displayed.

### Step 4: Styling (Optional)

You can use the same CSS as before to style the components and make sure it's responsive.

**App.css**:

```css
.App {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ddd;
  max-width: 500px;
  margin: 0 auto;
}

.posts-container {
  display: flex;
  flex-direction: column;
}

.post-card {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  color: #555;
}
```

### Conclusion

With **Redux** handling the search query and **TanStack Query** fetching the posts, you've created a real-time search filter that:

- Updates the displayed results as the user types.
- Filters posts based on the search query (case-insensitive).
- Handles empty states, loading, and error states.
  
This setup provides a scalable, maintainable approach for managing state and data fetching in modern React applications.