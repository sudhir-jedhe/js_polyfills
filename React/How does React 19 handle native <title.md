*** copy How does React 19 handle native <title.md ***

In React 19, support for **Document Metadata Hoisting** allows you to render `<title>`, `<meta>`, and `<link>` (rel="canonical", rel="icon", etc.) tags directly inside any component in your tree.

React automatically discovers these tags, hoists them to the document `<head>`, manages updates when state changes, and replaces external head management libraries like `react-helmet` or `react-helmet-async`.

---

**1. Writing Metadata Directly Inside Deeply Nested Components**

You no longer need to manage top-level wrappers or state lifecycles to set page metadata. Simply declare the `<title>` and `<meta>` tags inside the component that requires them:

```tsx
export function BlogPost({ post }: { post: { title: string; summary: string } }) {
  return (
    <article>
      {/* React 19 extracts and hoists these directly to document <head> */}
      <title>{post.title} | Tech Blog</title>
      <meta name="description" content={post.summary} />
      <meta property="og:title" content={post.title} />
      <link rel="canonical" href={`https://example.com/posts/${post.id}`} />

      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </article>
  );
}

```

When rendered, React prevents these tags from appearing in the DOM `<body>` and attaches them to the document's `<head>`.

---

**2. Cascade and Precedence (Deepest Component Wins)**

When multiple components in the tree define a `<title>` or the same `<meta>` tag, React applies a **nearest-leaf / deepest-component-wins** rule:

```tsx
// 1. Root Layout sets the default title
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <title>Default App Title</title>
      <meta name="description" content="Default app description" />
      {children}
    </div>
  );
}

// 2. Deeply nested page overrides the title
function SettingsPage() {
  return (
    <div>
      {/* This overrides "Default App Title" in <head> */}
      <title>User Settings</title>
      <h2>Settings Form</h2>
    </div>
  );
}

```

* When `SettingsPage` mounts, the document title becomes **"User Settings"**.
* If `SettingsPage` unmounts (e.g., the user navigates away), React automatically reverts the `<title>` back to **"Default App Title"**.

---

**3. Matching and Deduplication for `<meta>` and `<link>` Tags**

React matches and deduplicates metadata based on standard HTML identifying attributes:

* **Named Meta:** `<meta name="...">` is keyed and deduplicated by its `name` attribute.
* **Open Graph / Property Meta:** `<meta property="...">` is keyed by its `property` attribute.
* **HTTP Equiv:** `<meta http-equiv="...">` is keyed by `http-equiv`.
* **Rel Links:** `<link rel="...">` is keyed by `rel` and `href`.

If two mounted components define `<meta name="description" content="...">`, the deeper component's `content` value overrides the ancestor's value in `<head>`.

---

**4. Server-Side Rendering (SSR) & Streaming**

During Server-Side Rendering or React Server Components (RSC) execution:

* React discovers all `<title>` and `<meta>` tags during the server render pass.
* It places them into the initial `<head>` chunk of the streamed HTML response before the body chunks are sent.
* **SEO-Ready:** Search engine crawlers receive fully populated, accurate `<title>` and Open Graph tags in the initial HTML payload without requiring client-side JavaScript execution.

---

**Summary of Capabilities**

| Feature                   | React 19 Native Behavior                                                   |
| ------------------------- | -------------------------------------------------------------------------- |
| **Placement**             | Allowed anywhere in the component hierarchy (Server or Client components). |
| **DOM Injection**         | Extracted from component JSX and hoisted directly into document `<head>`.  |
| **Override Hierarchy**    | Deepest / most specific component in the tree takes precedence.            |
| **Unmount Cleanup**       | Automatically restores previous ancestor values upon unmounting.           |
| **SSR Streaming**         | Flushed into initial `<head>` HTML for optimal SEO performance.            |
| **Third-Party Libraries** | Completely replaces `react-helmet` and custom document head managers.      |
