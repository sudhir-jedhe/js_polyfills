To build your own HTTP server in Node.js, you need to understand the fundamentals of the HTTP protocol, how to handle TCP connections, how to parse HTTP headers, and how to respond with different HTTP status codes and bodies. You will also explore more advanced topics like handling concurrent connections, serving static files, and implementing HTTP compression.

### Step-by-Step Guide to Build Your Own HTTP Server

Let’s go step by step to build an HTTP server with support for multiple features:

### 1. **Bind to a Port**

To bind the server to a port, we’ll use Node.js's `net` module for TCP connection handling and `http` module for HTTP protocol handling. Let’s start with a very simple HTTP server that listens on a port (e.g., port 3000).

#### Code for Binding to a Port:

```javascript
// server.js
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200; // HTTP Status Code
  res.setHeader('Content-Type', 'text/plain'); // Set the response header
  res.end('Hello, World!\n'); // Send the response body
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

- **Explanation**: This simple server listens on port `3000` and responds with a plain text message when accessed.

### 2. **Respond with 200**

The server is already responding with a `200 OK` status code, but let’s ensure we handle different HTTP methods and respond accordingly.

#### Code to Handle GET and POST Requests:

```javascript
server.on('request', (req, res) => {
  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('GET request received');
  } else if (req.method === 'POST') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST request received');
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end('Method Not Allowed');
  }
});
```

- **Explanation**: Depending on whether the request is `GET` or `POST`, the server responds with appropriate messages.

### 3. **Extract URL Path**

You can extract the URL path of a request using `req.url`.

#### Code to Extract URL Path:

```javascript
server.on('request', (req, res) => {
  const url = req.url; // Get the request URL
  console.log(`Request made to: ${url}`);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`You requested: ${url}`);
});
```

- **Explanation**: The URL path of each request is logged to the console and returned in the response.

### 4. **Serve Files**

To serve files, you can use Node.js's `fs` module to read files from the filesystem and return them in the response.

#### Code to Serve a File:

```javascript
const fs = require('fs');
const path = require('path');

server.on('request', (req, res) => {
  const filePath = path.join(__dirname, 'index.html'); // Path to a file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(data); // Send the file content as response
  });
});
```

- **Explanation**: The server reads a file (`index.html`) from the local filesystem and serves it as the HTTP response.

### 5. **Read Request Body (POST Request)**

To read the body of a `POST` request, you can use the `data` and `end` events.

#### Code to Read Request Body:

```javascript
server.on('request', (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk; // Concatenate chunks of data
  });

  req.on('end', () => {
    console.log('Body:', body); // Log the body content
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('POST request received with body');
  });
});
```

- **Explanation**: This reads the incoming request body for a `POST` request and logs it to the console.

### 6. **HTTP Compression (Gzip)**

To implement HTTP compression (like Gzip), you can use Node.js's `zlib` module.

#### Code to Add Gzip Compression:

```javascript
const zlib = require('zlib');

server.on('request', (req, res) => {
  const acceptEncoding = req.headers['accept-encoding'];
  
  if (acceptEncoding && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip();
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.writeHead(200);
    res.pipe(gzip); // Compress response using gzip
    res.end('Compressed response');
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Uncompressed response');
  }
});
```

- **Explanation**: If the `Accept-Encoding` header includes `gzip`, the response is compressed using Gzip before being sent to the client.

### 7. **Handling Multiple Concurrent Connections**

Node.js is asynchronous and non-blocking by default, which means it can handle many concurrent connections without issues. No additional steps are necessary to handle multiple requests.

### 8. **Complete Code: Final Server**

Here’s the full code with all the features we’ve covered:

```javascript
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const server = http.createServer((req, res) => {
  // Extract URL path
  const url = req.url;

  if (req.method === 'GET') {
    if (url === '/') {
      const filePath = path.join(__dirname, 'index.html');
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
          return;
        }
        
        // Handle compression
        const acceptEncoding = req.headers['accept-encoding'];
        if (acceptEncoding && acceptEncoding.includes('gzip')) {
          res.setHeader('Content-Encoding', 'gzip');
          const gzip = zlib.createGzip();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.writeHead(200);
          res.pipe(gzip);
          res.end(data);
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(data);
        }
      });
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  } else if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      console.log('Body:', body); // Log body content
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('POST request received');
    });
  } else {
    res.statusCode = 405; // Method Not Allowed
    res.end('Method Not Allowed');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

### 9. **Conclusion**

By following the above steps, you've created a simple HTTP server with various features such as:

- Binding to a port and responding with HTTP status codes.
- Serving files and reading request bodies.
- Handling different HTTP methods (GET, POST).
- Implementing compression (gzip).
- Handling multiple concurrent connections.

With this foundation, you can further extend your server to include more complex features, like handling different content types, session management, and more.