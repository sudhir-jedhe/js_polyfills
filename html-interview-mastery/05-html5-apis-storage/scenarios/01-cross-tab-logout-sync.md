# Scenario: Logging Out in One Tab Should Log Out All Tabs

**Scenario:** Your app is often used with multiple tabs open (e.g., one tab for the dashboard, one for settings). When a user clicks "Log out" in any tab, all other open tabs of the app should immediately reflect the logged-out state (redirect to the login page) without the user having to manually refresh them. How do you implement this using only browser-native APIs, no server round-trip required for the sync itself?

**Diagnosis:** This is a textbook use case for `localStorage` + the `storage` event. `localStorage` is shared across all tabs of the same origin, and the `storage` event fires automatically in every *other* tab whenever a write happens — exactly the "notify everyone else" mechanism needed here. The one thing to watch for: the event does **not** fire in the tab that performed the write, so that tab's own logout flow (redirecting, clearing its own in-memory state) has to be handled directly in the click handler, separately from the `storage` listener.

**Implementation:**

```js
// auth.js — loaded on every page
const AUTH_KEY = 'auth-event';

function logout() {
  clearSessionState();               // clear in-memory/app state for THIS tab
  localStorage.setItem(AUTH_KEY, JSON.stringify({ type: 'logout', at: Date.now() }));
  redirectToLogin();                 // this tab's own redirect — storage event won't cover it
}

window.addEventListener('storage', (e) => {
  if (e.key !== AUTH_KEY || !e.newValue) return;
  const event = JSON.parse(e.newValue);
  if (event.type === 'logout') {
    clearSessionState();
    redirectToLogin();               // sync every OTHER tab
  }
});
```

**Why include a timestamp/random value in the payload?** Setting `localStorage.setItem(AUTH_KEY, 'logout')` twice in a row with the identical string would only fire the `storage` event the *first* time in some edge cases involving value equality — including `Date.now()` (or a random nonce) guarantees the value always changes, so the event reliably fires every time, even for repeated logout attempts.

**Extending the pattern:** The same mechanism generalizes to any cross-tab signal — "cart updated," "new notification," "theme changed" — by using a dedicated key per event type and a small `type` discriminator in the JSON payload, avoiding cross-talk between unrelated signals sharing the same storage area.
