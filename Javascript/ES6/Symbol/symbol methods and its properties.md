***  symbol methods and its properties.md ***

In JavaScript, the `Symbol` constructor and its instances provide a small set of **static methods**, **instance properties/methods**, and the **global symbol registry**.

---

### 1. Static Methods (Global Symbol Registry)

The global symbol registry allows you to create and share symbols across different code environments, modules, workers, or iframes.

**`Symbol.for(key)`**
Searches the global symbol registry for an existing symbol with the given `key`. If found, it returns that symbol; otherwise, it creates a new global symbol and registers it under that key.

```javascript
const globalSym1 = Symbol.for('app.config');
const globalSym2 = Symbol.for('app.config');

console.log(globalSym1 === globalSym2); // true (shared reference)

// Standard Symbol() is never shared:
const localSym1 = Symbol('app.config');
console.log(globalSym1 === localSym1);  // false

```

**`Symbol.keyFor(sym)`**
Retrieves the shared string key for a symbol registered in the global registry. Returns `undefined` if the symbol was created via standard `Symbol()`.

```javascript
const globalSym = Symbol.for('user.auth');
const localSym = Symbol('user.auth');

console.log(Symbol.keyFor(globalSym)); // "user.auth"
console.log(Symbol.keyFor(localSym));  // undefined

```

---

### 2. Instance Properties

Every `Symbol` instance inherits properties from `Symbol.prototype`.

**`Symbol.prototype.description` (Read-only)**
Returns the optional description string provided when the symbol was created (or `undefined` if no description was given).

```javascript
const symWithDesc = Symbol('userSessionId');
const symEmpty = Symbol();

console.log(symWithDesc.description); // "userSessionId"
console.log(symEmpty.description);    // undefined

```

---

### 3. Instance Methods

**`Symbol.prototype.toString()`**
Returns a string representation of the symbol (format: `Symbol(description)`).

```javascript
const id = Symbol('account_id');

console.log(id.toString()); // "Symbol(account_id)"

// Implicit string coercion throws a TypeError:
// console.log("ID is: " + id); 
// ❌ TypeError: Cannot convert a Symbol value to a string

```

**`Symbol.prototype.valueOf()`**
Returns the primitive symbol value itself.

```javascript
const sym = Symbol('foo');
console.log(sym.valueOf() === sym); // true

```

**`Symbol.prototype[Symbol.toPrimitive](hint)`**
The internal coercion hook that ensures symbols are only converted to primitives when explicitly requested (e.g., via `String(sym)` or `sym.valueOf()`), while preventing accidental implicit arithmetic or string operations.

```javascript
const sym = Symbol('test');
console.log(String(sym)); // "Symbol(test)"

```

---

### 4. Inspecting Symbols on Objects (Object Reflection Methods)

Because symbols are omitted from `Object.keys()` and `for...in` loops, JavaScript provides dedicated reflection methods on `Object` and `Reflect`:

| Method                                  | What It Returns                                                  |
| --------------------------------------- | ---------------------------------------------------------------- |
| **`Object.getOwnPropertySymbols(obj)`** | An array of all symbol-keyed own properties found on `obj`.      |
| **`Reflect.ownKeys(obj)`**              | An array containing **all** own keys (both strings and symbols). |

```javascript
const idKey = Symbol('id');
const roleKey = Symbol('role');

const user = {
  name: 'Alex',
  [idKey]: 4821,
  [roleKey]: 'admin',
};

// 1. Regular reflection ignores symbols:
console.log(Object.keys(user)); // ['name']

// 2. Object.getOwnPropertySymbols targets only symbols:
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(id), Symbol(role)]

// 3. Reflect.ownKeys gets both:
console.log(Reflect.ownKeys(user)); // ['name', Symbol(id), Symbol(role)]

```

---

### Summary Reference

| Category            | Identifier                          | Type              | Description                                                    |
| ------------------- | ----------------------------------- | ----------------- | -------------------------------------------------------------- |
| **Global Registry** | `Symbol.for(key)`                   | Static Method     | Creates or retrieves a shared symbol from the global registry. |
| **Global Registry** | `Symbol.keyFor(sym)`                | Static Method     | Retrieves the registry key for a global symbol.                |
| **Properties**      | `sym.description`                   | Instance Property | Read-only string description passed to `Symbol(desc)`.         |
| **Methods**         | `sym.toString()`                    | Instance Method   | Returns `"Symbol(description)"`.                               |
| **Methods**         | `sym.valueOf()`                     | Instance Method   | Returns the primitive symbol value.                            |
| **Reflection**      | `Object.getOwnPropertySymbols(obj)` | Object Method     | Returns all symbol properties on an object.                    |
