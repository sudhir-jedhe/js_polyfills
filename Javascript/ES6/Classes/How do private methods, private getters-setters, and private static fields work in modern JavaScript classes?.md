Private identifiers prefixed with `#` in modern JavaScript extend beyond instance variables to **private methods**, **private accessors (getters/setters)**, and **private static members**.

All private members share the same core rule: they are **lexically scoped** to the class body and completely inaccessible from external code, subclasses, or via reflection.

---

### 1. Private Instance Methods

Private methods are declared by prefixing the method name with `#`. They cannot be called on the instance from outside the class.

```javascript
class BankAccount {
  #balance = 0;

  constructor(initialDeposit) {
    this.#balance = initialDeposit;
  }

  // Public interface
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      this.#logTransaction('DEPOSIT', amount);
    }
  }

  // Private helper method
  #validateAmount(amount) {
    return typeof amount === 'number' && amount > 0;
  }

  // Private helper method
  #logTransaction(type, amount) {
    console.log(`[AUDIT] ${type}: $${amount} | New Balance: $${this.#balance}`);
  }
}

const account = new BankAccount(100);
account.deposit(50); // [AUDIT] DEPOSIT: $50 | New Balance: $150

// External access fails:
// account.#validateAmount(50); 
// ❌ SyntaxError: Private field '#validateAmount' must be declared in an enclosing class

```

---

### 2. Private Getters and Setters (Accessors)

You can define private getters and setters by prefixing the accessor name with `#`. This is useful for intercepting reads and writes to private state with internal validation, lazy computation, or transformation logic without exposing the accessor publicly.

```javascript
class UserProfile {
  #rawEmail = '';

  constructor(email) {
    this.#email = email; // Invokes private setter
  }

  // Private Setter: Validates internal format
  set #email(value) {
    if (!value.includes('@')) {
      throw new Error('Invalid email format');
    }
    this.#rawEmail = value.trim().toLowerCase();
  }

  // Private Getter: Formats internal value
  get #email() {
    return this.#rawEmail;
  }

  // Public method consuming private accessors
  getMaskedEmail() {
    const [name, domain] = this.#email.split('@');
    return `${name[0]}***@${domain}`;
  }
}

const profile = new UserProfile('Alex@Example.COM');
console.log(profile.getMaskedEmail()); // "a***@example.com"

// profile.#email = 'other@example.com';
// ❌ SyntaxError: Private field '#email' must be declared in an enclosing class

```

---

### 3. Private Static Fields, Methods & Accessors

Static private members are bound to the **constructor function (class itself)** rather than individual instances. They are useful for caching, instance counters, internal factories, or class-level constants that instances or public consumers should not tamper with.

```javascript
class DatabaseConnection {
  // Private static field (holds shared singleton state)
  static #instance = null;
  static #maxPoolSize = 5;
  static #activeConnections = 0;

  // Private constructor pattern via private method
  constructor(connectionString) {
    this.connectionString = connectionString;
    DatabaseConnection.#activeConnections++;
  }

  // Public static factory controlling access
  static getInstance(connectionString) {
    if (!DatabaseConnection.#instance) {
      if (DatabaseConnection.#canConnect) {
        DatabaseConnection.#instance = new DatabaseConnection(connectionString);
        DatabaseConnection.#logPoolStatus();
      }
    }
    return DatabaseConnection.#instance;
  }

  // Private static getter
  static get #canConnect() {
    return DatabaseConnection.#activeConnections < DatabaseConnection.#maxPoolSize;
  }

  // Private static method
  static #logPoolStatus() {
    console.log(`Pool: ${DatabaseConnection.#activeConnections}/${DatabaseConnection.#maxPoolSize}`);
  }
}

const conn = DatabaseConnection.getInstance('postgres://localhost:5432');
// DatabaseConnection.#maxPoolSize = 100;
// ❌ SyntaxError: Private field '#maxPoolSize' must be declared in an enclosing class

```

---

### 4. Checking for Private Fields with the `in` Operator

Because accessing a non-existent private field throws a runtime `TypeError` rather than returning `undefined`, modern JavaScript provides the **`#field in object`** brand check to safely test if an instance possesses a specific private member:

```javascript
class Node {
  #secretPayload;

  constructor(payload) {
    this.#secretPayload = payload;
  }

  static isNode(obj) {
    // Safe brand check: Returns true only if obj is a valid Node instance
    return #secretPayload in obj;
  }

  static getPayload(obj) {
    if (#secretPayload in obj) {
      return obj.#secretPayload;
    }
    throw new TypeError('Object is not a valid Node instance');
  }
}

const n = new Node('data');
console.log(Node.isNode(n));          // true
console.log(Node.isNode({}));         // false (does not throw)

```

---

### Summary of Behavioral Rules

* **Lexical Scope:** Subclasses cannot access private members of parent classes, even if the method or static field is declared identically in both classes.
* **No Dynamic Bracket Access:** Private members must be written using literal identifier syntax (`this.#method()`). Dynamic bracket lookups like `this['#method']` or `this[#method]` do not work.
* **Memory & Prototype Location:**
* **Private instance fields:** Installed per instance upon construction.
* **Private instance methods / accessors:** Installed on the internal class description (not on `prototype`), sharing a single function reference across instances without prototype pollution.
* **Private static members:** Installed strictly on the class constructor object.
