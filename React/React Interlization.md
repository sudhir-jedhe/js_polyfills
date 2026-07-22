**How do you localize React applications?**
Localizing a React application (often called **i18n** for internationalization and **l10n** for localization) involves extracting hardcoded text from your components, formatting dates, numbers, and currencies according to regional rules, and managing language switching seamlessly.

Here is a practical, step-by-step guide to localizing a modern React application.

---

### Step 1: Choose an i18n Library

While you can build localization from scratch, using a dedicated library handles complex edge cases like pluralization rules, interpolation, and text direction. The top choices in the React ecosystem include:

- **`react-i18next`**: The most popular and feature-rich library. Excellent for large teams, supports lazy-loading translation files, and has a massive plugin ecosystem.
- **`react-intl` (FormatJS)**: The standard-bearer for the **ICU Message Format**. Perfect if your organization relies on strict formatting rules for plurals, dates, and currencies.
- **`LinguiJS`**: A lightweight, compiler-driven alternative that compiles messages into tight JavaScript functions at build time, yielding near-zero runtime overhead.
- **`next-intl`**: The go-to standard if you are building a full-stack application using **Next.js**.

---

### Step 2: Set Up and Initialize (Using `react-i18next` as an Example)

First, install the core dependencies:

```bash
npm install i18next react-i18next i18next-browser-languagedetector

```

Next, create an initialization configuration file (`src/i18n.js`) where you define your default language, fallback languages, and translation resources:

```javascript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // Automatically detect user browser language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    resources: {
      en: {
        translation: {
          welcome: "Welcome back, {name}!",
          items_count: "You have {count} item in your cart.",
          items_count_plural: "You have {count} items in your cart.",
        },
      },
      es: {
        translation: {
          welcome: "¡Bienvenido de nuevo, {name}!",
          items_count: "Tienes {count} artículo en tu carrito.",
          items_count_plural: "Tienes {count} artículos en tu carrito.",
        },
      },
    },
    interpolation: {
      escapeValue: false, // React already escapes values safely from XSS
    },
  });

export default i18n;
```

Import this `i18n.js` file at the root entry point of your application (e.g., `main.jsx` or `index.js`).

---

### Step 3: Use Translations Inside Components

Use the `useTranslation` hook inside your components to retrieve the translation function (`t`) and the language-switching function (`i18n.changeLanguage`).

```jsx
import React from "react";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div>
      <nav>
        <button onClick={() => changeLanguage("en")}>English</button>
        <button onClick={() => changeLanguage("es")}>Español</button>
      </nav>

      <h1>{t("welcome", { name: "Sarah" })}</h1>
      <p>{t("items_count", { count: 3 })}</p>
    </div>
  );
}

export default Dashboard;
```

---

### Step 4: Localize Numbers, Dates, and Currencies

Never hardcode formatting for numbers, dates, or currencies, as patterns vary drastically by region (e.g., US uses `MM/DD/YYYY` while much of Europe uses `DD/MM/YYYY`). JavaScript's native `Intl` APIs—often wrapped cleanly by i18n libraries—handle this natively:

```javascript
// Formatting currency based on active locale
const price = 1250.75;
const formattedUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(price); // "$1,250.75"

const formattedEUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
}).format(price); // "1.250,75 €"
```

---

### Step 5: Handle Text Direction (LTR vs. RTL)

If you support languages written right-to-left (RTL) like Arabic, Hebrew, or Farsi, you must dynamically adjust the document direction (`dir`) attribute on the HTML root element.

You can listen for language changes via your i18n instance:

```javascript
i18n.on("languageChanged", (lng) => {
  const rtlLanguages = ["ar", "he", "fa"];
  document.dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});
```

---

### Best Practices for Production

- **Avoid Concatenating Sentences:** Never build UI text like `t('Hello') + ' ' + userName` because sentence structures and word orders differ across languages. Instead, use interpolation variables: `t('greeting', { name: userName })`.
- **Externalize Translation Files:** As projects scale, move JSON translation objects out of code files and into dedicated Translation Management Systems (TMS) like Crowdin, Lokalise, or Tolgee so translators can update strings without touching the source code repository.
- **Enforce Type Safety:** Use TypeScript alongside your i18n configurations to ensure that passing invalid or missing translation keys throws a build or compile-time error.

**`react-intl`** is a popular library used for internationalizing (i18n) and localizing React applications. It is part of **FormatJS**—a collection of libraries that standardize JavaScript internationalization using official ECMAScript `Intl` APIs and the **ICU MessageFormat** standard.

Rather than reinventing how dates, numbers, or pluralization rules work across different cultures, `react-intl` leverages browser-native localization engines wrapped in a declarative, React-friendly API.

---

### Key Features of `react-intl`

#### 1. Declarative React Components

`react-intl` provides a rich set of built-in components that make formatting data directly inside JSX seamless:

- `<FormattedMessage>`: Translates text strings using unique IDs and supports variable interpolation.
- `<FormattedNumber>`: Formats raw numbers, percentages, and currencies based on regional rules (e.g., currency symbols, decimal vs. comma separators).
- `<FormattedDate>` & `<FormattedTime>`: Converts raw JavaScript `Date` objects into localized date and time strings.
- `<FormattedRelativeTime>`: Automatically displays relative time expressions like _"2 days ago"_ or _"in 5 minutes"_ and can update dynamically over time.
- `<FormattedList>`: Joins arrays of strings or components into a grammatically correct localized list (e.g., "A, B, and C" vs. "A, B y C").

#### 2. Native Support for ICU MessageFormat

One of `react-intl`'s strongest features is its full support for the **ICU MessageFormat** standard. This allows complex grammatical constructs to be handled right inside a single translation string, including:

- **Pluralization:** Automatically handling singular, plural, and zero-count variations depending on the language's specific rules (some languages have multiple plural forms).

```jsx
<FormattedMessage
  id="cart.items"
  defaultMessage="{count, plural, one {1 item} other {# items}}"
  values={{ count }}
/>
```

- **Select/Gender Conditioning:** Switching text based on variables like gender or user status (e.g., _"{gender, select, male {He liked this} female {She liked this} other {They liked this}}"_).

#### 3. The `useIntl` Hook (Imperative API)

While components are great for UI trees, you often need formatted strings outside of JSX—such as for HTML `title` tags, `aria-label` attributes, form validation errors, or browser notifications. The `useIntl` hook gives you direct access to formatting functions like `intl.formatMessage()` and `intl.formatDate()` anywhere inside your functional components.

```jsx
import { useIntl } from "react-intl";

function MyComponent() {
  const intl = useIntl();
  const title = intl.formatMessage({ id: "nav.home", defaultMessage: "Home" });

  return <button title={title}>{title}</button>;
}
```

#### 4. Context-Driven State via `<IntlProvider>`

The library uses the React Context API via an `<IntlProvider>` wrapper component placed at the root of your application. It manages the current active locale (e.g., `es-ES`, `fr-FR`) and active translation dictionaries, making them instantly available to all nested child components without prop drilling. Changing the locale prop triggers a clean, app-wide re-render with the new language rules.

#### 5. First-Class TypeScript Support

`react-intl` is written in TypeScript, providing strong typing out of the box. Advanced setups allow you to override global types so your translation message IDs are statically checked—meaning typing a non-existent translation key layout triggers a build or compile-time error.

#### 6. Message Extraction Tooling (FormatJS CLI)

To prevent developers from having to manually track JSON translation files, the broader FormatJS ecosystem offers command-line tools that scan your source code, automatically extract all `<FormattedMessage>` defaults and IDs, and compile them into clean translation templates ready to be sent to translators.
