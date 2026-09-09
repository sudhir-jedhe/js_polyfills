***  How does Explicit Resource Management with 'using' and Symbol.dispose work in modern JavaScript and TypeScript?.md ***

**Explicit Resource Management** introduces the `using` and `await using` declarations alongside two well-known symbols—**`Symbol.dispose`** and **`Symbol.asyncDispose`**.

It provides deterministic, block-scoped teardown for resources (file handles, database connections, mutex locks, event subscriptions), eliminating the boilerplate and subtle leak risks of manual `try...finally` blocks.

---

### The Problem It Solves: `try...finally` Boilerplate

#### Traditional `try...finally`

```javascript
const handle = openFile('data.txt');
try {
  // If an error happens or function returns early,
  // we must guarantee handle.close() runs.
  processFile(handle);
} finally {
  handle.close();
}

```

#### Modern `using` Declaration

```javascript
{
  using handle = openFile('data.txt');
  processFile(handle); 
} // <- handle[Symbol.dispose]() is invoked automatically here!

```

---

### 1. Synchronous Disposal: `using` & `Symbol.dispose`

Any object implementing a method with the key `Symbol.dispose` is a **Disposable** resource.

When declared with the `using` keyword, its `[Symbol.dispose]()` method is guaranteed to execute when execution leaves the enclosing block scope—whether by normal completion, an early `return`, or a thrown error.

```typescript
// TypeScript / Modern JS
class DatabaseTransaction implements Disposable {
  #id: string;

  constructor(id: string) {
    this.#id = id;
    console.log(`[Tx ${this.#id}] Started.`);
  }

  commit() {
    console.log(`[Tx ${this.#id}] Changes committed.`);
  }

  // The disposal hook
  [Symbol.dispose]() {
    console.log(`[Tx ${this.#id}] Connection closed and cleaned up.`);
  }
}

function executeOrder() {
  using tx = new DatabaseTransaction('tx-101');
  
  tx.commit();
  console.log('Order complete.');
  
  // Scope exits here -> tx[Symbol.dispose]() runs immediately
}

executeOrder();
// Output:
// [Tx tx-101] Started.
// [Tx tx-101] Changes committed.
// Order complete.
// [Tx tx-101] Connection closed and cleaned up.

```

---

### 2. Asynchronous Disposal: `await using` & `Symbol.asyncDispose`

For resources that require asynchronous cleanup (closing network sockets, flushing telemetry streams, waiting for database release), implement `Symbol.asyncDispose` and bind it with **`await using`**.

```typescript
class RedisLock implements AsyncDisposable {
  #lockKey: string;

  constructor(lockKey: string) {
    this.#lockKey = lockKey;
  }

  static async acquire(key: string) {
    console.log(`Lock acquired for ${key}`);
    return new RedisLock(key);
  }

  // Asynchronous cleanup method returning a Promise
  async [Symbol.asyncDispose]() {
    console.log(`Releasing lock for ${this.#lockKey}...`);
    await new Promise((res) => setTimeout(res, 50)); // Simulating network release
    console.log(`Lock for ${this.#lockKey} successfully released.`);
  }
}

async function performAtomicUpdate() {
  // Disposed asynchronously when exiting block
  await using lock = await RedisLock.acquire('inventory-stock');

  console.log('Modifying shared database state...');
}

```

---

### 3. Multiple Disposables & LIFO Disposal Order

When multiple `using` declarations are declared in the same scope, they are disposed in **reverse order of declaration (Last In, First Out / LIFO)**—matching the behavior of nested `try...finally` blocks.

```typescript
function processPipeline() {
  using resA = createResource('A');
  using resB = createResource('B');
  using resC = createResource('C');

  console.log('Work inside block');
  
  // Cleanup order upon block exit:
  // 1. resC[Symbol.dispose]()
  // 2. resB[Symbol.dispose]()
  // 3. resA[Symbol.dispose]()
}

```

---

### 4. Error Handling & `SuppressedError`

If an error is thrown inside the code block **and** an additional error occurs inside `[Symbol.dispose]()`, JavaScript will not overwrite the original root cause. Instead, it wraps both inside a native **`SuppressedError`**:

```javascript
try {
  {
    using badRes = {
      [Symbol.dispose]() {
        throw new Error('Disposal failed'); // Error 2
      }
    };

    throw new Error('Main execution failed'); // Error 1
  }
} catch (e) {
  console.log(e instanceof SuppressedError); // true
  console.log(e.error.message);      // "Disposal failed"
  console.log(e.suppressed.message); // "Main execution failed"
}

```

---

### 5. Managing Dynamic Resources: `DisposableStack`

If you are acquiring a variable number of resources dynamically (e.g., inside a loop), use the built-in **`DisposableStack`** (or `AsyncDisposableStack`):

```typescript
function openMultipleFiles(filePaths: string[]) {
  using stack = new DisposableStack();

  const handles = filePaths.map((path) => {
    const handle = openFile(path);
    // Register individual disposable or manual cleanup callback
    stack.use(handle);
    return handle;
  });

  // You can also register custom teardown functions:
  stack.defer(() => console.log('All files flushed.'));

  // When scope exits, the stack disposes all registered resources in LIFO order
}

```

---

### TypeScript Configuration & Polyfills

To use this feature in TypeScript:

1. Ensure TypeScript version is `5.2+`.
2. Update `tsconfig.json` to include the DOM/ESNext disposable library definitions:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "ESNext.Disposable", "DOM"]
  }
}

```

For runtimes lacking native `Symbol.dispose` support, include standard polyfills such as `core-js` or `@ungap/with-resolvers`.
