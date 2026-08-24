# Reusable `<Modal>` Needs a Different Body Every Time It's Used

**Scenario:** You're building a `<Modal>` component used across the app — a confirmation dialog in one place, a form in another, an image gallery in a third — and the current implementation hardcodes the modal's body content, requiring a new prop (`confirmMessage`, `formFields`, `images`) for every use case.

**Approach:** This is a composition problem, not a props-shape problem. Instead of the modal knowing about every possible content type, let it accept `children`:

```jsx
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// usage — modal doesn't need to know what's inside
<Modal isOpen={isOpen} onClose={close} title="Confirm delete">
  <p>Are you sure? This can't be undone.</p>
  <button onClick={confirmDelete}>Delete</button>
</Modal>

<Modal isOpen={isOpen} onClose={close} title="Edit profile">
  <ProfileForm user={user} onSave={save} />
</Modal>
```

`Modal` now only owns layout/open-close/overlay concerns; the caller fully controls content via `children`, so no growing list of content-specific props is needed.
