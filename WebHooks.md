WebHooks allow the server to notify the client when there's new data available. The client registers a callback URL with the server and the server sends a message to that URL when there is data to send.

With WebHooks, the client sends requests as usual, but can also listen for and receive requests like a server.

Using the restaurant analogy, when the guest orders a meal, they give the waiter a bell (analogous to the callback URL). The waiter goes to the kitchen and rings the bell as soon as the meal is ready. This allows the client to know, in real-time, about the progress of his order.

WebHooks are superior to polling because you get real-time updates from the server once something changes, without having to make frequent, wasteful requests to the server about that change.

They're also superior to long polling because long polling can consume more client and server resources as it involves keeping connections open, potentially resulting in many open connections.


### Webhooks in React JS

Webhooks are a way for applications to send real-time data to other applications when a specific event occurs. In the context of **React JS**, webhooks are typically used to notify your React app about events that occur in another system, such as a server, a third-party service, or an API. For example, a webhook can notify your React app when a new user registers or when a payment is made.

Webhooks themselves are typically implemented on the server-side, but you can use them effectively in your React application by listening for those events, updating the UI, or taking some action based on the received data.

---

### **How Webhooks Work**

1. **Event Occurrence**: An event happens in an external system, such as a payment gateway processing a payment.
2. **Webhook Trigger**: The external system triggers a webhook request to a specific URL.
3. **Webhook Delivery**: The data (usually in the form of a POST request) is delivered to a configured endpoint (usually a server-side URL).
4. **React App Action**: The server processes the webhook request and sends data to the React application, either directly or via a backend API.

---

### **How to Implement Webhooks in React JS**

Although React is a frontend library and cannot directly listen to webhooks (since they are typically sent to a server), you can set up your server to handle webhooks and then push the data to your React app using something like **WebSockets** or **Server-Sent Events (SSE)**. Here's how you can do it:

---

#### **Step 1: Set Up the Backend to Receive Webhooks**

1. **Install the necessary packages for your backend (Node.js Example)**:
   - Install **express** to set up an HTTP server.
   - Optionally, use **body-parser** to handle incoming JSON requests.

```bash
npm install express body-parser
```

2. **Create a Webhook Endpoint in Node.js**:

```javascript
// server.js (Node.js backend)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Webhook endpoint that will receive events from an external service
app.post('/webhook', (req, res) => {
  const webhookData = req.body;
  console.log('Webhook received:', webhookData);

  // Process the webhook data (e.g., store it in a database or notify the frontend)

  // Send a response to acknowledge receipt of the webhook
  res.status(200).send('Webhook received successfully');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

In this example:
- **`/webhook`** is the endpoint that the external service will call when an event occurs.
- The **`req.body`** contains the data sent by the external service.

---

#### **Step 2: Push Data from Backend to React Using WebSockets**

To send real-time updates to your React app, we can use **WebSockets**. This allows the server to push data to the React app as soon as the webhook is received.

1. **Install `socket.io` in Node.js**:

```bash
npm install socket.io
```

2. **Modify the Backend to Use WebSockets**:

```javascript
// server.js (Node.js backend)

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

// Webhook endpoint that will receive events from an external service
app.post('/webhook', (req, res) => {
  const webhookData = req.body;
  console.log('Webhook received:', webhookData);

  // Emit the webhook data to all connected clients (React app)
  io.emit('webhookEvent', webhookData);

  res.status(200).send('Webhook received successfully');
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});
```

Here, we use **`socket.io`** to emit the `webhookEvent` to all connected clients.

---

#### **Step 3: Set Up the React App to Listen for WebSocket Messages**

1. **Install `socket.io-client` in React**:

```bash
npm install socket.io-client
```

2. **Connect React App to WebSocket**:

```javascript
// WebhookListener.js (React component)

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const WebhookListener = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Connect to the WebSocket server (Node.js)
    const socket = io('http://localhost:5000');

    // Listen for 'webhookEvent' from the server
    socket.on('webhookEvent', (data) => {
      console.log('Received webhook data:', data);
      setMessage(data);
    });

    return () => {
      // Clean up the WebSocket connection on component unmount
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Webhook Listener</h1>
      <div>
        {message ? (
          <pre>{JSON.stringify(message, null, 2)}</pre>
        ) : (
          <p>Waiting for webhook data...</p>
        )}
      </div>
    </div>
  );
};

export default WebhookListener;
```

In this example:
- The React component **`WebhookListener`** connects to the Node.js backend using **WebSocket** (`socket.io-client`).
- It listens for events (`'webhookEvent'`) and updates the state when a new message is received.

---

#### **Step 4: Test the Webhook**

1. **Start your Node.js server**:

```bash
node server.js
```

2. **Start your React app**:

```bash
npm start
```

3. **Simulate a Webhook Event**:
   - Use a tool like **Postman** or **curl** to send a POST request to the `/webhook` endpoint with some mock data.

```bash
curl -X POST http://localhost:5000/webhook -H "Content-Type: application/json" -d '{"event": "user_registered", "user": "John Doe"}'
```

4. **React App**: The React app will now receive the webhook data in real time and display it.

---

### **Summary**

- **Backend (Node.js)**: Handles receiving webhook data and sends updates to React via WebSockets.
- **Frontend (React)**: Listens for real-time updates and reacts to the data received.

Webhooks are great for real-time communication between systems. This setup can be extended to handle more complex use cases such as payment notifications, user actions, or any other event that your backend system might want to notify the frontend about.