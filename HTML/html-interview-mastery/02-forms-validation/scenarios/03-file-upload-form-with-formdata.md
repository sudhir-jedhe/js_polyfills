***  03-file-upload-form-with-formdata.md ***

# Scenario: Building a File Upload Form with Progress and Validation

**Scenario:** Build a profile picture upload form: single image file, max 5MB, must be `.jpg`/`.png`, with a client-side size/type check before upload (to avoid wasting the user's time on an upload that the server will reject anyway) and using `fetch` + `FormData` for the actual submission.

**Approach:**

```html
<form id="avatar-form">
  <label for="avatar">Profile picture (JPG or PNG, max 5MB)</label>
  <input id="avatar" name="avatar" type="file" accept="image/jpeg,image/png" required>
  <p id="avatar-error" role="alert" hidden></p>
  <button type="submit">Upload</button>
</form>
```

```js
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

const form = document.getElementById('avatar-form');
const input = document.getElementById('avatar');
const errorEl = document.getElementById('avatar-error');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const file = input.files[0];
  if (!file) return; // `required` already covers this on real submit attempts

  if (!ALLOWED_TYPES.includes(file.type)) {
    showError('Please choose a JPG or PNG image.');
    return;
  }
  if (file.size > MAX_BYTES) {
    showError(`File is ${(file.size / 1_048_576).toFixed(1)}MB — max allowed is 5MB.`);
    return;
  }

  const formData = new FormData(form); // includes the file under the "avatar" key automatically

  try {
    const res = await fetch('/api/profile/avatar', { method: 'POST', body: formData });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    console.log('Uploaded successfully');
  } catch (err) {
    showError('Upload failed. Please try again.');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
    input.focus();
  }
});
```

**Key decisions:**
- `accept="image/jpeg,image/png"` narrows what the native file picker shows/allows by default, but it is a **UX hint, not a security boundary** — a user can still bypass it (e.g. via drag-and-drop, or selecting "all files") so the explicit `file.type`/`file.size` checks in JS are still necessary, and the server must independently re-validate both, since client-side checks can always be bypassed entirely by a non-browser client hitting the API directly.
- `FormData(form)` is used directly rather than manually appending — it automatically picks up the file input's current selection under its `name` attribute, so there's no need to manually call `formData.append('avatar', file)`.
- No explicit `enctype` is needed since we're not doing a native form submission at all (`fetch` builds the multipart body and sets the correct header itself when given a `FormData` body).
