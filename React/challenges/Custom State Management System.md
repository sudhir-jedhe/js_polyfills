To build your own **custom state management system** from scratch, we'll go through each step systematically, from creating a state store to implementing middleware support and building a demo application. Here's the complete guide for implementing a basic state management system:

### **Step Zero: Set Up Your Environment**

You can implement this system using **plain JavaScript**. Create an HTML file and a `stateManager.js` file for the state management logic. Your folder structure should look like this:

```
/my-state-management
  /index.html
  /stateManager.js
  /app.js
```

---

### **Step One: Build the State Store**

Start by creating the `StateManager` class. This class will initialize with an initial state and hold a list of listeners (subscribers) to notify when the state changes.

```js
// stateManager.js
class StateManager {
    constructor(initialState) {
        this.state = initialState || {};
        this.listeners = [];
    }

    // Get the current state
    getState() {
        return this.state;
    }

    // Set a new state and notify listeners
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    // Notify all listeners with the current state
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
```

---

### **Step Two: Implement Get State Method**

This is already implemented in the above code. The `getState()` method simply returns the current state.

```js
getState() {
    return this.state;
}
```

---

### **Step Three: Implement Set State Method**

The `setState()` method updates the state by merging the current state with the new state and then notifying all listeners.

```js
setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
}
```

---

### **Step Four: Add Subscription System**

The `subscribe()` method allows components or other parts of your application to listen to state changes. Subscribers will be notified whenever the state changes.

```js
subscribe(listener) {
    this.listeners.push(listener);
    return () => {
        this.listeners = this.listeners.filter(l => l !== listener);
    };
}

notify() {
    this.listeners.forEach(listener => listener(this.state));
}
```

---

### **Step Five: Implement Middleware Support**

Middleware is useful for handling asynchronous actions or logging state transitions. You can extend the state management system to handle this.

Example of a logging middleware:

```js
class LoggerMiddleware {
    constructor() {
        this.next = null;
    }

    apply(store) {
        this.next = store.setState.bind(store); // Save the original setState
        store.setState = (newState) => {
            console.log('State changed: ', newState);
            this.next(newState); // Call the original setState
        };
    }
}
```

Now, integrate the middleware into your `StateManager`:

```js
class StateManager {
    constructor(initialState, middlewares = []) {
        this.state = initialState || {};
        this.listeners = [];
        this.middlewares = middlewares;
        this.applyMiddlewares();
    }

    applyMiddlewares() {
        this.middlewares.forEach(middleware => middleware.apply(this));
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}
```

---

### **Step Six: Build a Demo Application**

Now, create a simple demo app (like a to-do list) to use your state management system.

```js
// app.js
const stateManager = new StateManager(
    { todos: [] },
    [new LoggerMiddleware()]
);

// Render todos on the page
const renderTodos = () => {
    const todos = stateManager.getState().todos;
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        todoList.appendChild(li);
    });
};

// Subscribe to state changes and render the todos
stateManager.subscribe(renderTodos);

// Add new todo on button click
document.getElementById('add-todo').addEventListener('click', () => {
    const todoText = document.getElementById('todo-input').value;
    stateManager.setState({
        todos: [...stateManager.getState().todos, { text: todoText }]
    });
});
```

In your HTML, create the UI for adding todos:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>State Manager Demo</title>
</head>
<body>

    <h1>Todo List</h1>
    <input type="text" id="todo-input" placeholder="Add a todo">
    <button id="add-todo">Add Todo</button>
    <ul id="todo-list"></ul>

    <script src="stateManager.js"></script>
    <script src="app.js"></script>
</body>
</html>
```

This demo allows you to add todos to the list. The state is updated via `setState`, and the component is automatically re-rendered when the state changes.

---

### **Step Seven: Optional - Testing Your Code**

You can test your state management system by writing some basic unit tests using a framework like Jest.

Example test for `setState` and subscription:

```js
// stateManager.test.js
const { StateManager, LoggerMiddleware } = require('./stateManager');

test('setState should update the state and notify listeners', () => {
    const manager = new StateManager({ count: 0 });
    const listener = jest.fn();
    manager.subscribe(listener);
    manager.setState({ count: 1 });

    expect(manager.getState()).toEqual({ count: 1 });
    expect(listener).toHaveBeenCalledWith({ count: 1 });
});

test('LoggerMiddleware should log state changes', () => {
    const logger = new LoggerMiddleware();
    const manager = new StateManager({ count: 0 }, [logger]);
    const listener = jest.fn();
    manager.subscribe(listener);
    const consoleSpy = jest.spyOn(console, 'log');
    
    manager.setState({ count: 1 });

    expect(consoleSpy).toHaveBeenCalledWith('State changed: ', { count: 1 });
});
```

---

### **Step Eight: Optional - Code Quality with ESLint**

Set up ESLint to enforce code quality. You can install ESLint in your project:

```bash
npm init -y
npm install eslint --save-dev
npx eslint --init
```

Then, configure ESLint with your preferred coding style and rules.

---

### **Final Step: Clean Up and Document**

- **Comments**: Add comments to explain your logic and code.
- **README**: Write a `README.md` to explain the purpose and usage of your state management system.

Example:

```markdown
# Custom State Management System

A simple state management system built from scratch, designed to store and manage application state with subscriptions and middleware support.

## Features
- Centralized state store
- Subscriptions to state changes
- Middleware support for logging and async actions
- Example app with a todo list

## Usage

1. Initialize a `StateManager` with an initial state.
2. Use `setState` to update the state.
3. Subscribe to state changes to re-render components.
```

---

This concludes the challenge! You now have a working custom state management system with middleware support, a simple demo application, and optional enhancements like testing and ESLint integration.