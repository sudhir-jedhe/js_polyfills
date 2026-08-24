Setting up Tailwind CSS depends on your build tool or framework. Here are the step-by-step guides for the most common project environments.

---

### Option 1: Next.js (App Router)

1. **Install Tailwind CSS & PostCSS plugin:**
Run the following command in your project root:

```bash
npm install tailwindcss @tailwindcss/postcss postcss

```

1. **Configure PostCSS:**
Create a `postcss.config.mjs` file in your root directory:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

```

1. **Import Tailwind in your CSS:**
Add the `@import` directive to `app/globals.css`:

```css
@import "tailwindcss";

```

1. **Start using Tailwind classes:**
Use Tailwind utility classes directly in your React components:

```tsx
export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      <h1 className="text-3xl font-bold">Hello Tailwind CSS!</h1>
    </main>
  );
}

```

---

### Option 2: Vite (React, Vue, Svelte, or Vanilla)

1. **Install Tailwind CSS & Vite Plugin:**
Install the dedicated Vite plugin:

```bash
npm install tailwindcss @tailwindcss/vite

```

1. **Add the plugin to vite.config.ts:**
Update your `vite.config.ts` (or `vite.config.js`):

```typescript
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});

```

1. **Import Tailwind in your entry stylesheet:**
Add the `@import` directive to your main CSS file (e.g., `src/index.css` or `src/style.css`):

```css
@import "tailwindcss";

```

---

### Option 3: Standalone Tailwind CLI (Static HTML / General Projects)

1. **Install Tailwind CSS CLI:**
Install Tailwind locally:

```bash
npm install -D tailwindcss @tailwindcss/cli

```

1. **Create your input CSS file:**
Create `src/input.css` and add:

```css
@import "tailwindcss";

```

1. **Run the CLI build process:**
Start the build process in watch mode to generate your output stylesheet:

```bash
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch

```

1. **Link output CSS in your HTML:**
Include `./dist/output.css` inside your HTML `<head>`:

```html
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./dist/output.css" rel="stylesheet" />
  </head>
  <body class="p-8 bg-slate-100">
    <h1 class="text-2xl font-bold text-indigo-600">Tailwind CLI is running!</h1>
  </body>
</html>

```
