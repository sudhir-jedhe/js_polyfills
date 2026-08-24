Setting up `@welldone-software/why-did-you-render` (WDYR) in a TypeScript application requires initializing the library before any React code executes and configuring the JSX runtime appropriately.

---

### Step 1: Install the Dependency

Install WDYR as a development dependency:

```bash
npm install --save-dev @welldone-software/why-did-you-render
# or
pnpm add -D @welldone-software/why-did-you-render

```

---

### Step 2: Create the WDYR Initialization File

Create a dedicated file, typically `src/wdyr.ts`. It must only execute in development mode.

```typescript
// src/wdyr.ts
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false, // Set to true to track all React.memo / PureComponent
    trackHooks: true,              // Tracks hook-induced re-renders (e.g. useState/useMemo)
    logOwnerReasons: true,         // Logs which parent caused the render
    collapseGroups: true,          // Collapses console log groups for cleaner output
  });
}

```

---

### Step 3: Import WDYR at the Absolute Top of Your Entry Point

WDYR **must** be imported before `React`, `react-dom`, or any application components are loaded.

```typescript
// src/main.tsx or src/index.tsx
import './wdyr'; // 👈 Must be the very first import!

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

---

### Step 4: Configure the Build Tool (Vite / Next.js / Webpack)

If your project uses modern JSX transforms (`react/jsx-runtime`), WDYR needs access to the classic JSX creation calls in development to inspect element props accurately.

#### For Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@welldone-software/why-did-you-render',
    }),
  ],
});

```

#### For Next.js / Custom Babel (`.babelrc` or `babel.config.js`)

```json
{
  "presets": [
    [
      "next/babel",
      {
        "preset-react": {
          "importSource": "@welldone-software/why-did-you-render"
        }
      }
    ]
  ]
}

```

---

### Step 5: Track Specific Components

To monitor a component, assign the static property `whyDidYouRender = true` to it.

```tsx
// src/components/UserProfile.tsx
import React, { memo } from 'react';

interface UserProps {
  user: { name: string; email: string };
  onUpdate: () => void;
}

export const UserProfile: React.FC<UserProps> = memo(({ user, onUpdate }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
});

// Enable tracking for this specific component
UserProfile.whyDidYouRender = true;

```

---

### Step 6: Interpreting the Console Output

When an unnecessary render occurs (such as passing a newly created object or inline function reference with identical contents), WDYR prints a grouped diagnostic message directly in the browser console:

```text
[WhyDidYouRender] UserProfile re-rendered because of props changes:
  props.onUpdate: [Function] !== [Function]
  (Different references with identical source code)
  
  props.user: { name: "Alice", email: "alice@example.com" } !== { name: "Alice", email: "alice@example.com" }
  (Different objects with deep equality)

```

**Common fixes signaled by WDYR output:**

* **Function Reference Inequality:** Wrap the offending handler in `useCallback`.
* **Object/Array Reference Inequality:** Wrap calculations in `useMemo` or move static objects outside the component body.
* **Redundant State Setting:** Check if `setState` is called with identical primitive values.
