*** copy Event driven architecture.md ***

**Event-Driven Architecture (EDA)** in JavaScript is a design pattern where the flow of execution is determined by **events**—actions, state changes, messages, or user interactions—which are emitted by **producers** and reacted to by **consumers (listeners/handlers)** without the components being tightly coupled.

---

### Core Concepts

* **Event:** A signal indicating that something happened (e.g., `'user_registered'`, `'click'`, `'data_received'`).
* **Emitter / Producer:** The component that detects an action and triggers an event with an optional data payload.
* **Listener / Consumer / Subscriber:** The component that registers a callback function to handle an event when triggered.
* **Event Channel / Broker:** The intermediary registry that routes events from emitters to interested listeners.

---

### The Three Levels of EDA in JavaScript

#### 1. In the Browser (DOM Events)

The browser uses an event-driven model for UI and lifecycle events using `EventTarget` (`addEventListener` / `dispatchEvent`).

```javascript
const button = document.querySelector("#checkout-btn");

// Consumer/Subscriber
button.addEventListener("click", (event) => {
  console.log("Processing payment for click at coordinate:", event.clientX);
});

// Custom Event Producer
const orderEvent = new CustomEvent("orderPlaced", { detail: { orderId: 4521 } });
window.dispatchEvent(orderEvent);

```

---

#### 2. In Node.js (`EventEmitter`)

Node.js core is built around the `EventEmitter` module. Streams, HTTP servers, sockets, and file system watchers all inherit from `EventEmitter`.

```javascript
import EventEmitter from "node:events";

class OrderService extends EventEmitter {
  placeOrder(orderData) {
    console.log("Order saved to database:", orderData.id);
    
    // Emit event asynchronously or synchronously
    this.emit("order:created", orderData);
  }
}

const orderService = new OrderService();

// Subscribed Service 1: Email
orderService.on("order:created", (order) => {
  console.log(`[Email Service] Sending receipt to ${order.customerEmail}`);
});

// Subscribed Service 2: Inventory
orderService.on("order:created", (order) => {
  console.log(`[Inventory Service] Reserving stock for item: ${order.itemId}`);
});

// Trigger the workflow
orderService.placeOrder({ id: "ORD-99", itemId: "SKU-102", customerEmail: "dev@example.com" });

```

---

#### 3. Distributed / Microservices (Message Brokers)

In backend architectures, distributed services produce and consume events over message brokers (e.g., Redis Pub/Sub, RabbitMQ, Apache Kafka, AWS EventBridge).

```
[ Frontend API ] ──(HTTP POST)──> [ Order Service ]
                                         │
                                   (Publishes Event)
                                         ▼
                             [ Kafka / RabbitMQ Topic ]
                                 │                │
                      ┌──────────┴────────┐       └───────────┐
                      ▼                                       ▼
            [ Notification Service ]                 [ Analytics Service ]

```

---

### Implementing a Custom Event Bus (Pub/Sub)

Building a lightweight Pub/Sub system is a frequent coding interview question:

```javascript
class EventBus {
  constructor() {
    this.events = new Map();
  }

  // Subscribe to an event
  subscribe(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);

    // Return an unsubscribe cleanup function
    return () => {
      this.events.get(event).delete(callback);
      if (this.events.get(event).size === 0) {
        this.events.delete(event);
      }
    };
  }

  // Publish / Emit an event
  publish(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach((callback) => {
      try {
        callback(data);
      } catch (err) {
        console.error(`Error in listener for ${event}:`, err);
      }
    });
  }

  // One-time subscription
  once(event, callback) {
    const unsubscribe = this.subscribe(event, (data) => {
      unsubscribe();
      callback(data);
    });
  }
}

// Usage
const bus = new EventBus();
const unsubscribeEmail = bus.subscribe("user:signup", (user) => {
  console.log(`Welcome email sent to ${user.name}`);
});

bus.publish("user:signup", { name: "Kiara" });
unsubscribeEmail(); // Detaches the listener

```

---

### Pros & Cons

| Advantages                                                                                                              | Challenges & Trade-offs                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Loose Coupling:** Producers have zero awareness of who is listening or how many listeners exist.                      | **Harder Traceability:** Following the control flow across multiple emitted events can be tricky during debugging.                |
| **Extensibility:** Add new features (e.g., analytics, push notifications) without modifying the original producer code. | **Memory Leaks:** Forgetting to remove listeners (`removeListener` / `unsubscribe`) prevents garbage collection.                  |
| **Asynchronous Non-Blocking:** Supports resilient architectures where long-running processes run independently.         | **Event Ordering & Failures:** Ensuring delivery guarantees (at-least-once, exactly-once) in distributed brokers adds complexity. |
