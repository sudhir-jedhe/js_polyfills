***  How would you manage state shared across multiple micro-frontends?.md ***

Managing shared state across micro-frontends (MFEs) requires a strict boundary: **micro-frontends should be as autonomous and isolated as possible.** Sharing too much state creates a "distributed frontend monolith" where changes in one app break another.

Only share **truly global state** (e.g., authentication session, user profile, active localization/theme, cross-app notifications, or a shopping cart summary). Keep domain-specific state strictly internal to each MFE.

---

### Core Communication & State Patterns

| Pattern                                                 | Best Used For                                              | Framework Agnostic? | Persistence / Replay?    | Coupling Level     |
| ------------------------------------------------------- | ---------------------------------------------------------- | ------------------- | ------------------------ | ------------------ |
| **URL Parameters / Query Strings**                      | Routing, filters, IDs, navigation context                  | Yes                 | Yes (bookmarkable)       | **Lowest (Ideal)** |
| **Custom DOM Events / EventTarget**                     | Event-driven notifications, actions (e.g., "cart updated") | Yes                 | No                       | **Low**            |
| **Browser Storage (`StorageEvent` / IndexedDB)**        | Cross-tab session sync, persistent cart, tokens            | Yes                 | Yes                      | **Low**            |
| **Module Federation Shared Store (RxJS / Nano Stores)** | Reactive, high-frequency state updates (Theme, Auth user)  | Yes                 | Yes (holds latest value) | **Medium**         |
| **Shell / App Container Props**                         | Top-down passing from container shell to child MFEs        | Depends on runtime  | Controlled by shell      | **Medium**         |

---

### 1. The URL: The Primary Source of Truth (Zero Coupling)

Before creating shared state stores, evaluate if the state belongs in the URL (path params, search queries, or hashes):

* E.g., `?tenantId=123&productId=456&theme=dark`
* **Why:** Every framework (React, Vue, Angular, Svelte) knows how to read and observe URL changes without shared dependencies, and it guarantees deep linking and page refresh resilience.

---

### 2. Custom DOM Events / Event Bus (Decoupled & Framework-Agnostic)

Use the browser's native `CustomEvent` and `window.dispatchEvent` for action-based notifications where MFE A notifies the system, and any interested MFE reacts.

```typescript
// Shared Types / Contract (shared via npm package or contract repo)
export interface CartUpdatedEvent {
  itemCount: number;
  total: number;
}

// MFE 1 (Product Page - React/Vue/Vanilla): Dispatching an event
export function publishCartUpdate(cart: CartUpdatedEvent) {
  window.dispatchEvent(
    new CustomEvent<CartUpdatedEvent>('app:cart-updated', {
      detail: cart,
      bubbles: true,
    })
  );
}

// MFE 2 (Header / Navigation Bar): Subscribing to the event
export function subscribeToCart(callback: (data: CartUpdatedEvent) => void) {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CartUpdatedEvent>;
    callback(customEvent.detail);
  };

  window.addEventListener('app:cart-updated', handler);
  return () => window.removeEventListener('app:cart-updated', handler);
}

```

* **Limitation:** Native custom events do not retain current values (late-loading MFEs miss events fired in the past).

---

### 3. Lightweight Shared Observable Stores (Nano Stores / RxJS BehaviorSubject)

When late-joining MFEs must immediately read the **current state** upon mounting (e.g., Auth status, User profile), a framework-agnostic micro-store like **Nano Stores** (~1 KB) or **RxJS `BehaviorSubject**` works well.

#### Implementation with Module Federation & Nano Stores

1. Create a lightweight shared module (`@my-org/shared-state`):

```typescript
// shared-state/index.ts
import { atom } from 'nanostores';

export interface UserSession {
  id: string;
  name: string;
  token: string | null;
  isAuthenticated: boolean;
}

// Holds current value and notifies subscribers on update
export const $userSession = atom<UserSession>({
  id: '',
  name: 'Anonymous',
  token: null,
  isAuthenticated: false,
});

export function setSession(user: UserSession) {
  $userSession.set(user);
}

```

1. Expose and share it as a singleton in **Webpack / Vite Module Federation**:

```javascript
// vite.config.js or webpack.config.js in both Host & Remotes
shared: {
  '@my-org/shared-state': {
    singleton: true,
    strictVersion: false,
  }
}

```

1. Consume in React, Vue, or Svelte via native adapters:

```tsx
// Inside React Remote MFE
import { useStore } from '@nanostores/react';
import { $userSession } from '@my-org/shared-state';

export function UserBadge() {
  const user = useStore($userSession);

  if (!user.isAuthenticated) return <button>Sign In</button>;
  return <span>Welcome, {user.name}</span>;
}

```

---

### 4. Cross-Tab & Cross-Origin Synchronization (`BroadcastChannel` / `StorageEvent`)

If micro-frontends run under different origins or if you want multi-tab synchronization (e.g., logging out in Tab 1 immediately logs out Tab 2):

```typescript
// BroadcastChannel API: Fast, direct cross-MFE and cross-tab bus
const authChannel = new BroadcastChannel('auth_channel');

// MFE Logout Action
export function broadcastLogout() {
  authChannel.postMessage({ type: 'LOGOUT' });
}

// Any MFE Listener
authChannel.onmessage = (event) => {
  if (event.data.type === 'LOGOUT') {
    // Clear local cache & redirect to login
    window.location.reload();
  }
};

```

---

### Architectural Rules for Micro-Frontend State

1. **Avoid Shared Redux / Pinia / Global Monolith Stores:** Sharing a single Redux store across remotes tightly couples their release lifecycles and creates strict framework lock-in.
2. **Strict Versioned Contracts:** Treat shared events and payloads like backend API contracts. Use TypeScript interfaces or JSON schema validation (e.g., Zod) so updates do not silently break sibling MFEs.
3. **Prefer Push/Pull Architecture:** If MFE A needs complex data from MFE B, MFE A should receive an identifier via URL/Event and fetch its own data from the backend/BFF rather than passing massive JSON blobs across JavaScript boundaries.

Managing state across micro-frontends (MFEs) requires balancing **decoupling** (allowing independent deployments and framework agnosticism) with **synchronization** (ensuring consistent user experiences).

The golden rule of micro-frontend architecture is: **Share as little state as possible.** Treat cross-MFE state like cross-service communication in a backend distributed system.

---

### Strategy 1: URL & Route State (Preferred Default)

The URL is the most resilient, decoupled, and framework-agnostic state container available.

* **What to store:** Filters, active tab IDs, pagination, search queries, entity IDs (`/orders/123?tab=billing`).
* **Why it works:** Survives page reloads, enables deep linking, and works seamlessly across React, Vue, Angular, or vanilla JavaScript MFEs.
* **How to implement:** The host/shell shell coordinates routing, or individual MFEs read and write via the standard HTML5 `History API` / `URLSearchParams`.

---

### Strategy 2: Event-Driven Communication (Pub/Sub via Custom Events)

For asynchronous, fire-and-forget interactions where MFEs don't need a heavy shared state tree, standard browser `CustomEvent` interfaces provide clean boundaries.

```typescript
// Shared event definitions contract (published via an internal npm package or shared type contract)
export interface CartUpdatedDetail {
  itemCount: number;
  total: number;
}

// 1. MFE A (Product Catalog): Emits event on add to cart
export function emitCartUpdate(detail: CartUpdatedDetail) {
  window.dispatchEvent(
    new CustomEvent<CartUpdatedDetail>('mfe:cart-updated', { detail })
  );
}

// 2. MFE B (Header/Navigation): Listens to event
export function subscribeToCartUpdates(callback: (data: CartUpdatedDetail) => void) {
  const handler = (e: Event) => callback((e as CustomEvent<CartUpdatedDetail>).detail);
  window.addEventListener('mfe:cart-updated', handler);
  return () => window.removeEventListener('mfe:cart-updated', handler);
}

```

* **Best for:** Cross-cutting actions (e.g., "User added item to cart", "User logged out", "Notification triggered").
* **Benefits:** Zero shared runtime dependencies, strict contract isolation.

---

### Strategy 3: Global Event Bus / Observable Store (Reactive State)

If micro-frontends need to access the *current value* on initial mount (which raw `CustomEvent` misses if emitted before an MFE boots), use an observable store (e.g., RxJS `BehaviorSubject` or a small custom pub/sub store on `window`).

```typescript
// Shared Shell / Global API (e.g. window.__APP_CONTEXT__)
class SharedStore<T> {
  private state: T;
  private listeners = new Set<(state: T) => void>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState = () => this.state;

  setState = (partial: Partial<T>) => {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  };

  subscribe = (listener: (state: T) => void) => {
    this.listeners.add(listener);
    listener(this.state); // Immediate emission on subscribe
    return () => this.listeners.delete(listener);
  };
}

// Attach to root window scope
window.__AUTH_STORE__ = new SharedStore({ user: null, token: null });

```

**Inside a React MFE:** Connect directly to this global store using `useSyncExternalStore` for tear-free rendering:

```tsx
import { useSyncExternalStore } from 'react';

export function UserBadge() {
  const auth = useSyncExternalStore(
    window.__AUTH_STORE__.subscribe,
    window.__AUTH_STORE__.getState
  );

  return <div>{auth.user ? `Hello, ${auth.user.name}` : 'Sign In'}</div>;
}

```

---

### Strategy 4: Module Federation Shared Stores (Zustand / Redux / Single-Spa)

If you are using **Webpack Module Federation** or **Vite Module Federation** and all MFEs are React-based:

* Configure Module Federation `shared` scope with `singleton: true` for the state management library and the shared store container.
* **Warning:** Tight coupling. If one MFE updates its state schema, it can break another MFE. Use strict semantic versioning for the shared store module.

```javascript
// webpack.config.js
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        cartMFE: 'cartMFE@https://cdn.example.com/cart/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        zustand: { singleton: true }, // Ensures single shared memory instance
      },
    }),
  ],
};

```

---

### Decision Matrix

| State Type                  | Examples                                     | Recommended Solution                                                          |
| --------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| **Navigation & Query**      | Search filters, active page, sorting         | **URL / Query Params**                                                        |
| **Ephemeral Notifications** | Toast triggers, tracking events, modal opens | **Custom DOM Events (`CustomEvent`)**                                         |
| **Global Session & Auth**   | User profile, auth tokens, permissions       | **`window` Store + `useSyncExternalStore**`                                   |
| **Server/Backend Cache**    | Product inventory, order history             | **Independent React Query / SWR per MFE** (with shared cache key conventions) |
| **Domain-Specific State**   | Checkout steps, form multi-steps             | **Keep Internal to that MFE**                                                 |

---

### Best Practices & Pitfalls to Avoid

* **Do not build a monolithic shared store:** Storing everything in a single global Redux tree eliminates the deployment independence that micro-frontends were chosen for.
* **Treat shared state contracts like APIs:** Document and type all cross-MFE events and state structures with TypeScript interfaces published in an internal library.
* **Clean up event listeners:** Always remove event listeners when MFEs unmount to prevent memory leaks in Single Page Application (SPA) shells.

Here is a production-ready, type-safe Cross-Micro-Frontend (MFE) Event Bus implementation. It attaches a singleton instance to the global `window` object to work seamlessly across independent builds, Module Federation boundaries, or different framework runtimes.

---

### Step 1: Define the Shared Event Contract

Publish this contract via an internal `@company/mfe-events` package so all teams share the same strongly-typed schema.

```typescript
// packages/mfe-events/src/events.ts

export interface MfeEventMap {
  // Auth Events
  'auth:login': { userId: string; role: 'admin' | 'user'; token: string };
  'auth:logout': undefined;

  // Cart Events
  'cart:item-added': { productId: string; quantity: number; price: number };
  'cart:cleared': undefined;

  // UI / Global Notifications
  'ui:toast': { message: string; type: 'success' | 'error' | 'info'; durationMs?: number };
}

export type EventKey = keyof MfeEventMap;
export type EventPayload<K extends EventKey> = MfeEventMap[K];
export type EventHandler<K extends EventKey> = (
  payload: EventPayload<K>,
  meta: EventMetadata
) => void;

export interface EventMetadata {
  timestamp: number;
  sourceMfe: string;
}

```

---

### Step 2: Implement the Event Bus Core

This class handles subscription tracking, error isolation (so one faulty subscriber won't crash others), and history replay for late-mounting MFEs.

```typescript
// packages/mfe-events/src/EventBus.ts
import { EventKey, EventPayload, EventHandler, EventMetadata, MfeEventMap } from './events';

declare global {
  interface Window {
    __MFE_EVENT_BUS__?: MfeEventBus;
  }
}

export class MfeEventBus {
  private listeners: Map<EventKey, Set<EventHandler<any>>> = new Map();
  private lastEmitted: Map<EventKey, { payload: any; meta: EventMetadata }> = new Map();

  /**
   * Publish an event to all subscribers.
   */
  emit<K extends EventKey>(
    event: K,
    ...args: EventPayload<K> extends undefined ? [payload?: undefined, sourceMfe?: string] : [payload: EventPayload<K>, sourceMfe?: string]
  ): void {
    const [payload, sourceMfe = 'unknown-mfe'] = args;
    const meta: EventMetadata = { timestamp: Date.now(), sourceMfe };

    // Cache the latest value for sticky/replay subscriptions
    this.lastEmitted.set(event, { payload, meta });

    const handlers = this.listeners.get(event);
    if (!handlers || handlers.size === 0) return;

    // Isolate subscriber execution to prevent cascading errors
    handlers.forEach((handler) => {
      try {
        handler(payload, meta);
      } catch (err) {
        console.error(`[MfeEventBus] Error in listener for event "${String(event)}" from "${sourceMfe}":`, err);
      }
    });
  }

  /**
   * Subscribe to an event. Returns an unsubscribe cleanup function.
   */
  on<K extends EventKey>(
    event: K,
    handler: EventHandler<K>,
    options?: { replayLast?: boolean }
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    const handlers = this.listeners.get(event)!;
    handlers.add(handler);

    // If requested, immediately fire with the last known event state
    if (options?.replayLast && this.lastEmitted.has(event)) {
      const cached = this.lastEmitted.get(event)!;
      try {
        handler(cached.payload, cached.meta);
      } catch (err) {
        console.error(`[MfeEventBus] Error in replayed listener for event "${String(event)}":`, err);
      }
    }

    // Unsubscribe function
    return () => {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Subscribe to an event exactly once.
   */
  once<K extends EventKey>(event: K, handler: EventHandler<K>): () => void {
    const unsubscribe = this.on(event, (payload, meta) => {
      unsubscribe();
      handler(payload, meta);
    });
    return unsubscribe;
  }

  /**
   * Clear all subscribers (useful during teardown / testing).
   */
  clear(): void {
    this.listeners.clear();
    this.lastEmitted.clear();
  }
}

// Global Singleton Factory to survive multi-bundle instantiation
export function getEventBus(): MfeEventBus {
  if (typeof window !== 'undefined') {
    if (!window.__MFE_EVENT_BUS__) {
      window.__MFE_EVENT_BUS__ = new MfeEventBus();
    }
    return window.__MFE_EVENT_BUS__;
  }
  return new MfeEventBus(); // Fallback for SSR / Node environment
}

export const eventBus = getEventBus();

```

---

### Step 3: Create a Custom React Hook for Consumers

To ensure automatic cleanup when React components unmount, create a wrapper hook.

```typescript
// packages/mfe-events/src/useMfeEvent.ts
import { useEffect, useRef } from 'react';
import { EventKey, EventHandler, EventPayload } from './events';
import { eventBus } from './EventBus';

export function useMfeEventListener<K extends EventKey>(
  event: K,
  handler: EventHandler<K>,
  options?: { replayLast?: boolean }
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const listener: EventHandler<K> = (payload, meta) => {
      handlerRef.current(payload, meta);
    };

    const unsubscribe = eventBus.on(event, listener, options);
    return () => unsubscribe();
  }, [event, options?.replayLast]);
}

export function useMfeEmitter(sourceMfe: string) {
  return {
    emit: <K extends EventKey>(
      event: K,
      ...args: EventPayload<K> extends undefined ? [payload?: undefined] : [payload: EventPayload<K>]
    ) => {
      const [payload] = args;
      eventBus.emit(event, payload as any, sourceMfe);
    },
  };
}

```

---

### Step 4: Usage in Different Micro-Frontends

#### MFE A (Product Catalog - Emits Event)

```tsx
import React from 'react';
import { useMfeEmitter } from '@company/mfe-events';

export function AddToCartButton({ productId, price }: { productId: string; price: number }) {
  const { emit } = useMfeEmitter('catalog-mfe');

  const handleClick = () => {
    emit('cart:item-added', {
      productId,
      quantity: 1,
      price,
    });

    emit('ui:toast', {
      message: 'Item added to cart!',
      type: 'success',
    });
  };

  return <button onClick={handleClick}>Add to Cart</button>;
}

```

#### MFE B (Header / Cart Badge - Listens to Event)

```tsx
import React, { useState } from 'react';
import { useMfeEventListener } from '@company/mfe-events';

export function CartBadge() {
  const [count, setCount] = useState(0);

  // Automatically cleans up on unmount
  useMfeEventListener('cart:item-added', (payload, meta) => {
    setCount((prev) => prev + payload.quantity);
  });

  useMfeEventListener('cart:cleared', () => {
    setCount(0);
  });

  return <div className="badge">Cart Items: {count}</div>;
}

```

---

### Key Architectural Advantages

* **Type Safety Across Repositories:** TypeScript validates the payload structure and prevents emitting or listening to invalid event names.
* **Resilient to Cross-Bundle Splitting:** `window.__MFE_EVENT_BUS__` ensures that even if two MFEs bundle separate copies of `@company/mfe-events`, they still talk to the same shared memory registry.
* **Sticky/Replay Support (`replayLast`):** Late-mounting MFEs can immediately read the last known event state without waiting for a new action.
* **Error Containment:** If an exception is thrown inside one MFE's event listener, it is caught and logged without aborting other listeners or crashing the emitting MFE.

Here is the extended architecture adding **RxJS reactive operators** and cross-tab/window synchronization via the **`BroadcastChannel` API**.

---

### Step 1: Extended Event Bus with `BroadcastChannel` and RxJS `Subject`

This implementation uses an RxJS `Subject` per event key, handles circular event echo prevention across browser tabs, and exposes standard observables.

```typescript
// packages/mfe-events/src/RxBroadcastEventBus.ts
import { Subject, Observable, filter, map } from 'rxjs';
import { EventKey, EventPayload, EventMetadata, MfeEventMap } from './events';

export interface BusEnvelope<K extends EventKey = EventKey> {
  event: K;
  payload: EventPayload<K>;
  meta: EventMetadata & { tabId: string };
}

// Generate unique session tab identifier
const TAB_ID = typeof crypto !== 'undefined' && crypto.randomUUID 
  ? crypto.randomUUID() 
  : `tab_${Math.random().toString(36).substring(2, 9)}`;

export class RxBroadcastEventBus {
  private stream$ = new Subject<BusEnvelope<any>>();
  private channel: BroadcastChannel | null = null;
  private lastEmitted = new Map<EventKey, BusEnvelope<any>>();

  constructor(channelName = 'mfe_cross_tab_bus') {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(channelName);
      
      // Listen for messages broadcasted from other browser tabs
      this.channel.onmessage = (messageEvent: MessageEvent<BusEnvelope<any>>) => {
        const envelope = messageEvent.data;
        // Ignore events originated from this exact tab instance
        if (envelope && envelope.meta?.tabId !== TAB_ID) {
          this.dispatchLocal(envelope, false);
        }
      };
    }
  }

  /**
   * Internal local dispatcher
   */
  private dispatchLocal<K extends EventKey>(envelope: BusEnvelope<K>, broadcast: boolean): void {
    this.lastEmitted.set(envelope.event, envelope);
    this.stream$.next(envelope);

    if (broadcast && this.channel) {
      try {
        this.channel.postMessage(envelope);
      } catch (err) {
        console.error(`[RxBroadcastEventBus] Failed to broadcast event "${String(envelope.event)}":`, err);
      }
    }
  }

  /**
   * Emit an event locally and across tabs
   */
  emit<K extends EventKey>(
    event: K,
    ...args: EventPayload<K> extends undefined 
      ? [payload?: undefined, sourceMfe?: string, crossTab?: boolean] 
      : [payload: EventPayload<K>, sourceMfe?: string, crossTab?: boolean]
  ): void {
    const [payload, sourceMfe = 'unknown-mfe', crossTab = true] = args;
    const envelope: BusEnvelope<K> = {
      event,
      payload: payload as EventPayload<K>,
      meta: {
        timestamp: Date.now(),
        sourceMfe,
        tabId: TAB_ID,
      },
    };

    this.dispatchLocal(envelope, crossTab);
  }

  /**
   * Returns an RxJS Observable for a specific event key
   */
  on$<K extends EventKey>(event: K): Observable<{ payload: EventPayload<K>; meta: EventMetadata }> {
    return this.stream$.pipe(
      filter((envelope): envelope is BusEnvelope<K> => envelope.event === event),
      map(({ payload, meta }) => ({ payload, meta }))
    );
  }

  /**
   * Close channel connections and complete streams (for testing/cleanup)
   */
  destroy(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.stream$.complete();
    this.lastEmitted.clear();
  }
}

// Global Singleton Factory
declare global {
  interface Window {
    __MFE_RX_BUS__?: RxBroadcastEventBus;
  }
}

export function getRxEventBus(): RxBroadcastEventBus {
  if (typeof window !== 'undefined') {
    if (!window.__MFE_RX_BUS__) {
      window.__MFE_RX_BUS__ = new RxBroadcastEventBus();
    }
    return window.__MFE_RX_BUS__;
  }
  return new RxBroadcastEventBus();
}

export const rxEventBus = getRxEventBus();

```

---

### Step 2: Custom React Hook for RxJS Pipeline Execution

Create a hook that lets components subscribe directly via standard RxJS operator chains (`debounceTime`, `distinctUntilChanged`, `throttleTime`, etc.) with automatic subscription management.

```typescript
// packages/mfe-events/src/useMfeStream.ts
import { useEffect, useRef } from 'react';
import { Observable, Subscription } from 'rxjs';
import { EventKey, EventPayload, EventMetadata } from './events';
import { rxEventBus } from './RxBroadcastEventBus';

export function useMfeStream<K extends EventKey, R = { payload: EventPayload<K>; meta: EventMetadata }>(
  event: K,
  transform: (observable$: Observable<{ payload: EventPayload<K>; meta: EventMetadata }>) => Observable<R>,
  onNext: (data: R) => void
) {
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;

  useEffect(() => {
    const raw$ = rxEventBus.on$(event);
    const transformed$ = transform(raw$);

    const subscription: Subscription = transformed$.subscribe({
      next: (data) => onNextRef.current(data),
      error: (err) => console.error(`[useMfeStream] Stream error for "${String(event)}":`, err),
    });

    return () => subscription.unsubscribe();
  }, [event]);
}

```

---

### Step 3: Practical Examples in Micro-Frontends

#### Example A: Cross-Tab Auth Synchronization (Auto-Logout Across All Open Tabs)

When a user logs out in Tab 1, Tab 2 detects it via `BroadcastChannel` and clears local state immediately:

```tsx
// MFE: Auth Header Component (All open tabs)
import React from 'react';
import { useMfeStream } from '@company/mfe-events';

export function AuthStatusHeader() {
  useMfeStream(
    'auth:logout',
    (stream$) => stream$, // Direct pass-through
    () => {
      // Runs automatically across all open tabs/windows
      console.log('Detected logout from another tab. Redirecting...');
      window.location.href = '/login';
    }
  );

  return <header>Dashboard</header>;
}

```

#### Example B: RxJS Rate-Limiting & Buffering (Product Search / Analytics)

Debounce search telemetry or batch rapid clicks before making API calls:

```tsx
// MFE: Analytics Tracker
import React from 'react';
import { debounceTime, bufferTime, filter } from 'rxjs';
import { useMfeStream } from '@company/mfe-events';

export function AnalyticsListener() {
  // Batch rapid cart additions into a single analytics beacon every 5 seconds
  useMfeStream(
    'cart:item-added',
    (stream$) =>
      stream$.pipe(
        bufferTime(5000),
        filter((batch) => batch.length > 0)
      ),
    (batchedEvents) => {
      console.log(`Sending batched analytics payload (${batchedEvents.length} items):`, batchedEvents);
      navigator.sendBeacon('/api/analytics/cart-batch', JSON.stringify(batchedEvents));
    }
  );

  return null;
}

```

---

### Key Architectural Strengths

* **Zero Polling Overhead:** `BroadcastChannel` transmits messages across tabs on the same origin with native OS IPC speed without hitting `localStorage` storage events.
* **Echo Protection:** `TAB_ID` tagging prevents a tab from receiving and re-executing its own broadcasted messages.
* **Declarative Async Pipelines:** By exposing RxJS observables, consuming MFEs can manipulate incoming event streams using operators (`switchMap`, `debounceTime`, `exhaustMap`, `retry`) without writing custom timer or tracking logic.
