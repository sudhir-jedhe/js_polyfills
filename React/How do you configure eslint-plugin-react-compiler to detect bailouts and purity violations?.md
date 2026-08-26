The `eslint-plugin-react-compiler` enforces the Rules of React that the React Compiler relies on. It identifies impure patterns, illegal mutations, and conditions that cause the compiler to **bail out** (skip optimizing a component or hook).

---

### 1. Installation

Install the ESLint plugin via your package manager:

```bash
npm install -D eslint-plugin-react-compiler
# or
pnpm add -D eslint-plugin-react-compiler
# or
yarn add -D eslint-plugin-react-compiler

```

---

### 2. ESLint Configuration

#### Flat Config (`eslint.config.js` / `eslint.config.mjs` — ESLint v9+)

```javascript
import reactCompiler from 'eslint-plugin-react-compiler';

export default [
  // Other configs (e.g., js.configs.recommended, typescript-eslint)...
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      // Enables compiler error detection for invalid React patterns
      'react-compiler/react-compiler': 'error',
    },
  },
];

```

#### Legacy Config (`.eslintrc.json` / `.eslintrc.js` — ESLint v8)

```json
{
  "plugins": ["eslint-plugin-react-compiler"],
  "rules": {
    "react-compiler/react-compiler": "error"
  }
}

```

---

### 3. Advanced Configuration: Custom Hooks & Severity

If your application uses custom hooks that manage state or return memoized values with names that don't follow standard conventions, you can configure options directly inside the rule:

```javascript
// eslint.config.js
export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': [
        'error',
        {
          // Add custom hook names that follow hook rules
          sources: (filename) => {
            return filename.includes('src/');
          },
        },
      ],
    },
  },
];

```

* **`"error"` (Recommended for CI):** Prevents merging code that violates the Rules of React or causes compiler compilation failures.
* **`"warn"` (Recommended for initial adoption):** Surfaces existing bailouts across a legacy codebase without breaking builds.

---

### 4. Common Violations Caught by the Plugin

The plugin identifies specific anti-patterns that prevent safe compiler optimization:

#### A. Mutating Props or Existing State Variables

```tsx
function ItemList({ items }: { items: string[] }) {
  // ❌ ESLint Error: Mutating a prop or value created outside this render
  items.push('New Item');

  return <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>;
}

```

* **Fix:** Create a new copy instead (`const nextItems = [...items, 'New Item']`).

#### B. Reading/Writing `ref.current` During Render

```tsx
function Timer({ duration }: { duration: number }) {
  const countRef = useRef(0);

  // ❌ ESLint Error: Cannot read/write ref.current in the body of a render
  countRef.current += 1;

  return <div>Render count: {countRef.current}</div>;
}

```

* **Fix:** Read and mutate `ref.current` exclusively inside event handlers or `useEffect`.

#### C. Mutating Variables After Passing to Hooks / JSX

```tsx
function Profile({ user }: { user: User }) {
  const formattedUser = { ...user };
  useCustomEffect(formattedUser);

  // ❌ ESLint Error: Mutating variable after it has been passed into a hook
  formattedUser.modified = true;

  return <div>{formattedUser.name}</div>;
}

```

---

### 5. Running in CI / Build Pipeline

Add a dedicated linting script to your `package.json` to verify that no bailouts or rule violations reach production:

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings 0",
    "lint:compiler": "eslint . --rule 'react-compiler/react-compiler: error'"
  }
}

```

Running `npm run lint` in your GitHub Actions or GitLab CI pipeline will flag any purity violations or code that prevents automatic memoization before merging.
