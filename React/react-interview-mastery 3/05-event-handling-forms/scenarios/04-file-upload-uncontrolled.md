***  04-file-upload-uncontrolled.md ***

# Scenario: File upload form needs to read a selected file, but the input keeps warning about being uncontrolled/controlled

You're building a file upload form and initially tried to control the `<input type="file">` the same way as text inputs (`value={file}`), but React throws warnings and the browser refuses to set the input's value programmatically for security reasons.

**Approach:** File inputs are a case where you must use the uncontrolled pattern — read the selected file via `ref` or directly from the change event, and never attempt to set `value` on it:

```jsx
function AvatarUpload({ onUpload }) {
  const fileInputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(null);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file)); // local preview, derived state, not controlling the input itself
  }

  function handleSubmit(e) {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (file) onUpload(file);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
      {preview && <img src={preview} alt="preview" width={100} />}
      <button type="submit">Upload</button>
    </form>
  );
}
```

The input itself stays uncontrolled (no `value` prop); React only reads from it via the `ref` or the change event's `e.target.files`, while any derived UI (like a preview) is tracked in separate, normal state.
