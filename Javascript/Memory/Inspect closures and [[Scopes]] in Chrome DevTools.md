You can inspect closures and their internal `[[Scopes]]` array in Chrome DevTools using two primary approaches: **live breakpoint debugging** in the Sources panel or **logging function instances** directly in the Console.

---

### Setup Code Example

Paste this snippet into your browser console or a local script:

```javascript
function makeAccount(accountHolder) {
  let balance = 1500;
  const bankCode = "HDFC001"; // Never accessed by inner functions -> pruned by V8

  function deposit(amount) {
    balance += amount;
    return `${accountHolder}, new balance: ${balance}`;
  }

  return deposit;
}

const myDeposit = makeAccount("Kiara");

```

---

### Method 1: Inspecting via the Console (`[[Scopes]]`)

Chrome DevTools exposes internal V8 engine slots wrapped in double brackets (`[[...]]`).

1. Open **Chrome DevTools** (`F12` or `Cmd + Option + I` / `Ctrl + Shift + I`).
2. Go to the **Console** tab.
3. Type the function variable name: `console.dir(myDeposit)` or simply `myDeposit` and press **Enter**.
4. Expand the returned function object:

* Look down the properties list for **`[[Scopes]]`**.
* Expand `[[Scopes]]: Scopes[2]`.

```text
▼ deposit(amount)
  ► arguments: null
  ► caller: null
  ► length: 1
  ► name: "deposit"
  ▼ [[Scopes]]: Scopes[2]
    ▼ 0: Closure (makeAccount)
        accountHolder: "Kiara"
        balance: 1500
    ► 1: Global {window: Window, ...}

```

**What to notice:**

* **`Closure (makeAccount)`:** Holds only the variables that the inner function actually referenced (`accountHolder` and `balance`).
* **V8 Optimization:** Notice that `bankCode` is completely omitted from the closure `Context`. V8 parses the AST and prunes unreferenced variables from the heap context to conserve memory.

---

### Method 2: Inspecting via the Sources Panel (Live Scope Chain)

To view the closure during active execution:

1. Go to the **Sources** tab.
2. Place a breakpoint inside the inner function (e.g., on the `balance += amount;` line).
3. Call the function in the Console: `myDeposit(500)`.
4. Execution will pause. Look at the right-hand **Scope** pane:

```text
▼ Scope
  ▼ Local
      amount: 500
      this: Window
  ▼ Closure (makeAccount)
      accountHolder: "Kiara"
      balance: 1500
  ▼ Global
      ...

```

* **Local:** Variables created within the current execution frame (`amount`).
* **Closure (`makeAccount`):** The persistent heap-allocated context retained across invocations.
* **Live mutation:** Double-click on `balance` in the DevTools Scope pane, change `1500` to `5000`, and resume execution (`F8`)—the function will execute using the updated closure value.

---

### Method 3: Auditing Retained Closures in Memory Heap Snapshots

If you are debugging a memory leak caused by retained closures:

1. Open the **Memory** tab in DevTools.
2. Select **Heap snapshot** $\rightarrow$ Click **Take snapshot**.
3. In the **Class filter** box, type `Closure` or `system / Context`.
4. Expand `(closure)` to see all retained function scopes and trace their retainers tree to find what object or event listener is preventing garbage collection.
