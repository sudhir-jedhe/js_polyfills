assing refs in React 19
Overview
In this challenge, you will build a simple “Issue Creator” modal. The goal is to demonstrate how refs can be used to control focus in a component that is conditionally rendered.

The challenge focuses on understanding how refs are passed and used across components in a React 19-style API, without relying on forwardRef.

Requirements
Clicking the “Add issue” button must render the IssueModal.
When the modal opens, the <textarea> inside it must automatically receive focus.
Clicking Cancel must close the modal.
Clicking Create must also close the modal.
The solution must not use forwardRef.
Notes
The challenge focuses on understanding how refs are passed and used across components in a React 19-style API, without relying on forwardRef.
Create the ref in the parent and pass it directly to the IssueModal component.
The ref must point to the <textarea> element inside the modal.
Focus should be handled from the parent when the modal becomes visible.
Use IssueModalPre19 as a reference to understand the previous implementation pattern with forwardRef.
Tests
renders the app title
focuses the issue textarea when opening the modal
opens the modal when clicking 'add issue'
close the when clicking cancel
close the modal when clicking cancel


# React 19 – Assigning Refs Without `forwardRef`

In React 19, refs can be passed directly as a prop to function components, removing the need for `forwardRef`. [\[bing.com\]](https://bing.com/search?q=React+19+refs+passed+as+props+without+forwardRef+component+ref+prop+textarea+focus+example), [\[plainenglish.io\]](https://plainenglish.io/react/react-19-deprecates-forwardref-a-guide-to-passing-ref-as-a-standard-prop), [\[blog.saeloun.com\]](https://blog.saeloun.com/2025/03/24/react-19-ref-as-prop/)

For this challenge:

✅ Click **Add Issue** → open modal

✅ Focus textarea automatically

✅ Cancel closes modal

✅ Create closes modal

✅ No `forwardRef`

✅ Parent owns the ref

✅ Parent handles focus

***

# App.jsx

```jsx
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import IssueModal from "./IssueModal";

export default function App() {
  const [open, setOpen] =
    useState(false);

  const textareaRef =
    useRef(null);

  useEffect(() => {
    if (
      open &&
      textareaRef.current
    ) {
      textareaRef.current.focus();
    }
  }, [open]);

  return (
    <div>
      <h1>
        Issue Creator
      </h1>

      <button
        onClick={() =>
          setOpen(true)
        }
      >
        Add issue
      </button>

      {open && (
        <IssueModal
          ref={textareaRef}
          onClose={() =>
            setOpen(false)
          }
        />
      )}
    </div>
  );
}
```

***

# IssueModal.jsx

React 19 allows `ref` to be received like a normal prop. [\[bing.com\]](https://bing.com/search?q=React+19+refs+passed+as+props+without+forwardRef+component+ref+prop+textarea+focus+example), [\[blog.saeloun.com\]](https://blog.saeloun.com/2025/03/24/react-19-ref-as-prop/)

```jsx
export default function IssueModal({
  ref,
  onClose,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal"
    >
      <h2>
        Create Issue
      </h2>

      <textarea
        ref={ref}
        placeholder="Describe issue..."
      />

      <div>
        <button
          type="button"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onClose}
        >
          Create
        </button>
      </div>
    </div>
  );
}
```

***

# TypeScript Version

```tsx
import { Ref } from "react";

interface IssueModalProps {
  ref?: Ref<HTMLTextAreaElement>;
  onClose: () => void;
}

export default function IssueModal({
  ref,
  onClose,
}: IssueModalProps) {
  return (
    <div>
      <textarea ref={ref} />

      <button
        onClick={onClose}
      >
        Cancel
      </button>

      <button
        onClick={onClose}
      >
        Create
      </button>
    </div>
  );
}
```

Using `React.Ref<HTMLTextAreaElement>` is a common TypeScript approach for React 19 ref-as-prop components. [\[stackoverflow.com\]](https://stackoverflow.com/questions/79300987/react-19-ref-as-prop-and-typescript), [\[iifx.dev\]](https://iifx.dev/en/articles/456404573/modern-component-patterns-implementing-react-19-ref-props-in-typescript)

***

# Why It Passes All Tests

### Open Modal

```jsx
setOpen(true)
```

✅ renders modal

***

### Auto Focus

```jsx
useEffect(() => {
  textareaRef.current?.focus();
}, [open]);
```

✅ textarea focused when modal opens

***

### Cancel

```jsx
onClick={onClose}
```

✅ closes modal

***

### Create

```jsx
onClick={onClose}
```

✅ closes modal

***

### No `forwardRef`

```jsx
<IssueModal
  ref={textareaRef}
/>
```

and

```jsx
function IssueModal({ ref })
```

✅ React 19 pattern without `forwardRef` [\[bing.com\]](https://bing.com/search?q=React+19+refs+passed+as+props+without+forwardRef+component+ref+prop+textarea+focus+example), [\[plainenglish.io\]](https://plainenglish.io/react/react-19-deprecates-forwardref-a-guide-to-passing-ref-as-a-standard-prop)

***

# Senior Interview Answer

> In React 19, `forwardRef` is no longer required for function components. I create the ref in the parent using `useRef`, pass it directly to the modal as a prop, attach it to the `<textarea>`, and use an effect in the parent to focus the element when the modal becomes visible. This keeps focus management in the parent while keeping the modal component simple and reusable. [\[bing.com\]](https://bing.com/search?q=React+19+refs+passed+as+props+without+forwardRef+component+ref+prop+textarea+focus+example), [\[blog.saeloun.com\]](https://blog.saeloun.com/2025/03/24/react-19-ref-as-prop/)
