***  Sub vs Observer Pattern Prevent Node.js EventEmitter memory leaks Design event-driven microservices with Redis.md ***

Compare Pub/Sub vs Observer Pattern
Prevent Node.js EventEmitter memory leaks
Design event-driven microservices with Redis

### 1. Observer Pattern vs. Publish-Subscribe (Pub/Sub)

While both patterns decouple producers from consumers, their architectural boundary is fundamentally different:

```
Observer Pattern (Direct Coupling)
[ Subject ] ──────── (Notifies directly) ────────> [ Observer 1 ]
     │                                            [ Observer 2 ]
     └──────────────────────────────────────────> [ Observer 3 ]

Pub/Sub Pattern (Indirect Coupling via Broker)
[ Publisher ] ──(Publishes)──> [ Event Channel / Broker ] ──(Broadcasts)──> [ Subscriber 1 ]
                                                                           [ Subscriber 2 ]

```

#### Key Differences

| Dimension             | Observer Pattern                                                       | Publish-Subscribe (Pub/Sub)                                                    |
| --------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Intermediary**      | None. The Subject directly manages its observers.                      | Uses a dedicated **Event Bus / Message Broker**.                               |
| **Coupling**          | **Tight/Direct:** Subject maintains references to observers in memory. | **Complete Decoupling:** Publisher and Subscriber never know each other exist. |
| **Execution Context** | Typically synchronous and single-process/in-memory.                    | Cross-component, cross-process, or cross-network (distributed).                |
| **Addressing**        | Observers register directly on the Subject object.                     | Subscribers listen to named **topics/channels**.                               |
| **Example in JS**     | DOM `addEventListener`, MobX observables.                              | Node.js custom EventBus, Redis Pub/Sub, Kafka.                                 |

---

### 2. Preventing Node.js EventEmitter Memory Leaks

Because `EventEmitter` retains references to its listener functions, forgetting to unregister them creates retained object graphs that cannot be garbage collected.

```
EventEmitter instance ──> internal `_events` array ──> listener closure ──> large retained scope/data

```

#### Critical Anti-Patterns & Fixes

**1. Clean up event listeners on lifecycle completion:**

```javascript
import EventEmitter from "node:events";

function setupRequest(emitter) {
  const onData = (data) => console.log(data);
  emitter.on("data", onData);

  // ALWAYS unregister when finished
  return () => emitter.off("data", onData);
}

```

**2. Avoid anonymous inline functions when registering:**

```javascript
// BAD: Impossible to remove because reference is lost
emitter.on("update", () => doSomething());

// GOOD: Use named references
const handleUpdate = () => doSomething();
emitter.on("update", handleUpdate);
// Later:
emitter.removeListener("update", handleUpdate);

```

**3. Use `AbortController` (Modern Node.js 16+ pattern):**

```javascript
const ac = new AbortController();
const { signal } = ac;

// Automatically removes the listener when ac.abort() is called
emitter.on("data", (chunk) => console.log(chunk), { signal });

// Trigger cleanup from anywhere:
ac.abort();

```

**4. Use `.once()` for single-use events:**

```javascript
// Automatically removes itself after the first execution
emitter.once("connectionReady", () => initDatabase());

```

**5. Adjust or monitor `MaxListenersExceededWarning`:**

```javascript
// Default threshold is 10
emitter.setMaxListeners(20);

// Use rawListenerCount to audit potential leaks in tests
console.log(emitter.listenerCount("data"));

```

---

### 3. Designing Event-Driven Microservices with Redis

In distributed backend architectures, Redis can serve as a lightweight event broker using either **Redis Pub/Sub** or **Redis Streams**.

```
                           ┌───> [ Inventory Service ] (Subscriber)
[ API Gateway / Order Service ] ──(PUBLISH 'order.created')──> [ Redis Broker ] ────┼───> [ Notification Service ] (Subscriber)
                                                                                  └───> [ Analytics Service ] (Subscriber)

```

#### When to choose Pub/Sub vs. Streams

* **Redis Pub/Sub (Fire-and-Forget):** Ephemeral messages. If a subscriber service is down or restarts, messages sent during that window are permanently lost. Best for chat apps, live metrics, and real-time UI pushes.
* **Redis Streams (Persistent / Consumer Groups):** Retains messages on disk, supports consumer offset tracking, message acknowledgments (`XACK`), and retry mechanisms. Best for critical business operations like checkout or inventory allocation.

#### Implementation Example (Node.js with `ioredis`)

**Order Service (Publisher):**

```javascript
// orderService.js
import Redis from "ioredis";

const redisPublisher = new Redis({ host: "127.0.0.1", port: 6379 });

export async function createOrder(orderPayload) {
  // 1. Save order to database
  const order = { id: `ORD-${Date.now()}`, ...orderPayload, createdAt: new Date() };

  // 2. Publish event to Redis channel
  const channel = "events:orders";
  await redisPublisher.publish(channel, JSON.stringify({
    type: "ORDER_CREATED",
    data: order
  }));

  return order;
}

```

**Notification Service (Subscriber):**

```javascript
// notificationService.js
import Redis from "ioredis";

// A Redis client in subscriber mode can ONLY issue pub/sub commands
const redisSubscriber = new Redis({ host: "127.0.0.1", port: 6379 });

redisSubscriber.subscribe("events:orders", (err, count) => {
  if (err) console.error("Subscription error:", err);
  else console.log(`Subscribed to ${count} channel(s). Waiting for events...`);
});

redisSubscriber.on("message", (channel, message) => {
  if (channel === "events:orders") {
    const event = JSON.parse(message);
    
    if (event.type === "ORDER_CREATED") {
      console.log(`[Notification Service] Sending email for Order: ${event.data.id} to ${event.data.email}`);
    }
  }
});

```

**Resilience Considerations:**

* **Separate Redis Connections:** A Redis connection put into `SUBSCRIBE` mode enters subscriber state and cannot run regular commands like `GET`/`SET`. Maintain separate client instances for standard queries and pub/sub.
* **Idempotency:** Subscribers must handle duplicate events safely by checking an `idempotencyKey` or `orderId` against a local cache/database before processing.
