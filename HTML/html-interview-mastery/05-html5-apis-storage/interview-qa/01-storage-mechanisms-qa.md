*** copy 01-storage-mechanisms-qa.md ***

# Interview Q&A — Storage Mechanisms

**Q: What's the difference between `localStorage` and `sessionStorage`?**
Both share the same key/value string API, but `localStorage` persists indefinitely (until explicitly cleared) and is shared across all tabs of the same origin, while `sessionStorage` is cleared when the tab closes and is isolated per tab — even two tabs on the same site have separate `sessionStorage`.

**Q: Why would you choose a cookie over `localStorage` for an auth token?**
Cookies can be marked `HttpOnly`, making them completely invisible to JavaScript — an XSS attack that runs arbitrary JS on the page still can't read an `HttpOnly` cookie, whereas anything in `localStorage` is fully readable by any script on the page, including a malicious injected one. Cookies are also automatically sent by the browser on matching requests, which is convenient for server-side session validation without extra client JS.

**Q: What's the main downside of cookies compared to Web Storage?**
Cookies are automatically attached to every matching HTTP request (including requests for images, stylesheets, etc.), adding overhead to every request to that domain, and their capacity is much smaller — roughly 4KB per cookie versus several MB for Web Storage.

**Q: Why is IndexedDB asynchronous while `localStorage` is synchronous?**
`localStorage` was designed for small, quick key/value reads/writes where blocking briefly is acceptable. IndexedDB is designed for larger, more complex data (structured records, files, thousands of rows), where a synchronous API would risk blocking the main thread for a noticeable, UI-freezing amount of time — so it's built around events/Promises and transactions instead.

**Q: Can you store a JavaScript object directly in `localStorage`?**
Not directly — `localStorage` only stores strings. Passing a non-string value to `setItem` implicitly calls `.toString()` on it, so a plain object becomes the useless string `"[object Object]"`. You must `JSON.stringify()` before storing and `JSON.parse()` after reading.

**Q: What happens when you exceed a storage quota?**
`localStorage`/`sessionStorage` throw a `QuotaExceededError` `DOMException` on the write that pushes past the limit — it should be wrapped in a `try/catch`. IndexedDB behaves similarly but its quota is much larger and typically tied to available disk space rather than a fixed small cap.

**Q: Is Web Storage accessible from a Web Worker?**
No — `localStorage`/`sessionStorage` are synchronous APIs and are disallowed inside Workers for that reason. IndexedDB, being asynchronous, **is** accessible from within a Worker.
