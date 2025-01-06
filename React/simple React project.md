To create a **React project** that includes all of the requested features, we will break the task down into key steps. This guide will help you build a responsive, user-friendly app with guest login, dynamic content loading, advanced search functionality, and performance optimization.

---

### **Step 1: Set Up a New React Project**

First, create a new React project:

```bash
npx create-react-app my-app
cd my-app
```

### **Step 2: Install Necessary Libraries**

You will need some libraries for certain functionalities:

- **React Router** for navigation.
- **React Helmet** for better management of the HTML document head.
- **Axios** for data fetching.
- **React Infinite Scroll** for infinite scrolling.
- **React-Bootstrap** or **Material-UI** for responsive design components.
- **React-Icons** for easy icon integration.
- **React-Select** for advanced search filters.

Install dependencies:

```bash
npm install react-router-dom axios react-infinite-scroll-component react-bootstrap react-icons react-select react-helmet
```

---

### **Step 3: Project Structure**

Create the following basic structure:

```
/src
  /components
    - Header.js
    - Login.js
    - ProductList.js
    - SearchBar.js
    - Pagination.js
    - FeedbackForm.js
  /pages
    - Home.js
    - ProductDetail.js
    - LoginPage.js
  /utils
    - api.js
```

---

### **Step 4: Implement Responsive Design**

You can start with a **mobile-first** approach using CSS Grid or Flexbox for adaptable layouts.

```css
/* src/index.css */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .container {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
```

---

### **Step 5: Guest Login Option**

For a guest login, create a `Login.js` component to allow users to explore the app without an account.

```jsx
// src/components/Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [isGuest, setIsGuest] = useState(false);

  const handleLogin = () => {
    if (isGuest) {
      onLogin("Guest");
    } else {
      // Logic for normal login
    }
  };

  return (
    <div>
      <button onClick={() => setIsGuest(true)}>Guest Login</button>
      <button onClick={() => setIsGuest(false)}>Login</button>
      <button onClick={handleLogin}>Proceed as {isGuest ? 'Guest' : 'User'}</button>
    </div>
  );
};

export default Login;
```

---

### **Step 6: Intuitive Navigation**

Use **React Router** for navigation and implement breadcrumbs for easy navigation tracking.

```jsx
// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
```

---

### **Step 7: Dynamic Content Loading with Infinite Scroll**

Use **React Infinite Scroll Component** to load content dynamically.

```jsx
// src/components/ProductList.js
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get('https://api.example.com/products');
      setProducts((prev) => [...prev, ...res.data]);
      if (res.data.length === 0) setHasMore(false);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <InfiniteScroll
      dataLength={products.length}
      next={fetchProducts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
    >
      <div className="product-list">
        {products.map((product, index) => (
          <div key={index} className="product-item">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default ProductList;
```

---

### **Step 8: Advanced Search Functionality**

Use **React-Select** for filtering and search functionality.

```jsx
// src/components/SearchBar.js
import React, { useState } from 'react';
import Select from 'react-select';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (selectedOption) => {
    setSearchTerm(selectedOption ? selectedOption.value : '');
    onSearch(selectedOption ? selectedOption.value : '');
  };

  const options = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'tablet', label: 'Tablet' }
  ];

  return (
    <Select 
      options={options}
      onChange={handleChange}
      placeholder="Search Products"
    />
  );
};

export default SearchBar;
```

---

### **Step 9: User Feedback Mechanism**

Create a **FeedbackForm** to allow users to leave reviews.

```jsx
// src/components/FeedbackForm.js
import React, { useState } from 'react';

const FeedbackForm = ({ onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(feedback);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={feedback} 
        onChange={(e) => setFeedback(e.target.value)} 
        placeholder="Leave feedback" 
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
```

---

### **Step 10: Authentication and User Accounts**

Implement **secure login** using a service like Firebase or JWT-based authentication.

---

### **Step 11: Performance Optimization**

Use **code splitting** and **image optimization** for faster loading times.

```jsx
// src/App.js (for lazy loading)
import React, { Suspense } from 'react';

const ProductList = React.lazy(() => import('./components/ProductList'));

const App = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </div>
  );
};

export default App;
```

---

### **Step 12: Accessibility**

Ensure that all elements are accessible via the keyboard and ARIA attributes are used.

```jsx
// Example: Adding ARIA attributes
<button aria-label="Close" onClick={handleClose}>Close</button>
```

---

### **Step 13: Test, Build, and Deploy**

Once you've implemented all the features, test your app thoroughly. After ensuring everything works smoothly, run the following to create an optimized production build:

```bash
npm run build
```

You can deploy the app on platforms like **Netlify** or **Vercel** for easy deployment.

---

### **Conclusion**

With the features above, you’ve built a React app with responsive design, dynamic content loading, advanced search functionality, and other user-friendly features.