*** copy 05-formdata-and-fetch-submission.md ***

# Snippet: `FormData` + `fetch` Submission

```html
<form id="contact-form">
  <label for="name">Name</label>
  <input id="name" name="name" type="text" required>

  <label for="message">Message</label>
  <textarea id="message" name="message" required></textarea>

  <label for="attachment">Attachment</label>
  <input id="attachment" name="attachment" type="file">

  <button type="submit">Send</button>
</form>
```

```js
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent the default full-page navigation/reload

  const formData = new FormData(form); // captures every named field, including the file

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: formData, // fetch sets Content-Type: multipart/form-data with the correct boundary automatically
    });
    if (!res.ok) throw new Error(`Server responded ${res.status}`);
    console.log('Sent successfully');
    form.reset();
  } catch (err) {
    console.error('Submission failed:', err);
  }
});
```

Never manually set `Content-Type` when sending a `FormData` body via `fetch` — the browser needs to generate the multipart boundary string itself and include it in the header; overriding the header yourself breaks the boundary and the server can't parse the body.
