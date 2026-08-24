The **Dependency Inversion Principle (DIP)** states that high-level modules should not depend on low-level modules; both should depend on abstractions (interfaces).

When two concrete modules directly depend on each other, they create a circular reference (`A -> B -> A`). By introducing an **interface (abstraction)** and using **Dependency Injection (DI)**, you flip the dependency direction and transform the cyclic graph into a linear, acyclic graph.

---

### The Problem: Direct Concrete Coupling (Cycle)

Consider an `OrderService` that creates orders and calls `NotificationService`, while `NotificationService` checks order statuses by calling `OrderService`.

```
[OrderService.ts] ──imports (direct)──► [NotificationService.ts]
        ▲                                          │
        └──────────────imports (direct)────────────┘
                  (Circular Dependency!)

```

```typescript
// notificationService.ts
import { orderService } from './orderService'; // ❌ Cycle link 1

export class NotificationService {
  sendOrderConfirmation(orderId: string) {
    const status = orderService.getOrderStatus(orderId);
    console.log(`Sending confirmation for order ${orderId} (Status: ${status})`);
  }
}
export const notificationService = new NotificationService();

```

```typescript
// orderService.ts
import { notificationService } from './notificationService'; // ❌ Cycle link 2

export class OrderService {
  createOrder(id: string) {
    console.log(`Order ${id} created.`);
    notificationService.sendOrderConfirmation(id);
  }

  getOrderStatus(id: string) {
    return 'COMPLETED';
  }
}
export const orderService = new OrderService();

```

---

### The Fix: Inverting the Dependency via Interfaces & DI

Instead of `NotificationService` depending directly on the concrete `OrderService` class, we:

1. Define an abstraction (`IOrderProvider`) in a shared contract/interface file.
2. Make `NotificationService` depend solely on the interface.
3. Inject the concrete implementation at runtime via its constructor (Dependency Injection).

```
                      ┌───────────────────────┐
                      │    IOrderProvider     │ (Interface / Contract)
                      └───────────▲───────────┘
                                  │ (implements & type reference)
                 ┌────────────────┴────────────────┐
                 │                                 │
     [OrderService.ts]                 [NotificationService.ts]
  (Implements interface)               (Depends ONLY on interface)
                 │                                 ▲
                 └──────────────creates────────────┘
                        (One-way dependency)

```

---

### Step-by-Step Implementation

#### Step 1: Create the Abstract Contract (`contracts.ts` / `types.ts`)

Since TypeScript interfaces have **zero runtime overhead** (they are stripped during compilation), importing them cannot cause runtime circular initialization errors (TDZ).

```typescript
// contracts.ts
export interface IOrderProvider {
  getOrderStatus(orderId: string): string;
}

export interface INotificationService {
  sendOrderConfirmation(orderId: string): void;
}

```

#### Step 2: Implement the Independent Consumer with DI (`notificationService.ts`)

`NotificationService` now depends only on the contract. It has **no import** referencing `orderService.ts`.

```typescript
// notificationService.ts
import type { IOrderProvider, INotificationService } from './contracts';

export class NotificationService implements INotificationService {
  // Inject dependency via constructor
  constructor(private readonly orderProvider: IOrderProvider) {}

  sendOrderConfirmation(orderId: string): void {
    const status = this.orderProvider.getOrderStatus(orderId);
    console.log(`Sending confirmation for order ${orderId} (Status: ${status})`);
  }
}

```

#### Step 3: Implement the Concrete Provider (`orderService.ts`)

`OrderService` implements `IOrderProvider` and receives the notification service instance (or receives it when needed).

```typescript
// orderService.ts
import type { IOrderProvider, INotificationService } from './contracts';

export class OrderService implements IOrderProvider {
  private notificationService?: INotificationService;

  setNotificationService(notificationService: INotificationService): void {
    this.notificationService = notificationService;
  }

  createOrder(id: string): void {
    console.log(`Order ${id} created.`);
    this.notificationService?.sendOrderConfirmation(id);
  }

  getOrderStatus(id: string): string {
    return 'COMPLETED';
  }
}

```

#### Step 4: Wire Up at the Composition Root (`main.ts` or IoC Container)

Instantiate and wire up the dependencies in an entry point:

```typescript
// main.ts
import { OrderService } from './orderService';
import { NotificationService } from './notificationService';

// 1. Instantiate the provider
const orderService = new OrderService();

// 2. Inject order provider into notification service
const notificationService = new NotificationService(orderService);

// 3. Connect consumer
orderService.setNotificationService(notificationService);

// 4. Run application
orderService.createOrder('ORD-101');

```

---

### Using an IoC Container (e.g., TSyringe / InversifyJS)

When using modern Dependency Injection frameworks in TypeScript, circular references are resolved seamlessly using token injection and delayed property resolution:

```typescript
import { injectable, inject, container, delay } from 'tsyringe';
import type { IOrderProvider } from './contracts';

@injectable()
export class NotificationService {
  constructor(
    // `delay()` resolves the cyclic dependency lazily at runtime
    @inject(delay(() => OrderService)) private orderService: IOrderProvider
  ) {}
}

```

---

### Key Benefits

* **Zero Cycles:** The dependency graph becomes strictly acyclic and linear.
* **Independent Testability:** `NotificationService` can now be unit-tested in complete isolation by passing a mock object `{ getOrderStatus: () => 'PENDING' }` without instantiating `OrderService`.
* **Safe Runtime Execution:** Eliminates runtime `ReferenceError` (TDZ) and `undefined is not a function` errors caused by bundlers trying to evaluate circular modules.