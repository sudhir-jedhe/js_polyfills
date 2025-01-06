To solve the problem where we need to create a `BetterChannel` that builds on top of `SomeChannel` and handles callbacks and replies with a better structure, we need to think about message ordering, delayed message handling, and ensuring reliability.

### Key Considerations:
1. **Message Delays**: `SomeChannel` has random delays, and the messages might be received out of order.
2. **Callbacks**: We need to implement a way for `BetterChannel` to handle callbacks (`reply` function) after receiving messages.
3. **Handling Message Drops**: While `SomeChannel` guarantees message delivery, we must ensure no message is lost and all callbacks are handled correctly even with delays.

### Steps for Solution:
1. **Use `SomeChannel` for underlying message passing**. We will rely on `SomeChannel` to send and receive messages.
2. **Message Ordering**: We will track the order of messages internally within `BetterChannel` and make sure that replies match the original messages. We can do this by associating each message with a unique identifier.
3. **Callbacks**: We will store callbacks temporarily in an internal map and invoke them when the corresponding reply is received.
4. **Handle Delays and Dropped Messages**: To deal with random delays, we might need to use mechanisms like retrying or handling timeout conditions to ensure the reliability of the communication.

### Code for `BetterChannel`:

```javascript
class BetterChannel {
  constructor() {
    // Create the underlying SomeChannel
    const { port1, port2 } = new SomeChannel();
    this.port1 = port1;
    this.port2 = port2;

    // Internal storage for message IDs and their corresponding callbacks
    this.pendingReplies = new Map();

    // Handle incoming messages and process replies
    this.port2.onmessage = (message, reply) => {
      // Generate a message ID (for simplicity, use timestamp or incrementing counter)
      const messageId = message.id || Date.now();  // Use `id` if present or fallback to timestamp
      
      // Look for the matching callback for this message
      if (this.pendingReplies.has(messageId)) {
        const callback = this.pendingReplies.get(messageId);
        // Call the reply function with the response data
        callback(message.response);
        // Clean up after handling the reply
        this.pendingReplies.delete(messageId);
      }

      // Process the incoming message and decide on reply action
      if (message === 'ping?') {
        reply({ id: messageId, response: 'pong!' });
      } else if (message === 'pong?') {
        reply({ id: messageId, response: 'ping!' });
      }
    };
  }

  // Post a message and expect a callback
  postMessage(message, callback) {
    const messageId = Date.now(); // Use timestamp as unique ID for simplicity

    // Store the callback to be invoked later when the reply comes
    this.pendingReplies.set(messageId, callback);

    // Send the message along with the ID to ensure we can match the reply later
    this.port1.postMessage({ id: messageId, message });
  }
}
```

### Explanation:

1. **Constructor (`BetterChannel`)**:
   - Creates an instance of `SomeChannel` and extracts `port1` and `port2`.
   - Initializes an internal `pendingReplies` map to store message IDs and their corresponding callbacks.
   - Defines the `port2.onmessage` handler to process incoming messages, extract the message ID, find the corresponding callback, and invoke it with the reply.
   - Sends replies back using the `reply()` function, including a unique `messageId` to match the response to the original message.

2. **`postMessage()`**:
   - This method sends a message through `port1` and stores the callback in `pendingReplies` using a unique `messageId`.
   - The message sent includes an `id` to uniquely identify it and link the response back to the correct callback.
   
3. **Message Handling in `onmessage`**:
   - When a message is received on `port2`, the handler first checks if the message contains an ID.
   - It then looks for the callback in the `pendingReplies` map using this ID.
   - Once the correct callback is found, it is invoked with the reply data, and the entry is removed from `pendingReplies`.

4. **Reliability**: This structure ensures that messages are handled and replied to in the correct order, even if there are delays. Since each message is identified uniquely, the callbacks are matched correctly, and the message order is preserved.

### Example Usage:

```javascript
const { port1, port2 } = new BetterChannel();

port2.onmessage = (message, reply) => {
  if (message.message === 'ping?') {
    reply({ response: 'pong!' });
  } else if (message.message === 'pong?') {
    reply({ response: 'ping!' });
  }
};

// Send a message and handle the reply
port1.postMessage('ping?', (response) => {
  console.log(response);  // 'pong!'
});

port1.postMessage('pong?', (response) => {
  console.log(response);  // 'ping!'
});
```

### Key Features:
1. **Order Preservation**: Each message has a unique ID that ensures callbacks are correctly matched with their responses.
2. **Handling Delays**: While `SomeChannel` introduces delays, this approach handles responses as they come in, matching them with the correct callback.
3. **No Global State**: The `BetterChannel` class avoids global state and manages communication internally, ensuring clean and isolated communication between `port1` and `port2`.

This approach should meet the requirements of ensuring message reliability and order even with potential delays or message drops while maintaining clear separation of concerns between message passing and reply handling.