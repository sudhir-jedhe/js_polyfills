Vite treats CSS as a first-class citizen in its module graph. You do not need dedicated loaders (like Webpack’s `css-loader` or `style-loader`)—importing CSS works out of the box.

---

### 1. Dev Mode vs. Production Build

| Phase                         | How CSS is Loaded              | Behavior                                                                                                                                                                                           |
| ----------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Development (`vite`)**      | **JS Injected `<style>` Tags** | Vite transforms imported CSS files into JavaScript modules on the fly. When requested, the JS injects a `<style>` block into `<head>`. Updates patch instantly via HMR without a full page reload. |
| **Production (`vite build`)** | **Extracted `.css` Files**     | Rollup extracts all processed CSS from the module graph into standalone `.css` files (e.g., `dist/assets/index-B1a2c.css`) and links them via `<link rel="stylesheet">`.                           |

---

### 2. Supported Import Strategies

#### Direct Import (Standard)

Applies global styles to the application.

```javascript
import './styles/global.css';

```

#### CSS Modules (`.module.css`)

Automatically scoped to prevent naming collisions. Class names are hashed, and the module exports a JavaScript dictionary mapping local names to compiled class names.

```javascript
import styles from './Button.module.css';

const button = document.createElement('button');
button.className = styles.primaryBtn; // e.g. "_primaryBtn_1a2b3c_1"

```

#### Raw CSS String (`?raw`)

Imports the raw CSS text content as a plain string without injecting it into the DOM (useful for Shadow DOM or web components).

```javascript
import rawCss from './styles.css?raw';

const shadow = element.attachShadow({ mode: 'open' });
shadow.innerHTML = `<style>${rawCss}</style><div>Content</div>`;

```

#### Inline CSS URL (`?inline` or `?url`)

* `import cssUrl from './styles.css?url'`: Imports the resolved asset URL to the stylesheet instead of injecting it.
* `import css from './styles.css?inline'`: Returns the processed CSS string while preventing automatic DOM injection.

---

### 3. Preprocessors & PostCSS

* **SCSS / SASS / Less / Stylus:** No Vite plugins required. Simply install the preprocessor compiler into your project:

```bash
npm install -D sass-embedded

```

Then import `.scss` files directly:

```javascript
import './styles/main.scss';

```

* **PostCSS (Tailwind CSS, Autoprefixer):** If a `postcss.config.js` file is present in the project root, Vite automatically routes all processed CSS through your configured PostCSS plugins.

---

### 4. CSS Code Splitting in Production

By default, Vite enables **CSS Code Splitting** (`build.cssCodeSplit: true`).

* When a JavaScript chunk is dynamically imported (e.g., `const Admin = () => import('./Admin.js')`), Vite extracts the CSS used exclusively by `Admin.js` into its own chunk (`Admin.css`).
* When `Admin.js` is loaded at runtime, Vite automatically injects a `<link rel="stylesheet">` for `Admin.css` in parallel to prevent layout shifts.
* If you prefer a single unified CSS file for the entire application, disable it in `vite.config.js`:

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    cssCodeSplit: false // Bundles all CSS across all routes into one stylesheet
  }
});

```
