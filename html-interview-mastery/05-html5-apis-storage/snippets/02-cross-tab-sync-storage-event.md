# Snippet: Cross-Tab Sync via the `storage` Event

```html
<button id="logout">Log out</button>
<p id="status">Logged in</p>

<script>
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.setItem('auth-status', 'logged-out');
  });

  // Fires in every OTHER tab of the same origin — never in the tab that made the change
  window.addEventListener('storage', (e) => {
    if (e.key === 'auth-status' && e.newValue === 'logged-out') {
      document.getElementById('status').textContent = 'Logged out (synced from another tab)';
    }
  });
</script>
```

Open this page in two tabs side by side. Clicking "Log out" in Tab A updates the status text in Tab B, but Tab A's own status text is unaffected by its own `storage` listener (because the event never fires on the originating tab).
