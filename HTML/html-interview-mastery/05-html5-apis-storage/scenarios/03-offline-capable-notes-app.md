*** copy 03-offline-capable-notes-app.md ***

# Scenario: Notes App That Should Work Offline and Handle Large Attachments

**Scenario:** You're building a notes app where each note can have a title, body text, and an optional image attachment. It needs to work fully offline (users write notes on a plane, sync later), and some users end up with hundreds of notes plus several MB of attached images. Early in development, someone stored everything in `localStorage` as one big JSON blob; now it's throwing `QuotaExceededError` for heavy users, and every save/load noticeably freezes the UI. What storage should this actually use, and how do you fix it?

**Diagnosis:** `localStorage` is the wrong tool for two independent reasons: (1) capacity — `localStorage` typically caps around 5–10MB per origin, easily blown through by images plus growing note text; (2) it's synchronous and string-only, so `JSON.stringify`-ing and `JSON.parse`-ing an ever-larger blob on every save/load blocks the main thread longer as the dataset grows, which is exactly the "UI freeze" symptom described. **IndexedDB** solves both: it supports hundreds of MB+ (quota tied to available disk space, not a fixed small cap), it's asynchronous (no main-thread blocking), and it natively stores structured data and `Blob`s (so images don't need base64-string encoding, which would bloat them ~33% and still hit the same synchronous-JSON problem).

**Fix — migrate to IndexedDB, one record per note:**

```js
const dbRequest = indexedDB.open('notes-db', 1);

dbRequest.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore('notes', { keyPath: 'id' });
  store.createIndex('updatedAt', 'updatedAt'); // enables sorted queries without loading everything
};

function saveNote(db, note) {
  const tx = db.transaction('notes', 'readwrite');
  tx.objectStore('notes').put(note); // note.image can be a Blob directly, no base64 needed
  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

function getAllNotes(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction('notes', 'readonly');
    const request = tx.objectStore('notes').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
```

**Why not keep using `localStorage` for small metadata and IndexedDB only for images?** That's a reasonable middle-ground some apps use — small settings/preferences in `localStorage`, bulk data in IndexedDB — but since notes themselves can grow unpredictably (long text, many notes), keeping the *entire* note record (including the image `Blob`) in one IndexedDB object store per note avoids ever re-introducing the "one giant blob" anti-pattern that caused the original bug: each note is now its own transaction-sized unit, so saving one note never requires re-serializing every other note.

**Offline sync note:** IndexedDB handles local persistence; actually syncing to a server when connectivity returns is a separate concern typically handled with a Service Worker's Background Sync API or a simple "retry on reconnect" queue — worth mentioning if asked, but distinct from the storage-choice question itself.
