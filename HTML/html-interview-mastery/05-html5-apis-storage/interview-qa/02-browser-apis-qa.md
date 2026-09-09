***  02-browser-apis-qa.md ***

# Interview Q&A — Drag & Drop, Geolocation, Web Workers

**Q: Why doesn't the `drop` event fire even though I'm dragging over a valid-looking target?**
Because by default no element accepts drops — the `dragover` handler must call `event.preventDefault()` to opt the element in as a valid drop target. Without that call, the browser rejects the drop before it ever reaches the `drop` event.

**Q: What's the difference between `effectAllowed` and `dropEffect` on `DataTransfer`?**
`effectAllowed`, set during `dragstart`, declares what operations the *drag source* permits (e.g., `'move'`, `'copy'`, `'copyMove'`). `dropEffect`, set during `dragover`/`drop` on the *target*, indicates what operation will actually occur and affects the cursor shown — it must be one of the values allowed by `effectAllowed` to have effect.

**Q: What are the two methods for getting the user's location, and how do they differ?**
`getCurrentPosition()` fetches the location once and calls its success callback a single time. `watchPosition()` calls its success callback repeatedly whenever the device's position changes, and returns a watch ID that must be passed to `clearWatch()` to stop tracking.

**Q: What happens if the user denies the geolocation permission prompt?**
The error callback fires immediately with `error.code === error.PERMISSION_DENIED` (`1`). Critically, the browser will not automatically re-prompt on subsequent calls to `getCurrentPosition`/`watchPosition` from that origin — the user has to change the permission manually through browser settings.

**Q: Does the Geolocation API work on a plain `http://` page?**
No (except `localhost`) — modern browsers restrict Geolocation, along with several other privacy/security-sensitive APIs, to secure contexts (`https://` or `localhost`).

**Q: Can a Web Worker manipulate the DOM directly?**
No. Workers have no access to `document` or any DOM APIs at all — they run in a separate global context (`self`, not `window`). Any UI update resulting from a worker's computation has to be posted back to the main thread via `postMessage`, which then performs the actual DOM update.

**Q: How is data passed between the main thread and a Worker — by reference or by copy?**
By copy, via the structured clone algorithm (unless `Transferable` objects like `ArrayBuffer` are explicitly transferred, which moves ownership with zero copying). Mutating an object on one side after calling `postMessage` has no effect on the other side's already-cloned copy.

**Q: When should you reach for a Web Worker versus just using `async`/`await` with `fetch`?**
`fetch` is already non-blocking on the main thread regardless — network I/O doesn't require a Worker. A Worker is for offloading **CPU-bound, synchronous computation** (heavy parsing, image processing, complex calculations) that would otherwise block rendering and input handling if run directly on the main thread.
