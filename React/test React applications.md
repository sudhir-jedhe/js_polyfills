To test React applications, use Jest or Vitest as the test runner together with React Testing Library, which encourages testing components the way users interact with them. Drive interactions with @testing-library/user-event (preferred over fireEvent), mock network calls with MSW, and write end-to-end tests with Playwright (or Cypress). For React 19 features like async components and Server Components, lean on async queries (findBy\*, waitFor).

**How do you test React applications?**
**Unit testing**
Unit testing covers individual components in isolation. Jest and Vitest are the two dominant runners — Vitest is the natural choice for Vite-based projects and has largely caught up with Jest in features. Both pair with React Testing Library, which renders components and queries the DOM the way a user would.

Add @testing-library/jest-dom once in your setup file (e.g. setupTests.ts) so its matchers are registered globally — the older @testing-library/jest-dom/extend-expect import path is no longer needed:

```js
// setupTests.ts
import "@testing-library/jest-dom";
```

```js
// MyComponent.test.tsx
import { render, screen } from "@testing-library/react";
import MyComponent from "./MyComponent";

test("renders the component with the correct text", () => {
  render(<MyComponent />);
  expect(screen.getByText("Hello, World!")).toBeInTheDocument();
});
```

**Integration testing**
Integration tests exercise multiple components together. Prefer @testing-library/user-event over fireEvent — it simulates real user interactions (focus, hover, typing) much more faithfully and returns a promise, so you await the action.

```js
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ParentComponent from "./ParentComponent";

test("updates child component when parent state changes", async () => {
  const user = userEvent.setup();
  render(<ParentComponent />);

  await user.click(screen.getByRole("button", { name: "Update Child" }));

  expect(await screen.findByText("Child Updated")).toBeInTheDocument();
});
```

Note findByText (async) instead of getByText for assertions on UI that appears after an update — findBy\* retries until the element appears or times out, and is the standard tool for anything asynchronous. For more complex polling, use waitFor.

**Testing custom hooks**
Use renderHook from @testing-library/react to test hooks in isolation:

```js
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

test("increments the counter", () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});
```

**Mocking network requests with MSW**
Mock Service Worker (MSW) intercepts requests at the network layer rather than stubbing fetch, so the same handlers work in unit tests, Storybook, and the dev server. It is the de facto standard for API mocking in React tests.

```js
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  http.get("/api/user", () => HttpResponse.json({ name: "Ada" })),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Testing async and Server Components in React 19**
React 19 introduced async components and stabilized Server Components. For client-rendered async components, await the data with findBy\*/waitFor — RTL handles the suspended render automatically. For Server Components, run the component as a normal async function in a Node test and assert on the returned tree, or test them through an integration test with a framework like Next.js. Keep network calls mocked at the boundary (MSW, or by stubbing the data-fetching module).

```js
test("renders user data once loaded", async () => {
  render(<UserProfile id="42" />);
  expect(await screen.findByText("Ada")).toBeInTheDocument();
});
```

End-to-end testing
End-to-end tests drive the whole application in a real browser. Playwright has become the most popular choice for new projects — it ships parallel execution, multi-browser support, auto-waiting, and a strong trace viewer out of the box. Cypress is still widely used and a fine option in existing codebases.

```js
// Playwright
import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill("user");
  await page.getByLabel("Password").fill("password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});
```

**Snapshot testing**
Snapshot testing captures the rendered output of a component and compares it to a saved snapshot on subsequent runs. With React 19, react-test-renderer is deprecated — render with React Testing Library instead and snapshot the resulting markup:

```js
import { render } from "@testing-library/react";
import MyComponent from "./MyComponent";

test("matches the snapshot", () => {
  const { asFragment } = render(<MyComponent />);
  expect(asFragment()).toMatchSnapshot();
});
```

Use snapshot tests sparingly — they're easy to update reflexively, which can let regressions slip through. Reserve them for stable presentational output.

Testing React applications involves verifying that individual components function correctly in isolation (Unit/Component Testing), that pages and features work together seamlessly (Integration Testing), and that critical user journeys function properly end-to-end (E2E Testing).

---

### The Testing Pyramid for React

A robust testing strategy relies on a mix of different testing layers:

1. **Unit & Component Testing:** Fast tests that check individual helper functions or render isolated components to ensure they display and behave correctly.
2. **Integration Testing:** Tests multiple components working together (e.g., a form submitting data and updating a list).
3. **End-to-End (E2E) Testing:** Automated browser tests that simulate real user behavior across your entire application stack.

---

### Step 1: Component & Integration Testing (Vitest / Jest + React Testing Library)

The industry standard for testing React components is **React Testing Library (RTL)**. RTL encourages testing components from the user's perspective—querying elements by text, roles, or labels rather than internal implementation details (like component state or CSS classes).

You can pair RTL with either **Jest** or **Vitest** (the latter is heavily favored in modern Vite-based React setups).

#### Example Component Test (`Button.test.jsx`)

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  it("renders with the correct label", () => {
    render(<Button label="Click Me" />);

    // Assert the button is in the document with the correct text
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("calls the onClick handler when clicked", async () => {
    const handleClick = vi.fn(); // Mock function (use jest.fn() if using Jest)
    const user = userEvent.setup();

    render(<Button label="Submit" onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /submit/i });
    await user.click(button);

    // Assert the click handler was triggered once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

---

### Step 2: Handling Asynchronous Code & API Mocks

When your React components fetch data from an API, your tests should mock those network requests to keep tests fast, reliable, and independent of external backends.

- Use **`MSW (Mock Service Worker)`** to intercept network requests at the network level.
- Or mock asynchronous states directly using `waitFor` or `findBy` queries from React Testing Library:

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import UserProfile from "./UserProfile";

it("loads and displays user data", async () => {
  render(<UserProfile userId="1" />);

  // Shows loading state initially
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for the async data to appear on the screen
  const username = await screen.findByRole("heading", { name: /john doe/i });
  expect(username).toBeInTheDocument();
});
```

---

### Step 3: End-to-End (E2E) Testing (Playwright / Cypress)

While React Testing Library runs in a simulated DOM environment (jsdom), E2E testing runs your application in a real browser, executing true user workflows like logging in, navigating pages, and submitting forms.

- **Playwright:** The current favorite for modern React apps due to its speed, cross-browser support, robust auto-waiting mechanism, and native parallel test execution.
- **Cypress:** Another widely adopted tool known for its exceptional developer experience, time-travel debugging, and real-time browser preview.

#### Example Playwright Test (`login.spec.js`)

```javascript
import { test, expect } from "@playwright/test";

test("user can log in and view dashboard", async ({ page }) => {
  // 1. Go to the login page
  await page.goto("https://example.com/login");

  // 2. Fill out credentials
  await page.fill('input[name="email"]', "user@example.com");
  await page.fill('input[name="password"]', "securepassword");

  // 3. Click submit
  await page.click('button[type="submit"]');

  // 4. Assert redirection to the dashboard and welcome message
  await expect(page).toHaveURL("https://example.com/dashboard");
  await expect(page.locator("h1")).toContainText("Welcome back");
});
```

---

### Best Practices for Testing React Apps

- **Test Behavior, Not Implementation:** Avoid testing internal component state (`wrapper.state()`) or private methods. Test what the user sees and does (`screen.getByRole()`, `userEvent.click()`).
- **Prioritize Accessibility (a11y) Queries:** Using queries like `getByRole`, `getByLabelText`, and `getByPlaceholderText` forces you to write semantic HTML with proper ARIA attributes, making your app more accessible while making tests resilient.
- **Keep Unit Tests Fast:** Run your unit and component test suite (Vitest/Jest) on every commit or via continuous integration (CI) pipelines, reserving heavier E2E suites for deployment gates.

**What is Jest and how is it used for testing React applications?**

**Jest** is a popular, open-source JavaScript testing framework maintained by Meta (formerly Facebook). It is designed to ensure correctness in any JavaScript codebase, with built-in support for React, TypeScript, Node, and other frameworks.

Jest acts as an all-in-one testing solution, functioning simultaneously as a **test runner**, an **assertion library**, a **mocking engine**, and a **code coverage tool**.

---

### Key Features of Jest

- **Zero Configuration:** Jest works out-of-the-box for most JavaScript projects, requiring minimal setup to start writing tests.
- **Built-in Mocking:** It provides powerful tools to mock functions (`jest.fn()`), modules, timers, and network requests without needing extra external libraries.
- **Snapshot Testing:** Jest can capture rendered UI structures (or any serializable data) and compare them against a baseline file to catch unexpected visual or structural regressions.
- **Fast Parallel Execution:** Tests are sandboxed and executed in parallel across multiple worker processes for maximum speed.
- **Built-in Code Coverage:** With a single flag (`--coverage`), Jest generates detailed reports showing which lines, functions, and branches of your code are tested.

---

### How Jest is Used in React Applications

In the modern React ecosystem, Jest is rarely used alone to test UI components. Instead, it is typically paired with **React Testing Library (RTL)**:

- **Jest** provides the test runner environment (using `jsdom` to simulate a browser DOM in Node), the assertion syntax (`expect()`), and test structuring functions (`describe`, `it`, `beforeEach`).
- **React Testing Library** provides the utilities to render React components into that simulated DOM and interact with them from a user's perspective.

#### Example React Component Test with Jest

Here is a standard example of how Jest is used alongside React Testing Library to test a simple counter component:

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Counter from "./Counter";

describe("Counter Component", () => {
  // 1. Using Jest's test block syntax
  it("renders initial count and increments when clicked", async () => {
    const user = userEvent.setup();

    // Render the React component inside Jest's jsdom environment
    render(<Counter />);

    // Assert initial state using Jest's expect assertions
    const countDisplay = screen.getByText(/count: 0/i);
    expect(countDisplay).toBeInTheDocument();

    // Simulate user interaction
    const incrementButton = screen.getByRole("button", { name: /increment/i });
    await user.click(incrementButton);

    // Assert the state updated correctly
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});
```

### Modern Alternatives

While Jest remains widely used, many modern React projects (especially those built with Vite) utilize **Vitest** as a drop-in replacement. Vitest shares an almost identical API with Jest but integrates natively with Vite's build pipeline for significantly faster execution speeds.

**What is React Testing Library and how is it used for testing React components?**

**React Testing Library (RTL)** is the industry-standard utility library for testing React components. Built on top of DOM Testing Library, it is designed to test components from the **user's perspective** rather than focusing on internal implementation details (such as component state, lifecycle methods, or props).

The core philosophy of RTL is: _"The more your tests resemble the way your software is used, the more confidence they can give you."_

---

### Core Principles of React Testing Library

- **User-Centric Queries:** Instead of querying elements by CSS classes, IDs, or component internals, RTL encourages querying elements the way a real user interacts with them—by looking for visible text, labels, placeholder text, or accessibility roles (e.g., buttons, links, headings).
- **No Implementation Access:** RTL intentionally does not provide shortcuts to check or modify component state or internal variables. If a user cannot see a state change visually or textually on the screen, the test cannot access it either.

---

### Key Features and Queries

RTL provides the `screen` object, which acts as a global namespace to query the rendered DOM. The most common query methods include:

- **`getByRole`**: The primary and most accessible way to find elements (e.g., `screen.getByRole('button', { name: /submit/i })`).
- **`getByText`**: Finds elements containing specific visible text content.
- **`getByLabelText`**: Finds form inputs linked to a specific label text.
- **Async Queries (`findBy...`)**: Used to wait for asynchronous elements (like data fetched from an API) to appear on the screen.

---

### Example: Testing a React Component with RTL

Here is a typical example showing how React Testing Library is used alongside a test runner (like Jest or Vitest) and `user-event` to test an interactive login or submission form:

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "./LoginForm";

describe("LoginForm Component", () => {
  it("submits the form when valid credentials are provided", async () => {
    const handleSubmit = vi.fn(); // Mock submission handler
    const user = userEvent.setup();

    // 1. Render the component into the simulated DOM
    render(<LoginForm onSubmit={handleSubmit} />);

    // 2. Locate elements using user-facing queries
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    // 3. Simulate user interactions
    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "securepassword123");
    await user.click(submitButton);

    // 4. Assert the expected outcome
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "securepassword123",
    });
  });
});
```

---

### Why Use React Testing Library?

- **Resilient to Refactoring:** Because tests interact with the rendered UI rather than underlying code structure, you can completely rewrite how a component manages state without breaking your tests.
- **Improves Accessibility (a11y):** Prioritizing queries like `getByRole` and `getByLabelText` forces developers to write semantic, accessible HTML with proper ARIA attributes.

**How do you test React components using React Testing Library?**
Testing React components with **React Testing Library (RTL)** follows a predictable, user-centric workflow. Instead of checking internal state or method calls, you simulate how a real user interacts with your UI.

---

### The 4-Step RTL Workflow

1. **Render:** Mount the component into a simulated DOM using the `render` function.
2. **Query:** Find the elements you want to interact with or verify using the `screen` object and user-facing queries (like `getByRole` or `getByText`).
3. **Interact:** Simulate user actions (such as typing, clicking, or hovering) using the **`user-event`** library.
4. **Assert:** Check that the UI updates correctly or that expected functions are called using test assertions (`expect`).

---

### Step-by-Step Code Example

Here is how to test a simple counter component that increments a number when a button is clicked.

#### 1. The Component (`Counter.jsx`)

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

#### 2. The Test File (`Counter.test.jsx`)

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest"; // or jest
import Counter from "./Counter";

describe("Counter Component", () => {
  it("renders initial count and increments when clicked", async () => {
    // Setup user event simulation
    const user = userEvent.setup();

    // 1. Render the component
    render(<Counter />);

    // 2. Query elements (using user-facing accessibility roles and text)
    const countDisplay = screen.getByText(/count: 0/i);
    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // Assert initial state
    expect(countDisplay).toBeInTheDocument();

    // 3. Interact with the component
    await user.click(incrementButton);

    // 4. Assert the result updated on the screen
    expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
  });
});
```

---

### Best Practices for RTL Testing

- **Prioritize `getByRole`:** Always try to query elements by their semantic role first (e.g., `screen.getByRole('button', { name: /submit/i })`). This ensures your components are accessible to screen readers.
- **Use `userEvent` over `fireEvent`:** Always use `userEvent` (e.g., `user.click()`, `user.type()`) because it closely mimics real browser events (firing hovers, focus changes, and multiple underlying DOM events) compared to the lower-level `fireEvent`.
- **Handle Asynchronicity with `findBy`:** If your component fetches data or updates asynchronously, use `screen.findBy...` queries or `waitFor` to pause execution until the element appears.
  To test React components using React Testing Library, you can:

Render the component using render.
Interact with the component (e.g., clicking buttons, entering text).
Assert on the rendered output using queries like getByText, queryByRole, etc.
Example:

```js
import { render, screen, fireEvent } from "@testing-library/react";
import MyComponent from "./MyComponent";

test("renders component", () => {
  render(<MyComponent />);
  const button = screen.getByRole("button");
  fireEvent.click(button);
  expect(screen.getByText("Clicked!")).toBeInTheDocument();
});
```

In this example, the test renders MyComponent, clicks a button, and asserts that the text 'Clicked!' is present.

**. How do you test asynchronous code in React components?**
Testing asynchronous code in React components—such as fetching data from an API, handling loading states, or waiting for timers—involves using **React Testing Library's async queries** along with **`waitFor`** or `findBy` methods.

---

### 1. Using `findBy` Queries (Best for Data Fetching)

The `findBy` family of queries (like `findByRole` or `findByText`) automatically returns a promise that resolves when the element appears in the DOM. It includes a built-in timeout (defaulting to 1000ms), making it ideal for waiting on API responses.

```jsx
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

it("displays user data after loading", async () => {
  render(<UserProfile userId="1" />);

  // 1. Assert that the loading state is initially shown
  expect(screen.getByText(/loading.../i)).toBeInTheDocument();

  // 2. Wait for the asynchronous data to render on the screen
  const username = await screen.findByRole("heading", { name: /john doe/i });

  // 3. Assert the data is present and loading is gone
  expect(username).toBeInTheDocument();
  expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
});
```

---

### 2. Using `waitFor` (Best for Multiple Assertions or State Changes)

When you need to wait for multiple conditions or assert that something _changes_ over time (like a form submission success message), use the **`waitFor`** utility.

```jsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SettingsForm from "./SettingsForm";

it("shows success message upon saving", async () => {
  const user = userEvent.setup();
  render(<SettingsForm />);

  const saveButton = screen.getByRole("button", { name: /save/i });
  await user.click(saveButton);

  // Wait until the success message appears in the DOM
  await waitFor(() => {
    expect(
      screen.getByText(/settings saved successfully/i),
    ).toBeInTheDocument();
  });
});
```

---

### 3. Handling API Mocks with MSW (Mock Service Worker)

To make asynchronous tests reliable and independent, avoid hitting real backend servers. Instead, use **Mock Service Worker (MSW)** to intercept network requests at the network level and return mock payloads.

```javascript
// src/mocks/handlers.js
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/user/1", () => {
    return HttpResponse.json({ id: "1", name: "John Doe" });
  }),
];
```

---

### 4. Avoiding "Act" Warnings (`act(...)`)

When asynchronous operations update React state (like resolving an API call or timer), you might occasionally see console warnings about `act(...)`.

- **How to fix:** Ensure you always `await` your async interactions (`await user.click(...)`) and `await` your async queries (`await screen.findBy...`). This guarantees that React Testing Library wraps state updates inside React's internal `act` utility automatically.

**. How do you mock API calls in React component tests?**
Mocking API calls in React component tests ensures your test suite runs fast, remains reliable, and does not depend on external servers or live internet connections.

There are three primary ways to mock API calls in React component tests, ranging from modern network-level mocking to traditional module mocking.

---

### Method 1: Mock Service Worker (MSW) — The Gold Standard

**Mock Service Worker (MSW)** is the modern industry standard for testing. Instead of mocking individual functions or `fetch`, MSW intercepts actual network requests at the network level using Service Workers (in the browser) or a Node interceptor (in your test environment).

Your React component makes its normal API call (`fetch` or `axios`), and MSW seamlessly intercepts it and returns a mock response.

#### 1. Define your MSW server and handlers (`src/mocks/handlers.js`)

```javascript
import { http, HttpResponse } from "msw";

export const handlers = [
  // Intercept GET requests to /api/user
  http.get("/api/user", () => {
    return HttpResponse.json({ id: 1, name: "Jane Doe" });
  }),
];
```

#### 2. Setup the test server (`src/mocks/server.js`)

```javascript
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

#### 3. Configure your test setup file (e.g., `setupTests.js`)

```javascript
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### 4. Write your component test

Your component code requires zero special test configurations; it simply fetches data like normal.

```jsx
import { render, screen } from "@testing-library/react";
import UserProfile from "./UserProfile";

it("displays user data fetched from API", async () => {
  render(<UserProfile />);

  // MSW intercepts the request and returns the mock handler data
  const userName = await screen.findByText(/jane doe/i);
  expect(userName).toBeInTheDocument();
});
```

---

### Method 2: Module/Service Mocking (Vitest / Jest)

If your application uses a dedicated API service file (e.g., `api.js` or `userService.js`), you can mock that entire module directly using your test runner's mocking utilities (`vi.mock` in Vitest or `jest.mock` in Jest).

#### 1. The API service file (`userService.js`)

```javascript
export async function fetchUser() {
  const response = await fetch("/api/user");
  return response.json();
}
```

#### 2. The Test File

```jsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import UserProfile from "./UserProfile";
import * as userService from "./userService";

// Automatically mock the entire service module
vi.mock("./userService");

it("renders user profile with mocked data", async () => {
  // Tell the mock function what value to resolve with
  userService.fetchUser.mockResolvedValueOnce({ id: 1, name: "John Smith" });

  render(<UserProfile />);

  const userName = await screen.findByText(/john smith/i);
  expect(userName).toBeInTheDocument();
});
```

---

### Method 3: Mocking Global `fetch` (Quick & Simple)

If you aren't using MSW and want a quick way to mock native browser `fetch` calls without creating external handler files, you can override `global.fetch` directly inside your test.

```jsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import UserProfile from "./UserProfile";

it("mocks global fetch response", async () => {
  // Spy on or replace global.fetch
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ id: 1, name: "Alice" }),
  });

  render(<UserProfile />);

  const userName = await screen.findByText(/alice/i);
  expect(userName).toBeInTheDocument();
});
```

---

### Best Practices for API Testing

- **Test Error States:** Don't just test successful API responses. Use MSW's `http.get('...', () => new HttpResponse(null, { status: 500 }))` or `.mockRejectedValueOnce()` to test how your UI handles network errors or server failures.
- **Reset Mocks Between Tests:** Ensure you clean up your network handlers or mock call counts after each test (`afterEach(() => vi.clearAllMocks())` or MSW's `resetHandlers()`) so tests don't bleed state into one another.

To mock API calls in React component tests, you can use Jest's jest.mock to mock the API module and return mock data. This allows you to simulate API responses without making actual network requests.

Example:

```js
import { render, screen } from "@testing-library/react";

jest.mock("./api", () => ({
  fetchData: jest.fn(() => Promise.resolve("mocked data")),
}));

import MyComponent from "./MyComponent";

test("fetches data and renders it", async () => {
  render(<MyComponent />);
  expect(screen.getByText("Loading...")).toBeInTheDocument();
  expect(await screen.findByText("mocked data")).toBeInTheDocument();
});
```

In this example, the fetchData function from the api module is mocked to return 'mocked data' for testing purposes.

**How do you test React hooks in functional components?**

Testing React hooks (especially custom hooks) directly requires a utility that can execute them within the context of a functional component, since React throws an error if a hook is called outside of one.

The standard approach is using the **`renderHook`** utility provided natively by **React Testing Library** (v13+).

---

### Step-by-Step Guide to Testing a Custom Hook

Consider a simple custom hook called `useCounter` that manages a count and an increment function:

```javascript
// useCounter.js
import { useState, useCallback } from "react";

export default function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return { count, increment };
}
```

#### Writing the Test (`useCounter.test.js`)

To test this hook without building a dummy component manually, use `renderHook` and `act`:

```jsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest"; // or jest
import useCounter from "./useCounter";

describe("useCounter Hook", () => {
  it("should initialize with default or provided value", () => {
    // Render the hook with initial props/values
    const { result } = renderHook(() => useCounter(5));

    // Access the return values via result.current
    expect(result.current.count).toBe(5);
  });

  it("should increment the counter", () => {
    const { result } = renderHook(() => useCounter());

    // Wrap state-updating functions inside `act()`
    act(() => {
      result.current.increment();
    });

    // Assert that the state updated correctly
    expect(result.current.count).toBe(1);
  });
});
```

---

### Key Utilities for Hook Testing

- **`result.current`**: This object holds the latest returned values, states, or functions from your hook. Because React hook values change over time, always access them through `result.current` _after_ an action rather than caching variables early.
- **`act()`**: Any function call that triggers a state update or side effect inside a hook (like changing state or firing an effect) **must** be wrapped in `act(...)`. This ensures React flushes all state updates and rerenders before your assertions run.
- **`rerender()`**: If your hook accepts arguments that change over time, `renderHook` returns a `rerender` function to test how your hook reacts to new inputs:

```jsx
const { result, rerender } = renderHook(({ step }) => useCounter(0, step), {
  initialProps: { step: 1 },
});

// Rerender with a new prop/argument
rerender({ step: 5 });
```

- **`wrapper` option**: If your custom hook relies on context providers (like Redux, Router, or a Theme Context), you can pass a wrapper component to `renderHook`:

```jsx
const { result } = renderHook(() => useAuth(), {
  wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
});
```

---

[React Testing Tutorial - 40 - Custom React Hooks](https://www.youtube.com/watch?v=Ru4V8yCR6jQ)

This video provides a practical walkthrough on setting up and running unit tests for custom React hooks using testing utilities.

Render the hook inside a test using renderHook from @testing-library/react, then call act to drive any state updates.

```js
import { renderHook, act } from "@testing-library/react";
import useCounter from "./useCounter";

test("increments counter", () => {
  const { result } = renderHook(() => useCounter());
  act(() => {
    result.current.increment();
  });
  expect(result.current.count).toBe(1);
});
```

Older sources import renderHook from @testing-library/react-hooks. That package was deprecated and merged into @testing-library/react in v13; use the import shown above.

**How do you test custom hooks in React?**
Testing custom hooks in React is handled using the **`renderHook`** and **`act`** utilities provided by **React Testing Library**. Because React throws an error if a hook is called outside of a functional component, `renderHook` automatically creates a lightweight wrapper component to execute and manage your hook safely.

---

### 1. Basic Custom Hook Testing

To test a custom hook, you call `renderHook`, pass a callback that invokes your hook, and inspect its return values via **`result.current`**. Any function that triggers a state update must be wrapped in **`act()`**.

```jsx
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import useCounter from "./useCounter";

describe("useCounter Custom Hook", () => {
  it("should initialize and increment correctly", () => {
    // 1. Render the hook
    const { result } = renderHook(() => useCounter(0));

    // 2. Assert initial state
    expect(result.current.count).toBe(0);

    // 3. Trigger state change inside `act`
    act(() => {
      result.current.increment();
    });

    // 4. Assert updated state
    expect(result.current.count).toBe(1);
  });
});
```

---

### 2. Testing Hooks with Dynamic Arguments (Using `rerender`)

If your custom hook accepts arguments or props that change over time, you can use the **`rerender`** function returned by `renderHook` to test how the hook responds to new inputs.

```jsx
import { renderHook, act } from "@testing-library/react";
import useMultiplier from "./useMultiplier";

it("should update output when input argument changes", () => {
  const { result, rerender } = renderHook(
    ({ factor }) => useMultiplier(2, factor),
    {
      initialProps: { factor: 3 },
    },
  );

  expect(result.current.value).toBe(6); // 2 * 3

  // Rerender the hook with a new argument
  rerender({ factor: 5 });

  expect(result.current.value).toBe(10); // 2 * 5
});
```

---

### 3. Testing Hooks That Rely on Context (Using `wrapper`)

Many custom hooks depend on React Context (e.g., `useAuth()`, `useTheme()`, or Redux hooks). You can supply a custom provider wrapper using the `wrapper` option in `renderHook`.

```jsx
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

it("should access authentication context", async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  const { result } = renderHook(() => useAuth(), { wrapper });

  // Initial unauthenticated state
  expect(result.current.user).toBeNull();

  // Trigger login action
  await act(async () => {
    await result.current.login("test@example.com", "password");
  });

  expect(result.current.user).toEqual({ email: "test@example.com" });
});
```

---

### 4. Testing Asynchronous Custom Hooks

If your custom hook performs asynchronous actions (like fetching data or handling timers), you can combine `act` with `waitFor` or asynchronous helper functions.

```jsx
import { renderHook, waitFor } from "@testing-library/react";
import useUserData from "./useUserData";

it("should fetch and return user data asynchronously", async () => {
  const { result } = renderHook(() => useUserData("1"));

  // Initially in a loading state
  expect(result.current.loading).toBe(true);

  // Wait for the async operation to finish and state to update
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.user).toEqual({ id: "1", name: "John Doe" });
});
```

```js
import { renderHook, act } from "@testing-library/react";
import useCustomHook from "./useCustomHook";

test("hook behavior", () => {
  const { result } = renderHook(() => useCustomHook());
  act(() => {
    result.current.doSomething();
  });
  expect(result.current.value).toBe("expected value");
});

// With a context provider:
const wrapper = ({ children }) => (
  <MyProvider value="test">{children}</MyProvider>
);
const { result } = renderHook(() => useCustomHook(), { wrapper });
```

**What is Shallow Renderer in React testing?**
**Shallow Renderer** is a testing utility in React that lets you render a single component in **strict isolation**—meaning it renders only the component itself and _does not_ recursively render any child components nested inside it.

For example, if a `<Parent>` component renders a `<Child>` component, shallow rendering will render `<Parent>`'s markup, but it will replace `<Child/>` with a placeholder stub. Child component logic, child lifecycle methods, and child state changes are entirely ignored.

---

### How It Was Used (Historical Context)

Shallow rendering was heavily popularized by **Enzyme** (via its `shallow()` method) and the older `react-test-renderer/shallow` package.

```jsx
// Example using legacy Enzyme shallow rendering
import { shallow } from "enzyme";
import Parent from "./Parent";

it("renders parent component shallowly", () => {
  const wrapper = shallow(<Parent />);

  // Child components are not actually rendered into the tree
  expect(wrapper.find("ChildComponent").exists()).toBe(true);
});
```

---

### Why Shallow Renderer Is No Longer Recommended

In modern React development (especially with React 18+ and the rise of **React Testing Library**), shallow rendering is widely considered an **anti-pattern** and is largely obsolete.

Here is why the community moved away from it:

1. **Violates User-Centric Testing:** React Testing Library's core philosophy is to test components the way a user experiences them. Users interact with entire component trees (buttons inside forms inside pages), not isolated, half-rendered components.
2. **Brittle Tests (Coupled to Implementation):** Shallow tests often assert internal component details (e.g., checking what props were passed down to a child component) rather than verifying actual user-facing outputs or behaviors. This causes tests to break frequently during refactoring, even when the UI works perfectly.
3. **Incompatible with Modern React:** With the advent of React Server Components, concurrent rendering, and hooks that deeply integrate with context and Suspense boundaries, shallow renderers struggle to accurately simulate real component behavior.

### Modern Alternative

Instead of shallow rendering, modern testing stacks use **React Testing Library (RTL)** to render the full component tree, combined with **Mock Service Worker (MSW)** or manual module mocks to isolate external dependencies (like APIs or complex context) without cutting off child components.

Shallow rendering renders a component one level deep: its children are not rendered, only referenced as React elements. The intent was to isolate the component under test from its children.

The two implementations were react-test-renderer/shallow (a low-level API) and Enzyme's shallow() (a popular wrapper around it).

```js
// Enzyme-style example (historical)
import { shallow } from "enzyme";
const wrapper = shallow(<Button label="Click Me" />);
expect(wrapper.text()).toBe("Click Me");
```

Don't use shallow rendering in new code. Enzyme is unmaintained and has no official React 17+ adapter. The React docs recommend React Testing Library, which renders components the way users see them and asserts on accessible output, so tests don't break on internal refactors. Use RTL's render with screen.getByRole / getByText instead.

**What is Snapshot Testing in React?**
**Snapshot Testing** is an automated testing technique used to catch unexpected changes or regressions in your React application's UI output.

When you run a snapshot test, Jest (or Vitest) renders your React component, serializes its resulting DOM markup or JSON structure, and compares it against a reference file (a "snapshot" file) saved in your repository during a previous test run.

---

### How Snapshot Testing Works

1. **First Run (Creation):** When a snapshot test runs for the first time, the test runner generates a text file containing the rendered component's markup tree and saves it alongside your test file (e.g., in a `__snapshots__` directory).
2. **Subsequent Runs (Comparison):** On every future test run, the test runner renders the component again and compares its new output against the saved snapshot file.
3. **Pass or Fail:** If the markup matches perfectly, the test passes. If there is _any_ difference—even a single changed CSS class, a modified tag, or altered text—the test fails, displaying a diff of what changed.

---

### Code Example (Using Jest / Vitest + React Testing Library)

```jsx
import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import UserCard from "./UserCard";

describe("UserCard Snapshot Test", () => {
  it("renders correctly and matches snapshot", () => {
    // 1. Render the component with static props
    const { container } = render(<UserCard name="Jane Doe" role="Admin" />);

    // 2. Assert that the rendered container matches the saved snapshot file
    expect(container).toMatchSnapshot();
  });
});
```

---

### Handling UI Updates (`--updateSnapshot`)

Because UIs naturally evolve during development, valid changes will occasionally break your snapshot tests. When you intentionally modify a component's markup, you must update the reference snapshot file by running your test runner with a specific flag:

```bash
npm test -- -u
# or if using vitest
npx vitest -u

```

This overwrites the old snapshot with the new, approved component output.

---

### Pros and Cons of Snapshot Testing

#### **Advantages:**

- **Instant Baseline Coverage:** Quickly creates a safety net for complex components or static layouts without forcing you to write dozens of individual element queries.
- **Catches Accidental Regressions:** Immediately alerts you if a refactor accidentally strips out structural elements, wrappers, or accessibility attributes.

#### **Disadvantages & Pitfalls:**

- **"Snapshot Fatigue":** If snapshots are too large or components change frequently, developers tend to blindly run `npm test -u` without reading the diffs, rendering the tests useless.
- **Implementation-Coupled:** Because snapshots capture the raw HTML structure rather than user behavior, minor internal refactoring or library version upgrades (which change underlying DOM elements) can cause noisy, false-positive test failures.

### Best Practice

Use snapshot testing **sparingly**. It is great for small, highly stable UI components (like badges, icons, or typography wrappers), but it should never replace behavioral testing with React Testing Library.

Snapshot Testing in React is a testing technique that captures the rendered output of a component and saves it as a snapshot. Subsequent test runs compare the current output with the saved snapshot to detect any unexpected changes. If the output differs from the snapshot, the test fails, indicating that the component's output has changed.

Here's an example of using Snapshot Testing with Jest:

```js
import React from "react";
import renderer from "react-test-renderer";
import MyComponent from "./MyComponent";

test("renders correctly", () => {
  const tree = renderer.create(<MyComponent />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

In this example, the renderer.create function renders the MyComponent and converts it to a JSON tree. The toMatchSnapshot function saves the snapshot of the component's output. Subsequent test runs compare the current output with the saved snapshot, ensuring the component's output remains consistent.

**How do you test React components that use context?**
Testing React components that rely on Context involves wrapping the component under test inside the appropriate Context Provider. If you do not provide a provider, the component will either throw an error (if you use a custom hook that throws when context is missing) or fall back to default values.

---

### Method 1: Wrapping Components Manually in the Test

The most straightforward approach is to wrap the component in your actual Context Provider inside the test file, supplying initial or mock state values.

#### 1. The Context and Component

```jsx
// ThemeContext.jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// ThemedButton.jsx
export default function ThemedButton() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current theme is {theme}</button>;
}
```

#### 2. Writing the Test (`ThemedButton.test.jsx`)

```jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { ThemeProvider } from "./ThemeContext";
import ThemedButton from "./ThemedButton";

describe("ThemedButton Component", () => {
  it("toggles theme when clicked", async () => {
    const user = userEvent.setup();

    // Render component wrapped in the Context Provider
    render(
      <ThemeProvider>
        <ThemedButton />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", {
      name: /current theme is light/i,
    });
    expect(button).toBeInTheDocument();

    // Interact with the component
    await user.click(button);

    // Assert that the context state updated across the consumer
    expect(
      screen.getByRole("button", { name: /current theme is dark/i }),
    ).toBeInTheDocument();
  });
});
```

---

### Method 2: Creating a Custom Render Function (DRY Approach)

If your app relies heavily on context (such as Authentication, Themes, or Localization), wrapping every single test component manually becomes repetitive.

You can create a custom `render` wrapper function (often placed in a `test-utils.js` file) that automatically injects all global providers.

```jsx
// test-utils.jsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";

// All-in-one provider wrapper for tests
function AllProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </AuthProvider>
  );
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything from React Testing Library
export * from "@testing-library/react";
export { customRender as render };
```

Now, in your test files, you import `render` from your custom utility instead of `@testing-library/react`:

```jsx
import { render, screen } from "./test-utils";
import ThemedButton from "./ThemedButton";

it("renders correctly with custom render utility", () => {
  render(<ThemedButton />);
  expect(screen.getByRole("button")).toBeInTheDocument();
});
```

---

### Method 3: Providing Mock Values for Isolated Tests

If you want to test a component in isolation without using the real provider logic (or if you want to force a specific state like `isAuthenticated: true`), you can render the component using the raw Context Provider with a mocked value object:

```jsx
import { render, screen } from "@testing-library/react";
import { ThemeContext } from "./ThemeContext";
import ThemedButton from "./ThemedButton";

it("renders with forced mock context state", () => {
  const mockContextValue = { theme: "dark", toggleTheme: () => {} };

  render(
    <ThemeContext.Provider value={mockContextValue}>
      <ThemedButton />
    </ThemeContext.Provider>,
  );

  expect(
    screen.getByRole("button", { name: /current theme is dark/i }),
  ).toBeInTheDocument();
});
```

**How do you test React components that use Redux?**
Testing React components that use Redux involves providing a Redux store context to the component during the render phase. Because Redux components rely on `<Provider store="{...}">`, trying to render a connected component without a store will throw an error.

The recommended approach—endorsed by the Redux team—is to create a **custom render utility** that wraps components in a fresh Redux store for every test, allowing you to pass custom initial states (`preloadedState`) when needed.

---

### Step 1: Create a Custom Test Utility (`test-utils.jsx`)

Instead of repeating the `<Provider>` setup in every single test file, create a centralized utility file. This setup uses **Redux Toolkit (`configureStore`)**, but the same pattern applies to standard Redux.

```jsx
// test-utils.jsx
import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Import your root reducer
import counterReducer from "./counterSlice";

export function renderWithProviders(
  ui,
  {
    // Automatically generate a store instance if no store was passed
    preloadedState = {},
    store = configureStore({
      reducer: { counter: counterReducer },
      preloadedState,
    }),
    ...renderOptions
  } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
```

---

### Step 2: Write the Component Test

Now, use your custom `renderWithProviders` function inside your component test files. You can test initial states, user interactions that dispatch actions, and subsequent UI updates.

#### 1. The Component (`Counter.jsx`)

```jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./counterSlice";

export default function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <span data-testid="count-value">{count}</span>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}
```

#### 2. The Test File (`Counter.test.jsx`)

```jsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "./test-utils";
import Counter from "./Counter";

describe("Counter Component with Redux", () => {
  it("renders with default initial state from store", () => {
    // Render using our custom utility
    renderWithProviders(<Counter />);

    // Assert initial value is 0 (or whatever your reducer default is)
    expect(screen.getByTestId("count-value")).toHaveTextContent("0");
  });

  it("renders with a custom preloaded state", () => {
    // Pass preloadedState to test component starting at a different state
    renderWithProviders(<Counter />, {
      preloadedState: { counter: { value: 10 } },
    });

    expect(screen.getByTestId("count-value")).toHaveTextContent("10");
  });

  it("dispatches increment action and updates UI when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Counter />);

    const incrementButton = screen.getByRole("button", { name: /increment/i });

    // Simulate user clicking the button
    await user.click(incrementButton);

    // Assert the store updated and the UI reflects the new state
    expect(screen.getByTestId("count-value")).toHaveTextContent("1");
  });
});
```

---

### Key Best Practices for Testing Redux in React

- **Avoid Global Stores:** Always instantiate a _new_ Redux store inside your custom render wrapper (`configureStore` per test). Sharing a single global store across multiple tests will cause state leaks, leading to flaky, unpredictable test results.
- **Test Slices and Thunks Separately:** While component integration tests verify that UI clicks dispatch actions correctly, you should also write unit tests for your Redux reducers and async thunks in isolation to ensure business logic handles edge cases cleanly.

The key differences between **shallow rendering** and **full DOM rendering** lie in how deeply component trees are rendered and how closely the test environment mimics a real browser.

---

### Comparison Table

| Feature                        | Shallow Rendering                                                                                                             | Full DOM Rendering                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Component Depth**            | Renders **only** the target component in strict isolation. Child components are replaced with placeholder stubs.              | Renders the target component **along with all its child components** in a full recursive tree.                |
| **DOM Environment**            | Does not require a real DOM; runs via lightweight virtual DOM serializers.                                                    | Requires a DOM implementation like `jsdom` to simulate a real browser environment.                            |
| **User Interaction**           | Limited; cannot easily trigger full event propagation (like bubbling) across nested child trees.                              | Fully supported; accurately simulates real browser user behavior, event bubbling, and lifecycles.             |
| **Testing Library Equivalent** | Legacy tool (e.g., Enzyme's `shallow()`). **No modern equivalent in React Testing Library.**                                  | Modern standard (e.g., React Testing Library's `render()`).                                                   |
| **Coupling / Resiliency**      | **High coupling:** Tests break easily during internal refactoring because they assert implementation details and child props. | **Low coupling:** Tests are resilient, focusing strictly on user-facing outputs, accessibility, and behavior. |

---

### Detailed Differences

#### 1. Scope of the Render Tree

- **Shallow Rendering:** If you test a `<UserProfile>` component that contains an `<Avatar>` and a `<Button>`, a shallow render will output the markup for `<UserProfile>` and stub out `<Avatar/>` and `<Button/>` as empty tags. Their internal code, logic, and state are completely ignored.
- **Full DOM Rendering:** Renders `<UserProfile>`, mounts `<Avatar>`, mounts `<Button>`, and executes all their internal logic, hooks, and effects, exactly as it would appear in a live browser.

#### 2. Philosophy and Alignment with React's Evolution

- **Shallow Rendering** was popular in early React history (primarily via Enzyme) because unit testing tools back then were slow and brittle. Developers wanted to test components in complete isolation to speed up test execution.
- **Full DOM Rendering** is the core philosophy behind **React Testing Library**. The React team and modern testing communities strongly favor full rendering because it guarantees that your application actually works from an end-user perspective, capturing integration bugs between parent and child components that shallow rendering completely misses.

**What is the TestRenderer package in React?**
The **`react-test-renderer`** package is an official React utility designed to render React components into pure JavaScript objects without needing a real DOM or a browser environment (like `jsdom`).

### Key Characteristics & Purpose

- **Platform-Independent Rendering:** It renders a React component tree into a serializable JavaScript object structure representing the rendered elements (similar to a DOM tree, but made of plain JS objects).
- **Snapshot Testing:** Historically, its primary use case was enabling **snapshot testing** (especially with Jest). By calling `testRenderer.toJSON()`, developers could capture a JSON representation of a component's output and save it as a reference baseline to catch unintended UI changes.
- **Traversing the Tree:** It provides utilities (`root.find()`, `root.findByType()`, etc.) to inspect component props, instances, and children directly in memory.

---

### Official Deprecation Status

> [!WARNING]
> **`react-test-renderer` is officially deprecated.**

The React team deprecated the package because its APIs encourage inspecting React's internal fiber structures and implementation details, which can easily lead to brittle tests that break during internal framework updates.

Instead of `react-test-renderer`, the React team strongly recommends using:

- **`@testing-library/react`** for standard web applications (using browser-based environments like `jsdom`).
- **`@testing-library/react-native`** for React Native component integration tests.
  react-test-renderer was a utility for rendering React components to a plain JS object tree (rather than the DOM), useful for snapshot testing without a browser environment.

```js
import TestRenderer from "react-test-renderer";
import MyComponent from "./MyComponent";

const renderer = TestRenderer.create(<MyComponent />);
const tree = renderer.toJSON();
expect(tree).toMatchSnapshot();
```

react-test-renderer is deprecated as of React 19, and the React team recommends migrating off it. For component tests, use React Testing Library with a DOM environment (jsdom for Jest, or built-in for Vitest). For snapshot tests, serialize the DOM produced by RTL's render:

```js
import { render } from "@testing-library/react";
const { container } = render(<MyComponent />);
expect(container).toMatchSnapshot();
```
