*** copy create fake backend  mock json  server.md ***

A complete guide to setting up a zero-config, RESTful mock backend using **`json-server`** that supports CRUD operations, pagination, filtering, relationships, and artificial network delay.

---

### 1. Installation and Project Setup

Run the following commands in your project directory:

```bash
# Initialize project (if not already done)
npm init -y

# Install json-server
npm install -D json-server

```

---

### 2. Create the Database File (`db.json`)

Create a `db.json` file in your root folder. Each top-level key represents a REST endpoint.

```json
{
  "posts": [
    { "id": "1", "title": "First Post", "views": 100, "userId": "1" },
    { "id": "2", "title": "React Best Practices", "views": 250, "userId": "2" },
    { "id": "3", "title": "State Management Guide", "views": 80, "userId": "1" }
  ],
  "comments": [
    { "id": "1", "text": "Great article!", "postId": "1" },
    { "id": "2", "text": "Very informative.", "postId": "2" }
  ],
  "users": [
    { "id": "1", "name": "Alice Johnson", "email": "alice@example.com" },
    { "id": "2", "name": "Bob Smith", "email": "bob@example.com" }
  ]
}

```

---

### 3. Configure Scripts (`package.json`)

Add startup scripts to your `package.json` to configure the port and artificial network delay:

```json
{
  "scripts": {
    "server": "json-server db.json --port 5000 --delay 500"
  }
}

```

Start the mock server:

```bash
npm run server

```

The server will be live at `http://localhost:5000`.

---

### 4. Built-in Endpoints & Query Features

`json-server` provides complete CRUD functionality and advanced query capabilities out of the box:

**Standard CRUD Routes**

* `GET    /posts` — Fetch all posts
* `GET    /posts/1` — Fetch single post by ID
* `POST   /posts` — Create a post (auto-assigns new `id`)
* `PUT    /posts/1` — Replace post
* `PATCH  /posts/1` — Partially update post
* `DELETE /posts/1` — Delete post

**Filtering, Sorting & Pagination**

* **Filter by value:** `GET /posts?userId=1`
* **Full-text search:** `GET /posts?q=React`
* **Sort:** `GET /posts?_sort=views&_order=desc`
* **Pagination:** `GET /posts?_page=1&_limit=2` (includes `Link` and `X-Total-Count` headers)
* **Range queries:** `GET /posts?views_gte=100&views_lte=300`
* **Nested resources:** `GET /posts/1/comments`

---

### 5. Connecting from React

Example showing complete `GET` and `POST` operations against the mock server:

```jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/posts';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch Posts (GET)
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}?_sort=id&_order=desc`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  // 2. Add New Post (POST)
  const handleAddPost = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        views: 0,
        userId: '1',
      }),
    });

    const newPost = await response.json();
    setPosts((prev) => [newPost, ...prev]);
    setTitle('');
  };

  // 3. Delete Post (DELETE)
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Mock Backend Posts</h2>

      <form onSubmit={handleAddPost} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="New post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </form>

      {loading ? (
        <p>Loading from mock server...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {posts.map((post) => (
            <li
              key={post.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid #ddd',
              }}
            >
              <span>{post.title} (👁 {post.views})</span>
              <button onClick={() => handleDelete(post.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

```
