Here is how a responsive **User Profile Card** looks when built with Traditional CSS versus Tailwind CSS:

### 1. Traditional CSS Approach

Requires two separate files: an HTML structure with custom class names, and an external stylesheet defining the layout, colors, typography, hover states, and media queries.

**`index.html`**

```html
<div class="user-card">
  <img class="user-card__avatar" src="/avatar.jpg" alt="Jane Doe" />
  <div class="user-card__content">
    <h3 class="user-card__name">Jane Doe</h3>
    <p class="user-card__role">Frontend Engineer</p>
    <button class="user-card__btn">Connect</button>
  </div>
</div>

```

**`styles.css`**

```css
.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 24rem;
}

.user-card__avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  object-fit: cover;
}

.user-card__content {
  text-align: center;
}

.user-card__name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.user-card__role {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.user-card__btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
}

.user-card__btn:hover {
  background-color: #1d4ed8;
}

/* Tablet & Desktop layout adjustment */
@media (min-width: 640px) {
  .user-card {
    flex-direction: row;
    text-align: left;
  }
  .user-card__content {
    text-align: left;
  }
}

```

---

### 2. Tailwind CSS Approach

All layout, spacing, typography, transitions, pseudo-states (`hover:`), and responsive breakpoints (`sm:`) are declared directly in the markup.

**`index.html`**

```html
<div class="flex flex-col sm:flex-row items-center gap-4 p-6 bg-white rounded-xl shadow-md max-w-sm">
  <img class="w-20 h-20 rounded-full object-cover" src="/avatar.jpg" alt="Jane Doe" />
  <div class="text-center sm:text-left">
    <h3 class="text-lg font-semibold text-gray-900">Jane Doe</h3>
    <p class="text-sm text-gray-500 mt-1">Frontend Engineer</p>
    <button class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
      Connect
    </button>
  </div>
</div>

```

---

### Key Differences in Practice

| Dimension              | Traditional CSS                                            | Tailwind CSS                                               |
| ---------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| **Files & Context**    | 2 files (`.html` and `.css`)                               | 1 file (markup only)                                       |
| **Naming Overhead**    | Required (BEM: `.user-card__avatar`, etc.)                 | Zero naming required                                       |
| **Responsive Logic**   | Explicit `@media (min-width: ...)` block in CSS            | Inline prefix (`sm:flex-row`, `sm:text-left`)              |
| **Interactive States** | Pseudo-classes (`:hover`, `:focus`) written in CSS         | State prefixes (`hover:bg-blue-700`)                       |
| **Design Consistency** | Arbitrary pixels/hex codes unless CSS variables are set up | Standardized design scale (`p-6`, `text-lg`, `rounded-xl`) |
